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
import { Edit, Trash2 } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    email: "john@example.com",
    role: "User",
    phone: "+1234567890",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    email: "jane@example.com",
    role: "Landlord",
    phone: "+1234567891",
    isActive: true,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    email: "admin@example.com",
    role: "Admin",
    phone: "+1234567892",
    isActive: true,
    createdAt: "2024-01-01",
  },
];

export default function Users() {
  const [users] = useState(mockUsers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage all users and their roles</p>
        </div>
        <Button>Add User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-semibold">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "Admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
