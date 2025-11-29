import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMockProperties } from "@/services/mockDataService";
import { Property, PropertyStatus } from "@/services/mockDataService";

export function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "">("");
  const pageSize = 10;

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', page, search, statusFilter],
    queryFn: (): Promise<{ properties: Property[]; total: number }> => 
      getMockProperties(page, pageSize, { 
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      } as any),
    // @ts-ignore - keepPreviousData is a valid option
    keepPreviousData: true,
  });

  // Type assertion for the data
  const typedPropertiesData = propertiesData as { properties: Property[]; total: number } | undefined;

  const statuses: PropertyStatus[] = ["PENDING", "APPROVED", "REJECTED", "RESERVED"];

  const getStatusBadge = (status: PropertyStatus) => {
    const statusMap = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      APPROVED: "bg-green-100 text-green-800 hover:bg-green-200",
      REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
      RESERVED: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      DELETED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    return (
      <Badge className={`${statusMap[status]}`}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <div className="flex space-x-2">
          <Button>Add Property</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PropertyStatus | "");
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Properties Table */}
      <div className="border rounded-md
      ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : typedPropertiesData?.properties?.length ? (
              typedPropertiesData.properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{property.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.house_type} • {property.bedrooms} beds • {property.bathrooms} baths
                    </div>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>${property.price.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell>
                    {new Date(property.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No properties found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(page * pageSize, typedPropertiesData?.total || 0)}
          </span>{" "}
          of <span className="font-medium">{typedPropertiesData?.total || 0}</span> properties
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typedPropertiesData && page * pageSize < typedPropertiesData.total) {
                setPage((old) => old + 1);
              }
            }}
            disabled={!typedPropertiesData || page * pageSize >= typedPropertiesData.total}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
