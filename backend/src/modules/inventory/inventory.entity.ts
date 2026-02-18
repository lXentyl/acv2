import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('materials')
export class MaterialEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenant_id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 100 })
    category: string;

    @Column({ length: 50 })
    unit: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    current_stock: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    minimum_stock: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    cost_per_unit: number;

    @Column({ nullable: true })
    supplier: string;

    @Column()
    created_by: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ default: false })
    is_deleted: boolean;
}

@Entity('inventory_movements')
export class InventoryMovementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    material_id: string;

    @Column()
    tenant_id: string;

    @Column({ length: 20 })
    movement_type: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    quantity: number;

    @Column({ nullable: true })
    reference_job_id: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column()
    created_by: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
