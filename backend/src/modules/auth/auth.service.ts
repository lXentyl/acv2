import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { TenantEntity } from '../tenants/tenant.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(TenantEntity)
        private readonly tenantRepo: Repository<TenantEntity>,
        private readonly jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email, is_deleted: false },
        });

        if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const tokens = await this.generateTokens(user);

        // Store hashed refresh token
        user.refresh_token_hash = await bcrypt.hash(tokens.refresh_token, 10);
        user.last_login_at = new Date();
        await this.userRepo.save(user);

        return tokens;
    }

    async register(dto: RegisterDto) {
        // Check for existing user
        const existing = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new ConflictException('El correo ya está registrado');
        }

        // Create or get tenant
        let tenant: TenantEntity;
        if (dto.tenant_name) {
            const slug = dto.tenant_name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            tenant = this.tenantRepo.create({ name: dto.tenant_name, slug });
            tenant = await this.tenantRepo.save(tenant);
        } else {
            throw new ConflictException('Nombre de empresa requerido');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // Create admin user for new tenant
        const user = this.userRepo.create({
            tenant_id: tenant.id,
            email: dto.email,
            password_hash: passwordHash,
            first_name: dto.first_name,
            last_name: dto.last_name,
            role_id: '00000000-0000-0000-0000-000000000001', // admin role
        });
        const savedUser = await this.userRepo.save(user);

        return this.generateTokens(savedUser);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'acv2-refresh-secret',
            });

            const user = await this.userRepo.findOne({
                where: { id: payload.sub, is_deleted: false },
            });

            if (!user || !user.refresh_token_hash) {
                throw new UnauthorizedException('Token inválido');
            }

            const isValid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
            if (!isValid) throw new UnauthorizedException('Token inválido');

            const tokens = await this.generateTokens(user);
            user.refresh_token_hash = await bcrypt.hash(tokens.refresh_token, 10);
            await this.userRepo.save(user);

            return tokens;
        } catch {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

    async getProfile(userId: string) {
        const user = await this.userRepo.findOne({
            where: { id: userId, is_deleted: false },
        });
        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        // Strip sensitive fields
        const { password_hash, refresh_token_hash, ...profile } = user;
        return profile;
    }

    private async generateTokens(user: UserEntity) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role_id,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'acv2-refresh-secret',
                expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
            }),
        ]);

        return { access_token, refresh_token };
    }
}
