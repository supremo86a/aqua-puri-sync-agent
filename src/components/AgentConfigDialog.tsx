
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const timezones = [
  { value: "America/Mexico_City", label: "CST - Ciudad de México" },
  { value: "America/Monterrey", label: "CST - Monterrey" },
  { value: "America/Merida", label: "CST - Mérida" },
  { value: "America/Chicago", label: "CST - Chicago (Internacional)" },
];

const APPS = [
  { id: "ventas", label: "Ventas Agua" },
  { id: "billetera", label: "Billetera" },
  { id: "notas", label: "Notas Puri" },
];

interface Props {
  open: boolean;
  defaultTime: string;
  defaultTz: string;
  defaultApps?: string[];
  onSave: (time: string, tz: string, apps: string[]) => void;
  onClose: () => void;
}
const DEFAULT_SELECTED = ["ventas", "billetera", "notas"];

const AgentConfigDialog: React.FC<Props> = ({
  open,
  defaultTime,
  defaultTz,
  onSave,
  onClose,
}) => {
  const [time, setTime] = React.useState(defaultTime);
  const [tz, setTz] = React.useState(defaultTz);

  // Siempre seleccionado y deshabilitado
  const selectedApps = DEFAULT_SELECTED;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar horario y apps</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Hora diaria:</label>
            <input
              type="time"
              className="border px-2 py-1 rounded w-32"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Zona horaria:</label>
            <select
              className="border px-2 py-1 rounded w-full"
              value={tz}
              onChange={(e) => setTz(e.target.value)}
            >
              {timezones.map((tzOpt) => (
                <option key={tzOpt.value} value={tzOpt.value}>
                  {tzOpt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Aplicaciones automatizadas:
            </label>
            <div className="flex gap-4">
              {APPS.map((app) => (
                <label key={app.id} className="flex items-center gap-1 opacity-70">
                  <input
                    type="checkbox"
                    checked
                    disabled
                  />
                  {app.label}
                </label>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Las 3 aplicaciones estarán siempre automatizadas.
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={() => onSave(time, tz, selectedApps)}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentConfigDialog;
