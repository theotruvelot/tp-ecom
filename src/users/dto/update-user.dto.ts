import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @IsOptional()
    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        },
        {
            message: 'password too weak',
        },
    )
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty()
    @IsOptional()
    lastName: string;
}