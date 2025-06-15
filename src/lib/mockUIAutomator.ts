
import { format } from "date-fns";

// Simula la ejecución de la automatización
// En un caso real, aquí enlazarías con la capa nativa Android via webintoapp + plugin o bridge (WebView <-> nativo),
// para disparar el servicio de accesibilidad manejado fuera del navegador.

type Step = {
  id: string;
  name: string;
  description: string;
  action: () => Promise<string>;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runStep(step: Step): Promise<{ ok: boolean; log: string }> {
  try {
    const msg = await step.action();
    return { ok: true, log: `${step.name}: ${msg}` };
  } catch (e: any) {
    return { ok: false, log: `${step.name}: (Error) ${e.message || String(e)}` };
  }
}

/**
 * appsSelected: array de ids ["ventas", "billetera", "notas"]
 * si faltan, simplemente no se ejecuta ese paso
 */
export async function runAutomationTask(appsSelected?: string[]) {
  const now = new Date();
  const timestamp = format(now, "dd/MM/yyyy HH:mm");
  const logs: string[] = [];
  let status: "success" | "error" = "success";
  let message = "";

  // Tabla de pasos, el id debe coincidir con los checkboxes
  const steps: Step[] = [
    {
      id: "ventas",
      name: "Ventas Agua",
      description: "Abrir app, Mensual, Copiar reporte",
      action: async () => {
        await sleep(500);
        if (Math.random() < 0.2) throw new Error("App no respondió");
        return "Reporte copiado";
      },
    },
    {
      id: "billetera",
      name: "Billetera",
      description: "Abrir app, Copiar Resumen Diario",
      action: async () => {
        await sleep(400);
        if (Math.random() < 0.15) throw new Error("Fallo al copiar resumen");
        return "Resumen copiado";
      },
    },
    {
      id: "notas",
      name: "Notas Puri",
      description: "Abrir, pegar ambos reportes en nueva entrada",
      action: async () => {
        await sleep(400);
        if (Math.random() < 0.1) throw new Error("Falló pegado de datos");
        return "Añadido correctamente";
      },
    },
  ];

  // Filtrar pasos según lo seleccionado o default (por compat)
  const stepsToRun = Array.isArray(appsSelected) && appsSelected.length > 0
    ? steps.filter((s) => appsSelected.includes(s.id))
    : steps;

  for (let i = 0; i < stepsToRun.length; ++i) {
    const out = await runStep(stepsToRun[i]);
    logs.push(out.log);
    if (!out.ok) {
      status = "error";
      message = out.log;
      logs.push("Esperando 5 minutos para reintentar...");
      await sleep(200);
      const retry = await runStep(stepsToRun[i]);
      logs.push("(Reintento) " + retry.log);
      if (!retry.ok) {
        message = retry.log;
        logs.push("Fallo definitivo en " + stepsToRun[i].name);
        break;
      } else {
        logs.push("Reintento exitoso en " + stepsToRun[i].name);
        status = "success";
      }
    }
  }

  if (status === "success") {
    message = "Todos los pasos completados y guardados exitosamente en " +
      (stepsToRun.some((s) => s.id === "notas") ? "Notas Puri." : "las apps seleccionadas.");
  }

  return {
    timestamp,
    status,
    message,
    logs,
  };
}
