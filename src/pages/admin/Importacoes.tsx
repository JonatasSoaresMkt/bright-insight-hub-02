import { PageHeader, SectionCard, DataTable, StatCard } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Upload, FileDown } from "lucide-react";
import { importBatches } from "@/admin/mock";
import { formatDateTime } from "@/admin/catalog";

type Batch = (typeof importBatches)[number];

export default function Importacoes() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Importações"
        description="Carregue planilhas de doadores e doações offline. Cada lote gera um relatório de conciliação."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" /> Modelo CSV
            </Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" /> Nova importação
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Lotes" value={String(importBatches.length)} />
        <StatCard label="Criados" value={String(importBatches.reduce((s, b) => s + b.created, 0))} />
        <StatCard label="Atualizados" value={String(importBatches.reduce((s, b) => s + b.updated, 0))} />
        <StatCard label="Erros" value={String(importBatches.reduce((s, b) => s + b.errors, 0))} />
      </div>

      <SectionCard
        title="Como funciona"
        description="Colunas mínimas: nome, e-mail, valor, data, campanha e método de pagamento offline."
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Baixe o modelo CSV e preencha uma linha por doação.</li>
          <li>Envie o arquivo — duplicados são detectados por e-mail e documento.</li>
          <li>Revise o resumo do lote antes de confirmar a gravação.</li>
          <li>Linhas com erro ficam disponíveis para download e reenvio.</li>
        </ol>
      </SectionCard>

      <SectionCard title="Histórico de lotes">
        <DataTable<Batch>
          rows={importBatches}
          columns={[
            { key: "file", header: "Arquivo", render: (b) => <span className="font-medium">{b.file}</span> },
            { key: "date", header: "Data", render: (b) => formatDateTime(b.createdAt) },
            { key: "created", header: "Criados", render: (b) => String(b.created) },
            { key: "updated", header: "Atualizados", render: (b) => String(b.updated) },
            { key: "skipped", header: "Ignorados", render: (b) => String(b.skipped) },
            { key: "errors", header: "Erros", render: (b) => String(b.errors) },
            {
              key: "actions",
              header: "",
              render: () => (
                <Button variant="outline" size="sm">Ver relatório</Button>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
