-- ============================================================
-- ACV2 Print – Full PostgreSQL Schema
-- Enterprise Print Operations Management Platform
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TENANTS (Print shop companies)
-- ============================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- ============================================================
-- 2. ROLES
-- ============================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. PERMISSIONS
-- ============================================================
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  module VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. ROLE_PERMISSIONS (M:M)
-- ============================================================
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ============================================================
-- 5. USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  refresh_token_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_active ON users(tenant_id, is_active) WHERE is_deleted = false;

-- ============================================================
-- 6. JOBS (Print jobs)
-- ============================================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','design','prepress','printing','finishing','quality_check','ready','delivered')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low','medium','high','urgent')),
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_jobs_tenant ON jobs(tenant_id);
CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status) WHERE is_deleted = false;
CREATE INDEX idx_jobs_tenant_priority ON jobs(tenant_id, priority) WHERE is_deleted = false;
CREATE INDEX idx_jobs_assigned ON jobs(assigned_to) WHERE is_deleted = false;
CREATE INDEX idx_jobs_due_date ON jobs(tenant_id, due_date) WHERE is_deleted = false;

-- ============================================================
-- 7. JOB_STATUS_HISTORY (Immutable status transitions)
-- ============================================================
CREATE TABLE job_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_status_history_job ON job_status_history(job_id);
CREATE INDEX idx_job_status_history_tenant ON job_status_history(tenant_id);

-- ============================================================
-- 8. JOB_NOTES
-- ============================================================
CREATE TABLE job_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_job_notes_job ON job_notes(job_id);

-- ============================================================
-- 9. MATERIALS (Inventory items)
-- ============================================================
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  current_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  minimum_stock DECIMAL(12,2) NOT NULL DEFAULT 0,
  cost_per_unit DECIMAL(12,2) NOT NULL DEFAULT 0,
  supplier VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_materials_tenant ON materials(tenant_id);
CREATE INDEX idx_materials_tenant_category ON materials(tenant_id, category) WHERE is_deleted = false;
CREATE INDEX idx_materials_low_stock ON materials(tenant_id) WHERE current_stock <= minimum_stock AND is_deleted = false;

-- ============================================================
-- 10. INVENTORY_MOVEMENTS
-- ============================================================
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in','out','adjustment')),
  quantity DECIMAL(12,2) NOT NULL,
  reference_job_id UUID REFERENCES jobs(id),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_movements_material ON inventory_movements(material_id);
CREATE INDEX idx_inventory_movements_tenant ON inventory_movements(tenant_id);

-- ============================================================
-- 11. JOB_MATERIALS (Materials consumed per job)
-- ============================================================
CREATE TABLE job_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  quantity_used DECIMAL(12,2) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_materials_job ON job_materials(job_id);

-- ============================================================
-- 12. AUDIT_LOGS (Immutable – who changed what)
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('create','update','delete')),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_tenant_date ON audit_logs(tenant_id, created_at DESC);

-- ============================================================
-- 13. ACTIVITY_LOGS (Operational event timeline)
-- ============================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_tenant ON activity_logs(tenant_id);
CREATE INDEX idx_activity_logs_tenant_date ON activity_logs(tenant_id, created_at DESC);

-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO roles (id, name, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Full system access'),
  ('00000000-0000-0000-0000-000000000002', 'supervisor', 'Manage jobs and users'),
  ('00000000-0000-0000-0000-000000000003', 'operator', 'Execute jobs and update status'),
  ('00000000-0000-0000-0000-000000000004', 'viewer', 'Read-only access');

INSERT INTO permissions (id, name, description, module) VALUES
  (uuid_generate_v4(), 'jobs.create', 'Create print jobs', 'jobs'),
  (uuid_generate_v4(), 'jobs.read', 'View print jobs', 'jobs'),
  (uuid_generate_v4(), 'jobs.update', 'Update print jobs', 'jobs'),
  (uuid_generate_v4(), 'jobs.delete', 'Delete print jobs', 'jobs'),
  (uuid_generate_v4(), 'jobs.change_status', 'Change job status', 'jobs'),
  (uuid_generate_v4(), 'inventory.create', 'Add materials', 'inventory'),
  (uuid_generate_v4(), 'inventory.read', 'View inventory', 'inventory'),
  (uuid_generate_v4(), 'inventory.update', 'Update materials', 'inventory'),
  (uuid_generate_v4(), 'inventory.movement', 'Record stock movements', 'inventory'),
  (uuid_generate_v4(), 'users.create', 'Create users', 'users'),
  (uuid_generate_v4(), 'users.read', 'View users', 'users'),
  (uuid_generate_v4(), 'users.update', 'Update users', 'users'),
  (uuid_generate_v4(), 'users.delete', 'Delete users', 'users'),
  (uuid_generate_v4(), 'audit.read', 'View audit logs', 'audit'),
  (uuid_generate_v4(), 'settings.manage', 'Manage tenant settings', 'settings');

-- Grant all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM permissions;

-- Sample tenant
INSERT INTO tenants (id, name, slug) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Imprenta Demo S.A.', 'imprenta-demo');

-- Sample admin user (password: Admin123!)
-- bcrypt hash for 'Admin123!' 
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role_id) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin@demo.com', '$2b$10$rQZ8K8dF3eJ5sG6X9P3Z5OaW.V1zH4K2R5qY7N8M6lJ3cB2wA1xSe', 'Carlos', 'Rodríguez', '00000000-0000-0000-0000-000000000001');
