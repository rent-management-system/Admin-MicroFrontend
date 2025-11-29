import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMockProperties } from "@/services/mockDataService";
import { exportToCsv, formatPropertyForExport } from "@/utils/exportUtils";
import { toast } from "sonner";

interface ReportType {
  id: string;
  title: string;
  description: string;
  data?: any[];
  isLoading: boolean;
  exportFunction: () => Promise<void>;
}

export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);

  // Fetch properties for the property report
  const { data: propertiesData, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties-report"],
    queryFn: () => getMockProperties(1, 1000), // Get all properties for the report
  });

  const handleExportProperties = async () => {
    try {
      setIsExporting(true);
      if (!propertiesData?.properties || propertiesData.properties.length === 0) {
        toast.error("No property data available to export");
        return;
      }
      
      const formattedData = propertiesData.properties.map(property => 
        formatPropertyForExport(property)
      );
      
      exportToCsv(formattedData, 'properties-report');
      toast.success("Property report exported successfully");
    } catch (error) {
      console.error("Error exporting property report:", error);
      toast.error("Failed to export property report");
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
      title: 'Property Report',
      description: 'Generate a detailed report of all properties, including approval status and pricing trends.',
      data: propertiesData?.properties,
      isLoading: isPropertiesLoading,
      exportFunction: handleExportProperties
    }
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
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
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
