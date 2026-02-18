import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '@/types';

// ============================================================
// Animated counter hook
// ============================================================
function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return { count, ref };
}

// ============================================================
// KPI Card component
// ============================================================
interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'warning' | 'success';
  delay?: number;
}

function KPICard({
  title,
  value,
  icon,
  trend,
  trendUp,
  variant = 'default',
  delay = 0,
}: KPICardProps) {
  const { count } = useAnimatedCounter(value);

  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/30 bg-primary/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className={variantStyles[variant]}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {title}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{count}</p>
              {trend && (
                <p
                  className={`mt-1 flex items-center gap-1 text-xs ${
                    trendUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  <TrendingUp
                    className={`h-3 w-3 ${!trendUp ? 'rotate-180' : ''}`}
                  />
                  {trend}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-secondary p-2.5">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// Status distribution bar
// ============================================================
const statusConfig: Record<
  JobStatus,
  { label: string; color: string }
> = {
  pending: { label: 'Pendiente', color: 'bg-zinc-500' },
  design: { label: 'Diseño', color: 'bg-violet-500' },
  prepress: { label: 'Pre-prensa', color: 'bg-blue-500' },
  printing: { label: 'Impresión', color: 'bg-cyan-500' },
  finishing: { label: 'Acabado', color: 'bg-amber-500' },
  quality_check: { label: 'Control Calidad', color: 'bg-orange-500' },
  ready: { label: 'Listo', color: 'bg-emerald-500' },
  delivered: { label: 'Entregado', color: 'bg-green-600' },
};

// Mock demo data — replace with React Query data in production
const mockKPIs = {
  total_jobs: 156,
  active_jobs: 42,
  completed_jobs: 98,
  overdue_jobs: 3,
  total_materials: 64,
  low_stock_materials: 7,
  jobs_by_status: {
    pending: 8,
    design: 12,
    prepress: 6,
    printing: 9,
    finishing: 4,
    quality_check: 3,
    ready: 14,
    delivered: 98,
  } as Record<JobStatus, number>,
};

export function DashboardPage() {
  const totalActive = Object.entries(mockKPIs.jobs_by_status)
    .filter(([s]) => s !== 'delivered')
    .reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de operaciones
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Trabajos"
          value={mockKPIs.total_jobs}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          trend="+12% este mes"
          trendUp
          variant="primary"
          delay={0}
        />
        <KPICard
          title="En Proceso"
          value={mockKPIs.active_jobs}
          icon={<Clock className="h-5 w-5 text-amber-400" />}
          variant="warning"
          delay={0.1}
        />
        <KPICard
          title="Completados"
          value={mockKPIs.completed_jobs}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          trend="+8% vs semana pasada"
          trendUp
          variant="success"
          delay={0.2}
        />
        <KPICard
          title="Vencidos"
          value={mockKPIs.overdue_jobs}
          icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
          delay={0.3}
        />
      </div>

      {/* Second row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Status distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Distribución por Fase
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Distribution bar */}
              <div className="mb-4 flex h-4 overflow-hidden rounded-full bg-secondary">
                {Object.entries(mockKPIs.jobs_by_status).map(
                  ([status, count]) => {
                    const pct = totalActive > 0 ? (count / totalActive) * 100 : 0;
                    if (pct === 0) return null;
                    const cfg = statusConfig[status as JobStatus];
                    return (
                      <motion.div
                        key={status}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className={`${cfg.color} transition-all`}
                        title={`${cfg.label}: ${count}`}
                      />
                    );
                  }
                )}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(statusConfig).map(([status, cfg]) => (
                  <div key={status} className="flex items-center gap-2 text-xs">
                    <div className={`h-2.5 w-2.5 rounded-full ${cfg.color}`} />
                    <span className="text-muted-foreground">{cfg.label}</span>
                    <span className="font-medium">
                      {mockKPIs.jobs_by_status[status as JobStatus]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-amber-400" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Papel Bond A4', stock: 120, min: 500 },
                  { name: 'Tinta Cyan', stock: 2, min: 10 },
                  { name: 'Vinilo Adhesivo', stock: 15, min: 50 },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Mínimo: {item.min}
                      </p>
                    </div>
                    <Badge variant="warning">{item.stock} uds</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
