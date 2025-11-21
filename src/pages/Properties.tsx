import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProperties, approveProperty, type PropertyItem } from "@/services/backend";

export default function Properties() {
  const queryClient = useQueryClient();

  const { data: properties, isLoading, isError, error } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => listProperties(),
  });

  const approveMut = useMutation({
    mutationFn: (propertyId: string) => approveProperty(propertyId),
    onMutate: async (propertyId: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["admin-properties"] });
      const previous = queryClient.getQueryData<PropertyItem[]>(["admin-properties"]);
      if (previous) {
        queryClient.setQueryData<PropertyItem[]>(["admin-properties"], prev =>
          (prev ?? []).map(p => p.id === propertyId ? { ...p, status: "approved" } : p)
        );
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["admin-properties"], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Property Management
          </h2>
          <p className="text-muted-foreground">Review and approve property listings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-semibold">
            All Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="py-6 text-sm text-muted-foreground">Loading properties...</div>}
          {isError && <div className="py-6 text-sm text-red-600">Failed to load properties: {(error as Error)?.message}</div>}
          {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price (ETB)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties?.map((property: PropertyItem) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{Number(property.price).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {property.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-success hover:text-success"
                            title="Approve"
                            onClick={() => approveMut.mutate(property.id)}
                            >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
