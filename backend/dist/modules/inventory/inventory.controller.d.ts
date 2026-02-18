import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(req: any, page?: number, limit?: number): Promise<{
        data: import("./inventory.entity").MaterialEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(req: any, body: any): Promise<{
        data: import("./inventory.entity").MaterialEntity;
    }>;
    recordMovement(req: any, id: string, body: any): Promise<{
        data: import("./inventory.entity").InventoryMovementEntity;
    }>;
    getAlerts(req: any): Promise<{
        data: import("./inventory.entity").MaterialEntity[];
    }>;
}
