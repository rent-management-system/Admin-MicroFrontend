import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getPaymentMetrics } from "@/services/backend";
import { useAuth } from "@/hooks/useAuth";

export function KPIChart() {
  const { authStatus } = useAuth();
  const isAuthed = authStatus === "authenticated";
  const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const canCallAdmin = isAuthed || BYPASS_AUTH;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payment-metrics"],
    queryFn: async ({ signal }) => {
      try {
        return await getPaymentMetrics();
      } catch (err) {
        // Don't log aborted requests as errors
        if (err instanceof Error && err.name === 'AbortError') {
          return null; // Return null to prevent error state for aborted requests
        }
        throw err; // Re-throw other errors
      }
    },
    enabled: canCallAdmin,
    retry: 1, // Only retry once on failure
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });

  const success = Number(data?.data?.success_payments ?? 0) || 0;
  const pending = Number(data?.data?.pending_payments ?? 0) || 0;
  const failed = Number(data?.data?.failed_payments ?? 0) || 0;
  const totalRevenue = Number(data?.data?.total_revenue ?? 0) || 0;

  const chartData = [
    { label: "Success", value: success, fill: "hsl(var(--chart-3))" },
    { label: "Pending", value: pending, fill: "hsl(var(--chart-2))" },
    { label: "Failed", value: failed, fill: "hsl(var(--chart-1))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">Payment Metrics</CardTitle>
        <p className="text-xs text-muted-foreground">Transactions and revenue</p>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-4 text-sm text-muted-foreground">Loading payment metrics...</div>}
        {isError && !isLoading && (
          <div className="py-4 text-sm text-red-600">
            {error?.message?.includes('aborted') 
              ? 'Loading metrics was cancelled'
              : 'Failed to load payment metrics. Please try again.'}
          </div>
        )}
        {!isLoading && !isError && data && (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold">{Number(totalRevenue).toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
