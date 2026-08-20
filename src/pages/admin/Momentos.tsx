import { PageHeader, SectionCard, StatCard, DataTable, StatusBadge } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { relationshipTriggers, labelOf } from "@/admin/catalog";
import { emailCampaigns } from "@/admin/mock";

const moments = relationshipTriggers.map((t, i) => ({
  trigger: t.value,
  name: t.label,
  channel: i % 3 === 0 ? "E-mail" : i % 3 === 1 ? "E-mail + recibo" : "Tarefa interna",
  delay: ["Imediato", "1 dia", "3 dias", "7 dias", "30 dias"][i % 5],
  active: i % 4 !== 3,
  sent: (i + 1) * 37,
}));

type Moment = (typeof moments)[number];

export default function Momentos() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Momentos"
        description="Automações de relacionamento disparadas por eventos do doador."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Novo momento
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Momentos" value={String(moments.length)} />
        <StatCard label="Ativos" value={String(moments.filter((m) => m.active).length)} />
        <StatCard label="Envios no período" value={String(moments.reduce((s, m) => s + m.sent, 0))} />
      </div>

      <SectionCard>
        <DataTable<Moment>
          rows={moments}
          columns={[
            { key: "name", header: "Momento", render: (m) => <span className="font-medium">{m.name}</span> },
            { key: "trigger", header: "Gatilho", render: (m) => labelOf(relationshipTriggers, m.trigger) },
            { key: "channel", header: "Canal", render: (m) => m.channel },
            { key: "delay", header: "Atraso", render: (m) => m.delay },
            { key: "sent", header: "Envios", render: (m) => String(m.sent) },
            {
              key: "status",
              header: "Status",
              render: (m) => (
                <StatusBadge status={m.active ? "active" : "draft"} label={m.active ? "Ativo" : "Pausado"} />
              ),
            },
            { key: "toggle", header: "", render: (m) => <Switch defaultChecked={m.active} /> },
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Modelos vinculados"
        description="Mensagens usadas pelos momentos ativos."
      >
        <ul className="space-y-2 text-sm">
          {emailCampaigns.map((e) => (
            <li key={e.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{e.name}</p>
              <p className="text-xs text-muted-foreground">{e.subject}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
