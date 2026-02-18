import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const tokens = await this.authService.login(dto);
        return { data: tokens };
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const tokens = await this.authService.register(dto);
        return { data: tokens };
    }

    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        const tokens = await this.authService.refreshTokens(dto.refresh_token);
        return { data: tokens };
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Request() req: any) {
        const profile = await this.authService.getProfile(req.user.id);
        return { data: profile };
    }
}
