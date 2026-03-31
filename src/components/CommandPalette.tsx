import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command";
import { Factory, Ship, FileText, BarChart3, Settings, LayoutDashboard, Search, Zap, FlaskConical } from "lucide-react";
import { generatedData } from "@/lib/mock-generator";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search installations, importers, pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/")}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/declarations")}><FileText className="mr-2 h-4 w-4" />Declarations</CommandItem>
          <CommandItem onSelect={() => go("/installations")}><Factory className="mr-2 h-4 w-4" />Installations</CommandItem>
          <CommandItem onSelect={() => go("/importers")}><Ship className="mr-2 h-4 w-4" />Importers</CommandItem>
          <CommandItem onSelect={() => go("/reports")}><BarChart3 className="mr-2 h-4 w-4" />Reports</CommandItem>
          <CommandItem onSelect={() => go("/risk-assessment")}><Zap className="mr-2 h-4 w-4" />Risk Assessment</CommandItem>
          <CommandItem onSelect={() => go("/what-if")}><FlaskConical className="mr-2 h-4 w-4" />What-If Simulator</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><Settings className="mr-2 h-4 w-4" />Settings</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Installations (top 10)">
          {generatedData.installations.slice(0, 10).map((inst) => (
            <CommandItem key={inst.id} onSelect={() => go("/installations")}>
              <Factory className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{inst.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{inst.country}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Importers (top 10)">
          {generatedData.importers.slice(0, 10).map((imp) => (
            <CommandItem key={imp.id} onSelect={() => go("/importers")}>
              <Ship className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{imp.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{imp.eoriNumber}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
