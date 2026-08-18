// Dados mock locais (front-end apenas). Substituíveis pelo back-end existente.

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  currency: string;
  goal: number;
  raised: number;
  status: "draft" | "published" | "archived";
  publishedVersion: number | null;
  donations: number;
  createdAt: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "blocked" | "archived" | "merged";
  consent: "opt_in" | "opt_out";
  donationsCount: number;
  totalGiven: number;
  createdAt: string;
  city?: string;
  document?: string;
}

export interface Donation {
  id: string;
  reference: string;
  donorId: string;
  campaignId: string;
  amount: number;
  fee: number;
  status: "pending" | "confirmed" | "failed" | "refunded" | "disputed" | "reconciled";
  frequency: "one_time" | "monthly" | "quarterly" | "semiannual" | "annual";
  provider: "offline" | "sandbox" | "stripe" | "paypal" | "none";
  date: string;
  receiptId?: string;
  planId?: string;
  answers?: { question: string; answer: string }[];
}

export interface RecurringPlan {
  id: string;
  donorId: string;
  campaignId: string;
  amount: number;
  frequency: Donation["frequency"];
  provider: Donation["provider"];
  status: "active" | "paused" | "past_due" | "canceled";
  nextCharge: string;
  cycles: number;
  version: number;
}

export interface Receipt {
  id: string;
  number: string;
  donationId: string;
  donorId: string;
  campaignId: string;
  type: "one_time" | "recurring" | "annual";
  year: number;
  issuedAt: string;
  amount: number;
}

export interface DonorList {
  id: string;
  name: string;
  description: string;
  match: "all" | "any";
  version: number;
  archived: boolean;
  matches: number;
  rules: string[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: "donation" | "fee" | "refund" | "payout" | "adjustment";
  donorId?: string;
  campaignId?: string;
  amount: number;
  source: string;
  reference: string;
}

export interface Conversation {
  id: string;
  eventType: string;
  donorId: string;
  status: "pending" | "processing" | "processed" | "failed";
  createdAt: string;
  attempts: number;
  payload: Record<string, string>;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  segment: string;
  trigger: string;
  body: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt: string | null;
  audience: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  metadata: Record<string, string>;
}

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operador" | "leitura";
  status: "ativo" | "convidado" | "suspenso";
  lastAccess: string;
}

const day = 86_400_000;
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString();
const ahead = (days: number) => new Date(Date.now() + days * day).toISOString();

export const campaigns: Campaign[] = [
  { id: "cmp_1", name: "Natal Solidário 2026", slug: "natal-solidario-2026", currency: "BRL", goal: 120000, raised: 84300, status: "published", publishedVersion: 7, donations: 412, createdAt: iso(120) },
  { id: "cmp_2", name: "Campanha do Agasalho", slug: "campanha-do-agasalho", currency: "BRL", goal: 60000, raised: 41250, status: "published", publishedVersion: 3, donations: 233, createdAt: iso(80) },
  { id: "cmp_3", name: "Apadrinhe uma Criança", slug: "apadrinhe-uma-crianca", currency: "BRL", goal: 240000, raised: 158900, status: "published", publishedVersion: 12, donations: 690, createdAt: iso(300) },
  { id: "cmp_4", name: "Reforma da Creche", slug: "reforma-da-creche", currency: "BRL", goal: 90000, raised: 12400, status: "draft", publishedVersion: null, donations: 18, createdAt: iso(14) },
  { id: "cmp_5", name: "Ação Emergencial Enchentes", slug: "acao-emergencial-enchentes", currency: "BRL", goal: 300000, raised: 287500, status: "archived", publishedVersion: 5, donations: 1204, createdAt: iso(420) },
];

const donorNames = [
  "Ana Beatriz Cardoso", "Bruno Tavares", "Camila Nogueira", "Diego Ramalho",
  "Eduarda Lima", "Felipe Andrade", "Gabriela Prado", "Henrique Sales",
  "Isabela Moraes", "João Vitor Pires", "Karina Duarte", "Leonardo Bastos",
  "Mariana Rocha", "Nelson Ferraz", "Olívia Campos", "Paulo Menezes",
  "Queila Santos", "Rafael Coutinho", "Sabrina Vieira", "Tiago Barbosa",
];

