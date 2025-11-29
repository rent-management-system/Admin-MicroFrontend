import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Mock data for all environments
const MOCK_SERVICES = [
  {
    id: 'core',
    title: 'Admin Core',
    alias: 'Core backend service',
    status: 'operational',
    message: 'Service is running normally',
    version: '1.0.0'
  },
  {
    id: 'ai',
    title: 'AI Service',
    alias: 'AI processing service',
    status: 'operational',
    message: 'AI models are ready',
    version: '1.2.3'
  },
  {
    id: 'payments',
    title: 'Payment Service',
    alias: 'Payment processing',
    status: 'operational',
    message: 'Payment gateway connected',
    version: '2.1.0'
  },
  {
    id: 'search',
    title: 'Search Service',
    alias: 'Search functionality',
    status: 'operational',
    message: 'Search index is up to date',
    version: '1.5.2'
  }
];

// Mock fetch function that returns immediately with mock data
const fetchHealth = async (endpoint: string) => {
  const service = MOCK_SERVICES.find(s => s.id === endpoint);
  return {
    ...service,
    ok: true,
    status: service?.status || 'operational',
    message: service?.message || 'Service is running normally'
  };
};

export default function SystemHealth() {
  const { 
    data: core, 
    isLoading: isLoadingCore, 
    refetch: refetchCore 
  } = useQuery({
    queryKey: ["admin-health", "core"],
    queryFn: () => fetchHealth('core'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { 
    data: ai, 
    isLoading: isLoadingAi, 
    refetch: refetchAi 
  } = useQuery({
    queryKey: ["admin-health", "ai"],
    queryFn: () => fetchHealth('ai'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { 
    data: payments, 
    isLoading: isLoadingPayments, 
    refetch: refetchPayments 
  } = useQuery({
    queryKey: ["admin-health", "payments"],
    queryFn: () => fetchHealth('payments'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const { 
    data: search, 
    isLoading: isLoadingSearch, 
    refetch: refetchSearch 
  } = useQuery({
    queryKey: ["admin-health", "search"],
    queryFn: () => fetchHealth('search'),
    retry: 1,
    refetchOnWindowFocus: false
  });

  // No loading states needed since we're using mock data
  const isLoading = false;
  
  const refetchAll = () => {
    // No-op since we're using mock data
    console.log('Refreshing all services...');
  };

  const items = MOCK_SERVICES.map(service => ({
    id: service.id,
    title: `${service.title} Health`,
    data: service,
    alias: service.alias,
    status: service.status,
    message: service.message,
    refetch: () => console.log(`Refreshing ${service.id}...`)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">System Health</h2>
            <p className="text-muted-foreground">Monitor all microservices status</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetchAll}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </>
          )}
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Mock Data</AlertTitle>
        <AlertDescription>
          Currently showing mock health data. Configure backend endpoints to see real-time status.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, title, alias, status, message, data, refetch }) => {
          const isOperational = status === 'operational' || status === 'ok';
          const isChecking = status === 'checking';
          const isError = status === 'error';
          
          return (
            <Card key={id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      isOperational ? "bg-emerald-600" : 
                      isChecking ? "bg-yellow-500" : 
                      "bg-red-600"
                    }
                  >
                    {isChecking ? "CHECKING" : isOperational ? "OPERATIONAL" : "ERROR"}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => refetch()}
                    disabled={isChecking}
                  >
                    <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{alias}</div>
                <p className={`text-sm mt-1 ${isError ? 'text-destructive' : ''}`}>
                  {message}
                </p>
                {data?.version && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Version: {data.version}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
