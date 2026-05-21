import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiPropertyOptional({ description: '所属分组 ID（不传则为未分组）', example: 'xxx' })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiProperty({ description: '笔记标题', example: '学习笔记' })
  @IsNotEmpty({ message: '笔记标题不能为空' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '笔记内容（HTML）', example: '<p>内容</p>' })
  @IsOptional()
  @IsString()
  content?: string;
}

export class UpdateNoteDto {
  @ApiPropertyOptional({ description: '所属分组 ID' })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional({ description: '笔记标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '笔记内容（HTML）' })
  @IsOptional()
  @IsString()
  content?: string;
}