export const donors: Donor[] = donorNames.map((name, i) => ({
  id: `dnr_${i + 1}`,
  name,
  email: `${name.toLowerCase().split(" ")[0]}.${i + 1}@exemplo.org`,
  phone: i % 4 === 0 ? undefined : `+55 11 9${(10000000 + i * 137).toString().slice(0, 8)}`,
  status: i % 11 === 0 ? "blocked" : i % 7 === 0 ? "archived" : "active",
  consent: i % 3 === 0 ? "opt_out" : "opt_in",
  donationsCount: (i * 3) % 9,
  totalGiven: ((i * 137) % 900) * 10 + 50,
  createdAt: iso(i * 13 + 3),
  city: ["São Paulo", "Rio de Janeiro", "Curitiba", "Recife", "Belo Horizonte"][i % 5],
  document: i % 5 === 0 ? undefined : `***.***.${(100 + i).toString()}-**`,
}));

const statuses: Donation["status"][] = ["confirmed", "confirmed", "confirmed", "pending", "failed", "refunded", "disputed", "reconciled"];
const freqs: Donation["frequency"][] = ["one_time", "monthly", "one_time", "annual", "quarterly", "semiannual"];
const providers: Donation["provider"][] = ["stripe", "paypal", "offline", "sandbox", "none"];

export const donations: Donation[] = Array.from({ length: 64 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const amount = ((i * 73) % 950) + 25;
  return {
    id: `don_${i + 1}`,
    reference: `DN-2026-${(1000 + i).toString()}`,
    donorId: donors[i % donors.length].id,
    campaignId: campaigns[i % 4].id,
    amount,
    fee: Math.round(amount * 0.049 * 100) / 100,
    status,
    frequency: freqs[i % freqs.length],
    provider: providers[i % providers.length],
    date: iso((i * 2) % 95),
    receiptId: status === "confirmed" || status === "reconciled" ? `rec_${i + 1}` : undefined,
    planId: i % 5 === 1 ? `pln_${(i % 8) + 1}` : undefined,
    answers: [
      { question: "Como conheceu a organização?", answer: ["Indicação", "Instagram", "Evento", "Busca"][i % 4] },
      { question: "Deseja receber novidades?", answer: i % 3 === 0 ? "Não" : "Sim" },
    ],
  };
});

export const plans: RecurringPlan[] = Array.from({ length: 12 }, (_, i) => ({
  id: `pln_${i + 1}`,
  donorId: donors[(i * 3) % donors.length].id,
  campaignId: campaigns[i % 3].id,
  amount: ((i * 47) % 300) + 30,
  frequency: (["monthly", "quarterly", "annual", "semiannual"] as const)[i % 4],
  provider: providers[i % 4],
  status: (["active", "active", "paused", "past_due", "canceled"] as const)[i % 5],
  nextCharge: ahead((i % 28) + 1),
  cycles: (i * 5) % 36,
  version: (i % 3) + 1,
}));

export const receipts: Receipt[] = donations
  .filter((d) => d.receiptId)
  .map((d, i) => ({
    id: d.receiptId!,
    number: `RC-2026-${(2000 + i).toString()}`,
    donationId: d.id,
    donorId: d.donorId,
    campaignId: d.campaignId,
    type: d.frequency === "one_time" ? "one_time" : "recurring",
    year: 2026,
    issuedAt: d.date,
    amount: d.amount,
  }));

export const donorLists: DonorList[] = [
  { id: "lst_1", name: "Recorrentes ativos com opt-in", description: "Base principal de relacionamento mensal.", match: "all", version: 4, archived: false, matches: 128, rules: ["Recorrência ativa", "E-mail permitido (opt-in)"] },
  { id: "lst_2", name: "Doadores sem doação em 90 dias", description: "Alvo de campanha de reativação.", match: "all", version: 2, archived: false, matches: 341, rules: ["Doador ativo", "Sem doação nos últimos 90 dias"] },
  { id: "lst_3", name: "Entradas recentes no CRM", description: "Novos cadastros para boas-vindas.", match: "any", version: 1, archived: false, matches: 57, rules: ["Entrada no CRM: últimos 30 dias"] },
  { id: "lst_4", name: "Campanha do Agasalho 2025", description: "Lista histórica arquivada.", match: "all", version: 6, archived: true, matches: 892, rules: ["Campanha com doação confirmada"] },
];

