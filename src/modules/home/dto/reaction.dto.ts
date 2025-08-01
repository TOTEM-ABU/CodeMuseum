import { IsUUID, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionDto {
  @ApiProperty({
    description: 'Reaksiya berilayotgan postning ID raqami',
    example: 1,
  })
  postId: string;

  @ApiProperty({
    description: 'Reaksiya yuborayotgan foydalanuvchining ID raqami',
    example: 'user-uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Like (yoqdi) soni — odatda 0 yoki 1',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  like: number;

  @ApiProperty({
    description: 'Dislike (yoqmadi) soni — odatda 0 yoki 1',
    example: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  dislike: number;
}
