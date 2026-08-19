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
  KeyValue,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download, Plus } from "lucide-react";
import { donations, Donation, donorById, campaignById } from "@/admin/mock";
import {
  donationStatus,
  frequencyOptions,
  providerOptions,
  formatBRL,
  formatDateTime,
  labelOf,
} from "@/admin/catalog";

export default function Doacoes() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [selected, setSelected] = useState<Donation | null>(null);

  const rows = useMemo(
    () =>
      donations.filter((d) => {
        const donor = donorById(d.donorId);
        const term = q.toLowerCase();
        return (
          (status === "all" || d.status === status) &&
          (provider === "all" || d.provider === provider) &&
          (frequency === "all" || d.frequency === frequency) &&
          (!term ||
            d.reference.toLowerCase().includes(term) ||
            (donor?.name.toLowerCase().includes(term) ?? false))
        );
      }),
    [q, status, provider, frequency],
  );

  const confirmedTotal = rows
    .filter((d) => d.status === "confirmed" || d.status === "reconciled")
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doações"
        description="Todas as contribuições recebidas, com status de pagamento e conciliação."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Doação offline
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Resultados" value={String(rows.length)} />
        <StatCard label="Confirmado" value={formatBRL(confirmedTotal)} />
        <StatCard label="Taxas" value={formatBRL(rows.reduce((s, d) => s + d.fee, 0))} />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por referência ou doador" />
        <FilterSelect value={status} onChange={setStatus} options={donationStatus} allLabel="Todos os status" />
        <FilterSelect value={provider} onChange={setProvider} options={providerOptions} allLabel="Todos os provedores" />
        <FilterSelect value={frequency} onChange={setFrequency} options={frequencyOptions} allLabel="Todas as frequências" />
      </FiltersBar>

      <SectionCard>
        <DataTable<Donation>
          rows={rows}
          onRowClick={setSelected}
          columns={[
            { key: "ref", header: "Referência", render: (d) => <span className="font-medium">{d.reference}</span> },
            { key: "donor", header: "Doador", render: (d) => donorById(d.donorId)?.name ?? "—" },
            { key: "campaign", header: "Campanha", render: (d) => campaignById(d.campaignId)?.name ?? "—" },
            { key: "amount", header: "Valor", render: (d) => formatBRL(d.amount) },
            { key: "freq", header: "Frequência", render: (d) => labelOf(frequencyOptions, d.frequency) },
            { key: "provider", header: "Provedor", render: (d) => labelOf(providerOptions, d.provider) },
            {
              key: "status",
              header: "Status",
              render: (d) => <StatusBadge status={d.status} label={labelOf(donationStatus, d.status)} />,
            },
            { key: "date", header: "Data", render: (d) => formatDateTime(d.date) },
          ]}
        />
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.reference}</SheetTitle>
                <SheetDescription>Detalhes da doação e histórico de pagamento.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <KeyValue
                  items={[
                    { label: "Doador", value: donorById(selected.donorId)?.name ?? "—" },
                    { label: "Campanha", value: campaignById(selected.campaignId)?.name ?? "—" },
                    { label: "Valor", value: formatBRL(selected.amount) },
                    { label: "Taxa", value: formatBRL(selected.fee) },
                    { label: "Frequência", value: labelOf(frequencyOptions, selected.frequency) },
                    { label: "Provedor", value: labelOf(providerOptions, selected.provider) },
                    {
                      label: "Status",
                      value: <StatusBadge status={selected.status} label={labelOf(donationStatus, selected.status)} />,
                    },
                    { label: "Data", value: formatDateTime(selected.date) },
                    { label: "Recibo", value: selected.receiptId ?? "Não emitido" },
                    { label: "Plano recorrente", value: selected.planId ?? "—" },
                  ]}
                />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Respostas do formulário</h3>
                  {selected.answers?.map((a) => (
                    <div key={a.question} className="rounded-lg border border-border p-3 text-sm">
                      <p className="text-xs text-muted-foreground">{a.question}</p>
                      <p className="font-medium">{a.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Reenviar recibo</Button>
                  <Button variant="outline" size="sm">Marcar conciliada</Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Registrar reembolso
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
