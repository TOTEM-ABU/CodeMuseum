import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Response } from "express";
import { Protected } from "src/decoratores";


@ApiTags('Authentication')
@Controller('auth')
export class AuthController{

  constructor(private readonly service: AuthService){}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAll(){
    return await this.service.getAll();
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'success' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            githubURL: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response){
    return await this.service.register(body, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'success' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Password error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response){
    return await this.service.login(body, res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'success' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string, @Res({ passthrough: true }) res: Response){
    return await this.service.delete(id, res);
  }
}