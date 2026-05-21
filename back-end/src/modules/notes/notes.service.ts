import { Injectable, NotFoundException } from '@nestjs/common';
import { D1Service } from '../../common/d1/d1.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class NotesService {
  constructor(private readonly d1: D1Service) {}

  async findAll(groupId?: string) {
    let sql = `SELECT n.*, g.name AS group_name FROM notes n LEFT JOIN \`groups\` g ON n.group_id = g.id`;
    const params: any[] = [];

    if (groupId) {
      sql += ' WHERE n.group_id = ?';
      params.push(groupId);
    }

    sql += ' ORDER BY n.created_at DESC';
    return this.d1.query(sql, params);
  }

  async findOne(id: string) {
    const notes = await this.d1.query<any>(
      `SELECT n.*, g.name AS group_name FROM notes n LEFT JOIN \`groups\` g ON n.group_id = g.id WHERE n.id = ?`,
      [id]
    );
    if (!notes.length) throw new NotFoundException('笔记不存在');
    return notes[0];
  }

  async create(dto: CreateNoteDto) {
    const id = nanoid();
    await this.d1.execute(
      'INSERT INTO notes (id, group_id, title, content) VALUES (?, ?, ?, ?)',
      [id, dto.groupId ?? null, dto.title, dto.content ?? '']
    );
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);

    const sets: string[] = [];
    const params: any[] = [];

    if (dto.groupId !== undefined) {
      sets.push('group_id = ?');
      params.push(dto.groupId);
    }
    if (dto.title !== undefined) {
      sets.push('title = ?');
      params.push(dto.title);
    }
    if (dto.content !== undefined) {
      sets.push('content = ?');
      params.push(dto.content);
    }

    if (sets.length) {
      params.push(id);
      await this.d1.execute(
        `UPDATE notes SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`,
        params
      );
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.d1.execute('DELETE FROM notes WHERE id = ?', [id]);
  }
}
