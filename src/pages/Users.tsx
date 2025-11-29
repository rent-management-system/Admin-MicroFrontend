import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMockUsers } from "@/services/mockDataService";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", { page, search }],
    queryFn: () => getMockUsers(page, PAGE_SIZE, { search }),
    placeholderData: keepPreviousData,
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPage));
      setSearchParams(params);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">View all users in the system</p>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(page - 1)} 
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-sm">
                          Page {page} of {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(page + 1)} 
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
