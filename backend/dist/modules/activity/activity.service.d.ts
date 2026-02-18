import { Repository } from 'typeorm';
import { ActivityLogEntity } from './activity-log.entity';
export declare class ActivityService {
    private readonly activityRepo;
    constructor(activityRepo: Repository<ActivityLogEntity>);
    findAll(tenantId: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: ActivityLogEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    log(entry: Partial<ActivityLogEntity>): Promise<ActivityLogEntity>;
}
