import { motion } from 'framer-motion';
import { ScrollText, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { AuditLog } from '@/types';

// Mock audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: 'a1',
    tenant_id: 't1',
    user_id: 'u1',
    entity_type: 'job',
    entity_id: '1',
    action: 'update',
    old_values: { status: 'pending' },
    new_values: { status: 'design' },
    ip_address: '192.168.1.10',
    created_at: '2026-02-18T14:30:00',
  },
  {
    id: 'a2',
    tenant_id: 't1',
    user_id: 'u1',
    entity_type: 'material',
    entity_id: 'm1',
    action: 'update',
    old_values: { current_stock: 170 },
    new_values: { current_stock: 120 },
    ip_address: '192.168.1.10',
    created_at: '2026-02-18T10:30:00',
  },
  {
    id: 'a3',
    tenant_id: 't1',
    user_id: 'u2',
    entity_type: 'job',
    entity_id: '3',
    action: 'create',
    old_values: null,
    new_values: { title: 'Banner gran formato 3x2m', status: 'pending' },
    ip_address: '192.168.1.15',
    created_at: '2026-02-17T09:00:00',
  },
  {
    id: 'a4',
    tenant_id: 't1',
    user_id: 'u1',
    entity_type: 'user',
    entity_id: 'u3',
    action: 'update',
    old_values: { role: 'operator' },
    new_values: { role: 'supervisor' },
    ip_address: '192.168.1.10',
    created_at: '2026-02-16T16:00:00',
  },
];

const actionLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' }> = {
  create: { label: 'Crear', variant: 'success' },
  update: { label: 'Actualizar', variant: 'warning' },
  delete: { label: 'Eliminar', variant: 'destructive' },
};

const entityLabels: Record<string, string> = {
  job: 'Trabajo',
  material: 'Material',
  user: 'Usuario',
  tenant: 'Empresa',
};

export function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auditoría</h1>
        <p className="text-sm text-muted-foreground">
          Registro inmutable de cambios en el sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar en auditoría..." className="pl-9" />
        </div>
      </div>

      {/* Audit log entries */}
      <div className="space-y-3">
        {mockAuditLogs.map((log, i) => {
          const actionCfg = actionLabels[log.action] ?? {
            label: log.action,
            variant: 'default' as const,
          };
          const entityLabel = entityLabels[log.entity_type] ?? log.entity_type;

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="transition-colors hover:bg-card/80">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-secondary p-2">
                        <ScrollText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={actionCfg.variant}>
                            {actionCfg.label}
                          </Badge>
                          <span className="text-sm font-medium">
                            {entityLabel}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            #{log.entity_id}
                          </span>
                        </div>

                        {/* Old vs new values */}
                        {log.old_values && log.new_values && (
                          <div className="mt-2 rounded-lg bg-secondary/50 p-2 font-mono text-xs">
                            {Object.keys(log.new_values).map((key) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="text-red-400 line-through">
                                  {String(
                                    (log.old_values as Record<string, unknown>)?.[key] ?? '—'
                                  )}
                                </span>
                                <span className="text-emerald-400">
                                  →{' '}
                                  {String(
                                    (log.new_values as Record<string, unknown>)[key]
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {!log.old_values && log.new_values && (
                          <div className="mt-2 rounded-lg bg-secondary/50 p-2 font-mono text-xs">
                            {Object.entries(log.new_values).map(([key, val]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="text-emerald-400">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Usuario: {log.user_id}</span>
                          <span>IP: {log.ip_address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      {new Date(log.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
