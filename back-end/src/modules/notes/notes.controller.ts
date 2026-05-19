import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@ApiTags('笔记')
@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Get()
  @ApiOperation({ summary: '获取笔记列表' })
  @ApiQuery({ name: 'groupId', required: false, description: '按分组筛选' })
  @ApiResponse({ status: 200, description: '返回笔记列表（含分组名）' })
  findAll(@Query('groupId') groupId?: string) {
    return this.service.findAll(groupId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取笔记详情' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '创建笔记' })
  @ApiBody({ type: CreateNoteDto })
  create(@Body() dto: CreateNoteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '更新笔记' })
  @ApiBody({ type: UpdateNoteDto })
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '删除笔记' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
