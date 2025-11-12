import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", revenue: 120, visits: 80, business: 60 },
  { day: "Tue", revenue: 180, visits: 140, business: 100 },
  { day: "Wed", revenue: 160, visits: 120, business: 90 },
  { day: "Thu", revenue: 220, visits: 180, business: 140 },
  { day: "Fri", revenue: 200, visits: 160, business: 120 },
  { day: "Sat", revenue: 240, visits: 200, business: 160 },
  { day: "Sun", revenue: 210, visits: 170, business: 130 },
];

export function KPIChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">KPI</CardTitle>
        <p className="text-xs text-muted-foreground">User Record / Million</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              axisLine={false}
              tickLine={false}
            />
            <Area
              type="natural"
              dataKey="revenue"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
            <Area
              type="natural"
              dataKey="visits"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorVisits)"
              strokeWidth={2}
            />
            <Area
              type="natural"
              dataKey="business"
              stroke="hsl(var(--chart-3))"
              fillOpacity={1}
              fill="url(#colorBusiness)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-around text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <span className="text-muted-foreground">Very Visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <span className="text-muted-foreground">Business</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-5))]"></div>
            <span className="text-muted-foreground">Money</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
