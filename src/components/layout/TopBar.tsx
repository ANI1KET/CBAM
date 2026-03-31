import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="font-display font-semibold text-lg text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search declarations..."
            className="pl-9 w-64 h-9 bg-muted/50 border-transparent focus:border-accent"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
            3
          </Badge>
        </Button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs text-muted-foreground">admin@cbamhub.eu</p>
          </div>
        </div>
      </div>
    </header>
  );
}
