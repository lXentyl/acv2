import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findAll(req: any, page?: number, limit?: number): Promise<{
        data: import("./activity-log.entity").ActivityLogEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
