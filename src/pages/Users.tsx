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
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAdminUsers, type AdminUser } from "@/services/backend";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const PAGE_SIZE_DEFAULT = 10;

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const skip = Number(searchParams.get("skip") || 0);
  const limit = Number(searchParams.get("limit") || PAGE_SIZE_DEFAULT);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users", { skip, limit }] as const,
    queryFn: (): Promise<ReturnType<typeof getAdminUsers> extends Promise<infer R> ? R : never> =>
      getAdminUsers({ skip, limit }),
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];
  const total = data?.total_users ?? 0;

  const onPrev = () => {
    const nextSkip = Math.max(0, skip - limit);
    setSearchParams({ skip: String(nextSkip), limit: String(limit) });
  };
  const onNext = () => {
    const nextSkip = skip + limit;
    if (nextSkip < total) setSearchParams({ skip: String(nextSkip), limit: String(limit) });
  };

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
          {isLoading && <div className="py-6 text-sm text-muted-foreground">Loading users...</div>}
          {isError && <div className="py-6 text-sm text-red-600">Failed to load users: {(error as Error)?.message}</div>}
          {!isLoading && !isError && (
            <>
              <div className="pb-3 text-sm text-muted-foreground">Total: {total.toLocaleString()}</div>
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
                  {users.map((user: AdminUser) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
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

              <div className="pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={(e) => { e.preventDefault(); onPrev(); }} href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={(e) => { e.preventDefault(); onNext(); }} href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
