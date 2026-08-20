import { donors as allDonors } from "./mock";

export const maskEmailSafe =
  "Dados sensíveis são exibidos mascarados no painel; a mesclagem preserva o histórico de doações.";

const duplicates = allDonors.slice(0, 5).map((d, i) => ({
  a: d.name,
  b: allDonors[allDonors.length - 1 - i].name,
  email: d.email,
  score: 96 - i * 7,
}));

const missing = allDonors
  .filter((d) => !d.document || !d.phone)
  .slice(0, 8)
  .map((d) => ({
    name: d.name,
    fields: [!d.document ? "Documento" : null, !d.phone ? "Telefone" : null].filter(
      Boolean,
    ) as string[],
    createdAt: d.createdAt,
  }));

export const donors = {
  duplicates,
  missing,
  optOut: allDonors.filter((d) => d.consent === "opt_out").length,
};
