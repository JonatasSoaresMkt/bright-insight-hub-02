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
import { conversations, Conversation, donorById } from "@/admin/mock";
import { outboxStatus, formatDateTime, labelOf } from "@/admin/catalog";

export default function Conversas() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Conversation | null>(null);

  const rows = useMemo(
    () =>
      conversations.filter((c) => {
        const term = q.toLowerCase();
        const donor = donorById(c.donorId);
        return (
          (status === "all" || c.status === status) &&
          (!term ||
            c.eventType.toLowerCase().includes(term) ||
            (donor?.name.toLowerCase().includes(term) ?? false))
        );
      }),
    [q, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversas"
        description="Fila de mensagens transacionais enviadas aos doadores, com tentativas e falhas."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Mensagens" value={String(rows.length)} />
        <StatCard label="Pendentes" value={String(rows.filter((c) => c.status === "pending").length)} />
        <StatCard label="Falhas" value={String(rows.filter((c) => c.status === "failed").length)} />
      </div>

      <FiltersBar>
        <SearchInput value={q} onChange={setQ} placeholder="Buscar por evento ou doador" />
        <FilterSelect value={status} onChange={setStatus} options={outboxStatus} allLabel="Todos os status" />
      </FiltersBar>

      <SectionCard>
        <DataTable<Conversation>
          rows={rows}
          onRowClick={setSelected}
          columns={[
            { key: "event", header: "Evento", render: (c) => <span className="font-medium">{c.eventType}</span> },
            { key: "donor", header: "Doador", render: (c) => donorById(c.donorId)?.name ?? "—" },
            { key: "attempts", header: "Tentativas", render: (c) => String(c.attempts) },
            {
              key: "status",
              header: "Status",
              render: (c) => <StatusBadge status={c.status} label={labelOf(outboxStatus, c.status)} />,
            },
            { key: "date", header: "Criado em", render: (c) => formatDateTime(c.createdAt) },
          ]}
        />
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.eventType}</SheetTitle>
                <SheetDescription>Conteúdo sensível é exibido redigido.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <KeyValue
                  items={[
                    { label: "Doador", value: donorById(selected.donorId)?.name ?? "—" },
                    { label: "Tentativas", value: String(selected.attempts) },
                    {
                      label: "Status",
                      value: <StatusBadge status={selected.status} label={labelOf(outboxStatus, selected.status)} />,
                    },
                    { label: "Criado em", value: formatDateTime(selected.createdAt) },
                  ]}
                />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Payload</h3>
                  <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs">
                    {JSON.stringify(selected.payload, null, 2)}
                  </pre>
                </div>
                <Button size="sm" variant="outline">Reprocessar</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
