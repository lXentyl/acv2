import { Repository } from 'typeorm';
import { MaterialEntity, InventoryMovementEntity } from './inventory.entity';
export declare class InventoryService {
    private readonly materialRepo;
    private readonly movementRepo;
    constructor(materialRepo: Repository<MaterialEntity>, movementRepo: Repository<InventoryMovementEntity>);
    findAllMaterials(tenantId: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: MaterialEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    createMaterial(tenantId: string, userId: string, data: Partial<MaterialEntity>): Promise<MaterialEntity>;
    recordMovement(tenantId: string, userId: string, materialId: string, payload: {
        movement_type: string;
        quantity: number;
        reference_job_id?: string;
        notes?: string;
    }): Promise<InventoryMovementEntity>;
    getAlerts(tenantId: string): Promise<MaterialEntity[]>;
}
