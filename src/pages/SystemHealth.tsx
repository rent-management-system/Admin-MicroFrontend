import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle } from "lucide-react";

const services = [
  { name: "User Management", status: "ok" },
  { name: "Property Listing", status: "ok" },
  { name: "Payment Processing", status: "ok" },
  { name: "Search & Filters", status: "ok" },
  { name: "AI Recommendation", status: "ok" },
  { name: "Notification Service", status: "ok" },
];

export default function SystemHealth() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-primary" />
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            System Health
          </h2>
          <p className="text-muted-foreground">Monitor all microservices status</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <Badge className="bg-success">
                {service.status.toUpperCase()}
              </Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                Last checked: Just now
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
