import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ConfigModule } from "@nestjs/config"
import { AuthModule, HomeModule, PostModule, CategoryModule, UserModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    PrismaModule,
    AuthModule,
    HomeModule,
    PostModule,
    CategoryModule,
    UserModule
  ],
})
export class AppModule {}
