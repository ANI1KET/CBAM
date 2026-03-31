import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/CommandPalette";
import Index from "./pages/Index";
import Declarations from "./pages/Declarations";
import Installations from "./pages/Installations";
import Importers from "./pages/Importers";
import Suppliers from "./pages/Suppliers";
import RiskAssessment from "./pages/RiskAssessment";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CommandPalette />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/declarations" element={<Declarations />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/importers" element={<Importers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/risk-assessment" element={<RiskAssessment />} />
          <Route path="/what-if" element={<WhatIfSimulator />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
