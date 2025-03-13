import { Controller,Post,Get,Param,Body,Res,NotFoundException } from '@nestjs/common';
import {LinksService} from "./links.service"
import {CreateShortLinkDto} from "./dto/create-short-url.dto"
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';


@ApiTags('links')
@Controller()
export class LinksController {
    constructor(private readonly linksService:LinksService) {}

    @Post('/short/url')
    @ApiBody({type:CreateShortLinkDto})
    @ApiResponse({status:201,description:'URL shortened Successfully'})
    async createShortUrl(@Body() dto:CreateShortLinkDto){
        return await this.linksService.shortUrl(dto)
    }


    
    @Get(':shortCode')
    @ApiResponse({ status: 302, description: "Redirects to original URL" })
    async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
        try {
            const originalUrl = await this.linksService.getOriginalUrl(shortCode);
            return res.redirect(originalUrl);
        } catch (error) {
            throw new NotFoundException("Short URL not found or expired");
        }
    }
    
    @Get('stats/:shortCode')
    @ApiResponse({status:200,description:"URL Visit Statistics"})
    async getStats(@Param('shortCode') shortCode:string){
        const stats = await this.linksService.getStatistics(shortCode);
        if(!stats){
            throw new NotFoundException("Short URL not found")
        }
        return stats
    }

}
