import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('数据概览')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取数据概览' })
  @ApiResponse({ status: 200, description: '返回笔记总数、分组总数、近期笔记列表' })
  getStats() {
    return this.service.getStats();
  }
}
