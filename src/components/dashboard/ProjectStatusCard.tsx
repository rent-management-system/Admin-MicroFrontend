import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "./CircularProgress";

interface Project {
  name: string;
  percentage: number;
  color: string;
  tasks: string;
}

const projects: Project[] = [
  { name: "Project Status", percentage: 65, color: "hsl(var(--chart-1))", tasks: "Main Tasks" },
  { name: "Progress", percentage: 80, color: "hsl(var(--chart-3))", tasks: "Development" },
  { name: "Review", percentage: 45, color: "hsl(var(--chart-5))", tasks: "Final Stage" },
];

export function ProjectStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.name} className="flex flex-col items-center space-y-2">
              <CircularProgress percentage={project.percentage} color={project.color} />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.tasks}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
