
import { format } from "date-fns";

// Simula la ejecución de la automatización
// En un caso real, aquí enlazarías con la capa nativa Android via webintoapp + plugin o bridge (WebView <-> nativo),
// para disparar el servicio de accesibilidad manejado fuera del navegador.

type Step = {
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

export async function runAutomationTask() {
  const now = new Date();
  const timestamp = format(now, "dd/MM/yyyy HH:mm");
  const logs: string[] = [];
  let status: "success" | "error" = "success";
  let message = "";

  // Pasos a realizar, simulado.
  const steps: Step[] = [
    {
      name: "Ventas Agua",
      description: "Abrir app, Mensual, Copiar reporte",
      action: async () => {
        await sleep(500);
        // 20% chance de error
        if (Math.random() < 0.2) throw new Error("App no respondió");
        return "Reporte copiado";
      },
    },
    {
      name: "Billetera",
      description: "Abrir app, Copiar Resumen Diario",
      action: async () => {
        await sleep(400);
        if (Math.random() < 0.15) throw new Error("Fallo al copiar resumen");
        return "Resumen copiado";
      },
    },
    {
      name: "Notas Puri",
      description: "Abrir, pegar ambos reportes en nueva entrada",
      action: async () => {
        await sleep(400);
        if (Math.random() < 0.1) throw new Error("Falló pegado de datos");
        return "Añadido correctamente";
      },
    },
  ];

  for (let i = 0; i < steps.length; ++i) {
    const out = await runStep(steps[i]);
    logs.push(out.log);
    if (!out.ok) {
      status = "error";
      message = out.log;
      // Reintentar tras 5 minutos si hay error
      logs.push("Esperando 5 minutos para reintentar...");
      await sleep(200); // Simula 5min -> 0.2seg para demo
      const retry = await runStep(steps[i]);
      logs.push("(Reintento) " + retry.log);
      if (!retry.ok) {
        message = retry.log;
        logs.push("Fallo definitivo en " + steps[i].name);
        break;
      } else {
        logs.push("Reintento exitoso en " + steps[i].name);
        status = "success";
      }
    }
  }

  if (status === "success") {
    message = "Todos los pasos completados y guardados exitosamente en Notas Puri.";
  }

  return {
    timestamp,
    status,
    message,
    logs,
  };
}
