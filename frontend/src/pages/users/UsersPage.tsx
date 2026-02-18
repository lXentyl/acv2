import { motion } from 'framer-motion';
import { Plus, Shield, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

const mockUsers = [
  { id: 'u1', name: 'Carlos Rodríguez', email: 'carlos@imprenta.com', role: 'admin', is_active: true },
  { id: 'u2', name: 'Ana López', email: 'ana@imprenta.com', role: 'supervisor', is_active: true },
  { id: 'u3', name: 'Miguel Torres', email: 'miguel@imprenta.com', role: 'operator', is_active: true },
  { id: 'u4', name: 'Laura Méndez', email: 'laura@imprenta.com', role: 'operator', is_active: true },
  { id: 'u5', name: 'Pedro Sánchez', email: 'pedro@imprenta.com', role: 'viewer', is_active: false },
];

const roleLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  admin: { label: 'Administrador', variant: 'default' },
  supervisor: { label: 'Supervisor', variant: 'success' },
  operator: { label: 'Operador', variant: 'warning' },
  viewer: { label: 'Visualizador', variant: 'secondary' },
};

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Gestión de usuarios y permisos</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Nuevo Usuario</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(roleLabels).map(([key, cfg]) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 p-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{mockUsers.filter(u => u.role === key).length}</p>
                <p className="text-xs text-muted-foreground">{cfg.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockUsers.map((user, i) => {
              const r = roleLabels[user.role] ?? { label: user.role, variant: 'secondary' as const };
              return (
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 hover:bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{getInitials(user.name)}</div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={r.variant}>{r.label}</Badge>
                    <Badge variant={user.is_active ? 'success' : 'secondary'}>{user.is_active ? 'Activo' : 'Inactivo'}</Badge>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
