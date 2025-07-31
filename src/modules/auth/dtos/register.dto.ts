import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class RegisterDto {
  @ApiProperty({ type: 'string', example: 'username', required: true })
  @IsString()
  username: string;

  @ApiProperty({ type: 'string', example: 'email@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ type: 'string', example: '1234', required: true })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ type: 'string', example: '1234', required: false })
  @IsOptional()
  @IsString()
  githubURL: string;
}