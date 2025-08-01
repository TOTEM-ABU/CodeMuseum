import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAnonymousPostDto {
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
    description: 'Category name',
    example: 'JAVASCRIPT',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  categoryName: string;
} 