import { TenantEntity } from '../tenants/tenant.entity';
export declare class UserEntity {
    id: string;
    tenant_id: string;
    tenant: TenantEntity;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role_id: string;
    avatar_url: string;
    is_active: boolean;
    last_login_at: Date;
    refresh_token_hash: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
