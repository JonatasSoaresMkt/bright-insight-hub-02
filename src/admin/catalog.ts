// Catálogo técnico dos seletores da plataforma (rótulos em PT-BR)

export const periodOptions = [
  { value: "all", label: "Todo o período" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
];

export const donationStatus = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "failed", label: "Falhou" },
  { value: "refunded", label: "Reembolsada" },
  { value: "disputed", label: "Disputada" },
  { value: "reconciled", label: "Reconciliada" },
];

export const frequencyOptions = [
  { value: "one_time", label: "Única" },
  { value: "monthly", label: "Mensal" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" },
  { value: "annual", label: "Anual" },
];

export const providerOptions = [
  { value: "offline", label: "Offline manual" },
  { value: "sandbox", label: "Sandbox" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "none", label: "Pendente/sem provedor" },
];

export const planStatus = [
  { value: "active", label: "Ativo" },
  { value: "paused", label: "Pausado" },
  { value: "past_due", label: "Em atraso" },
  { value: "canceled", label: "Cancelado" },
];

export const donorStatus = [
  { value: "active", label: "Ativo" },
  { value: "blocked", label: "Bloqueado" },
  { value: "archived", label: "Arquivado" },
  { value: "merged", label: "Mesclado" },
];

export const consentOptions = [
  { value: "opt_in", label: "E-mail permitido (opt-in)" },
  { value: "opt_out", label: "Sem marketing (opt-out)" },
];

export const campaignStatus = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicada" },
  { value: "archived", label: "Arquivada" },
];

export const listMatchOptions = [
  { value: "all", label: "Todas as regras" },
  { value: "any", label: "Qualquer regra" },
];

export const crmEntryWindows = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
  { value: "365", label: "Últimos 365 dias" },
];

export const listDonationRules = [
  { value: "none", label: "Sem doação" },
  { value: "confirmed", label: "Doação confirmada" },
  { value: "refunded", label: "Doação reembolsada" },
];

export const listRecurrenceRules = [
  { value: "none", label: "Sem plano" },
  { value: "active", label: "Recorrência ativa" },
  { value: "paused", label: "Recorrência pausada" },
  { value: "past_due", label: "Recorrência em atraso" },
  { value: "canceled", label: "Recorrência cancelada" },
];

export const offlineMethods = [
  { value: "cash", label: "Dinheiro" },
  { value: "check", label: "Cheque" },
  { value: "transfer", label: "Transferência" },
  { value: "other", label: "Outro" },
];

export const relationshipTriggers = [
  { value: "first_donation", label: "Primeira doação confirmada" },
  { value: "donation_anniversary", label: "Aniversário da doação" },
  { value: "manual", label: "Seleção manual" },
  { value: "payment_failed", label: "Falha de pagamento local" },
  { value: "recurring_active", label: "Recorrência ativa" },
];

export const emailSegments = [
  { value: "active_recurring", label: "Recorrentes ativos" },
  { value: "all_opt_in", label: "Todos com opt-in" },
  { value: "confirmed_donors", label: "Doadores confirmados" },
];

export const outboxStatus = [
  { value: "pending", label: "Pendente" },
  { value: "processing", label: "Processando" },
  { value: "processed", label: "Processado" },
  { value: "failed", label: "Falhou" },
];

export const receiptTemplateTypes = [
  { value: "one_time", label: "Doação única" },
  { value: "recurring", label: "Recorrente" },
  { value: "annual", label: "Resumo anual" },
];

export const ledgerEntryTypes = [
  { value: "donation", label: "Doação" },
  { value: "fee", label: "Taxa" },
  { value: "refund", label: "Reembolso" },
  { value: "payout", label: "Repasse" },
  { value: "adjustment", label: "Ajuste" },
];

export const trackingProviders = [
  { value: "meta_pixel", label: "Meta Pixel" },
  { value: "google_analytics", label: "Google Analytics" },
  { value: "google_ads", label: "Google Ads" },
  { value: "tiktok_pixel", label: "TikTok Pixel" },
];

export const consentModes = [
  { value: "require", label: "Exigir consentimento" },
  { value: "analytics_only", label: "Somente analytics" },
  { value: "disabled", label: "Desativado" },
];

export const integrationStatus = [
  { value: "not_connected", label: "Não conectado" },
  { value: "local_preview", label: "Preview local" },
];

export const apiScopes = [
  "donations:read",
  "supporters:read",
  "webhooks:write",
  "reports:read",
];

export const webhookEvents = [
  "donation.confirmed",
  "donation.failed",
  "donation.refunded",
  "supporter.created",
];

export const auditActions = [
  { value: "donation.created", label: "Doação criada" },
  { value: "donation.refunded", label: "Doação reembolsada" },
  { value: "campaign.published", label: "Campanha publicada" },
  { value: "supporter.updated", label: "Doador atualizado" },
  { value: "session.revoked", label: "Sessão revogada" },
  { value: "apikey.created", label: "Chave de API criada" },
];

export function labelOf(
  options: { value: string; label: string }[],
  value?: string | null,
) {
  return options.find((o) => o.value === value)?.label ?? "—";
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(user.length - 2, 2))}@${domain}`;
}
