import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AccessTokenGuard } from 'src/guards/accesstoken.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @UseGuards(AccessTokenGuard)
    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.getAllProducts();
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
     findOne(@Param() params: any): Promise<Product> {
        return this.productsService.getProductById(Number(params.id));
    }

    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMINISTRATOR', 'MANAGER')
    @HttpCode(201)
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.createProduct(createProductDto);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMINISTRATOR', 'MANAGER')
     update(@Param() params: any, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
        return this.productsService.updateProduct(Number(params.id), updateProductDto);
    
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMINISTRATOR', 'MANAGER')
    @HttpCode(204)
    async delete(@Param() params: any): Promise<Product> {
        return this.productsService.deleteProduct(Number(params.id));    
    }
}
