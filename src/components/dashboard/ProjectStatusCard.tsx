import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { getPropertiesMetrics } from "@/services/backend";

function pct(numerator: number, denominator: number): number {
  if (!denominator || denominator <= 0) return 0;
  const v = (numerator / denominator) * 100;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function ProjectStatusCard() {
  const propsQ = useQuery({ queryKey: ["projects-properties-metrics"], queryFn: () => getPropertiesMetrics() });

  const totalListings = propsQ.data?.data?.total_listings ?? 0;
  const approved = propsQ.data?.data?.approved ?? 0;
  const pending = propsQ.data?.data?.pending ?? 0;
  const rejected = propsQ.data?.data?.rejected ?? 0;

  // Percentages based purely on properties status distribution
  const approvedPct = pct(approved, totalListings);
  const pendingPct = pct(pending, totalListings);
  const rejectedPct = pct(rejected, totalListings);

  const items = [
    { name: "Approved", percentage: approvedPct, color: "hsl(var(--chart-3))", tasks: "Project Status" },
    { name: "Pending", percentage: pendingPct, color: "hsl(var(--chart-2))", tasks: "Progress" },
    { name: "Rejected", percentage: rejectedPct, color: "hsl(var(--chart-1))", tasks: "Review" },
  ];

  const loading = propsQ.isLoading;
  const error = propsQ.isError;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="py-4 text-sm text-muted-foreground">Calculating project metrics...</div>}
        {error && !loading && <div className="py-4 text-sm text-red-600">Failed to load project metrics.</div>}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4">
            {items.map((project) => (
              <div key={project.name} className="flex flex-col items-center space-y-2">
                <CircularProgress percentage={project.percentage} color={project.color} />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
