import { Injectable, NotFoundException } from '@nestjs/common';
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
      'INSERT INTO `groups` (id, name, sort_order) VALUES (?, ?, ?)',
      [id, dto.name, dto.sortOrder ?? 0]
    );
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateGroupDto) {
    await this.findOne(id);

    const sets: string[] = [];
    const params: any[] = [];

    if (dto.name !== undefined) {
      sets.push('name = ?');
      params.push(dto.name);
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
    await this.d1.execute('DELETE FROM `groups` WHERE id = ?', [id]);
  }
}
