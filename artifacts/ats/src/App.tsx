import {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Router as WouterRouter,
} from "wouter";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CandidateList from "./pages/CandidateList";
import CandidateForm from "./pages/CandidateForm";
import CandidateDetail from "./pages/CandidateDetail";
import KanbanBoard from "./pages/KanbanBoard";
import ActivityLog from "./pages/ActivityLog";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/not-found";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import {
  clearStoredAuth,
  getStoredAuthToken,
  setStoredAuthToken,
} from "./lib/auth-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Allow one retry on 401 in case the Bearer token getter wasn't set
        // yet on the first render (timing edge case). Hard-stop at 1 retry.
        if (error?.status === 401) return failureCount < 1;
        return failureCount < 2;
      },
      retryDelay: 300,
      staleTime: 30_000,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  // Handle absolute URLs — extract just the pathname
  try {
    const url = new URL(path);
    path = url.pathname + url.search + url.hash;
  } catch {
    // already a relative path, continue
  }
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function AuthTokenInitializer() {
  const [, setLocation] = useLocation();

  const syncAuth = useCallback(
    (token: string | null) => {
      setAuthTokenGetter(token ? () => token : null);
      if (!token) {
        setLocation("/", { replace: true });
      }
    },
    [setLocation],
  );

  useLayoutEffect(() => {
    syncAuth(getStoredAuthToken());
    return () => setAuthTokenGetter(null);
  }, [syncAuth]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "ats.token") {
        syncAuth(event.newValue);
      }
    };

    const onAuthChange = () => {
      syncAuth(getStoredAuthToken());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:change", onAuthChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:change", onAuthChange);
    };
  }, [syncAuth]);

  return null;
}

function QueryClientCacheInvalidator() {
  const qc = useQueryClient();

  useEffect(() => {
    const token = getStoredAuthToken();
    if (token) {
      qc.clear();
    }
  }, [qc]);

  return null;
}

function FullPageLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold text-primary-foreground">A</span>
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/candidates/new" component={CandidateForm} />
        <Route path="/candidates/:id" component={CandidateDetail} />
        <Route path="/candidates" component={CandidateList} />
        <Route path="/kanban" component={KanbanBoard} />
        <Route path="/activity" component={ActivityLog} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

/** Home route: landing for guests, dashboard redirect for signed-in users. */
function HomeRoute() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getStoredAuthToken();
    setIsAuthenticated(Boolean(token));
    setIsReady(true);
  }, []);

  if (!isReady) return <FullPageLoader />;
  if (isAuthenticated) return <Redirect to="/dashboard" />;
  return <LandingPage />;
}

function ProtectedApp() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getStoredAuthToken();
    setIsAuthenticated(Boolean(token));
    setIsReady(true);
  }, []);

  if (!isReady) return <FullPageLoader />;
  if (!isAuthenticated) return <Redirect to="/sign-in" />;
  return <AppContent />;
}

function AppProviders() {
  const [, setLocation] = useLocation();

  const routerPush = useCallback(
    (to: string) => setLocation(stripBase(to)),
    [setLocation],
  );
  const routerReplace = useCallback(
    (to: string) => setLocation(stripBase(to), { replace: true }),
    [setLocation],
  );

  useEffect(() => {
    const base = stripBase(
      window.location.pathname + window.location.search + window.location.hash,
    );
    if (
      base !==
      window.location.pathname + window.location.search + window.location.hash
    ) {
      setLocation(base, { replace: true });
    }
  }, [setLocation]);

  useMemo(() => routerPush, [routerPush]);
  useMemo(() => routerReplace, [routerReplace]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthTokenInitializer />
      <QueryClientCacheInvalidator />
      <TooltipProvider>
        <Switch>
          <Route path="/" component={HomeRoute} />
          <Route path="/sign-in/" component={SignInPage} />
          <Route path="/sign-up/" component={SignUpPage} />
          <Route path="/" component={ProtectedApp} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WouterRouter base={basePath}>
        <AppProviders />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
