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
import { Download } from "lucide-react";
import { donors, Donor, donations, plans, campaignById } from "@/admin/mock";
import {
  donorStatus,
  consentOptions,
  donationStatus,
  formatBRL,
  formatDate,
  labelOf,
  maskEmail,
} from "@/admin/catalog";

export default function Doadores() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [consent, setConsent] = useState("all");
  const [selected, setSelected] = useState<Donor | null>(null);

  const rows = useMemo(
    () =>
      donors.filter((d) => {
        const term = q.toLowerCase();
        return (
          (status === "all" || d.status === status) &&
          (consent === "all" || d.consent === consent) &&
          (!term || d.name.toLowerCase().includes(term) || d.email.toLowerCase().includes(term))
        );
      }),
    [q, status, consent],
  );

  const donorDonations = selected ? donations.filter((d) => d.donorId === selected.id) : [];
  const donorPlans = selected ? plans.filter((p) => p.donorId === selected.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doadores"
        description="Cadastro único de apoiadores, com consentimento de contato e histórico de doações."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Resultados" value={String(rows.length)} />
        <StatCard label="Com opt-in" value={String(rows.filter((d) => d.consent === "opt_in").length)} />
        <StatCard label="Total doado" value={formatBRL(rows.reduce((s, d) => s + d.totalGiven, 0))} />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por nome ou e-mail" />
        <FilterSelect value={status} onChange={setStatus} options={donorStatus} allLabel="Todos os status" />
        <FilterSelect value={consent} onChange={setConsent} options={consentOptions} allLabel="Todos os consentimentos" />
      </FiltersBar>

      <SectionCard>
        <DataTable<Donor>
          rows={rows}
          onRowClick={setSelected}
          columns={[
            { key: "name", header: "Nome", render: (d) => <span className="font-medium">{d.name}</span> },
            { key: "email", header: "E-mail", render: (d) => maskEmail(d.email) },
            { key: "city", header: "Cidade", render: (d) => d.city ?? "—" },
            { key: "count", header: "Doações", render: (d) => String(d.donationsCount) },
            { key: "total", header: "Total", render: (d) => formatBRL(d.totalGiven) },
            { key: "consent", header: "Consentimento", render: (d) => labelOf(consentOptions, d.consent) },
            {
              key: "status",
              header: "Status",
              render: (d) => <StatusBadge status={d.status} label={labelOf(donorStatus, d.status)} />,
            },
          ]}
        />
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>Ficha do doador com dados de contato mascarados.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <KeyValue
                  items={[
                    { label: "E-mail", value: maskEmail(selected.email) },
                    { label: "Telefone", value: selected.phone ?? "—" },
                    { label: "Documento", value: selected.document ?? "—" },
                    { label: "Cidade", value: selected.city ?? "—" },
                    { label: "Cadastro", value: formatDate(selected.createdAt) },
                    {
                      label: "Status",
                      value: <StatusBadge status={selected.status} label={labelOf(donorStatus, selected.status)} />,
                    },
                  ]}
                />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Doações ({donorDonations.length})</h3>
                  {donorDonations.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem doações registradas.</p>
                  )}
                  {donorDonations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{formatBRL(d.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {campaignById(d.campaignId)?.name} · {formatDate(d.date)}
                        </p>
                      </div>
                      <StatusBadge status={d.status} label={labelOf(donationStatus, d.status)} />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Planos recorrentes ({donorPlans.length})</h3>
                  {donorPlans.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem planos recorrentes.</p>
                  )}
                  {donorPlans.map((p) => (
                    <div key={p.id} className="rounded-lg border border-border p-3 text-sm">
                      {formatBRL(p.amount)} · próxima em {formatDate(p.nextCharge)}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Bloquear contato</Button>
                  <Button variant="outline" size="sm">Mesclar duplicado</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
