import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TenantEntity } from '../tenants/tenant.entity';

@Entity('jobs')
export class JobEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenant_id: string;

    @ManyToOne(() => TenantEntity)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantEntity;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 255 })
    client_name: string;

    @Column({ length: 50, default: 'pending' })
    status: string;

    @Column({ length: 20, default: 'medium' })
    priority: string;

    @Column({ nullable: true })
    assigned_to: string;

    @Column({ type: 'date', nullable: true })
    due_date: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    estimated_cost: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    actual_cost: number;

    @Column({ default: 1 })
    quantity: number;

    @Column()
    created_by: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ default: false })
    is_deleted: boolean;
}
