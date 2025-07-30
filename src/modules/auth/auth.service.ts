import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma";


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const data =await this.prisma.user.findMany();

    return {
      message: "success",
      data: data
    }
  }
}