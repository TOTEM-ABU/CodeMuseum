import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'React Hooks Example',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Code content',
    example: 'const [count, setCount] = useState(0);',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsNotEmpty()
  categoryId: number;
} 