import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    PrismaModule,
  ],
})
export class AppModule {}
