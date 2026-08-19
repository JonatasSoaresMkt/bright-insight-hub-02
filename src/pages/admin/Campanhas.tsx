import { useMemo, useState } from "react";
import { PageHeader, SectionCard, FiltersBar, SearchInput, FilterSelect, DataTable, StatusBadge, StatCard } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { campaigns, Campaign } from "@/admin/mock";
import { campaignStatus, formatBRL, formatDate, labelOf } from "@/admin/catalog";

export default function Campanhas() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          (status === "all" || c.status === status) &&
          (c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.includes(q.toLowerCase())),
      ),
    [q, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        description="Crie, publique e acompanhe as páginas de doação da organização."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova campanha
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Publicadas" value={String(campaigns.filter((c) => c.status === "published").length)} />
        <StatCard label="Rascunhos" value={String(campaigns.filter((c) => c.status === "draft").length)} />
        <StatCard
          label="Total arrecadado"
          value={formatBRL(campaigns.reduce((s, c) => s + c.raised, 0))}
        />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nome ou slug" />
        <FilterSelect value={status} onChange={setStatus} options={campaignStatus} allLabel="Todos os status" />
      </FiltersBar>

      <SectionCard>
        <DataTable<Campaign>
          rows={rows}
          columns={[
            {
              key: "name",
              header: "Campanha",
              render: (c) => (
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    /{c.slug} <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              ),
            },
            { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} label={labelOf(campaignStatus, c.status)} /> },
            {
              key: "progress",
              header: "Meta",
              render: (c) => (
                <div className="min-w-[140px] space-y-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, (c.raised / c.goal) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatBRL(c.raised)} / {formatBRL(c.goal)}
                  </p>
                </div>
              ),
            },
            { key: "donations", header: "Doações", render: (c) => c.donations },
            {
              key: "version",
              header: "Versão publicada",
              render: (c) => (c.publishedVersion ? `v${c.publishedVersion}` : "—"),
            },
            { key: "created", header: "Criada em", render: (c) => formatDate(c.createdAt) },
          ]}
        />
      </SectionCard>
    </div>
  );
}
