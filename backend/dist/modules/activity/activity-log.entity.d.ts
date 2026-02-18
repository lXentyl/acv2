export declare class ActivityLogEntity {
    id: string;
    tenant_id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata: Record<string, unknown>;
    created_at: Date;
}
