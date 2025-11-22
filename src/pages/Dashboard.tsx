import { useEffect, useState } from "react";
import { Users, Home, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { ProjectStatusCard } from "@/components/dashboard/ProjectStatusCard";
import { KPIChart } from "@/components/dashboard/KPIChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHealth } from "@/services/backend";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, getPropertiesMetrics, getPaymentMetrics, listPublicProperties } from "@/services/backend";

export default function Dashboard() {
  const { authStatus } = useAuth();
  const isAuthed = authStatus === "authenticated";
  const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const canCallAdmin = isAuthed || BYPASS_AUTH;
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [backendMsg, setBackendMsg] = useState<string>("");

  // Query total users once here (Rules of Hooks)
  const { data: usersTotalData, isLoading: usersTotalLoading, isError: usersTotalError } = useQuery({
    queryKey: ["admin-users-total"],
    queryFn: () => getAdminUsers({ skip: 0, limit: 1 }),
    enabled: canCallAdmin,
  });
  const totalUsers = usersTotalData?.total_users ?? 0;
  const totalUsersDisplay = usersTotalLoading ? "Loading..." : usersTotalError ? "-" : totalUsers.toLocaleString();
  if (usersTotalError) {
    console.error("Failed to fetch total users", usersTotalError);
  }

  // Properties metrics
  const { data: propsMetricsData, isLoading: propsLoading, isError: propsError } = useQuery({
    queryKey: ["properties-metrics"],
    queryFn: () => getPropertiesMetrics(),
    enabled: canCallAdmin,
  });
  const totalListings = propsMetricsData?.data?.total_listings ?? 0;
  const totalListingsDisplay = propsLoading ? "Loading..." : propsError ? "-" : totalListings.toLocaleString();
  const approvedCount = propsMetricsData?.data?.approved ?? 0;
  const approvedDisplay = propsLoading ? "Loading..." : propsError ? "-" : approvedCount.toLocaleString();

  // Payments metrics (use this for Total Revenue)
  const { data: paymentsData, isLoading: paymentsLoading, isError: paymentsError } = useQuery({
    queryKey: ["payment-metrics-total"],
    queryFn: () => getPaymentMetrics(),
    enabled: canCallAdmin,
  });
  const totalRevenueNum = Number(paymentsData?.data?.total_revenue ?? 0) || 0;
  const totalRevenueDisplay = paymentsLoading ? "Loading..." : paymentsError ? "-" : totalRevenueNum.toLocaleString();

  // Public properties list (minimal integration)
  const { data: publicPropsData, isLoading: publicPropsLoading, isError: publicPropsError } = useQuery({
    queryKey: ["public-properties", 0, 20],
    queryFn: () => listPublicProperties({ offset: 0, limit: 20 }),
  });

  // Log to console to verify the call works end-to-end without altering UI
  useEffect(() => {
    if (publicPropsData) {
      console.log("Public properties:", publicPropsData);
    }
    if (publicPropsError) {
      console.error("Failed to fetch public properties", publicPropsError);
    }
  }, [publicPropsData, publicPropsError]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getHealth();
      if (!mounted) return;
      if (res.ok) {
        setBackendOk(true);
        const msg = res.data?.status || res.data?.message || res.data?.detail || "OK";
        setBackendMsg(typeof msg === "string" ? msg : "OK");
      } else {
        setBackendOk(false);
        setBackendMsg(res.error || "Unavailable");
      }
    })();
    return () => { mounted = false; };
  }, []);

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

      {/* Backend connection status */}
      <div className="rounded-md border p-3 text-sm flex items-center gap-3">
        <span
          className={`inline-block h-2 w-2 rounded-full ${backendOk === null ? "bg-yellow-500" : backendOk ? "bg-emerald-500" : "bg-red-500"}`}
          aria-hidden
        />
        <div>
          <div className="font-medium">
            {backendOk === null ? "Checking backend..." : backendOk ? "Backend connected" : "Backend unreachable"}
          </div>
          <div className="text-muted-foreground">
            {backendOk === null ? "" : backendMsg}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsersDisplay}
          change="+5156.397% progress"
          changeType="positive"
          icon={TrendingUp}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Total Properties"
          value={totalListingsDisplay}
          change="Approved/Pending/Rejected"
          changeType="positive"
          icon={Users}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Total Revenue"
          value={totalRevenueDisplay}
          change="Efficiency rate"
          changeType="positive"
          icon={Activity}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
        <StatCard
          title="Approved Properties"
          value={approvedDisplay}
          change="Total approved"
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
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Users</span>
                <span className="font-heading text-lg font-bold">{typeof totalUsers === 'number' ? totalUsers.toLocaleString() : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Properties</span>
                <span className="font-heading text-lg font-bold">{totalListingsDisplay}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="text-xs text-muted-foreground">
                <p>Revenue</p>
                <p className="mt-1">{totalRevenueDisplay}</p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></span>
                  Users
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]"></span>
                  Properties
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]"></span>
                  Revenue
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
