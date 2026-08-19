import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard, SectionCard, FiltersBar, FilterSelect } from "@/admin/ui";
import { dashboardSeries, funnel, retention, campaigns, donations } from "@/admin/mock";
import { formatBRL, periodOptions } from "@/admin/catalog";

export default function Visao() {
  const [period, setPeriod] = useState("30d");
  const [campaign, setCampaign] = useState("all");

  const totals = useMemo(() => {
    const confirmed = donations.filter((d) => d.status === "confirmed" || d.status === "reconciled");
    const amount = confirmed.reduce((s, d) => s + d.amount, 0);
    return {
      amount,
      count: confirmed.length,
      ticket: confirmed.length ? amount / confirmed.length : 0,
      recurring: donations.filter((d) => d.frequency !== "one_time").length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description="Resultados de captação da organização ativa, com dados consolidados por período."
      />

      <FiltersBar>
        <FilterSelect
          value={period}
          onChange={setPeriod}
          options={periodOptions}
          allLabel="Todo o período"
          width="w-[190px]"
        />
        <FilterSelect
          value={campaign}
          onChange={setCampaign}
          options={campaigns.map((c) => ({ value: c.id, label: c.name }))}
          allLabel="Todas as campanhas"
          width="w-[230px]"
        />
      </FiltersBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Arrecadado" value={formatBRL(totals.amount)} hint="Doações confirmadas" />
        <StatCard label="Doações" value={String(totals.count)} hint="No período selecionado" />
        <StatCard label="Ticket médio" value={formatBRL(totals.ticket)} />
        <StatCard label="Recorrentes" value={String(totals.recurring)} hint="Planos com cobrança ativa" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Arrecadação diária"
          description="Valor confirmado por dia"
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardSeries}>
                <defs>
                  <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="hsl(var(--primary))"
                  fill="url(#fillValor)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Funil de conversão" description="Da visita à doação confirmada">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="etapa"
                  width={120}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Retenção de recorrentes" description="Percentual ativo por ciclo">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retention}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                <Tooltip
                  formatter={(v: number) => `${v}%`}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="taxa"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Campanhas em destaque" description="Progresso sobre a meta">
          <div className="space-y-4">
            {campaigns.slice(0, 4).map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium text-foreground">{c.name}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatBRL(c.raised)} de {formatBRL(c.goal)} · {c.donations} doações
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
