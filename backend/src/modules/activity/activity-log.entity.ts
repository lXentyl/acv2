import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenant_id: string;

    @Column()
    user_id: string;

    @Column({ length: 255 })
    action: string;

    @Column({ length: 50 })
    entity_type: string;

    @Column()
    entity_id: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, unknown>;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
