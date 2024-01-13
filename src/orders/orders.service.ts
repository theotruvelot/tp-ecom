import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService,) { }

  async create(createOrderDto: CreateOrderDto, req: any) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: createOrderDto.productId },
      });
      if (!product) {
        throw new UnprocessableEntityException('Product not found');
      }

      const createdOrder = await this.prisma.order.create({
        data: {
          userId: req.user.userId,
          orderProducts: {
            create: {
              productId: createOrderDto.productId,
              quantity: createOrderDto.quantity,
            },
          },
        },
        include: { orderProducts: true },
      });

      return createdOrder;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error creating order');
    }
  }

  async findAll(req: any) {
    try {
      if (req.user.role === 'admin') {
        return await this.prisma.order.findMany({
          include: { orderProducts: true },
        });
      } else {
        return await this.prisma.order.findMany({
          where: { userId: req.user.userId },
          include: { orderProducts: true },
        });
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting orders');
    }
  }

  async findOne(id: string, req: any) {
    try {
      let order;
      if (req.user.role === 'ADMINISTRATOR' || req.user.role === 'MANAGER') {
        order = await this.prisma.order.findUnique({
          where: { id: Number(id) },
          include: { orderProducts: true },
        });
      } else {
        order = await this.prisma.order.findUnique({
          where: { id: Number(id), userId: req.user.userId },
          include: { orderProducts: true },
        });
      }
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return order;
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting order');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderProducts: true },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...updateOrderDto
        },
        include: { orderProducts: true },
      });

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating order');
    }
  }

  async remove(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      await this.prisma.orderProduct.deleteMany({
        where: { orderId: id },
      });
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting order');
    }
  }
}
