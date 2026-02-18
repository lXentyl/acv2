import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { MaterialEntity, InventoryMovementEntity } from './inventory.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(MaterialEntity)
        private readonly materialRepo: Repository<MaterialEntity>,
        @InjectRepository(InventoryMovementEntity)
        private readonly movementRepo: Repository<InventoryMovementEntity>,
    ) { }

    async findAllMaterials(tenantId: string, params: { page?: number; limit?: number }) {
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

    async createMaterial(tenantId: string, userId: string, data: Partial<MaterialEntity>) {
        const material = this.materialRepo.create({
            ...data,
            tenant_id: tenantId,
            created_by: userId,
        });
        return this.materialRepo.save(material);
    }

    /** Record inventory movement and update stock */
    async recordMovement(
        tenantId: string,
        userId: string,
        materialId: string,
        payload: { movement_type: string; quantity: number; reference_job_id?: string; notes?: string },
    ) {
        const material = await this.materialRepo.findOne({
            where: { id: materialId, tenant_id: tenantId, is_deleted: false },
        });
        if (!material) throw new BadRequestException('Material no encontrado');

        // Update stock based on movement type
        const qty = Number(payload.quantity);
        if (payload.movement_type === 'in') {
            material.current_stock = Number(material.current_stock) + qty;
        } else if (payload.movement_type === 'out') {
            if (Number(material.current_stock) < qty) {
                throw new BadRequestException('Stock insuficiente');
            }
            material.current_stock = Number(material.current_stock) - qty;
        } else {
            material.current_stock = qty; // adjustment sets absolute value
        }

        await this.materialRepo.save(material);

        // Record the movement
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

    /** Get materials below minimum stock threshold */
    async getAlerts(tenantId: string) {
        return this.materialRepo
            .createQueryBuilder('m')
            .where('m.tenant_id = :tenantId', { tenantId })
            .andWhere('m.is_deleted = false')
            .andWhere('m.current_stock <= m.minimum_stock')
            .orderBy('m.current_stock', 'ASC')
            .getMany();
    }
}
