import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ConfigModule } from "@nestjs/config"
import { AuthModule, HomeModule, PostModule, CategoryModule, UserModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard } from './guards';

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

  providers : [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard
    },
  ]
})
export class AppModule {}
