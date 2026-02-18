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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./inventory.entity");
let InventoryService = class InventoryService {
    constructor(materialRepo, movementRepo) {
        this.materialRepo = materialRepo;
        this.movementRepo = movementRepo;
    }
    async findAllMaterials(tenantId, params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const [data, total] = await this.materialRepo.findAndCount({
            where: { tenant_id: tenantId, is_deleted: false },
            order: { name: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async createMaterial(tenantId, userId, data) {
        const material = this.materialRepo.create({
            ...data,
            tenant_id: tenantId,
            created_by: userId,
        });
        return this.materialRepo.save(material);
    }
    async recordMovement(tenantId, userId, materialId, payload) {
        const material = await this.materialRepo.findOne({
            where: { id: materialId, tenant_id: tenantId, is_deleted: false },
        });
        if (!material)
            throw new common_1.BadRequestException('Material no encontrado');
        const qty = Number(payload.quantity);
        if (payload.movement_type === 'in') {
            material.current_stock = Number(material.current_stock) + qty;
        }
        else if (payload.movement_type === 'out') {
            if (Number(material.current_stock) < qty) {
                throw new common_1.BadRequestException('Stock insuficiente');
            }
            material.current_stock = Number(material.current_stock) - qty;
        }
        else {
            material.current_stock = qty;
        }
        await this.materialRepo.save(material);
        const movement = this.movementRepo.create({
            material_id: materialId,
            tenant_id: tenantId,
            movement_type: payload.movement_type,
            quantity: qty,
            reference_job_id: payload.reference_job_id,
            notes: payload.notes,
            created_by: userId,
        });
        return this.movementRepo.save(movement);
    }
    async getAlerts(tenantId) {
        return this.materialRepo
            .createQueryBuilder('m')
            .where('m.tenant_id = :tenantId', { tenantId })
            .andWhere('m.is_deleted = false')
            .andWhere('m.current_stock <= m.minimum_stock')
            .orderBy('m.current_stock', 'ASC')
            .getMany();
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.MaterialEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_entity_1.InventoryMovementEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map