import { useMemo, useState } from "react";
import {
  PageHeader,
  SectionCard,
  FiltersBar,
  SearchInput,
  FilterSelect,
  DataTable,
  StatCard,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ledger, LedgerEntry, donorById, campaignById } from "@/admin/mock";
import { ledgerEntryTypes, formatBRL, formatDate, labelOf } from "@/admin/catalog";

export default function Ledger() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const rows = useMemo(
    () =>
      ledger.filter((e) => {
        const term = q.toLowerCase();
        return (
          (type === "all" || e.type === type) &&
          (!term || e.reference.toLowerCase().includes(term))
        );
      }),
    [q, type],
  );

  const net = rows.reduce((s, e) => s + e.amount, 0);
  const fees = rows.filter((e) => e.type === "fee").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Livro-razão"
        description="Lançamentos de doações, taxas, reembolsos e repasses para conciliação contábil."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Lançamentos" value={String(rows.length)} />
        <StatCard label="Resultado líquido" value={formatBRL(net)} />
        <StatCard label="Taxas" value={formatBRL(fees)} />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por referência" />
        <FilterSelect value={type} onChange={setType} options={ledgerEntryTypes} allLabel="Todos os tipos" />
      </FiltersBar>

      <SectionCard>
        <DataTable<LedgerEntry>
          rows={rows}
          columns={[
            { key: "date", header: "Data", render: (e) => formatDate(e.date) },
            { key: "ref", header: "Referência", render: (e) => <span className="font-medium">{e.reference}</span> },
            { key: "type", header: "Tipo", render: (e) => labelOf(ledgerEntryTypes, e.type) },
            { key: "donor", header: "Doador", render: (e) => donorById(e.donorId)?.name ?? "—" },
            { key: "campaign", header: "Campanha", render: (e) => campaignById(e.campaignId)?.name ?? "—" },
            { key: "source", header: "Origem", render: (e) => e.source },
            {
              key: "amount",
              header: "Valor",
              render: (e) => (
                <span className={e.amount < 0 ? "text-destructive" : "text-foreground"}>
                  {formatBRL(e.amount)}
                </span>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
