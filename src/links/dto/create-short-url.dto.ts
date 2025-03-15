import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsString,IsUrl,IsOptional,IsDateString, Matches} from "class-validator"

export class CreateShortLinkDto {
    @ApiProperty({ example: 'https://example.com', description: 'The original URL to be shortened'})
    @IsString()
    @IsUrl({},{message:"Invalid URL format"})
    @Matches(/^https:\/\//, { message: "Only HTTPS URLs are allowed." })
    url:string;


    @ApiPropertyOptional({ example: '2025-12-31T23:59:59.999Z', description: 'Expiration date for the short link (optional)' })
    @IsOptional()
    @IsDateString({},{message:'Invalid date format'})
    expiresAt?:string

}