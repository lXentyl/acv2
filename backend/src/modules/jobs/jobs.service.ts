import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
import { JobStatusHistoryEntity } from './job-status-history.entity';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(JobEntity)
        private readonly jobRepo: Repository<JobEntity>,
        @InjectRepository(JobStatusHistoryEntity)
        private readonly historyRepo: Repository<JobStatusHistoryEntity>,
    ) { }

    /** List jobs for a tenant with pagination */
    async findAll(tenantId: string, params: { page?: number; limit?: number; status?: string }) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;

        const qb = this.jobRepo
            .createQueryBuilder('job')
            .where('job.tenant_id = :tenantId', { tenantId })
            .andWhere('job.is_deleted = false');

        if (params.status) {
            qb.andWhere('job.status = :status', { status: params.status });
        }

        qb.orderBy('job.created_at', 'DESC').skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    /** Create a new job */
    async create(tenantId: string, userId: string, data: Partial<JobEntity>) {
        const job = this.jobRepo.create({
            ...data,
            tenant_id: tenantId,
            created_by: userId,
        });
        const saved = await this.jobRepo.save(job);

        // Log initial status
        await this.historyRepo.save({
            job_id: saved.id,
            tenant_id: tenantId,
            from_status: null,
            to_status: saved.status,
            changed_by: userId,
            notes: 'Job created',
        });

        return saved;
    }

    /** Update job status (Kanban transition) */
    async updateStatus(
        tenantId: string,
        jobId: string,
        userId: string,
        newStatus: string,
        notes?: string,
    ) {
        const job = await this.jobRepo.findOne({
            where: { id: jobId, tenant_id: tenantId, is_deleted: false },
        });
        if (!job) throw new Error('Job not found');

        const oldStatus = job.status;
        job.status = newStatus;
        await this.jobRepo.save(job);

        // Log status change
        await this.historyRepo.save({
            job_id: jobId,
            tenant_id: tenantId,
            from_status: oldStatus,
            to_status: newStatus,
            changed_by: userId,
            notes,
        });

        return job;
    }

    /** Get status change history */
    async getHistory(tenantId: string, jobId: string) {
        return this.historyRepo.find({
            where: { job_id: jobId, tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
    }
}
