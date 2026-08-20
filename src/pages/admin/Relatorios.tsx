import { useState } from "react";
import { PageHeader, SectionCard, StatCard, FiltersBar, FilterSelect, DataTable } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { dashboardSeries, funnel, retention, campaigns, donations } from "@/admin/mock";
import { periodOptions, formatBRL } from "@/admin/catalog";

export default function Relatorios() {
  const [period, setPeriod] = useState("30d");

  const byCampaign = campaigns.map((c) => {
    const list = donations.filter(
      (d) => d.campaignId === c.id && (d.status === "confirmed" || d.status === "reconciled"),
    );
    return {
      campanha: c.name,
      total: list.reduce((s, d) => s + d.amount, 0),
      doacoes: list.length,
      ticket: list.length ? list.reduce((s, d) => s + d.amount, 0) / list.length : 0,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Desempenho de captação, funil de conversão e retenção de doadores recorrentes."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
        }
      />

      <FiltersBar>
        <FilterSelect value={period} onChange={setPeriod} options={periodOptions} allLabel="Todo o período" />
      </FiltersBar>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Arrecadado" value={formatBRL(byCampaign.reduce((s, c) => s + c.total, 0))} />
        <StatCard label="Doações confirmadas" value={String(byCampaign.reduce((s, c) => s + c.doacoes, 0))} />
        <StatCard
          label="Ticket médio"
          value={formatBRL(
            byCampaign.reduce((s, c) => s + c.total, 0) /
              Math.max(byCampaign.reduce((s, c) => s + c.doacoes, 0), 1),
          )}
        />
      </div>

      <SectionCard title="Arrecadação diária">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Funil de conversão">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="etapa" width={130} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Retenção de recorrentes">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retention}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Line type="monotone" dataKey="taxa" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Desempenho por campanha">
        <DataTable
          rows={byCampaign}
          columns={[
            { key: "c", header: "Campanha", render: (r: typeof byCampaign[number]) => r.campanha },
            { key: "t", header: "Arrecadado", render: (r: typeof byCampaign[number]) => formatBRL(r.total) },
            { key: "d", header: "Doações", render: (r: typeof byCampaign[number]) => String(r.doacoes) },
            { key: "m", header: "Ticket médio", render: (r: typeof byCampaign[number]) => formatBRL(r.ticket) },
          ]}
        />
      </SectionCard>
    </div>
  );
}
