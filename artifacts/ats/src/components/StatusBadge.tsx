import { Badge } from "@/components/ui/badge";
import { CandidateStatus } from "@workspace/api-client-react";

export function StatusBadge({ status }: { status: CandidateStatus }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    applied: "secondary",
    screening: "outline",
    interview: "default",
    offer: "default",
    selected: "default",
    rejected: "destructive",
  };
  
  const colors: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    screening: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    interview: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    offer: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    selected: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <Badge 
      variant={variants[status] || "default"} 
      className={`capitalize font-medium ${colors[status] || ""}`}
    >
      {status}
    </Badge>
  );
}
