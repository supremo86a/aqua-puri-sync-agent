
import AgentDashboard from "@/components/AgentDashboard";

const Index = () => {
  return (
    <main className="min-h-screen py-12 bg-gradient-to-br from-[#f4f6fa] via-[#f9fafb] to-[#e3e9f7] px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Agente Automatizado de Reportes Diarios
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          El agente interactúa automáticamente con las apps <b>Ventas Agua</b>, <b>Billetera</b> y <b>Notas Puri</b> todos los días a las 19:00 (CST). Puedes ver logs, historial y ejecutar pruebas manuales.
        </p>
        <AgentDashboard />
      </div>
    </main>
  );
};

export default Index;
