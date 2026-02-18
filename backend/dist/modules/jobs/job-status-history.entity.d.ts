export declare class JobStatusHistoryEntity {
    id: string;
    job_id: string;
    tenant_id: string;
    from_status: string | null;
    to_status: string;
    changed_by: string;
    notes: string;
    created_at: Date;
}
