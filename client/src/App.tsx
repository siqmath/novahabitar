/**
 * Nova Habitar — App Entry
 * Routes: /pt/* and /en/* for language switching
 * Sidebar is persistent on all pages
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import { useEffect } from "react";

// Redirect root to /pt
function RootRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/pt", { replace: true });
  }, [navigate]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/pt" component={Home} />
      <Route path="/pt/:rest*" component={Home} />
      <Route path="/en" component={Home} />
      <Route path="/en/:rest*" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main className="nh-main" style={{ flex: 1, minWidth: 0 }}>
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LangProvider>
          <TooltipProvider>
            <Toaster />
            <AppLayout />
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
