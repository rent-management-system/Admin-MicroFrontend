import { useEffect, useState } from "react";
import { Users, Home, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { KPIChart } from "@/components/dashboard/KPIChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  getMockProperties, 
  getUserStats, 
  getPropertyStats 
} from "@/services/mockDataService";

export default function Dashboard() {
  const { authStatus } = useAuth();
  const isAuthed = authStatus === "authenticated";
  const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';
  const canCallAdmin = isAuthed || BYPASS_AUTH;

  // Get user statistics
  const { data: userStats, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
  });

  // Get property statistics
  const { data: propertyStats, isLoading: propsLoading, isError: propsError } = useQuery({
    queryKey: ["property-stats"],
    queryFn: getPropertyStats,
  });

  // Calculate display values
  const totalUsers = userStats?.total ?? 0;
  const totalUsersDisplay = usersLoading ? "Loading..." : usersError ? "-" : totalUsers.toLocaleString();
  
  const totalListings = propertyStats?.total ?? 0;
  const totalListingsDisplay = propsLoading ? "Loading..." : propsError ? "-" : totalListings.toLocaleString();
  
  // Using available instead of approved since that's what's in the type
  const availableCount = propertyStats?.available ?? 0;
  const availableDisplay = propsLoading ? "Loading..." : propsError ? "-" : availableCount.toLocaleString();

  if (usersError) {
    console.error("Failed to fetch user stats", usersError);
  }

  // Public properties list from mock data
  const { data: publicPropsData, isError: publicPropsError } = useQuery({
    queryKey: ["mock-public-properties"],
    queryFn: () => getMockProperties(1, 10, {}),
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
          title="Available Properties"
          value={availableDisplay}
          change="Total available"
          changeType="neutral"
          icon={Home}
          colorClass="bg-[hsl(var(--button-bg))]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <ProductivityChart />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <KPIChart />
        </div>
        <div className="md:col-span-1">
          <StatusChart />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-semibold">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Users</span>
            <span className="font-heading text-lg font-bold">
              {typeof totalUsers === 'number' ? totalUsers.toLocaleString() : '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Properties</span>
            <span className="font-heading text-lg font-bold">{totalListingsDisplay}</span>
          </div>
          <div className="h-px bg-border"></div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></span>
              Users
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]"></span>
              Properties
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <ProjectStatusCard />
      </div>
    </div>
  );
}
