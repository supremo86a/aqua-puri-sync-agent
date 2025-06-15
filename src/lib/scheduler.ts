
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz"; // updated import

// Simula un scheduler en frontend, en código nativo equivalente usarías WorkManager (Android) 
// o AlarmManager + Servicio de Accesibilidad para background scheduler real.
// Aquí sería donde conectarías con la capa nativa exportada por webintoapp.

let interval: NodeJS.Timeout | null = null;
let latestCallback: (() => void) | null = null;

// Calcula el próximo horario, formato bonito para la UI
export function getNextRun(hhmm: string, tz: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  // Generar la fecha de próxima ejecución en el tz correcto
  const next = toZonedTime(now, tz); // updated usage
  next.setHours(h, m, 0, 0);
  if (now >= next) next.setDate(next.getDate() + 1);
  return format(next, "dd/MM/yyyy HH:mm");
}

// Exporta agente: se ejecutará la callback en cuanto "ocurra" (cada 1min revisa)
// En una app nativa, esta lógica debe migrar a background services + capa nativa Accesibility
export function scheduleAgent(
  hhmm: string,
  tz: string,
  onRun: (result: any) => void
) {
  if (interval) clearInterval(interval);
  latestCallback = () => triggerIfDue(hhmm, tz, onRun);

  interval = setInterval(() => {
    if (latestCallback) latestCallback();
  }, 60 * 1000); // Checa cada minuto

  // Ejecuta al montar si es justo ahora
  triggerIfDue(hhmm, tz, onRun);

  return () => {
    if (interval) clearInterval(interval);
  };
}

function triggerIfDue(hhmm: string, tz: string, onRun: (result: any) => void) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const local = toZonedTime(now, tz); // updated usage
  if (local.getHours() === h && local.getMinutes() === m) {
    // Para evitar múltiples ejecuciones en la misma ventana de 1 minuto:
    const k = format(now, "yyyy-MM-dd-HH-mm");
    if ((window as any).__last_agent_tick_key === k) return;
    (window as any).__last_agent_tick_key = k;
    import("./mockUIAutomator").then(({ runAutomationTask }) =>
      runAutomationTask().then(onRun)
    );
  }
}

export function unsubscribeAgent() {
  if (interval) clearInterval(interval);
}

