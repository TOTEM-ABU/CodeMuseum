import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProgrammingLanguage } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name (must be one of the ProgrammingLanguage enum values, case insensitive)',
    example: 'JAVASCRIPT',
    enum: ProgrammingLanguage,
  })
  @IsNotEmpty()
  @IsEnum(ProgrammingLanguage)
  @Transform(({ value }) => value?.toUpperCase())
  name: ProgrammingLanguage;
} 