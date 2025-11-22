import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getPropertiesMetrics } from "@/services/backend";
import { useAuth } from "@/hooks/useAuth";

export function StatusChart() {
  const { authStatus } = useAuth();
  const isAuthed = authStatus === "authenticated";
  const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const canCallAdmin = isAuthed || BYPASS_AUTH;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties-metrics-status"],
    queryFn: () => getPropertiesMetrics(),
    enabled: canCallAdmin,
  });

  const pending = data?.data?.pending ?? 0;
  const approved = data?.data?.approved ?? 0;
  const rejected = data?.data?.rejected ?? 0;

  const chartData = [
    { status: "Pending", value: pending, color: "hsl(var(--chart-2))" },
    { status: "Approved", value: approved, color: "hsl(var(--chart-3))" },
    { status: "Rejected", value: rejected, color: "hsl(var(--chart-1))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">
          Listings Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-4 text-sm text-muted-foreground">Loading status metrics...</div>}
        {isError && !isLoading && <div className="py-4 text-sm text-red-600">Failed to load status metrics.</div>}
        {!isLoading && !isError && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="status"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 flex justify-around text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-2))]"></div>
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-3))]"></div>
            <span className="text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1))]"></div>
            <span className="text-muted-foreground">Rejected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
