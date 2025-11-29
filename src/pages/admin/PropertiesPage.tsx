import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { 
  getMockProperties, 
  updatePropertyStatus,
  type Property,
  type PropertyStatus
} from "@/services/mockDataService";
import { toast } from "sonner";
import { Link } from 'react-router-dom';

export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  // Fetch properties with pagination and filters
  const { data, isLoading } = useQuery({
    queryKey: ['admin-properties', pagination, searchTerm, filters],
    queryFn: () => getMockProperties(
      pagination.page, 
      pagination.pageSize,
      { ...filters, search: searchTerm }
    ),
  });

  // Update property status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PropertyStatus }) => {
      return updatePropertyStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast.success('Property status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    },
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: PropertyStatus }) => {
    const statusVariants = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      RESERVED: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETED: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusVariants[status]}`}>
        {status}
      </span>
    );
  };

  // Property table columns
  const columns = [
    {
      id: 'title',
      header: 'Property',
      cell: (property: Property) => (
        <div>
          <div className="font-medium">{property.title}</div>
          <div className="text-sm text-muted-foreground">{property.location}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'price',
      header: 'Price',
      cell: (property: Property) => `ETB ${property.price.toLocaleString()}`,
      sortable: true
    },
    {
      id: 'details',
      header: 'Details',
      cell: (property: Property) => (
        <div className="text-sm">
          <div>Beds: {property.bedrooms}</div>
          <div>Baths: {property.bathrooms}</div>
          <div>Type: {property.house_type}</div>
        </div>
      ),
      sortable: false
    },
    {
      id: 'status',
      header: 'Status',
      cell: (property: Property) => (
        <select
          className="bg-background border rounded px-2 py-1 text-sm w-full"
          value={property.status}
          onChange={(e) => 
            updateStatus.mutate({ 
              id: property.id, 
              status: e.target.value as PropertyStatus 
            })
          }
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="RESERVED">Reserved</option>
          <option value="DELETED">Delete</option>
        </select>
      ),
      sortable: true
    },
    {
      id: 'dates',
      header: 'Dates',
      cell: (property: Property) => (
        <div className="text-sm">
          <div>Listed: {format(new Date(property.created_at), 'MMM d, yyyy')}</div>
          <div>Updated: {format(new Date(property.updated_at), 'MMM d, yyyy')}</div>
        </div>
      ),
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (property: Property) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/properties/${property.id}`}>
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm">
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
          <h1 className="text-2xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">
            Manage all properties in the system
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/properties/new">
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border p-6">
        <DataTable
          columns={columns}
          data={data?.properties || []}
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
            },
            {
              key: 'bedrooms',
              label: 'Filter by Bedrooms',
              options: [
                { value: '1', label: '1 Bedroom' },
                { value: '2', label: '2 Bedrooms' },
                { value: '3', label: '3 Bedrooms' },
                { value: '4+', label: '4+ Bedrooms' },
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
            of <span className="font-medium">{data?.total || 0}</span> properties
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
