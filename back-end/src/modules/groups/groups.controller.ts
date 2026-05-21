import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';

@ApiTags('分组')
@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Get()
  @ApiOperation({ summary: '获取所有分组' })
  @ApiResponse({ status: 200, description: '返回分组列表（含笔记数）' })
  findAll() {
    return this.service.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: '获取分组树形结构' })
  @ApiResponse({ status: 200, description: '返回嵌套的分组树' })
  getTree() {
    return this.service.getTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个分组' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '创建分组' })
  @ApiBody({ type: CreateGroupDto })
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '更新分组' })
  @ApiBody({ type: UpdateGroupDto })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '删除分组' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
