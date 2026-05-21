import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: '分组名称', example: '技术' })
  @IsNotEmpty({ message: '分组名称不能为空' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '父级分组 ID（不传则为顶级分组）' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: '排序序号（越小越靠前）', example: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateGroupDto {
  @ApiPropertyOptional({ description: '分组名称', example: '前端技术' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '父级分组 ID' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: '排序序号', example: 1 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
