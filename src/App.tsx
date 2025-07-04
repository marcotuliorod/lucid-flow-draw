
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard";
import ProcessEditor from "./components/ProcessEditor";
import LoginForm from "./components/auth/LoginForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('App: Current state:', { userEmail: user?.email, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-slate-300">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Index />} />
        <Route path="/login" element={user ? <Dashboard /> : <LoginForm />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <LoginForm />} />
        <Route path="/editor/:id" element={user ? <ProcessEditor /> : <LoginForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  console.log('App: Initializing application...')
  
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
