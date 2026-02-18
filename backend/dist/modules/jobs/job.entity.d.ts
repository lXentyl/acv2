import { TenantEntity } from '../tenants/tenant.entity';
export declare class JobEntity {
    id: string;
    tenant_id: string;
    tenant: TenantEntity;
    title: string;
    description: string;
    client_name: string;
    status: string;
    priority: string;
    assigned_to: string;
    due_date: Date;
    estimated_cost: number;
    actual_cost: number;
    quantity: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
