import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMockProperties, getMockUsers } from "@/services/mockDataService";

type ReportType = "properties" | "users" | "transactions";
type ReportFormat = "csv" | "pdf" | "excel";

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("properties");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Fetch data based on report type
  const { data: propertiesData } = useQuery({
    queryKey: ['properties-report'],
    queryFn: () => getMockProperties(1, 1000), // Large page size to get all properties
    enabled: reportType === 'properties',
  });

  const { data: usersData } = useQuery({
    queryKey: ['users-report'],
    queryFn: () => getMockUsers(1, 1000), // Large page size to get all users
    enabled: reportType === 'users',
  });

  const handleExport = (format: ReportFormat) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${reportType} report as ${format}`, {
      dateRange,
      data: reportType === 'properties' ? propertiesData : usersData
    });
    
    // Mock download
    alert(`Exporting ${reportType} report as ${format}...`);
  };

  const renderReportPreview = () => {
    switch (reportType) {
      case "properties":
        return (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertiesData?.properties.slice(0, 5).map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>${property.price.toLocaleString()}</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>{new Date(property.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {propertiesData && propertiesData.properties.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      + {propertiesData.properties.length - 5} more records
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        );
      case "users":
        return (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {usersData && usersData.users.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      + {usersData.users.length - 5} more records
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        );
      case "transactions":
        return (
          <div className="text-center py-8 text-muted-foreground">
            No transaction data available in preview. Select date range and generate report.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-2">
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value as ReportType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="properties">Properties</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="transactions">Transactions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
              {isCalendarOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                      if (range?.from && range?.to) {
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export As</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("excel")}
              >
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("pdf")}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="p-4 border rounded-md bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
              </h3>
              <span className="text-sm text-muted-foreground">
                {propertiesData && `${propertiesData.total} records`}
                {usersData && `${usersData.total} records`}
              </span>
            </div>
            {renderReportPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
