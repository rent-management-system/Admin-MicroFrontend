import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getDashboardStats, getMockPaymentMetrics, getPropertyStats, getUserStats } from "@/services/mockDataService";
import { Home, Users, DollarSign, Activity } from "lucide-react";

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats
  });

  const { data: paymentMetrics } = useQuery({
    queryKey: ['payment-metrics'],
    queryFn: getMockPaymentMetrics
  });

  const { data: propertyStats } = useQuery({
    queryKey: ['property-stats'],
    queryFn: getPropertyStats
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats
  });

  // Get total revenue from payment metrics
  const totalRevenue = paymentMetrics?.data?.total_revenue || 0;
  
  // Get user stats
  const totalUsers = userStats?.total || 0;
  const activeUsers = userStats?.active || 0;
  const newUsers = userStats?.recentUsers?.length || 0;
  
  // Get property stats
  const totalProperties = propertyStats?.total || 0;
  const availableProperties = propertyStats?.available || 0;

  // Sample monthly revenue data - in a real app, this would come from an API
  const monthlyRevenue = [
    { name: 'Jan', revenue: 40000 },
    { name: 'Feb', revenue: 30000 },
    { name: 'Mar', revenue: 50000 },
    { name: 'Apr', revenue: 27800 },
    { name: 'May', revenue: 18900 },
    { name: 'Jun', revenue: 23900 },
    { name: 'Jul', revenue: 34900 },
  ];

  const propertyStatusData = [
    { name: 'Approved', value: propertyStats?.available || 0 },
    { name: 'Pending', value: propertyStats?.pending || 0 },
    { name: 'Reserved', value: propertyStats?.reserved || 0 },
    { name: 'Rejected', value: 0 }, // This needs to be added to the mock service if needed
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">+{availableProperties} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{newUsers} recently joined</p>
          </CardContent>
        </Card>




      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Status</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyStatusData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propertyStats?.recentProperties?.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{property.title}</p>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  ${property.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
