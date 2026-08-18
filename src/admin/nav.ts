import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  CreditCard,
  MapPin,
  HeartHandshake,
  Repeat,
  Users,
  ListFilter,
  Upload,
  Sparkles,
  BookOpen,
  BarChart3,
  Clock,
  Mail,
  MessageSquare,
  Receipt,
  Globe,
  Activity,
  Plug,
  MessagesSquare,
  Webhook,
  Gift,
  CreditCard as Billing,
  Share2,
  ShieldCheck,
  ScrollText,
  Settings,
} from "lucide-react";

export type NavState = "ready" | "planned";

export interface NavItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  state: NavState;
  /** shown as short hint on disabled items */
  note?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { title: "Visão geral", url: "/admin", icon: LayoutDashboard, state: "ready" },
    ],
  },
  {
    label: "Captação",
    items: [
      { title: "Campanhas", url: "/admin/campanhas", icon: Megaphone, state: "ready" },
      { title: "Eventos", icon: Calendar, state: "planned", note: "Em breve" },
      { title: "Assinaturas", icon: CreditCard, state: "planned", note: "Em breve" },
      { title: "Campanhas presenciais", icon: MapPin, state: "planned", note: "Em breve" },
    ],
  },
  {
    label: "Gerenciar",
    items: [
      { title: "Doações", url: "/admin/doacoes", icon: HeartHandshake, state: "ready" },
      { title: "Planos recorrentes", url: "/admin/recorrencias", icon: Repeat, state: "ready" },
      { title: "Doadores", url: "/admin/doadores", icon: Users, state: "ready" },
      { title: "Listas", url: "/admin/listas", icon: ListFilter, state: "ready" },
      { title: "Importações", url: "/admin/importacoes", icon: Upload, state: "ready" },
      { title: "Higiene de dados", url: "/admin/higiene", icon: Sparkles, state: "ready" },
      { title: "Livro-razão", url: "/admin/ledger", icon: BookOpen, state: "ready" },
    ],
  },
  {
    label: "Relacionamento",
    items: [
      { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3, state: "ready" },
      { title: "Momentos", url: "/admin/momentos", icon: Clock, state: "ready" },
      { title: "Email marketing", url: "/admin/email-marketing", icon: Mail, state: "ready" },
      { title: "Conversas", url: "/admin/conversas", icon: MessageSquare, state: "ready" },
    ],
  },
  {
    label: "Recibos",
    items: [{ title: "Recibos", url: "/admin/recibos", icon: Receipt, state: "ready" }],
  },
  {
    label: "Integrações e adicionais",
    items: [
      { title: "Domínio personalizado", icon: Globe, state: "planned", note: "Indisponível" },
      { title: "Tracking e analytics", url: "/admin/tracking", icon: Activity, state: "ready" },
      { title: "Doação equivalente", icon: Gift, state: "planned", note: "Em breve" },
      { title: "Integrações", url: "/admin/integracoes", icon: Plug, state: "ready" },
      { title: "Doação por mensagem", icon: MessagesSquare, state: "planned", note: "Em breve" },
      { title: "Zapier & API", url: "/admin/api-webhooks", icon: Webhook, state: "ready" },
    ],
  },
  {
    label: "Conta",
    items: [
      { title: "Meu plano", icon: Billing, state: "planned", note: "Em breve" },
      { title: "Indicações", icon: Share2, state: "planned", note: "Em breve" },
      { title: "Membros", url: "/admin/membros", icon: Users, state: "ready" },
      { title: "Auditoria", url: "/admin/auditoria", icon: ScrollText, state: "ready" },
      { title: "Segurança", url: "/admin/seguranca", icon: ShieldCheck, state: "ready" },
      { title: "Configurações", url: "/admin/fundacao", icon: Settings, state: "ready" },
    ],
  },
];

export const mobileShortcuts: NavItem[] = [
  { title: "Início", url: "/admin", icon: LayoutDashboard, state: "ready" },
  { title: "Campanhas", url: "/admin/campanhas", icon: Megaphone, state: "ready" },
  { title: "Doações", url: "/admin/doacoes", icon: HeartHandshake, state: "ready" },
  { title: "Doadores", url: "/admin/doadores", icon: Users, state: "ready" },
];
