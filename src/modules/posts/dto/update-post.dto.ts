import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProgrammingLanguage } from '@prisma/client';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Updated React Hooks Example',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Code content',
    example: 'const [count, setCount] = useState(0);\nreturn <div>{count}</div>;',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Category name (must be one of the ProgrammingLanguage enum values, case insensitive)',
    example: 'JAVASCRIPT',
    enum: ProgrammingLanguage,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProgrammingLanguage)
  @Transform(({ value }) => value?.toUpperCase())
  categoryName?: ProgrammingLanguage;
} 