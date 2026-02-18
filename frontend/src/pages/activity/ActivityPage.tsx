import { motion } from 'framer-motion';
import {
  Activity,
  KanbanSquare,
  Package,
  User,
  Settings,
} from 'lucide-react';
import type { ActivityLog } from '@/types';

// Mock activity data
const mockActivity: ActivityLog[] = [
  { id: 'act1', tenant_id: 't1', user_id: 'u1', action: 'Movió trabajo a "Impresión"', entity_type: 'job', entity_id: '3', metadata: null, created_at: '2026-02-18T15:30:00' },
  { id: 'act2', tenant_id: 't1', user_id: 'u2', action: 'Registró salida de 50 resmas de Papel Bond A4', entity_type: 'material', entity_id: 'm1', metadata: null, created_at: '2026-02-18T10:30:00' },
  { id: 'act3', tenant_id: 't1', user_id: 'u1', action: 'Creó nuevo trabajo: "Banner gran formato"', entity_type: 'job', entity_id: '3', metadata: null, created_at: '2026-02-17T09:00:00' },
  { id: 'act4', tenant_id: 't1', user_id: 'u1', action: 'Actualizó rol de usuario a Supervisor', entity_type: 'user', entity_id: 'u3', metadata: null, created_at: '2026-02-16T16:00:00' },
  { id: 'act5', tenant_id: 't1', user_id: 'u2', action: 'Añadió nota al trabajo #2', entity_type: 'job', entity_id: '2', metadata: null, created_at: '2026-02-16T11:00:00' },
  { id: 'act6', tenant_id: 't1', user_id: 'u1', action: 'Registró entrada de 100 paquetes de Papel Couché', entity_type: 'material', entity_id: 'm4', metadata: null, created_at: '2026-02-16T09:00:00' },
];

const entityIcons: Record<string, React.ReactNode> = {
  job: <KanbanSquare className="h-4 w-4" />,
  material: <Package className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  tenant: <Settings className="h-4 w-4" />,
};

export function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Actividad</h1>
        <p className="text-sm text-muted-foreground">
          Línea de tiempo de eventos operacionales
        </p>
      </div>

      {/* Activity timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-5 top-0 w-px bg-border" />

        <div className="space-y-4">
          {mockActivity.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex items-start gap-4 pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-3 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground">
                {entityIcons[activity.entity_type] ?? (
                  <Activity className="h-3 w-3" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card/80">
                <p className="text-sm">{activity.action}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {new Date(activity.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>Usuario: {activity.user_id}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
