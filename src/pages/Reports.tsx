import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Users, DollarSign, Home, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMockProperties, getMockTenants, getMockPayments } from "@/services/mockDataService";
import { exportToCsv, formatPropertyForExport, formatTenantForExport, formatPaymentForExport } from "@/utils/exportUtils";
import { toast } from "sonner";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  data?: any[];
  isLoading: boolean;
  exportFunction: () => Promise<void>;
}

export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data for reports
  const { data: propertiesData, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties-report"],
    queryFn: () => getMockProperties(1, 1000),
  });

  const { data: tenantsData, isLoading: isTenantsLoading } = useQuery({
    queryKey: ["tenants-report"],
    queryFn: () => getMockTenants(1, 1000),
  });

  const { data: paymentsData, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments-report"],
    queryFn: () => getMockPayments(1, 1000, new Date().getFullYear()),
  });

  const handleExport = async (data: any[], formatFn: (item: any) => any, reportName: string) => {
    try {
      setIsExporting(true);
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
      
      if (data.length === 0) {
        throw new Error('No data available to export');
      }
      
      console.log(`Exporting ${reportName} with ${data.length} items`);
      
      // Format the data
      const formattedData = data.map((item, index) => {
        try {
          return formatFn(item);
        } catch (error) {
          console.error(`Error formatting item ${index}:`, error);
          throw new Error(`Error formatting data at position ${index + 1}`);
        }
      });
      
      console.log('Formatted data for export:', formattedData);
      
      // Generate a safe filename
      const safeReportName = reportName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Export to CSV
      const success = exportToCsv(formattedData, `${safeReportName}-report`);
      
      if (success) {
        toast.success(`${reportName} report exported successfully`);
      } else {
        throw new Error('Export failed');
      }
      
    } catch (error) {
      console.error(`Error exporting ${reportName} report:`, error);
      toast.error(`Failed to export ${reportName} report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypes: ReportType[] = [
    {
      id: 'users',
      title: 'User Report',
      description: 'Generate a comprehensive report of all users, including registration trends and activity metrics.',
      isLoading: false,
      exportFunction: async () => {
        // TODO: Implement user export
        toast.info("User export will be implemented soon");
      }
    },
    {
      id: 'properties',
      title: 'Properties',
      description: 'Export all property listings with detailed information',
      icon: <Home className="h-5 w-5 text-blue-500" />,
      data: propertiesData?.properties || [],
      isLoading: isPropertiesLoading,
      exportFunction: () => handleExport(propertiesData?.properties || [], formatPropertyForExport, 'Properties'),
    },
    {
      id: 'tenants',
      title: 'Tenants',
      description: 'Export tenant information and lease details',
      icon: <Users className="h-5 w-5 text-green-500" />,
      data: tenantsData?.tenants || [],
      isLoading: isTenantsLoading,
      exportFunction: () => handleExport(tenantsData?.tenants || [], formatTenantForExport, 'Tenants'),
    },
    {
      id: 'payments',
      title: 'Payments',
      description: 'Export payment history and transaction details',
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      data: paymentsData?.payments || [],
      isLoading: isPaymentsLoading,
      exportFunction: () => handleExport(paymentsData?.payments || [], formatPaymentForExport, 'Payments'),
    },
    {
      id: 'vacancies',
      title: 'Vacancies',
      description: 'Export vacant properties and availability dates',
      icon: <Calendar className="h-5 w-5 text-amber-500" />,
      data: propertiesData?.properties?.filter((p: any) => p.status === 'vacant') || [],
      isLoading: isPropertiesLoading,
      exportFunction: () => {
        const vacantProperties = propertiesData?.properties?.filter((p: any) => p.status === 'vacant') || [];
        return handleExport(vacantProperties, formatPropertyForExport, 'Vacant Properties');
      },
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground">Reports</h2>
        <p className="text-muted-foreground">
          Generate and export system reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {report.icon || <FileText className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button className="flex-1" disabled={report.isLoading}>
                  <FileText className="mr-2 h-4 w-4" />
                  {report.isLoading ? 'Loading...' : 'Generate Report'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={report.exportFunction}
                  disabled={report.isLoading || isExporting}
                >
                  {isExporting && report.id === 'properties' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
