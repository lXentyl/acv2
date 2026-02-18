import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('job_status_history')
export class JobStatusHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    job_id: string;

    @Column()
    tenant_id: string;

    @Column({ length: 50, nullable: true })
    from_status: string | null;

    @Column({ length: 50 })
    to_status: string;

    @Column()
    changed_by: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
