import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    @IsOptional()
    tenant_name?: string;
}

export class RefreshTokenDto {
    @IsString()
    refresh_token: string;
}
