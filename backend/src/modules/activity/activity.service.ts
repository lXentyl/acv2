import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogEntity } from './activity-log.entity';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(ActivityLogEntity)
        private readonly activityRepo: Repository<ActivityLogEntity>,
    ) { }

    async findAll(tenantId: string, params: { page?: number; limit?: number }) {
        const page = params.page || 1;
        const limit = params.limit || 30;
        const [data, total] = await this.activityRepo.findAndCount({
            where: { tenant_id: tenantId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async log(entry: Partial<ActivityLogEntity>) {
        const log = this.activityRepo.create(entry);
        return this.activityRepo.save(log);
    }
}
