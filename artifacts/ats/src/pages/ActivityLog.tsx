import { useState } from "react";
import { useListActivity } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ActivityLog() {
  const [limit, setLimit] = useState(50);
  const { data: activities, isLoading } = useListActivity({ limit });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Activity</h1>
        <p className="text-muted-foreground text-sm">Chronological log of all system events</p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[200px]">Candidate</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : !activities || activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                    No activity found.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {activity.candidateName}
                    </TableCell>
                    <TableCell className="capitalize text-sm">
                      {activity.action}
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.oldValue && activity.newValue ? (
                        <span>
                          <span className="text-muted-foreground line-through mr-2">{activity.oldValue}</span>
                          &rarr; <span className="ml-2 font-medium">{activity.newValue}</span>
                        </span>
                      ) : activity.newValue ? (
                        <span className="font-medium">{activity.newValue}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/candidates/${activity.candidateId}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
