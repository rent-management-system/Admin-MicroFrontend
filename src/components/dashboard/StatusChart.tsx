import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", pending: 45, approved: 65, rejected: 25 },
  { month: "Feb", pending: 38, approved: 72, rejected: 18 },
  { month: "Mar", pending: 52, approved: 68, rejected: 30 },
  { month: "Apr", pending: 41, approved: 78, rejected: 22 },
  { month: "May", pending: 48, approved: 82, rejected: 28 },
  { month: "Jun", pending: 55, approved: 75, rejected: 32 },
  { month: "Jul", pending: 43, approved: 85, rejected: 20 },
  { month: "Aug", pending: 50, approved: 80, rejected: 26 },
];

export function StatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">
          Project Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
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
            <Bar dataKey="pending" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-around text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-2))]"></div>
            <span className="text-muted-foreground">Waiting Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-3))]"></div>
            <span className="text-muted-foreground">Manpower Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1))]"></div>
            <span className="text-muted-foreground">Response Hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
