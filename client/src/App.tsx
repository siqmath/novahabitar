/**
 * Nova Habitar — App Entry
 * Routes:
 *   /           → redirect to /pt
 *   /pt         → Home (PT)
 *   /en         → Home (EN)
 *   /pt/projetos → Projects page (PT)
 *   /en/projetos → Projects page (EN)
 *   /admin       → Admin panel (no sidebar)
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
import Projects from "./pages/Projects";
import Admin from "./pages/Admin";
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
      {/* Language-prefixed routes */}
      <Route path="/pt" component={Home} />
      <Route path="/pt/projetos" component={Projects} />
      <Route path="/en" component={Home} />
      <Route path="/en/projetos" component={Projects} />
      {/* Admin — no sidebar */}
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <Router />;
  }

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
