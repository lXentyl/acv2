"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./job.entity");
const job_status_history_entity_1 = require("./job-status-history.entity");
let JobsService = class JobsService {
    constructor(jobRepo, historyRepo) {
        this.jobRepo = jobRepo;
        this.historyRepo = historyRepo;
    }
    async findAll(tenantId, params) {
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
    async create(tenantId, userId, data) {
        const job = this.jobRepo.create({
            ...data,
            tenant_id: tenantId,
            created_by: userId,
        });
        const saved = await this.jobRepo.save(job);
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
    async updateStatus(tenantId, jobId, userId, newStatus, notes) {
        const job = await this.jobRepo.findOne({
            where: { id: jobId, tenant_id: tenantId, is_deleted: false },
        });
        if (!job)
            throw new Error('Job not found');
        const oldStatus = job.status;
        job.status = newStatus;
        await this.jobRepo.save(job);
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
    async getHistory(tenantId, jobId) {
        return this.historyRepo.find({
            where: { job_id: jobId, tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.JobEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(job_status_history_entity_1.JobStatusHistoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], JobsService);
//# sourceMappingURL=jobs.service.js.map