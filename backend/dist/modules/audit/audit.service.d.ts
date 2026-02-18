import { Repository } from 'typeorm';
import { AuditLogEntity } from './audit-log.entity';
export declare class AuditService {
    private readonly auditRepo;
    constructor(auditRepo: Repository<AuditLogEntity>);
    findAll(tenantId: string, params: {
        page?: number;
        limit?: number;
        entity_type?: string;
    }): Promise<{
        data: AuditLogEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    log(entry: Partial<AuditLogEntity>): Promise<AuditLogEntity>;
}
