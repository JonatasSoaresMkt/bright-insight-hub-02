import { NavLink, useLocation } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { navGroups } from "@/admin/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string) =>
    url === "/admin" ? pathname === "/admin" : pathname.startsWith(url);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
          <HeartHandshake className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-sidebar-foreground">
              Fundação Bem Maior
            </h2>
            <p className="truncate text-xs text-muted-foreground">Painel de captação</p>
          </div>
        )}
      </div>

      <SidebarContent className="px-3 py-4">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel
              className={`mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground ${
                collapsed ? "hidden" : ""
              }`}
            >
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  if (item.state === "planned" || !item.url) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <div
                          aria-disabled
                          title={item.note}
                          className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/60"
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.title}</span>
                              {item.note && (
                                <Badge
                                  variant="secondary"
                                  className="h-4 px-1 text-[9px] font-normal"
                                >
                                  {item.note}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </SidebarMenuItem>
                    );
                  }
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 flex-shrink-0 ${
                              active ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
