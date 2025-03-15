import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LinksModule } from './links/links.module';
import {logger} from "./utils/logger"
import { WinstonModule } from 'nest-winston';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [PrismaModule, 
    LinksModule,
    WinstonModule.forRoot(logger),
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_PIPE,
    useValue:new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
    })
  }],
})
export class AppModule {}
