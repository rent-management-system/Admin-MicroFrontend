import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const data = [
  { time: "1h", taskload: 850, progress: 600, revenue: 400 },
  { time: "2h", taskload: 920, progress: 680, revenue: 420 },
  { time: "3h", taskload: 1100, progress: 850, revenue: 500 },
  { time: "4h", taskload: 980, progress: 750, revenue: 480 },
  { time: "5h", taskload: 1250, progress: 950, revenue: 580 },
  { time: "6h", taskload: 1150, progress: 880, revenue: 550 },
  { time: "7h", taskload: 1300, progress: 1000, revenue: 620 },
  { time: "8h", taskload: 1200, progress: 920, revenue: 590 },
  { time: "9h", taskload: 1350, progress: 1050, revenue: 640 },
  { time: "10h", taskload: 1280, progress: 980, revenue: 610 },
  { time: "11h", taskload: 1400, progress: 1100, revenue: 670 },
  { time: "12h", taskload: 1320, progress: 1020, revenue: 630 },
];

export function ProductivityChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-lg font-semibold">
          Real Time Productivity
        </CardTitle>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <span className="text-muted-foreground">Taskload</span>
            <span className="font-medium">5156.397%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">2.651%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium">3.313%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTaskload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="time" 
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
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Area
              type="monotone"
              dataKey="taskload"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorTaskload)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorProgress)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-3))"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
