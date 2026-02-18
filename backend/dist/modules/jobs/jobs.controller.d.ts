import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findAll(req: any, page?: number, limit?: number, status?: string): Promise<{
        data: import("./job.entity").JobEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(req: any, body: any): Promise<{
        data: import("./job.entity").JobEntity;
    }>;
    updateStatus(req: any, id: string, body: {
        status: string;
        notes?: string;
    }): Promise<{
        data: import("./job.entity").JobEntity;
    }>;
    getHistory(req: any, id: string): Promise<{
        data: import("./job-status-history.entity").JobStatusHistoryEntity[];
    }>;
}
