import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveCommentDto {
  @ApiProperty({
    description: 'Izoh yozilayotgan postning ID raqami',
    example: 1,
  })
  @IsNotEmpty()
  postId: string;

  @ApiProperty({
    description: 'Izoh qoldirayotgan foydalanuvchining ID raqami',
    example: 'user-uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Foydalanuvchi yozgan izoh matni',
    example: 'Zor post! Yana davom eting!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

