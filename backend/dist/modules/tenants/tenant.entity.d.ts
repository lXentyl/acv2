export declare class TenantEntity {
    id: string;
    name: string;
    slug: string;
    logo_url: string;
    is_active: boolean;
    settings: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}
