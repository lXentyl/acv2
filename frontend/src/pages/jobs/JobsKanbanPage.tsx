import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  User,
  Calendar,
  GripVertical,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Job, JobStatus, JobPriority } from '@/types';

// ============================================================
// Kanban column configuration (Spanish)
// ============================================================
interface KanbanColumn {
  id: JobStatus;
  title: string;
  color: string;
  borderColor: string;
}

const columns: KanbanColumn[] = [
  { id: 'pending', title: 'Pendiente', color: 'bg-zinc-500', borderColor: 'border-zinc-500/30' },
  { id: 'design', title: 'Diseño', color: 'bg-violet-500', borderColor: 'border-violet-500/30' },
  { id: 'prepress', title: 'Pre-prensa', color: 'bg-blue-500', borderColor: 'border-blue-500/30' },
  { id: 'printing', title: 'Impresión', color: 'bg-cyan-500', borderColor: 'border-cyan-500/30' },
  { id: 'finishing', title: 'Acabado', color: 'bg-amber-500', borderColor: 'border-amber-500/30' },
  { id: 'quality_check', title: 'Control Calidad', color: 'bg-orange-500', borderColor: 'border-orange-500/30' },
  { id: 'ready', title: 'Listo', color: 'bg-emerald-500', borderColor: 'border-emerald-500/30' },
  { id: 'delivered', title: 'Entregado', color: 'bg-green-600', borderColor: 'border-green-600/30' },
];

const priorityLabels: Record<JobPriority, { label: string; variant: 'default' | 'warning' | 'destructive' | 'success' }> = {
  low: { label: 'Baja', variant: 'default' },
  medium: { label: 'Media', variant: 'default' },
  high: { label: 'Alta', variant: 'warning' },
  urgent: { label: 'Urgente', variant: 'destructive' },
};

// Mock jobs for demo
const initialJobs: Job[] = [
  { id: '1', tenant_id: 't1', title: 'Tarjetas de presentación – Corp XYZ', description: '500 unidades, papel couché 300g', client_name: 'Corp XYZ', status: 'pending', priority: 'medium', assigned_to: null, due_date: '2026-02-25', estimated_cost: 150, actual_cost: null, quantity: 500, created_by: 'u1', created_at: '2026-02-15T10:00:00', updated_at: '2026-02-15T10:00:00', is_deleted: false },
  { id: '2', tenant_id: 't1', title: 'Folletos trípticos – Evento 2026', description: '1000 unidades, a color', client_name: 'Eventos Plus', status: 'design', priority: 'high', assigned_to: null, due_date: '2026-02-22', estimated_cost: 450, actual_cost: null, quantity: 1000, created_by: 'u1', created_at: '2026-02-14T09:00:00', updated_at: '2026-02-14T09:00:00', is_deleted: false },
  { id: '3', tenant_id: 't1', title: 'Banner gran formato 3x2m', description: 'Vinilo adhesivo', client_name: 'Restaurante El Buen Sabor', status: 'printing', priority: 'urgent', assigned_to: null, due_date: '2026-02-20', estimated_cost: 280, actual_cost: null, quantity: 2, created_by: 'u1', created_at: '2026-02-13T14:00:00', updated_at: '2026-02-13T14:00:00', is_deleted: false },
  { id: '4', tenant_id: 't1', title: 'Catálogos 48 páginas', description: 'Encuadernado wire-o', client_name: 'Distribuidora Nacional', status: 'prepress', priority: 'medium', assigned_to: null, due_date: '2026-02-28', estimated_cost: 1200, actual_cost: null, quantity: 200, created_by: 'u1', created_at: '2026-02-12T11:00:00', updated_at: '2026-02-12T11:00:00', is_deleted: false },
  { id: '5', tenant_id: 't1', title: 'Etiquetas producto – Lote 500', description: null, client_name: 'Alimentos del Sur', status: 'finishing', priority: 'low', assigned_to: null, due_date: '2026-03-01', estimated_cost: 320, actual_cost: null, quantity: 5000, created_by: 'u1', created_at: '2026-02-11T08:00:00', updated_at: '2026-02-11T08:00:00', is_deleted: false },
  { id: '6', tenant_id: 't1', title: 'Invitaciones boda – Especial', description: 'Con relieve y foil dorado', client_name: 'María González', status: 'quality_check', priority: 'high', assigned_to: null, due_date: '2026-02-21', estimated_cost: 600, actual_cost: null, quantity: 150, created_by: 'u1', created_at: '2026-02-10T16:00:00', updated_at: '2026-02-10T16:00:00', is_deleted: false },
];

// ============================================================
// Sortable job card
// ============================================================
function SortableJobCard({ job }: { job: Job }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { job } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-40' : ''}
    >
      <JobCard job={job} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

/** Single job card inside a Kanban column */
function JobCard({
  job,
  dragHandleProps,
}: {
  job: Job;
  dragHandleProps?: Record<string, unknown>;
}) {
  const prio = priorityLabels[job.priority];

  return (
    <Card className="group cursor-pointer border-border/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <button
            className="mt-0.5 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium leading-tight">{job.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{job.client_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={prio.variant as 'default' | 'warning' | 'destructive'}>{prio.label}</Badge>
              {job.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(job.due_date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Column component
// ============================================================
function KanbanColumnComponent({
  column,
  jobs,
}: {
  column: KanbanColumn;
  jobs: Job[];
}) {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl border border-border bg-card/50">
      {/* Column header */}
      <div className={`flex items-center gap-2 border-b ${column.borderColor} p-3`}>
        <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
          {jobs.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ minHeight: '200px' }}>
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <SortableJobCard job={job} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}

// ============================================================
// Kanban board page
// ============================================================
export function JobsKanbanPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  /** Get jobs by status */
  const getColumnJobs = (status: JobStatus) =>
    jobs.filter((j) => j.status === status);

  /** Determine which column a draggable is over */
  const findColumnForJob = (jobId: string): JobStatus | undefined =>
    jobs.find((j) => j.id === jobId)?.status;

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find((j) => j.id === event.active.id);
    if (job) setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine target column – if dropped on another card, use that card's column;
    // if dropped on a column directly, use the column id
    let targetStatus: JobStatus | undefined;

    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      targetStatus = overColumn.id;
    } else {
      targetStatus = findColumnForJob(overId);
    }

    if (!targetStatus) return;

    setJobs((prev) =>
      prev.map((j) =>
        j.id === activeId ? { ...j, status: targetStatus as JobStatus } : j
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trabajos</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de trabajos de impresión – Vista Kanban
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Trabajo
        </Button>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {columns.map((col) => (
              <KanbanColumnComponent
                key={col.id}
                column={col}
                jobs={getColumnJobs(col.id)}
              />
            ))}
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeJob ? (
              <div className="w-72 rotate-2 scale-105">
                <JobCard job={activeJob} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
