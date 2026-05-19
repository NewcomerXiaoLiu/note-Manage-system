import { Injectable } from '@nestjs/common';
import { D1Service } from '../../common/d1/d1.service';

@Injectable()
export class DashboardService {
  constructor(private readonly d1: D1Service) {}

  async getStats() {
    const [noteTotal] = await this.d1.query<any>('SELECT COUNT(*) AS count FROM notes');
    const [groupTotal] = await this.d1.query<any>('SELECT COUNT(*) AS count FROM `groups`');

    const recentNotes = await this.d1.query<any>(
      "SELECT n.*, g.name AS group_name FROM notes n LEFT JOIN `groups` g ON n.group_id = g.id ORDER BY n.created_at DESC LIMIT 10"
    );

    return {
      noteCount: noteTotal?.count || 0,
      groupCount: groupTotal?.count || 0,
      recentNotes,
    };
  }
}
