import { Inject, Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShortLinkDto } from './dto/create-short-url.dto';
import { nanoid } from 'nanoid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Injectable()
export class LinksService {
    constructor(private prisma: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger:Logger
    ) {}


    async shortUrl(dto:CreateShortLinkDto)
    {
        this.logger.info(`Received request to shorten URL: ${dto.url}`)
        const existing = await this.prisma.link.findUnique({where:{originalUrl:dto.url}})
        if(existing) {
            this.logger.warn(`URL already shortened: ${dto.url} -> ${existing.shortCode}`)
            return {shorturl:`http://localhost:3000/${existing.shortCode}`}
        }


        const shortCode = nanoid(6)

        const link = await this.prisma.link.create({
            data:{
                originalUrl:dto.url,
                shortCode,
                expiresAt:dto.expiresAt ? new Date(dto.expiresAt) : null,
                
            },
        });

        this.logger.info(`Generated short URL: ${dto.url} -> http://localhost:3000/${shortCode}`)
        return {shortUrl:`http://localhost:3000/${link.shortCode}`}

    }

    async getOriginalUrl(shortCode:string){
        this.logger.info(`Fetching original URL for shortcode: ${shortCode}`)
        const link = await this.prisma.link.findUnique({where:{shortCode}})
        if(!link) {

           this.logger.error(`Short URL not found: ${shortCode}`)
            throw new NotFoundException("Short URL not found")
        }
        
        if(link.expiresAt && new Date() > link.expiresAt){
            this.logger.warn(`Short URL expired: ${shortCode}`)
            throw new NotFoundException("Short URL has expired")
        }
        
        await this.prisma.link.update({
            where:{shortCode},
            data:{
                visits:{increment:1},
                visitLogs:{create:{timestamp:new Date()}}
            }

        })

        this.logger.info(`Redirecting ${shortCode} -> ${link.originalUrl}`)
        return link.originalUrl
    }

    async getStatistics (shortCode:string){
        this.logger.info(`Fetching statistics for shortcode: ${shortCode}`)
        const link = await this.prisma.link.findUnique({
            where:{shortCode},
            include:{visitLogs:true}
        })

        if(!link) {
            this.logger.error(`Short URL not found for statistics: ${shortCode}`)
            throw new NotFoundException("Short URL not found")
        }
        
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const visitsToday = link.visitLogs.filter(v=> v.timestamp >= startOfToday).length ;
        const visitsThisWeek = link.visitLogs.filter(v => v.timestamp >= sevenDaysAgo).length;
        const visitsThisMonth = link.visitLogs.filter(v => v.timestamp >= startOfMonth).length;

        this.logger.info(`Stats for ${shortCode}: total=${link.visits}, today=${visitsToday}, thisWeek=${visitsThisWeek}, thisMonth=${visitsThisMonth}`)

        return {total:link.visits,today:visitsToday,thisWeek:visitsThisWeek,thisMonth:visitsThisMonth}
    }




}


