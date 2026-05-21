import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { D1Service } from '../../common/d1/d1.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class GroupsService {
  constructor(private readonly d1: D1Service) {}

  async findAll() {
    const groups = await this.d1.query<any>(
      `SELECT g.*, (SELECT COUNT(*) FROM notes WHERE group_id = g.id) AS note_count
       FROM \`groups\` g ORDER BY g.sort_order ASC, g.created_at ASC`
    );
    return groups;
  }

  async findOne(id: string) {
    const groups = await this.d1.query<any>(
      'SELECT * FROM `groups` WHERE id = ?',
      [id]
    );
    if (!groups.length) throw new NotFoundException('分组不存在');
    return groups[0];
  }

  async create(dto: CreateGroupDto) {
    const id = nanoid();
    await this.d1.execute(
      'INSERT INTO `groups` (id, name, parent_id, sort_order) VALUES (?, ?, ?, ?)',
      [id, dto.name, dto.parentId ?? null, dto.sortOrder ?? 0]
    );
    return this.findOne(id);
  }

  async getTree() {
    const groups = await this.findAll();
    const map = new Map<string, any>();
    const roots: any[] = [];

    groups.forEach(g => map.set(g.id, { ...g, children: [] }));
    groups.forEach(g => {
      const node = map.get(g.id);
      if (g.parent_id && map.has(g.parent_id)) {
        map.get(g.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortFn = (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
    const sortTree = (nodes: any[]) => {
      nodes.sort(sortFn);
      nodes.forEach(n => sortTree(n.children));
    };
    sortTree(roots);

    return roots;
  }

  async update(id: string, dto: UpdateGroupDto) {
    await this.findOne(id);

    // 循环引用校验
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('不能将自身设为父级分组');
      }
      const allGroups = await this.d1.query<any>('SELECT id, parent_id FROM `groups`');
      let current = dto.parentId;
      while (current) {
        if (current === id) {
          throw new BadRequestException('不能将子级分组设为父级分组');
        }
        const parent = allGroups.find(g => g.id === current);
        current = parent?.parent_id;
      }
    }

    const sets: string[] = [];
    const params: any[] = [];

    if (dto.name !== undefined) {
      sets.push('name = ?');
      params.push(dto.name);
    }
    if (dto.parentId !== undefined) {
      sets.push('parent_id = ?');
      params.push(dto.parentId);
    }
    if (dto.sortOrder !== undefined) {
      sets.push('sort_order = ?');
      params.push(dto.sortOrder);
    }

    if (sets.length) {
      params.push(id);
      await this.d1.execute(
        `UPDATE \`groups\` SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`,
        params
      );
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    // 先将子分组的 parent_id 置空
    await this.d1.execute(
      'UPDATE `groups` SET parent_id = NULL, updated_at = datetime(\'now\') WHERE parent_id = ?',
      [id]
    );
    await this.d1.execute('DELETE FROM `groups` WHERE id = ?', [id]);
  }
}
