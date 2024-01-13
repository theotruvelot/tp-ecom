import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';


@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService,) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        try {
            return await this.prisma.product.create({
                data: {
                    ...createProductDto
                },
            });
        } catch (error) {
            throw new Error('Error creating product');
        }
    }

    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.prisma.product.findMany();
        } catch (error) {
            console.error(error);
            throw new Error('Error getting products');
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Error getting product');
        }
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        try {
            if (updateProductDto) {
                throw new BadRequestException('Product not found');
            }
            const updatedProduct = await this.prisma.product.update({
                where: { id },
                data: {
                    ...updateProductDto
                },
            });
            return updatedProduct
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error('Error updating product');
        }
    }

    async deleteProduct(id: number): Promise<Product> {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            const hasOrders = await this.prisma.order.findMany({
                where: { orderProducts: { some: { productId: id } } },
            });
            if (hasOrders.length > 0) {
                await this.prisma.orderProduct.deleteMany({
                    where: { productId: id },
                });
            }            
            await this.prisma.product.delete({
                where: { id },
            });
            return null;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Error deleting product');
        }
    }
}
