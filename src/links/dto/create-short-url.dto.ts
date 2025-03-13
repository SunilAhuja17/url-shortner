import {IsString,IsUrl,IsOptional,IsDateString} from "class-validator"


export class CreateShortLinkDto {
    @IsString()
    @IsUrl({},{message:"Invalid URL format"})
    url:string;



    @IsOptional()
    @IsDateString({},{message:'Invalid date format'})
    expiresAt?:string

}