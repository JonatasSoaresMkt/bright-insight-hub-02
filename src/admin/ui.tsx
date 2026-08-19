import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      {(title || actions) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <CardContent className={title || actions ? "" : "pt-6"}>{children}</CardContent>
    </Card>
  );
}

const toneMap: Record<string, string> = {
  success: "bg-primary-light text-primary border-transparent",
  warning: "bg-warning-light text-warning border-transparent",
  danger: "bg-destructive/10 text-destructive border-transparent",
  neutral: "bg-muted text-muted-foreground border-transparent",
};

export type StatusTone = keyof typeof toneMap;

const toneByStatus: Record<string, StatusTone> = {
  confirmed: "success",
  reconciled: "success",
  processed: "success",
  sent: "success",
  active: "success",
  ativo: "success",
  published: "success",
  entregue: "success",
  processado: "success",
  pending: "warning",
  pendente: "warning",
  processing: "warning",
  scheduled: "warning",
  past_due: "warning",
  paused: "warning",
  disputed: "warning",
  convidado: "warning",
  draft: "neutral",
  archived: "neutral",
  canceled: "neutral",
  merged: "neutral",
  refunded: "neutral",
  failed: "danger",
  falhou: "danger",
  dlq: "danger",
  blocked: "danger",
  suspenso: "danger",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const tone = toneByStatus[status] ?? "neutral";
  return (
    <Badge variant="outline" className={toneMap[tone]}>
      {label ?? status}
    </Badge>
  );
}

export function FiltersBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative min-w-[220px] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  allLabel = "Todos",
  width = "w-[180px]",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel?: string;
  width?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={width}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DataTable<T>({
  columns,
  rows,
  empty = "Nenhum registro encontrado.",
  onRowClick,
}: {
  columns: { key: string; header: string; render: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer" : undefined}
            >
              {columns.map((c) => (
                <TableCell key={c.key} className={c.className}>
                  {c.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function KeyValue({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