export const ledger: LedgerEntry[] = donations.slice(0, 40).flatMap((d, i) => {
  const base: LedgerEntry = {
    id: `led_${i}_a`,
    date: d.date,
    type: "donation",
    donorId: d.donorId,
    campaignId: d.campaignId,
    amount: d.amount,
    source: d.provider,
    reference: d.reference,
  };
  const fee: LedgerEntry = {
    id: `led_${i}_b`,
    date: d.date,
    type: "fee",
    donorId: d.donorId,
    campaignId: d.campaignId,
    amount: -d.fee,
    source: d.provider,
    reference: d.reference,
  };
  return d.status === "refunded"
    ? [base, fee, { ...base, id: `led_${i}_c`, type: "refund" as const, amount: -d.amount }]
    : [base, fee];
});

export const conversations: Conversation[] = Array.from({ length: 18 }, (_, i) => ({
  id: `cnv_${i + 1}`,
  eventType: ["donation.confirmed", "receipt.sent", "plan.past_due", "supporter.created"][i % 4],
  donorId: donors[i % donors.length].id,
  status: (["processed", "processed", "pending", "failed", "processing"] as const)[i % 5],
  createdAt: iso(i),
  attempts: (i % 4) + 1,
  payload: {
    template: ["recibo-unica", "boas-vindas", "falha-pagamento", "agradecimento"][i % 4],
    email: "[redigido]",
    valor: "[redigido]",
  },
}));

export const emailCampaigns: EmailCampaign[] = [
  { id: "eml_1", name: "Boas-vindas doador novo", subject: "Obrigado por apoiar nossa causa", segment: "all_opt_in", trigger: "first_donation", body: "Olá, {{nome}}! Sua primeira doação foi confirmada.", status: "sent", scheduledAt: iso(6), audience: 214 },
  { id: "eml_2", name: "Reativação 90 dias", subject: "Sentimos sua falta", segment: "confirmed_donors", trigger: "manual", body: "Faz um tempo desde sua última doação...", status: "scheduled", scheduledAt: ahead(3), audience: 341 },
  { id: "eml_3", name: "Falha de pagamento", subject: "Precisamos atualizar seu pagamento", segment: "active_recurring", trigger: "payment_failed", body: "Não conseguimos processar sua contribuição.", status: "draft", scheduledAt: null, audience: 22 },
];

export const auditEvents: AuditEvent[] = Array.from({ length: 24 }, (_, i) => ({
  id: `aud_${i + 1}`,
  actor: ["admin@fundacao.org", "operacao@fundacao.org", "sistema"][i % 3],
  action: ["donation.created", "donation.refunded", "campaign.published", "supporter.updated", "session.revoked", "apikey.created"][i % 6],
  target: ["don_12", "cmp_1", "dnr_4", "sess_88", "key_2"][i % 5],
  createdAt: iso(i / 2),
  metadata: { ip: "200.***.***.14", origem: "painel", escopo: "organização ativa" },
}));

export const members: MemberUser[] = [
  { id: "mbr_1", name: "Jonatas Pereira", email: "admin@fundacao.org", role: "admin", status: "ativo", lastAccess: iso(0) },
  { id: "mbr_2", name: "Marina Alves", email: "operacao@fundacao.org", role: "operador", status: "ativo", lastAccess: iso(1) },
  { id: "mbr_3", name: "Carlos Prado", email: "financeiro@fundacao.org", role: "leitura", status: "ativo", lastAccess: iso(4) },
  { id: "mbr_4", name: "Renata Souza", email: "renata@fundacao.org", role: "operador", status: "convidado", lastAccess: iso(9) },
];

export const sessions = [
  { id: "sess_1", device: "Chrome · macOS", location: "São Paulo, BR", ip: "200.***.***.14", lastSeen: iso(0), current: true },
  { id: "sess_2", device: "Safari · iPhone", location: "São Paulo, BR", ip: "177.***.***.31", lastSeen: iso(1), current: false },
  { id: "sess_3", device: "Firefox · Windows", location: "Curitiba, BR", ip: "189.***.***.77", lastSeen: iso(5), current: false },
];

