import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Factory, Ship, BarChart3, Settings,
  ChevronLeft, Leaf, Zap, FlaskConical, Users, Command,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/declarations", icon: FileText, label: "Declarations" },
  { to: "/installations", icon: Factory, label: "Installations" },
  { to: "/importers", icon: Ship, label: "Importers" },
  { to: "/suppliers", icon: Users, label: "Suppliers" },
  { to: "/risk-assessment", icon: Zap, label: "Risk Assessment" },
  { to: "/what-if", icon: FlaskConical, label: "What-If Simulator" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-sidebar-primary-foreground text-lg tracking-tight">
            CBAM<span className="text-sidebar-primary">Hub</span>
          </span>
        )}
      </div>

      {/* Cmd-K hint */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-md bg-sidebar-accent text-sidebar-foreground text-xs flex items-center gap-2 cursor-pointer hover:bg-sidebar-accent/80"
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        >
          <Command className="h-3 w-3" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-sidebar-border px-1 rounded">⌘K</kbd>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
}
