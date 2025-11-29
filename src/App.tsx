import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { PropertiesPage } from "./components/properties/PropertiesPage";
import { ReportsPage } from "./components/reports/ReportsPage";
import Users from "./pages/Users";
import SystemHealth from "./pages/SystemHealth";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

// Remove AdminLayout and related imports as they're not used in the current implementation

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000, // 1 minute cache for metrics/lists to feel instant
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Main Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<Users />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="system-health" element={<SystemHealth />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin routes can be added here in the future */}

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
