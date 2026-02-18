// ============================================================
// Core domain types for ACV2 Print
// ============================================================

/** Tenant (print shop company) */
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** User roles */
export type RoleName = 'admin' | 'supervisor' | 'operator' | 'viewer';

/** User account */
export interface User {
    id: string;
    tenant_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: RoleName;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/** Authentication tokens */
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

/** Login credentials */
export interface LoginCredentials {
    email: string;
    password: string;
}

/** Registration payload */
export interface RegisterPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    tenant_name?: string;
}

/** Job priority levels */
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Job status phases (Kanban columns) */
export type JobStatus =
    | 'pending'
    | 'design'
    | 'prepress'
    | 'printing'
    | 'finishing'
    | 'quality_check'
    | 'ready'
    | 'delivered';

/** Print job */
export interface Job {
    id: string;
    tenant_id: string;
    title: string;
    description: string | null;
    client_name: string;
    status: JobStatus;
    priority: JobPriority;
    assigned_to: string | null;
    assigned_user?: User;
    due_date: string | null;
    estimated_cost: number | null;
    actual_cost: number | null;
    quantity: number;
    created_by: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

/** Job status change history */
export interface JobStatusHistory {
    id: string;
    job_id: string;
    from_status: JobStatus | null;
    to_status: JobStatus;
    changed_by: string;
    changed_by_user?: User;
    notes: string | null;
    created_at: string;
}

/** Job note / comment */
export interface JobNote {
    id: string;
    job_id: string;
    user_id: string;
    user?: User;
    content: string;
    created_at: string;
}

/** Inventory material */
export interface Material {
    id: string;
    tenant_id: string;
    name: string;
    description: string | null;
    category: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    cost_per_unit: number;
    supplier: string | null;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

/** Inventory movement types */
export type MovementType = 'in' | 'out' | 'adjustment';

/** Inventory movement record */
export interface InventoryMovement {
    id: string;
    material_id: string;
    material?: Material;
    tenant_id: string;
    movement_type: MovementType;
    quantity: number;
    reference_job_id: string | null;
    notes: string | null;
    created_by: string;
    created_by_user?: User;
    created_at: string;
}

/** Audit log entry */
export interface AuditLog {
    id: string;
    tenant_id: string;
    user_id: string;
    user?: User;
    entity_type: string;
    entity_id: string;
    action: 'create' | 'update' | 'delete';
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
}

/** Activity log entry */
export interface ActivityLog {
    id: string;
    tenant_id: string;
    user_id: string;
    user?: User;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

// ============================================================
// API response wrappers
// ============================================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/** Dashboard KPI data */
export interface DashboardKPIs {
    total_jobs: number;
    active_jobs: number;
    completed_jobs: number;
    overdue_jobs: number;
    total_materials: number;
    low_stock_materials: number;
    jobs_by_status: Record<JobStatus, number>;
    jobs_by_priority: Record<JobPriority, number>;
    recent_activity: ActivityLog[];
}
