import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { 
  getMockUsers, 
  updateMockUser, 
  type User 
} from "@/services/mockDataService";
import { toast } from "sonner";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  // Fetch users with pagination
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', pagination, searchTerm, filters],
    queryFn: () => getMockUsers(
      pagination.page, 
      pagination.pageSize,
      { ...filters, search: searchTerm }
    ),
  });

  // Update user status mutation
  const updateUserStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return updateMockUser(id, { is_active: isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    },
  });

  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: User['role'] }) => {
      return updateMockUser(id, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    },
  });

  // User table columns
  const columns = [
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
      id: 'phone',
      header: 'Phone',
      cell: (user: User) => user.phone || 'N/A',
      sortable: false
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user: User) => (
        <select
          className="bg-background border rounded px-2 py-1 text-sm"
          value={user.role}
          onChange={(e) => 
            updateUserRole.mutate({ 
              id: user.id, 
              role: e.target.value as User['role'] 
            })
          }
        >
          <option value="TENANT">Tenant</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
      ),
      sortable: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: (user: User) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => 
            updateUserStatus.mutate({ 
              id: user.id, 
              isActive: !user.is_active 
            })
          }
          className={user.is_active ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </Button>
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
      id: 'actions',
      header: 'Actions',
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm" disabled={user.role === 'ADMIN'}>
            Edit
          </Button>
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
        <Button>Add New User</Button>
      </div>

      <div className="rounded-lg border p-6">
        <DataTable
          columns={columns}
          data={data?.users || []}
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
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.pageSize, data?.total || 0)}
            </span>{' '}
            of <span className="font-medium">{data?.total || 0}</span> users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => 
                setPagination(prev => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1)
                }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => 
                setPagination(prev => ({
                  ...prev,
                  page: prev.page + 1
                }))
              }
              disabled={!data || pagination.page * pagination.pageSize >= data.total}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
