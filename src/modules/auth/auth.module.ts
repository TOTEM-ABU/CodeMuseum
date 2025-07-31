import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma";
import { JwtHelper } from "src/helpers";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || "your-super-secret-jwt-key-here-make-it-long-and-secure",
      signOptions: { expiresIn: process.env.SECRET_TIME || "24h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtHelper],
  exports: [JwtHelper],
})
export class AuthModule {}