import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TenantEntity } from '../tenants/tenant.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tenant_id: string;

    @ManyToOne(() => TenantEntity)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantEntity;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password_hash: string;

    @Column({ length: 100 })
    first_name: string;

    @Column({ length: 100 })
    last_name: string;

    @Column()
    role_id: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'timestamptz', nullable: true })
    last_login_at: Date;

    @Column({ nullable: true })
    refresh_token_hash: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @Column({ default: false })
    is_deleted: boolean;
}
