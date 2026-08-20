import { PageHeader, SectionCard, StatCard, DataTable } from "@/admin/ui";
import { Button } from "@/components/ui/button";
import { donors, maskEmailSafe } from "@/admin/hygiene";
import { formatDate, maskEmail } from "@/admin/catalog";

export default function Higiene() {
  const duplicates = donors.duplicates;
  const missing = donors.missing;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Higiene de dados"
        description="Duplicados prováveis, dados incompletos e contatos inválidos que afetam recibos e e-mails."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Duplicados prováveis" value={String(duplicates.length)} />
        <StatCard label="Cadastros incompletos" value={String(missing.length)} />
        <StatCard label="Contatos sem opt-in" value={String(donors.optOut)} />
      </div>

      <SectionCard
        title="Duplicados prováveis"
        description="Comparação por e-mail normalizado, documento e similaridade de nome."
      >
        <DataTable
          rows={duplicates}
          columns={[
            { key: "a", header: "Registro A", render: (r: typeof duplicates[number]) => r.a },
            { key: "b", header: "Registro B", render: (r: typeof duplicates[number]) => r.b },
            { key: "email", header: "E-mail", render: (r: typeof duplicates[number]) => maskEmail(r.email) },
            { key: "score", header: "Similaridade", render: (r: typeof duplicates[number]) => `${r.score}%` },
            {
              key: "actions",
              header: "",
              render: () => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Mesclar</Button>
                  <Button variant="ghost" size="sm">Ignorar</Button>
                </div>
              ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Cadastros incompletos"
        description="Campos obrigatórios para emissão de recibo e comunicação."
      >
        <DataTable
          rows={missing}
          columns={[
            { key: "name", header: "Doador", render: (r: typeof missing[number]) => r.name },
            { key: "fields", header: "Campos faltantes", render: (r: typeof missing[number]) => r.fields.join(", ") },
            { key: "since", header: "Cadastro", render: (r: typeof missing[number]) => formatDate(r.createdAt) },
            {
              key: "actions",
              header: "",
              render: () => <Button variant="outline" size="sm">Completar</Button>,
            },
          ]}
        />
      </SectionCard>

      <p className="text-xs text-muted-foreground">{maskEmailSafe}</p>
    </div>
  );
}
