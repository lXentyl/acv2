import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from './audit-log.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLogEntity)
        private readonly auditRepo: Repository<AuditLogEntity>,
    ) { }

    /** Query audit logs for a tenant */
    async findAll(tenantId: string, params: { page?: number; limit?: number; entity_type?: string }) {
        const page = params.page || 1;
        const limit = params.limit || 20;

        const qb = this.auditRepo
            .createQueryBuilder('log')
            .where('log.tenant_id = :tenantId', { tenantId });

        if (params.entity_type) {
            qb.andWhere('log.entity_type = :et', { et: params.entity_type });
        }

        qb.orderBy('log.created_at', 'DESC').skip((page - 1) * limit).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    /** Create an audit log entry (called from interceptors/services) */
    async log(entry: Partial<AuditLogEntity>) {
        const log = this.auditRepo.create(entry);
        return this.auditRepo.save(log);
    }
}
