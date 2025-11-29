import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMockProperties } from "@/services/mockDataService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Debounce utility function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const PAGE_SIZE = 10;

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  house_type: string;
  bedrooms: number;
  bathrooms: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | string;
  created_at: string;
  description?: string; // Added missing property
};

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  // Update search input when URL search param changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounced search
  const handleSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("search", value);
      params.set("page", "1"); // Reset to first page on new search
      setSearchParams(params);
    }, 300),
    [searchParams, setSearchParams]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["properties", { page, search }],
    queryFn: () => getMockProperties(page, PAGE_SIZE, { search }),
    placeholderData: keepPreviousData,
  });

  const properties = data?.properties || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPage));
      setSearchParams(params);
      window.scrollTo(0, 0);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");
    setSearchParams(params);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Property Management
            </h2>
            <p className="text-muted-foreground">View all property listings</p>
          </div>
          <div className="w-full md:w-96">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Property Management
          </h2>
          <p className="text-muted-foreground">View all property listings</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search properties..."
            className="pl-10 pr-10"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-heading text-lg font-semibold">
            All Properties
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {total.toLocaleString()} {total === 1 ? 'property' : 'properties'} found
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="py-6 text-center text-sm text-red-600">
              Failed to load properties: {(error as Error)?.message}
            </div>
          ) : properties.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No properties found{search ? ` matching "${search}"` : ''}
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={handleClearSearch}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[25%]">Title</TableHead>
                        <TableHead className="w-[20%]">Location</TableHead>
                        <TableHead className="w-[15%]">Price</TableHead>
                        <TableHead className="w-[10%]">Type</TableHead>
                        <TableHead className="w-[10%]">Details</TableHead>
                        <TableHead className="w-[10%]">Status</TableHead>
                        <TableHead className="w-[10%]">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="line-clamp-1">{property.title}</div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {property.location}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${property.price.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {property.house_type?.toLowerCase() || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {property.bedrooms || 0}bd / {property.bathrooms || 0}ba
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(property.status)}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(property.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * PAGE_SIZE, total)}
                      </span>{' '}
                      of <span className="font-medium">{total}</span> properties
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="h-8 w-8 p-0"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show first page, last page, and pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          if (pageNum < 1 || pageNum > totalPages) return null;
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === page ? "default" : "ghost"}
                              size="sm"
                              className={`h-8 w-8 p-0 ${pageNum === page ? 'font-bold' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                              aria-label={`Page ${pageNum}`}
                              aria-current={pageNum === page ? 'page' : undefined}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        {totalPages > 5 && page < totalPages - 2 && (
                          <span className="px-2 text-sm text-muted-foreground">
                            ...
                          </span>
                        )}
                        
                        {totalPages > 5 && page < totalPages - 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePageChange(totalPages)}
                            aria-label={`Page ${totalPages}`}
                          >
                            {totalPages}
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="h-8 w-8 p-0"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
