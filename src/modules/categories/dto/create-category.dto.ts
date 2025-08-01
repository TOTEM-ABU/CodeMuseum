import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'JAVASCRIPT',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  name: string;
} 