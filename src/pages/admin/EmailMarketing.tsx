import { useState } from "react";
import { PageHeader, SectionCard, StatCard, DataTable, StatusBadge, KeyValue } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { emailCampaigns, EmailCampaign } from "@/admin/mock";
import {
  emailSegments,
  relationshipTriggers,
  formatDateTime,
  labelOf,
} from "@/admin/catalog";

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  sent: "Enviado",
  failed: "Falhou",
};

export default function EmailMarketing() {
  const [selected, setSelected] = useState<EmailCampaign | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email marketing"
        description="Campanhas de e-mail segmentadas por listas e gatilhos de relacionamento."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova campanha
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Campanhas" value={String(emailCampaigns.length)} />
        <StatCard label="Agendadas" value={String(emailCampaigns.filter((e) => e.status === "scheduled").length)} />
        <StatCard label="Alcance total" value={String(emailCampaigns.reduce((s, e) => s + e.audience, 0))} />
      </div>

      <SectionCard>
        <DataTable<EmailCampaign>
          rows={emailCampaigns}
          onRowClick={setSelected}
          columns={[
            { key: "name", header: "Campanha", render: (e) => <span className="font-medium">{e.name}</span> },
            { key: "subject", header: "Assunto", render: (e) => e.subject },
            { key: "segment", header: "Segmento", render: (e) => labelOf(emailSegments, e.segment) },
            { key: "trigger", header: "Gatilho", render: (e) => labelOf(relationshipTriggers, e.trigger) },
            { key: "audience", header: "Alcance", render: (e) => String(e.audience) },
            {
              key: "status",
              header: "Status",
              render: (e) => <StatusBadge status={e.status} label={statusLabels[e.status]} />,
            },
            {
              key: "when",
              header: "Envio",
              render: (e) => (e.scheduledAt ? formatDateTime(e.scheduledAt) : "—"),
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
                <SheetDescription>Prévia da mensagem e configuração de envio.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <KeyValue
                  items={[
                    { label: "Assunto", value: selected.subject },
                    { label: "Segmento", value: labelOf(emailSegments, selected.segment) },
                    { label: "Gatilho", value: labelOf(relationshipTriggers, selected.trigger) },
                    { label: "Alcance", value: String(selected.audience) },
                    {
                      label: "Status",
                      value: <StatusBadge status={selected.status} label={statusLabels[selected.status]} />,
                    },
                    {
                      label: "Agendamento",
                      value: selected.scheduledAt ? formatDateTime(selected.scheduledAt) : "—",
                    },
                  ]}
                />
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                  {selected.body}
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Enviar teste</Button>
                  <Button variant="outline" size="sm">Duplicar</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
