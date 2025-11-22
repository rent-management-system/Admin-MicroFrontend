import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, getPropertiesMetrics } from "@/services/backend";
import { useAuth } from "@/hooks/useAuth";

export function ProductivityChart() {
  const queryClient = useQueryClient();
  const { authStatus } = useAuth();
  const isAuthed = authStatus === "authenticated";
  // Fetch totals
  const usersQ = useQuery({
    queryKey: ["admin-users-total-for-chart"],
    queryFn: () => getAdminUsers({ skip: 0, limit: 1 }),
    placeholderData: keepPreviousData,
    retry: 0,
    enabled: isAuthed,
  });
  const propsQ = useQuery({
    queryKey: ["properties-metrics-for-chart"],
    queryFn: () => getPropertiesMetrics(),
    placeholderData: keepPreviousData,
    retry: 1,
    enabled: isAuthed,
  });

  // Primary data from local queries
  let usersTotal = usersQ.data?.total_users as number | undefined;
  let propertiesTotal = propsQ.data?.data?.total_listings as number | undefined;
  let revenueTotal = propsQ.data?.data?.total_revenue !== undefined
    ? Number(propsQ.data.data.total_revenue ?? "0")
    : undefined;

  // Fallback to cached queries from Dashboard if local queries failed
  if ((usersTotal === undefined || usersQ.isError)) {
    const cachedUsers = queryClient.getQueryData<{ total_users: number }>(["admin-users-total"]);
    if (cachedUsers?.total_users !== undefined) usersTotal = cachedUsers.total_users;
  }
  if ((propertiesTotal === undefined || revenueTotal === undefined || propsQ.isError)) {
    const cachedProps = queryClient.getQueryData<{ data?: { total_listings?: number; total_revenue?: string | number } }>(["properties-metrics"]);
    if (cachedProps?.data?.total_listings !== undefined) propertiesTotal = cachedProps.data.total_listings;
    if (cachedProps?.data?.total_revenue !== undefined) revenueTotal = Number(cachedProps.data.total_revenue);
  }

  const usersAvailable = true; // Always show Users (even if token missing)
  const propsAvailable = true; // Always show Properties/Revenue bars for consistent UI

  if (usersQ.isError) {
    console.error("Users total query failed for chart:", usersQ.error);
  }
  if (propsQ.isError) {
    console.error("Properties metrics query failed for chart:", propsQ.error);
  }

  const isLoading = usersQ.isLoading && propsQ.isLoading;
  const nothingLoaded = (!usersQ.data && usersQ.isError) && (!propsQ.data && propsQ.isError);

  const chartData: Array<{ label: string; value: number; fill: string }> = [
    { label: "Users", value: typeof usersTotal === 'number' ? usersTotal : 0, fill: "hsl(var(--chart-1))" },
    { label: "Properties", value: typeof propertiesTotal === 'number' ? propertiesTotal : 0, fill: "hsl(var(--chart-2))" },
    { label: "Revenue", value: typeof revenueTotal === 'number' && !Number.isNaN(revenueTotal) ? revenueTotal : 0, fill: "hsl(var(--chart-3))" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-lg font-semibold">Users, Properties, Revenue</CardTitle>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2"><div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-1))]"></div><span className="text-muted-foreground">Users</span></div>
          <div className="flex items-center gap-2"><div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-2))]"></div><span className="text-muted-foreground">Properties</span></div>
          <div className="flex items-center gap-2"><div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-3))]"></div><span className="text-muted-foreground">Revenue</span></div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-6 text-sm text-muted-foreground">Loading metrics...</div>}
        {nothingLoaded && !isLoading && <div className="py-6 text-sm text-red-600">Failed to load metrics.</div>}
        {!isLoading && !nothingLoaded && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
