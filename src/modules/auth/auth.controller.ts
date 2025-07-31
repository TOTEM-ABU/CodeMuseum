import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Response } from "express";
import { Protected } from "src/decoratores";


@Controller('auth')
export class AuthController{

  constructor(private readonly service: AuthService){}

  @Get()
  @Protected(true)
  async getAll(){
    return await this.service.getAll();
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response){
    return await this.service.register(body, res);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response){
    return await this.service.login(body, res);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res({ passthrough: true }) res: Response){
    return await this.service.delete(id, res);
  }
}