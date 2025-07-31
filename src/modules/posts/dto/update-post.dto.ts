import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

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
    description: 'Category ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  categoryId?: number;
} 