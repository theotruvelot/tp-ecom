import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import {
    IsNotEmpty,
    IsEnum,
} from 'class-validator';

export class UpdateOrderDto {
    @ApiProperty()
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;
}
