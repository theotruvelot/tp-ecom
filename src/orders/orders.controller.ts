import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, Res, UseFilters } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AccessTokenGuard } from 'src/guards/accesstoken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @HttpCode(201)
  create(@Req()req: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, req);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  findAll(@Req() req: Request) {
    return this.ordersService.findAll(req);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.ordersService.findOne(id, req);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('ADMINISTRATOR', 'MANAGER')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('ADMINISTRATOR', 'MANAGER')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
