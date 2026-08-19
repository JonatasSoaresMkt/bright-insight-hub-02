import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Building2, ChevronDown, Bell, LogOut } from "lucide-react";
import { mobileShortcuts } from "@/admin/nav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const organizations = ["Fundação Bem Maior", "Instituto Semear"];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { toast } = useToast();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
            <SidebarTrigger />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden max-w-[160px] truncate sm:inline">
                    {organizations[0]}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Organização ativa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                  <DropdownMenuItem key={org}>{org}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar doadores, doações, campanhas…"
                className="border-none bg-muted pl-9"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notificações">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>

          {/* Atalhos mobile */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-border bg-card lg:hidden">
            {mobileShortcuts.map((item) => {
              const Icon = item.icon;
              const active =
                item.url === "/admin" ? pathname === "/admin" : pathname.startsWith(item.url!);
              return (
                <NavLink
                  key={item.title}
                  to={item.url!}
                  className={`flex flex-col items-center gap-1 py-2 text-[11px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
}
