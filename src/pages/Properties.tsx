import { useState } from "react";
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

const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    location: "Addis Ababa",
    status: "pending",
    ownerId: "owner-1",
    price: 2500,
  },
  {
    id: "2",
    title: "Luxury Villa with Pool",
    location: "Hawassa",
    status: "approved",
    ownerId: "owner-2",
    price: 8000,
  },
  {
    id: "3",
    title: "Cozy Studio Apartment",
    location: "Bahir Dar",
    status: "rejected",
    ownerId: "owner-3",
    price: 1200,
  },
];

export default function Properties() {
  const [properties] = useState(mockProperties);

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
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.price.toLocaleString()}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
