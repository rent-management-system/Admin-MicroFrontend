import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, BarChart, Clock } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import { 
  getMockUsers, 
  getMockProperties, 
  getMockPaymentMetrics, 
  getUserStats, 
  getPropertyStats,
  type User,
  type Property
} from "@/services/mockDataService";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  // Fetch data
  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getMockUsers(1, 5)
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => getMockProperties(1, 5)
  });

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getMockPaymentMetrics
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats
  });

  const { data: propertyStats } = useQuery({
    queryKey: ['property-stats'],
    queryFn: getPropertyStats
  });

  // User columns
  const userColumns = [
    {
      id: 'full_name',
      header: 'Name',
      cell: (user: User) => (
        <div className="font-medium">{user.full_name}</div>
      ),
      sortable: true
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user: User) => user.email,
      sortable: true
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user: User) => (
        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      ),
      sortable: true
    },
    {
      id: 'created_at',
      header: 'Joined',
      cell: (user: User) => format(new Date(user.created_at), 'MMM d, yyyy'),
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: (user: User) => (
        <Badge variant={user.is_active ? 'default' : 'outline'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
      sortable: true
    }
  ];

  // Property columns
  const propertyColumns = [
    {
      id: 'title',
      header: 'Property',
      cell: (property: Property) => (
        <div className="font-medium">{property.title}</div>
      ),
      sortable: true
    },
    {
      id: 'location',
      header: 'Location',
      cell: (property: Property) => property.location,
      sortable: true
    },
    {
      id: 'price',
      header: 'Price',
      cell: (property: Property) => `ETB ${property.price.toLocaleString()}`,
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: (property: Property) => {
        const statusVariants = {
          PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          APPROVED: 'bg-green-100 text-green-800 border-green-200',
          REJECTED: 'bg-red-100 text-red-800 border-red-200',
          RESERVED: 'bg-blue-100 text-blue-800 border-blue-200',
          DELETED: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusVariants[property.status]}`}>
            {property.status}
          </span>
        );
      },
      sortable: true
    },
    {
      id: 'created_at',
      header: 'Listed',
      cell: (property: Property) => format(new Date(property.created_at), 'MMM d, yyyy'),
      sortable: true
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground">
              {userStats?.active || 0} active users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyStats?.total || 0}</div>
            <div className="text-xs text-muted-foreground">
              {propertyStats?.available || 0} available
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ETB {metrics?.data?.total_revenue?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              {metrics?.data?.success_payments || 0} successful payments
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {propertyStats?.pending || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              properties waiting for approval
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-users">Recent Users</TabsTrigger>
          <TabsTrigger value="recent-properties">Recent Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={userColumns}
                data={usersData?.users || []}
                searchKey="email"
                filterOptions={[
                  {
                    key: 'role',
                    label: 'Filter by Role',
                    options: [
                      { value: 'TENANT', label: 'Tenant' },
                      { value: 'OWNER', label: 'Owner' },
                      { value: 'ADMIN', label: 'Admin' },
                    ]
                  },
                  {
                    key: 'is_active',
                    label: 'Filter by Status',
                    options: [
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ]
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent-properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={propertyColumns}
                data={propertiesData?.properties || []}
                searchKey="title"
                filterOptions={[
                  {
                    key: 'status',
                    label: 'Filter by Status',
                    options: [
                      { value: 'PENDING', label: 'Pending' },
                      { value: 'APPROVED', label: 'Approved' },
                      { value: 'REJECTED', label: 'Rejected' },
                      { value: 'RESERVED', label: 'Reserved' },
                      { value: 'DELETED', label: 'Deleted' },
                    ]
                  },
                  {
                    key: 'house_type',
                    label: 'Filter by Type',
                    options: [
                      { value: 'apartment', label: 'Apartment' },
                      { value: 'house', label: 'House' },
                      { value: 'condo', label: 'Condo' },
                      { value: 'villa', label: 'Villa' },
                    ]
                  }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
