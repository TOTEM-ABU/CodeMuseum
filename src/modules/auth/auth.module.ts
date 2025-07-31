import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma";
import { JwtHelper } from "src/helpers";
import { JwtService } from "@nestjs/jwt";



@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtHelper, JwtService],
  exports: [JwtHelper, JwtService],
})
export class AuthModule {}