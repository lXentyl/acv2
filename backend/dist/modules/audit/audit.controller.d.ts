import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(req: any, page?: number, limit?: number, entityType?: string): Promise<{
        data: import("./audit-log.entity").AuditLogEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
