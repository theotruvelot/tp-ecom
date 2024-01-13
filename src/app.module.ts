import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
;
@Module({
  imports: [AuthModule,],
  controllers: [AppController, ProductsController, OrdersController, UsersController],
  providers: [AppService, ProductsService, PrismaService, JwtService, OrdersService, UsersService],
})
export class AppModule {}
