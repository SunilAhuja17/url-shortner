import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LinksModule } from './links/links.module';
import {logger} from "./utils/logger"
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [PrismaModule, 
    LinksModule,
    WinstonModule.forRoot(logger),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
