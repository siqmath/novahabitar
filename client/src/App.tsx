import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/contexts/LangContext";
import { Route, Switch, useLocation } from "wouter";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminGuard from "./components/AdminGuard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import History from "./pages/History";
import UploadTest from "./pages/UploadTest";
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
      {/* PT routes */}
      <Route path="/pt" component={Home} />
      <Route path="/pt/projetos" component={Projects} />
      <Route path="/pt/projetos/:slug" component={ProjectDetail} />
      <Route path="/pt/contato" component={Contact} />
      <Route path="/pt/historia" component={History} />
      {/* EN routes */}
      <Route path="/en" component={Home} />
      <Route path="/en/projetos" component={Projects} />
      <Route path="/en/projetos/:slug" component={ProjectDetail} />
      <Route path="/en/contato" component={Contact} />
      <Route path="/en/historia" component={History} />
      {/* Admin — password protected, no sidebar */}
      <Route path="/admin">
        {() => (
          <AdminGuard>
            <Admin />
          </AdminGuard>
        )}
      </Route>
      {/* Test route */}
      <Route path="/upload-test" component={UploadTest} />
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nova-habitar-theme">
      <LangProvider>
        <Router />
      </LangProvider>
    </ThemeProvider>
  );
}
