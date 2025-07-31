import { IsNotEmpty, IsUUID, IsString } from 'class-validator';
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

