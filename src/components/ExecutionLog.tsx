
import React from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

type Log = {
  timestamp: string;
  status: "success" | "error";
  message: string;
  logs: string[];
};

const ExecutionLog: React.FC<{ logs: Log[] }> = ({ logs }) => (
  <div className="bg-white rounded-lg p-4 border">
    <div className="font-semibold mb-2 flex items-center gap-2">
      <RefreshCw className="w-5 h-5" />
      Histórico de ejecuciones (7 más recientes)
    </div>
    <div className="space-y-3 max-h-56 overflow-auto">
      {logs.length === 0 && (
        <div className="text-sm text-muted-foreground">Sin ejecuciones aún.</div>
      )}
      {logs.map((log, idx) => (
        <div
          key={idx}
          className="border rounded p-2 bg-muted/40 flex flex-col gap-1"
        >
          <div className="flex gap-2 items-center">
            {log.status === "success" ? (
              <CheckCircle className="w-4 h-4 text-green-700" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="font-mono text-xs">{log.timestamp}</span>
            <span className="ml-2 text-sm">{log.message}</span>
          </div>
          <ul className="pl-7 text-xs text-muted-foreground list-disc">
            {log.logs.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default ExecutionLog;
