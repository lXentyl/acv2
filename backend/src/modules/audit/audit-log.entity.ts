import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenant_id: string;

    @Column()
    user_id: string;

    @Column({ length: 50 })
    entity_type: string;

    @Column()
    entity_id: string;

    @Column({ length: 20 })
    action: string;

    @Column({ type: 'jsonb', nullable: true })
    old_values: Record<string, unknown>;

    @Column({ type: 'jsonb', nullable: true })
    new_values: Record<string, unknown>;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true })
    user_agent: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
