import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionDto {
  @ApiProperty({
    description: 'Reaksiya berilayotgan postning ID raqami',
    example: '',
  })
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: 'Reaksiya yuborayotgan foydalanuvchining ID raqami',
    example: '',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Like (yoqdi) soni — odatda 0 yoki 1',
    example: 1,
  })
  @IsInt()
  @Min(0)
  like: number;

  @ApiProperty({
    description: 'Dislike (yoqmadi) soni — odatda 0 yoki 1',
    example: 0,
  })
  @IsInt()
  @Min(0)
  dislike: number;
}
