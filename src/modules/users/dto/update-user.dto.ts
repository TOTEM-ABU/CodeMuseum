import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'GitHub URL',
    example: 'https://github.com/johndoe',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  githubURL?: string;
} 