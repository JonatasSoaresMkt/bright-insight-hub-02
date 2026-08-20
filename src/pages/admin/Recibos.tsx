import { useMemo, useState } from "react";
import {
  PageHeader,
  SectionCard,
  FiltersBar,
  SearchInput,
  DataTable,
  StatCard,
  StatusBadge,
} from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import {
  receipts,
  Receipt,
  receiptTemplates,
  receiptBatches,
  donorById,
  campaignById,
} from "@/admin/mock";
import {
  receiptTemplateTypes,
  formatBRL,
  formatDate,
  labelOf,
} from "@/admin/catalog";

export default function Recibos() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return receipts.filter(
      (r) =>
        !term ||
        r.number.toLowerCase().includes(term) ||
        (donorById(r.donorId)?.name.toLowerCase().includes(term) ?? false),
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recibos"
        description="Emissão, modelos e lotes de recibos de doação."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Emitir lote
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Recibos emitidos" value={String(receipts.length)} />
        <StatCard label="Modelos" value={String(receiptTemplates.length)} />
        <StatCard label="Valor total" value={formatBRL(receipts.reduce((s, r) => s + r.amount, 0))} />
      </div>

      <Tabs defaultValue="emitidos">
        <TabsList>
          <TabsTrigger value="emitidos">Emitidos</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
          <TabsTrigger value="lotes">Lotes</TabsTrigger>
        </TabsList>

        <TabsContent value="emitidos" className="mt-4 space-y-4">
          <FiltersBar>
            <SearchInput value={q} onChange={setQ} placeholder="Buscar por número ou doador" />
          </FiltersBar>
          <SectionCard>
            <DataTable<Receipt>
              rows={rows}
              columns={[
                { key: "n", header: "Número", render: (r) => <span className="font-medium">{r.number}</span> },
                { key: "donor", header: "Doador", render: (r) => donorById(r.donorId)?.name ?? "—" },
                { key: "campaign", header: "Campanha", render: (r) => campaignById(r.campaignId)?.name ?? "—" },
                { key: "type", header: "Tipo", render: (r) => labelOf(receiptTemplateTypes, r.type) },
                { key: "amount", header: "Valor", render: (r) => formatBRL(r.amount) },
                { key: "date", header: "Emissão", render: (r) => formatDate(r.issuedAt) },
                {
                  key: "actions",
                  header: "",
                  render: () => <Button variant="outline" size="sm">Reenviar</Button>,
                },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="modelos" className="mt-4">
          <SectionCard>
            <DataTable
              rows={receiptTemplates}
              columns={[
                {
                  key: "subject",
                  header: "Modelo",
                  render: (t: typeof receiptTemplates[number]) => (
                    <span className="font-medium">{t.subject}</span>
                  ),
                },
                {
                  key: "type",
                  header: "Tipo",
                  render: (t: typeof receiptTemplates[number]) => labelOf(receiptTemplateTypes, t.type),
                },
                {
                  key: "campaign",
                  header: "Campanha",
                  render: (t: typeof receiptTemplates[number]) =>
                    t.campaignId ? campaignById(t.campaignId)?.name ?? "—" : "Todas",
                },
                {
                  key: "version",
                  header: "Versão",
                  render: (t: typeof receiptTemplates[number]) => `v${t.version}`,
                },
                {
                  key: "updated",
                  header: "Atualizado",
                  render: (t: typeof receiptTemplates[number]) => formatDate(t.updatedAt),
                },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="lotes" className="mt-4">
          <SectionCard>
            <DataTable
              rows={receiptBatches}
              columns={[
                {
                  key: "op",
                  header: "Operação",
                  render: (b: typeof receiptBatches[number]) => <span className="font-medium">{b.operation}</span>,
                },
                {
                  key: "campaign",
                  header: "Campanha",
                  render: (b: typeof receiptBatches[number]) =>
                    b.campaignId ? campaignById(b.campaignId)?.name ?? "—" : "Todas",
                },
                { key: "year", header: "Ano", render: (b: typeof receiptBatches[number]) => String(b.year) },
                { key: "items", header: "Itens", render: (b: typeof receiptBatches[number]) => String(b.items) },
                {
                  key: "status",
                  header: "Status",
                  render: (b: typeof receiptBatches[number]) => <StatusBadge status={b.status} label={b.status} />,
                },
                {
                  key: "created",
                  header: "Criado",
                  render: (b: typeof receiptBatches[number]) => formatDate(b.createdAt),
                },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
