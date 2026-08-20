import { useMemo, useState } from "react";
import {
  PageHeader,
  SectionCard,
  FiltersBar,
  SearchInput,
  FilterSelect,
  DataTable,
  StatusBadge,
  StatCard,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { plans, RecurringPlan, donorById, campaignById } from "@/admin/mock";
import {
  planStatus,
  frequencyOptions,
  providerOptions,
  formatBRL,
  formatDate,
  labelOf,
} from "@/admin/catalog";

export default function Recorrencias() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [frequency, setFrequency] = useState("all");

  const rows = useMemo(
    () =>
      plans.filter((p) => {
        const donor = donorById(p.donorId);
        const term = q.toLowerCase();
        return (
          (status === "all" || p.status === status) &&
          (frequency === "all" || p.frequency === frequency) &&
          (!term || (donor?.name.toLowerCase().includes(term) ?? false))
        );
      }),
    [q, status, frequency],
  );

  const mrr = rows
    .filter((p) => p.status === "active" && p.frequency === "monthly")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos recorrentes"
        description="Assinaturas de doação ativas, pausadas e em atraso, com próxima cobrança."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Planos" value={String(rows.length)} />
        <StatCard label="Ativos" value={String(rows.filter((p) => p.status === "active").length)} />
        <StatCard label="Receita mensal" value={formatBRL(mrr)} hint="Somente planos mensais ativos" />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por doador" />
        <FilterSelect value={status} onChange={setStatus} options={planStatus} allLabel="Todos os status" />
        <FilterSelect
          value={frequency}
          onChange={setFrequency}
          options={frequencyOptions}
          allLabel="Todas as frequências"
        />
      </FiltersBar>

      <SectionCard>
        <DataTable<RecurringPlan>
          rows={rows}
          columns={[
            { key: "donor", header: "Doador", render: (p) => donorById(p.donorId)?.name ?? "—" },
            { key: "campaign", header: "Campanha", render: (p) => campaignById(p.campaignId)?.name ?? "—" },
            { key: "amount", header: "Valor", render: (p) => formatBRL(p.amount) },
            { key: "freq", header: "Frequência", render: (p) => labelOf(frequencyOptions, p.frequency) },
            { key: "provider", header: "Provedor", render: (p) => labelOf(providerOptions, p.provider) },
            { key: "next", header: "Próxima cobrança", render: (p) => formatDate(p.nextCharge) },
            { key: "cycles", header: "Ciclos", render: (p) => String(p.cycles) },
            {
              key: "status",
              header: "Status",
              render: (p) => <StatusBadge status={p.status} label={labelOf(planStatus, p.status)} />,
            },
            {
              key: "actions",
              header: "",
              render: () => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Pausar</Button>
                  <Button variant="outline" size="sm" className="text-destructive">Cancelar</Button>
                </div>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
