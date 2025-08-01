import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
    example:
      'const [count, setCount] = useState(0);\nreturn <div>{count}</div>;',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Category name',
    example: 'JAVASCRIPT',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  categoryName?: string;
}
