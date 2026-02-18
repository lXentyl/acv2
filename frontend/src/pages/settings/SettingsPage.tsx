import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">Ajustes de la empresa</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Printer className="h-4 w-4" /> Datos de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de la Empresa</Label>
              <Input defaultValue="Mi Imprenta S.A." />
            </div>
            <div className="space-y-2">
              <Label>Correo de Contacto</Label>
              <Input defaultValue="info@miimprenta.com" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input defaultValue="+1 809 555 0100" />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input defaultValue="Av. Principal #123, Santo Domingo" />
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="text-sm font-medium">Modo Oscuro</p>
                <p className="text-xs text-muted-foreground">Activado por defecto</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-primary/50 p-0.5">
                <div className="h-5 w-5 translate-x-4 rounded-full bg-primary transition-transform" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="text-sm font-medium">Notificaciones</p>
                <p className="text-xs text-muted-foreground">Alertas de inventario bajo</p>
              </div>
              <div className="h-6 w-10 rounded-full bg-primary/50 p-0.5">
                <div className="h-5 w-5 translate-x-4 rounded-full bg-primary transition-transform" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
