import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { TenantEntity } from '../tenants/tenant.entity';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly tenantRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<UserEntity>, tenantRepo: Repository<TenantEntity>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        tenant_id: string;
        tenant: TenantEntity;
        email: string;
        first_name: string;
        last_name: string;
        role_id: string;
        avatar_url: string;
        is_active: boolean;
        last_login_at: Date;
        created_at: Date;
        updated_at: Date;
        is_deleted: boolean;
    }>;
    private generateTokens;
}
