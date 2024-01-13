import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsPositive,
    IsInt,
} from 'class-validator';

export class CreateOrderDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    productId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;
}
