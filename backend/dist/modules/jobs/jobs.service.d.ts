import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
import { JobStatusHistoryEntity } from './job-status-history.entity';
export declare class JobsService {
    private readonly jobRepo;
    private readonly historyRepo;
    constructor(jobRepo: Repository<JobEntity>, historyRepo: Repository<JobStatusHistoryEntity>);
    findAll(tenantId: string, params: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        data: JobEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(tenantId: string, userId: string, data: Partial<JobEntity>): Promise<JobEntity>;
    updateStatus(tenantId: string, jobId: string, userId: string, newStatus: string, notes?: string): Promise<JobEntity>;
    getHistory(tenantId: string, jobId: string): Promise<JobStatusHistoryEntity[]>;
}
