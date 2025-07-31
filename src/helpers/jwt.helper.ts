import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";

@Injectable()
export class JwtHelper {
  constructor(private readonly jwt: JwtService){};

  async generateToken(payload: {id: string}){
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.SECRET_TIME,
    });

    return token;
  }

  async verifyToken(token: string){

    try {
      const secretKey = process.env.SECRET_KEY;
      const openToken = await this.jwt.verifyAsync(token, {secret: secretKey});
      return openToken;
    } catch (error) {
      
      if(error instanceof JsonWebTokenError){
        throw new BadRequestException("Token not found");
      }
      if(error instanceof TokenExpiredError){
        throw new ForbiddenException('token time out');
      }

      throw new InternalServerErrorException("Server error");
    }
  }
}