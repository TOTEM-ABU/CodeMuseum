import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveCommentDto {
  @ApiProperty({
    description: 'Izoh yozilayotgan postning ID raqami',
    example: '',
  })
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'Izoh qoldirayotgan foydalanuvchining ID raqami',
    example: '',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Foydalanuvchi yozgan izoh matni',
    example: 'Zor post! Yana davom eting!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

