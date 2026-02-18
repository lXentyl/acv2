export declare class MaterialEntity {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    cost_per_unit: number;
    supplier: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}
export declare class InventoryMovementEntity {
    id: string;
    material_id: string;
    tenant_id: string;
    movement_type: string;
    quantity: number;
    reference_job_id: string;
    notes: string;
    created_by: string;
    created_at: Date;
}
