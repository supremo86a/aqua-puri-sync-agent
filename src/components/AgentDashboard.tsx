
import React, { useEffect, useState } from "react";
import { Play, Clock, RefreshCw, Calendar, Settings, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getNextRun, scheduleAgent, unsubscribeAgent } from "@/lib/scheduler";
import { runAutomationTask } from "@/lib/mockUIAutomator";
import AgentConfigDialog from "./AgentConfigDialog";
import ExecutionLog from "./ExecutionLog";

const AGENT_DEFAULT_TIME = "19:00";
const AGENT_DEFAULT_TZ = "America/Mexico_City";
const AGENT_DEFAULT_APPS = ["ventas", "billetera"]; // id values matching AgentConfigDialog

type RunResult = {
  timestamp: string;
  status: "success" | "error";
  message: string;
  logs: string[];
};

const APPS_LABELS: Record<string, string> = {
  ventas: "Ventas Agua",
  billetera: "Billetera",
  notas: "Notas Puri",
};

const AgentDashboard = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [time, setTime] = useState(AGENT_DEFAULT_TIME);
  const [tz, setTz] = useState(AGENT_DEFAULT_TZ);
  const [apps, setApps] = useState<string[]>(AGENT_DEFAULT_APPS);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);
  const [logs, setLogs] = useState<RunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nextRun, setNextRun] = useState<string>("");

  useEffect(() => {
    // Inicializar scheduler autómata
    const unsubscribe = scheduleAgent(
      time,
      tz,
      (res: RunResult) => {
        setLastRun(res);
        setLogs((prev) => [res, ...prev]);
        toast({
          title: res.status === "success" ? "Ejecución exitosa" : "Error en la ejecución",
          description: res.message,
        });
      },
      apps // <-- esta será ignorada a menos que la pasemos a runAutomationTask
    );
    setNextRun(getNextRun(time, tz));
    return () => unsubscribeAgent && unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, tz, apps]);

  useEffect(() => {
    setNextRun(getNextRun(time, tz));
  }, [time, tz, lastRun]);

  // --- Ejecutar manualmente con apps elegidas
  const handleManualRun = async () => {
    setIsRunning(true);
    const res = await runAutomationTask(apps); // pasamos apps seleccionadas
    setLastRun(res);
    setLogs((prev) => [res, ...prev]);
    toast({
      title: res.status === "success" ? "Ejecución exitosa" : "Error en la ejecución",
      description: res.message,
      variant: res.status === "success" ? "default" : "destructive",
    });
    setIsRunning(false);
  };

  return (
    <Card className="p-6 shadow-xl bg-white rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold">
              Hora programada:{" "}
              <span className="font-mono text-blue-700">
                {time} ({tz})
              </span>
            </span>
            <Button variant="ghost" size="icon" onClick={() => setShowConfig(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Próxima ejecución: <b>{nextRun}</b>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              Aplicaciones seleccionadas:&nbsp;
              {apps.map(a => APPS_LABELS[a]).join(", ")}
            </span>
          </div>
        </div>
        <Button
          onClick={handleManualRun}
          disabled={isRunning}
          variant="default"
          className="gap-2 px-6 py-2 text-lg"
        >
          <Play className="w-5 h-5" />
          Ejecutar Ahora
        </Button>
      </div>
      <div className="mb-2">
        <div className="text-md font-semibold mb-1 flex items-center gap-2">
          Estado último intento:
          {lastRun?.status === "success" && (
            <CheckCircle className="text-green-600 w-5 h-5" />
          )}
          {lastRun?.status === "error" && (
            <XCircle className="text-red-500 w-5 h-5" />
          )}
          <span className="text-xs ml-2 text-muted-foreground">
            {lastRun?.timestamp}
          </span>
        </div>
        <div className="bg-muted rounded px-3 py-2 text-sm font-mono text-muted-foreground overflow-x-auto">
          {lastRun ? lastRun.message : "El agente aún no ha corrido hoy"}
        </div>
      </div>
      <hr className="my-4" />
      <ExecutionLog logs={logs.slice(0, 7)} />
      <AgentConfigDialog
        open={showConfig}
        defaultTime={time}
        defaultTz={tz}
        defaultApps={apps}
        onClose={() => setShowConfig(false)}
        onSave={(newTime, newTz, newApps) => {
          setTime(newTime);
          setTz(newTz);
          setApps(newApps);
          setShowConfig(false);
          setNextRun(getNextRun(newTime, newTz));
        }}
      />
    </Card>
  );
};

export default AgentDashboard;
