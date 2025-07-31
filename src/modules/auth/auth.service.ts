import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { LoginDto, RegisterDto } from './dtos';
import { JwtHelper } from 'src/helpers';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { isUUID } from "validator"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtHelper,
  ) {}

  async getAll() {
    const data = await this.prisma.user.findMany();

    return {
      message: 'success',
      data: data,
    };
  }

  async register(payload: RegisterDto, res: Response) {
    const foundUser = await this.prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: hashPassword,
        githubURL: payload.githubURL,
      },
    });

    const token = await this.jwt.generateToken({ id: newUser.id });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'success',
      data: newUser,
    };
  }

  async login(payload: LoginDto, res: Response) {
    const foundUser = await this.prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }

    const openPassword = await bcrypt.compare(
      payload.password,
      foundUser.password,
    );

    if (!openPassword) {
      throw new BadRequestException('Password error');
    }

    const token = await this.jwt.generateToken({ id: foundUser.id });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: "success",
    }
  }

  async delete(id: string, res: Response){

    if(!isUUID(id)){
      throw new BadRequestException("id error format");
    }

    const foundUser = await this.prisma.user.findUnique({where: {id: id}});

    if(!foundUser){
      throw new NotFoundException("User not found");
    }

    await this.prisma.user.delete({where: {id: foundUser.id}});

    res.clearCookie('token');

    return {
      message: "success"
    }
  }
}
