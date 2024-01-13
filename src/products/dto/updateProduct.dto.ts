import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    MaxLength,
    MinLength,
    IsNumber,
    IsOptional,
    IsPositive,
} from 'class-validator';

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price: number;
}
