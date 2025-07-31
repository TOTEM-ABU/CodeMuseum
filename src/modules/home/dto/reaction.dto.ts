import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
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
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Like (yoqdi) soni — odatda 0 yoki 1',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  like?: number;

  @ApiProperty({
    description: 'Dislike (yoqmadi) soni — odatda 0 yoki 1',
    example: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  dislike?: number;
}
