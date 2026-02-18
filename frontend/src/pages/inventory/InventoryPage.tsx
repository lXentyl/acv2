import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  AlertTriangle,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Material, InventoryMovement } from '@/types';

// Mock material data
const mockMaterials: Material[] = [
  { id: 'm1', tenant_id: 't1', name: 'Papel Bond A4 75g', description: 'Resma 500 hojas', category: 'Papel', unit: 'Resma', current_stock: 120, minimum_stock: 500, cost_per_unit: 4.5, supplier: 'Papelera Nacional', created_at: '2026-01-01', updated_at: '2026-02-18', is_deleted: false },
  { id: 'm2', tenant_id: 't1', name: 'Tinta Cyan HP', description: 'Cartucho original', category: 'Tintas', unit: 'Unidad', current_stock: 2, minimum_stock: 10, cost_per_unit: 45.0, supplier: 'HP Distribuidor', created_at: '2026-01-01', updated_at: '2026-02-18', is_deleted: false },
  { id: 'm3', tenant_id: 't1', name: 'Vinilo Adhesivo Blanco', description: 'Rollo 1.27m x 50m', category: 'Vinilos', unit: 'Rollo', current_stock: 15, minimum_stock: 50, cost_per_unit: 120.0, supplier: 'ViNova', created_at: '2026-01-01', updated_at: '2026-02-17', is_deleted: false },
  { id: 'm4', tenant_id: 't1', name: 'Papel Couché 300g A3', description: 'Paquete 100 hojas', category: 'Papel', unit: 'Paquete', current_stock: 340, minimum_stock: 200, cost_per_unit: 18.0, supplier: 'Papelera Nacional', created_at: '2026-01-01', updated_at: '2026-02-16', is_deleted: false },
  { id: 'm5', tenant_id: 't1', name: 'Lona PVC 13oz', description: 'Rollo 3.2m x 50m', category: 'Lonas', unit: 'Rollo', current_stock: 8, minimum_stock: 5, cost_per_unit: 250.0, supplier: 'MediaTex', created_at: '2026-01-01', updated_at: '2026-02-15', is_deleted: false },
  { id: 'm6', tenant_id: 't1', name: 'Tinta Magenta Eco-Solvent', description: 'Botella 1L', category: 'Tintas', unit: 'Litro', current_stock: 3, minimum_stock: 8, cost_per_unit: 68.0, supplier: 'InkPro', created_at: '2026-01-01', updated_at: '2026-02-14', is_deleted: false },
];

const mockMovements: InventoryMovement[] = [
  { id: 'mv1', material_id: 'm1', tenant_id: 't1', movement_type: 'out', quantity: 50, reference_job_id: '1', notes: 'Trabajo #1 – Tarjetas presentación', created_by: 'u1', created_at: '2026-02-18T10:30:00' },
  { id: 'mv2', material_id: 'm2', tenant_id: 't1', movement_type: 'out', quantity: 1, reference_job_id: '3', notes: 'Trabajo #3 – Banner', created_by: 'u1', created_at: '2026-02-17T15:00:00' },
  { id: 'mv3', material_id: 'm4', tenant_id: 't1', movement_type: 'in', quantity: 100, reference_job_id: null, notes: 'Compra proveedor', created_by: 'u1', created_at: '2026-02-16T09:00:00' },
];

export function InventoryPage() {
  const [search, setSearch] = useState('');

  const filtered = mockMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = mockMaterials.filter((m) => m.current_stock <= m.minimum_stock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Control de materiales y movimientos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Material
        </Button>
      </div>

      {/* Alert banner */}
      {lowStock.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-200">
              {lowStock.length} materiales por debajo del stock mínimo
            </p>
            <p className="text-xs text-amber-400/70">
              {lowStock.map((m) => m.name).join(', ')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Materials table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-4 font-medium text-muted-foreground">Material</th>
                  <th className="p-4 font-medium text-muted-foreground">Categoría</th>
                  <th className="p-4 font-medium text-muted-foreground">Stock Actual</th>
                  <th className="p-4 font-medium text-muted-foreground">Mínimo</th>
                  <th className="p-4 font-medium text-muted-foreground">Estado</th>
                  <th className="p-4 font-medium text-muted-foreground">Costo/Unidad</th>
                  <th className="p-4 font-medium text-muted-foreground">Proveedor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((material, i) => {
                  const isLow = material.current_stock <= material.minimum_stock;
                  return (
                    <motion.tr
                      key={material.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{material.name}</p>
                          {material.description && (
                            <p className="text-xs text-muted-foreground">
                              {material.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{material.category}</Badge>
                      </td>
                      <td className="p-4 font-mono font-medium">
                        {material.current_stock} {material.unit}
                      </td>
                      <td className="p-4 font-mono text-muted-foreground">
                        {material.minimum_stock}
                      </td>
                      <td className="p-4">
                        <Badge variant={isLow ? 'warning' : 'success'}>
                          {isLow ? 'Bajo' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono">
                        ${material.cost_per_unit.toFixed(2)}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {material.supplier ?? '—'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent movements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowUpDown className="h-4 w-4" />
            Movimientos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMovements.map((mv) => (
              <div
                key={mv.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3"
              >
                {mv.movement_type === 'in' ? (
                  <div className="rounded-full bg-emerald-500/15 p-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                ) : (
                  <div className="rounded-full bg-red-500/15 p-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {mv.movement_type === 'in' ? 'Entrada' : 'Salida'}: {mv.quantity} unidades
                  </p>
                  <p className="text-xs text-muted-foreground">{mv.notes}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(mv.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
