
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const timezones = [
  { value: "America/Mexico_City", label: "CST - Ciudad de México" },
  { value: "America/Monterrey", label: "CST - Monterrey" },
  { value: "America/Merida", label: "CST - Mérida" },
  { value: "America/Chicago", label: "CST - Chicago (Internacional)" },
];

interface Props {
  open: boolean;
  defaultTime: string;
  defaultTz: string;
  onSave: (time: string, tz: string) => void;
  onClose: () => void;
}

const AgentConfigDialog: React.FC<Props> = ({
  open,
  defaultTime,
  defaultTz,
  onSave,
  onClose,
}) => {
  const [time, setTime] = useState(defaultTime);
  const [tz, setTz] = useState(defaultTz);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar horario</DialogTitle>
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
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            variant="default"
            onClick={() => onSave(time, tz)}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentConfigDialog;
