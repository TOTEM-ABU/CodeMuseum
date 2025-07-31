import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProgrammingLanguage } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'React Hooks Example',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Code content (multiline text supported)',
    example: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Category name (must be one of the ProgrammingLanguage enum values, case insensitive)',
    example: 'JAVASCRIPT',
    enum: ProgrammingLanguage,
  })
  @IsNotEmpty()
  @IsEnum(ProgrammingLanguage)
  @Transform(({ value }) => value?.toUpperCase())
  categoryName: ProgrammingLanguage;
} 