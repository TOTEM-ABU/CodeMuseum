import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma";
import { JwtHelper } from "src/helpers";
import { JwtService } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtHelper, JwtService, JwtGuard],
  exports: [JwtHelper, JwtService, JwtGuard],
})
export class AuthModule {}