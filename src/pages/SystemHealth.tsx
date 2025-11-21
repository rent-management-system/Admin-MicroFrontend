import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminAiHealth,
  getAdminCoreHealth,
  getAdminPaymentsHealth,
  getAdminSearchHealth,
} from "@/services/backend";

export default function SystemHealth() {
  const core = useQuery({ queryKey: ["admin-health", "core"], queryFn: getAdminCoreHealth });
  const ai = useQuery({ queryKey: ["admin-health", "ai"], queryFn: getAdminAiHealth });
  const payments = useQuery({ queryKey: ["admin-health", "payments"], queryFn: getAdminPaymentsHealth });
  const search = useQuery({ queryKey: ["admin-health", "search"], queryFn: getAdminSearchHealth });

  const items = [
    { title: "Admin Core Health", q: core, alias: "Check Health" },
    { title: "AI Service Health", q: ai, alias: "AI Service Health Alias" },
    { title: "Payment Service Health", q: payments, alias: "Payment Service Health Alias" },
    { title: "Search Service Health", q: search, alias: "Search Service Health Alias" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">System Health</h2>
          <p className="text-muted-foreground">Monitor all microservices status</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, q, alias }) => {
          const isLoading = q.isLoading;
          const isError = q.isError || (q.data && q.data.ok === false);
          const ok = !isLoading && !isError;
          const detail = q.data?.data?.status || q.data?.data?.message || q.data?.data?.detail || q.data?.error || (isLoading ? "Checking..." : ok ? "OK" : "Unhealthy");
          return (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Badge className={ok ? "bg-emerald-600" : isLoading ? "bg-yellow-500" : "bg-red-600"}>
                  {isLoading ? "CHECKING" : ok ? "OK" : "FAIL"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{alias}</div>
                <div className="mt-2 text-sm">{detail}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
