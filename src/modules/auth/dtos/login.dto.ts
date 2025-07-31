import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";



export class LoginDto {

  @ApiProperty({ type: 'string', example: 'username', required: true })
  @IsString()
  username: string;

  @ApiProperty({ type: 'string', example: '1234', required: true })
  @IsString()
  password: string;
}