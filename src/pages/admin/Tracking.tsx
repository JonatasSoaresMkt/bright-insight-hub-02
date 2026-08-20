import { useState } from "react";
import { PageHeader, SectionCard, StatusBadge } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackingProviders, consentModes } from "@/admin/catalog";

export default function Tracking() {
  const [mode, setMode] = useState("require");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking e analytics"
        description="Pixels e tags de mensuração das páginas de doação, respeitando o consentimento do visitante."
        actions={<Button>Salvar alterações</Button>}
      />

      <SectionCard
        title="Consentimento"
        description="Define quando as tags podem carregar na página pública."
      >
        <div className="max-w-sm space-y-2">
          <Label>Modo de consentimento</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {consentModes.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Provedores" description="Informe o identificador de cada plataforma.">
        <div className="space-y-4">
          {trackingProviders.map((p, i) => (
            <div
              key={p.value}
              className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-2">
                <Label>{p.label}</Label>
                <Input placeholder={i % 2 === 0 ? "ID do pixel" : "ID de medição"} />
              </div>
              <div className="flex items-center gap-3 pb-2">
                <StatusBadge status={i === 0 ? "active" : "draft"} label={i === 0 ? "Ativo" : "Inativo"} />
                <Switch defaultChecked={i === 0} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Eventos enviados">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>page_view — visita à página de doação</li>
          <li>begin_checkout — início do formulário</li>
          <li>add_payment_info — dados de pagamento preenchidos</li>
          <li>purchase — doação confirmada (valor e moeda)</li>
        </ul>
      </SectionCard>
    </div>
  );
}
