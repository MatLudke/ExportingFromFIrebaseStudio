import { Header } from "@/components/dashboard/header";
import { ReportCharts } from "@/components/dashboard/report-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
    return (
      <>
        <Header title="Relatórios" />
        <main className="flex-1 overflow-auto p-4 md:p-6 pt-28">
            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessões Concluídas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">+2 na última semana</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Horas de Foco</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">8.5h</div>
                            <p className="text-xs text-muted-foreground">+1.2h na última semana</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Eficiência</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">92%</div>
                            <p className="text-xs text-muted-foreground">Média de atividades concluídas</p>
                        </CardContent>
                    </Card>
                </div>
                <ReportCharts />
            </div>
        </main>
      </>
    );
  }
