
// API local para automatización mock, para futura migración a nativo
import { runAutomationTask } from "@/lib/mockUIAutomator";

// Simula endpoint en http://localhost:5173/api/run-automation
export async function runAutomationAPI(req: Request): Promise<Response> {
  // forzamos las 3 apps: ventas, billetera, notas
  const data = await runAutomationTask(["ventas", "billetera", "notas"]);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

// Ejemplo de cómo usar en fetch:
// fetch("/api/run-automation").then(r => r.json()).then(console.log);
