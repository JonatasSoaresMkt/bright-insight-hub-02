import { useState } from "react";
import { PageHeader, SectionCard, DataTable, StatCard, StatusBadge } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { donorLists, DonorList } from "@/admin/mock";
import {
  listMatchOptions,
  listDonationRules,
  listRecurrenceRules,
  crmEntryWindows,
} from "@/admin/catalog";

export default function Listas() {
  const [match, setMatch] = useState("all");
  const [donationRule, setDonationRule] = useState("confirmed");
  const [recurrenceRule, setRecurrenceRule] = useState("active");
  const [window, setWindow] = useState("30");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listas"
        description="Segmentos dinâmicos de doadores usados em e-mail marketing e momentos de relacionamento."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Nova lista
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova lista</DialogTitle>
                <DialogDescription>
                  Combine regras de doação, recorrência e entrada no CRM.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da lista</Label>
                  <Input placeholder="Ex.: Recorrentes ativos com opt-in" />
                </div>
                <div className="space-y-2">
                  <Label>Correspondência</Label>
                  <Select value={match} onValueChange={setMatch}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {listMatchOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Regra de doação</Label>
                  <Select value={donationRule} onValueChange={setDonationRule}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {listDonationRules.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Regra de recorrência</Label>
                  <Select value={recurrenceRule} onValueChange={setRecurrenceRule}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {listRecurrenceRules.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Entrada no CRM</Label>
                  <Select value={window} onValueChange={setWindow}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {crmEntryWindows.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button>Salvar lista</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Listas ativas" value={String(donorLists.filter((l) => !l.archived).length)} />
        <StatCard label="Arquivadas" value={String(donorLists.filter((l) => l.archived).length)} />
        <StatCard
          label="Doadores segmentados"
          value={String(donorLists.filter((l) => !l.archived).reduce((s, l) => s + l.matches, 0))}
        />
      </div>

      <SectionCard>
        <DataTable<DonorList>
          rows={donorLists}
          columns={[
            {
              key: "name",
              header: "Lista",
              render: (l) => (
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.description}</p>
                </div>
              ),
            },
            {
              key: "rules",
              header: "Regras",
              render: (l) => (
                <div className="flex flex-wrap gap-1">
                  {l.rules.map((r) => (
                    <Badge key={r} variant="secondary" className="font-normal">{r}</Badge>
                  ))}
                </div>
              ),
            },
            { key: "match", header: "Correspondência", render: (l) => (l.match === "all" ? "Todas" : "Qualquer") },
            { key: "matches", header: "Doadores", render: (l) => String(l.matches) },
            { key: "version", header: "Versão", render: (l) => `v${l.version}` },
            {
              key: "status",
              header: "Status",
              render: (l) => (
                <StatusBadge status={l.archived ? "archived" : "active"} label={l.archived ? "Arquivada" : "Ativa"} />
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
