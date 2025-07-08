
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useSecurity } from "./hooks/useSecurity";
import { useEffect, lazy } from "react";
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";

// Lazy loading das páginas
const Index = lazy(() => import("./pages/Index"));
const Resources = lazy(() => import("./pages/Resources"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ProcessEditor = lazy(() => import("./components/ProcessEditor"));
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-slate-300">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-slate-300">Carregando...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  // Initialize security middleware
  useSecurity();
  
  // Initialize performance monitoring
  usePerformanceMonitor();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Index />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/recursos" 
          element={
            <PublicRoute>
              <Resources />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editor/:id" 
          element={
            <ProtectedRoute>
              <ProcessEditor />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    console.log('App: Initializing application with security enhancements...')
    
    // Import and initialize auth cleanup on app start
    import('@/lib/authCleanup').then(({ cleanupAuthState }) => {
      // Only cleanup if there are stale entries, not current session
      const hasStaleEntries = Object.keys(localStorage).some(key => 
        key.includes('sb-') && !key.includes('supabase.auth.token')
      );
      
      if (hasStaleEntries) {
        cleanupAuthState();
      }
    });
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
