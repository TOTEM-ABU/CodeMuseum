import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    description: 'Reaction type: "like" or "dislike"',
    example: 'like',
    enum: ['like', 'dislike'],
  })
  @IsString()
  @IsIn(['like', 'dislike'])
  type: 'like' | 'dislike';
} 