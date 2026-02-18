export declare class AuditLogEntity {
    id: string;
    tenant_id: string;
    user_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    old_values: Record<string, unknown>;
    new_values: Record<string, unknown>;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}
