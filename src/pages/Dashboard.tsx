import { Users, Home, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { StatusChart } from "@/components/dashboard/StatusChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="2,543"
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          colorClass="bg-primary"
        />
        <StatCard
          title="Total Properties"
          value="1,234"
          change="+8.2% from last month"
          changeType="positive"
          icon={Home}
          colorClass="bg-secondary"
        />
        <StatCard
          title="Approved"
          value="892"
          change="72% approval rate"
          changeType="positive"
          icon={CheckCircle}
          colorClass="bg-success"
        />
        <StatCard
          title="Pending Review"
          value="45"
          change="Requires attention"
          changeType="neutral"
          icon={Clock}
          colorClass="bg-chart-4"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <ProductivityChart />
        </div>
        <div className="md:col-span-3">
          <StatusChart />
        </div>
      </div>
    </div>
  );
}
