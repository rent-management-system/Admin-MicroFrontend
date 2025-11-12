import { Users, Home, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { ProjectStatusCard } from "@/components/dashboard/ProjectStatusCard";
import { KPIChart } from "@/components/dashboard/KPIChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Construction Dashboard
        </h2>
        <p className="text-muted-foreground">
          Real-time monitoring and analytics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Project Regess"
          value="5156"
          change="+5156.397% progress"
          changeType="positive"
          icon={TrendingUp}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Labor Productivity"
          value="1000"
          change="Active workers"
          changeType="positive"
          icon={Users}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Set Titsch"
          value="2,451%"
          change="Efficiency rate"
          changeType="positive"
          icon={Activity}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Tow Phase"
          value="78"
          change="Completed tasks"
          changeType="neutral"
          icon={Home}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <ProductivityChart />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <KPIChart />
        </div>
        <div className="md:col-span-1">
          <StatusChart />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">
                Equilightions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revious Workers</span>
                <span className="font-heading text-lg font-bold">3,07%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Generated Revenue</span>
                <span className="font-heading text-lg font-bold">3,55%</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="text-xs text-muted-foreground">
                <p>€€€1.1k</p>
                <p className="mt-1">$3001512bn</p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></span>
                  Corporate Revenue
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]"></span>
                  Generated Revenue
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4">
        <ProjectStatusCard />
      </div>
    </div>
  );
}