export const apiKeys = [
  { id: "key_1", name: "Integração ERP", scopes: ["donations:read", "reports:read"], createdAt: iso(40), lastUsed: iso(1), revoked: false },
  { id: "key_2", name: "Zapier", scopes: ["donations:read", "supporters:read", "webhooks:write"], createdAt: iso(12), lastUsed: iso(0), revoked: false },
  { id: "key_3", name: "Chave antiga", scopes: ["donations:read"], createdAt: iso(210), lastUsed: iso(120), revoked: true },
];

export const webhookEndpoints = [
  { id: "whk_1", url: "https://erp.fundacao.org/hooks/lovable", events: ["donation.confirmed", "donation.refunded"], active: true },
  { id: "whk_2", url: "https://hooks.zapier.com/hooks/catch/9911/abc", events: ["supporter.created"], active: true },
  { id: "whk_3", url: "https://legacy.fundacao.org/webhook", events: ["donation.failed"], active: false },
];

export const webhookDeliveries = Array.from({ length: 14 }, (_, i) => ({
  id: `dlv_${i + 1}`,
  endpointId: `whk_${(i % 3) + 1}`,
  event: ["donation.confirmed", "donation.failed", "donation.refunded", "supporter.created"][i % 4],
  status: (["entregue", "pendente", "falhou", "dlq"] as const)[i % 4],
  attempts: (i % 5) + 1,
  createdAt: iso(i / 3),
}));

export const importBatches = [
  { id: "imp_1", file: "doadores-marco.csv", createdAt: iso(3), created: 214, updated: 38, skipped: 12, errors: 4 },
  { id: "imp_2", file: "planilha-eventos.csv", createdAt: iso(21), created: 89, updated: 5, skipped: 0, errors: 0 },
];

export const receiptTemplates = [
  { id: "tpl_1", campaignId: null, type: "one_time", subject: "Recibo da sua doação", version: 5, updatedAt: iso(8) },
  { id: "tpl_2", campaignId: "cmp_3", type: "recurring", subject: "Recibo mensal — Apadrinhe uma Criança", version: 2, updatedAt: iso(30) },
  { id: "tpl_3", campaignId: null, type: "annual", subject: "Resumo anual de doações", version: 1, updatedAt: iso(60) },
];

export const receiptBatches = [
  { id: "bat_1", operation: "Emissão anual", campaignId: null, year: 2025, status: "processado", items: 1420, createdAt: iso(45) },
  { id: "bat_2", operation: "Reenvio de falhas", campaignId: "cmp_1", year: 2026, status: "falhou", items: 37, createdAt: iso(2) },
];

// Helpers de leitura
export const donorById = (id?: string) => donors.find((d) => d.id === id);
export const campaignById = (id?: string) => campaigns.find((c) => c.id === id);
export const donationById = (id?: string) => donations.find((d) => d.id === id);
export const planById = (id?: string) => plans.find((p) => p.id === id);
export const receiptById = (id?: string) => receipts.find((r) => r.id === id);
export const conversationById = (id?: string) => conversations.find((c) => c.id === id);

export const dashboardSeries = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  valor: 1200 + Math.round(Math.sin(i / 3) * 500) + i * 40,
  doacoes: 8 + Math.round(Math.cos(i / 4) * 4) + Math.round(i / 5),
}));

export const funnel = [
  { etapa: "Visitas na página", valor: 12840 },
  { etapa: "Checkout iniciado", valor: 3120 },
  { etapa: "Dados preenchidos", valor: 1870 },
  { etapa: "Doação confirmada", valor: 1204 },
];

export const retention = [
  { mes: "M0", taxa: 100 },
  { mes: "M1", taxa: 78 },
  { mes: "M2", taxa: 66 },
  { mes: "M3", taxa: 59 },
  { mes: "M6", taxa: 47 },
  { mes: "M12", taxa: 38 },
];

export const weeklyHeatmap = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, d) => ({
  dia,
  horas: Array.from({ length: 24 }, (_, h) => Math.max(0, Math.round(Math.sin((h + d) / 3) * 6 + 6))),
}));
