import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { exclude } from 'src/utils/exclude';
import { encodePassword } from 'src/utils/bcrypt';
import { validate } from 'class-validator';
import { empty } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;
      const userExists = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
      if (userExists) {
        throw new ConflictException('Email already exists')
      }

      const hashedPassword = await encodePassword(password);


      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword
        }
      });
      return exclude(user, ['password']);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error creating user');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map(user => exclude(user, ['password']));
    } catch (error) {
      throw new Error('Error getting users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return exclude(user, ['password']);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error getting user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto) {
        throw new BadRequestException('Bad request body');
      }
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto
        },
      });
      return exclude(updatedUser, ['password']);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        console.log('user not found')
        throw new NotFoundException('User not found');
      }
      const hasOrders = await this.prisma.order.findMany({
        where: { userId: id },
      });
      if (hasOrders.length) {
        await this.prisma.order.deleteMany({
          where: { userId: id },
        });
      }
      await this.prisma.user.delete({
        where: { id },
      });
      return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
