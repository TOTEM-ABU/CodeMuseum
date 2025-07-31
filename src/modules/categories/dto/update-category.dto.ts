import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Updated JavaScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
} 