import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { encodePassword, comparePassword } from '../utils/bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(loginDto: LoginDto): Promise<AuthEntity> {
        try {
            const { email, password } = loginDto;
            const user = await this.prisma.user.findUnique({ where: { email: email } });

            if (!user) {
                throw new UnauthorizedException('Invalid email or password')
            }

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password')
            }

            return {
                accessToken: this.jwtService.sign({ userId: user.id, role: user.role }, { expiresIn: '1d', secret: process.env.JWT_SECRET }),
                refreshToken: this.jwtService.sign({ userId: user.id }, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET })
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong')
        }
    }

    async register(registerDto: RegisterDto): Promise<AuthEntity> {
        try {
            const { email, firstName, lastName, password } = registerDto;
            const userExists = await this.prisma.user.findUnique({ where: { email: email } });
            if (userExists) {
                throw new ConflictException('Email already exists')
            }

            const hashedPassword = await encodePassword(password);

            const user = await this.prisma.user.create({ data: { email, password: hashedPassword, firstName, lastName } });

            return {
                accessToken: this.jwtService.sign({ userId: user.id, role: user.role }, { expiresIn: '1d', secret: process.env.JWT_SECRET }),
                refreshToken: this.jwtService.sign({ userId: user.id }, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET })
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong')
        }
    }

    async refresh(refreshToken: string): Promise<AuthEntity> {
        try {
            const { userId } = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
            const user = await this.prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                throw new UnauthorizedException('Invalid refresh token')
            }

            return {
                accessToken: this.jwtService.sign({ userId: user.id, role: user.role }, { expiresIn: '1d', secret: process.env.JWT_SECRET }),
                refreshToken: this.jwtService.sign({ userId: user.id }, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET })
            };
        }
        catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong')
        }
    }
}
