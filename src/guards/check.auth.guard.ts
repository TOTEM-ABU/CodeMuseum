import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PROTECTED_KEY } from 'src/decoratores';
import { JwtHelper } from 'src/helpers';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtHelper,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & {userId: string}>();


    if(!isProtected){
      return true
    }

    const token = request.cookies?.token;

    if(!token){
      throw new UnauthorizedException('Token Not Found');
    }

    const data = await this.jwt.verifyToken(token);


    request.userId = data.id

    return true;
  }
}
