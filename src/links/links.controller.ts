import { Controller,Post,Get,Param,Body,Res,NotFoundException } from '@nestjs/common';
import {LinksService} from "./links.service"
import {CreateShortLinkDto} from "./dto/create-short-url.dto"
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';


@ApiTags('links')
@Controller()
export class LinksController {
    constructor(private readonly linksService:LinksService) {}
    @ApiOperation({summary: 'Create a short URL' })
    @Post('/short/url')
    @ApiBody({type:CreateShortLinkDto})
    @ApiResponse({status:201,description:'URL shortened Successfully'})
    async createShortUrl(@Body() dto:CreateShortLinkDto){
        return await this.linksService.shortUrl(dto)
    }


    @ApiOperation({ summary: 'Redirect to original URL using short alias' })
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
    
    @ApiOperation({ summary: 'Get statistics of a shortened URL', description: 'Fetches visit count and other details for a given short URL code' })
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
