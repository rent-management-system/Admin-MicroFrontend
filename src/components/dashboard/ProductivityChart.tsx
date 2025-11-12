import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", users: 400, properties: 240 },
  { month: "Feb", users: 300, properties: 139 },
  { month: "Mar", users: 500, properties: 380 },
  { month: "Apr", users: 278, properties: 390 },
  { month: "May", users: 589, properties: 480 },
  { month: "Jun", users: 439, properties: 380 },
  { month: "Jul", users: 649, properties: 430 },
];

export function ProductivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">
          Real Time Productivity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProperties" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorUsers)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="properties"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorProperties)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
