import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground">Reports</h2>
        <p className="text-muted-foreground">
          Generate and export system reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">
              User Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a comprehensive report of all users, including registration trends
              and activity metrics.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">
              Property Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a detailed report of all properties, including approval status and
              pricing trends.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
