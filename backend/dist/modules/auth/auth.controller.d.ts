import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    getProfile(req: any): Promise<{
        data: {
            id: string;
            tenant_id: string;
            tenant: import("../tenants/tenant.entity").TenantEntity;
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
        };
    }>;
}
