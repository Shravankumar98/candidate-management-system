import { useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PhoneCall, FileText, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time pipeline overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time pipeline overview</p>
        </div>
        <Card className="shadow-sm">
          <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Could not load dashboard data</p>
              <p className="text-sm text-muted-foreground mt-1">
                There was a problem connecting to the server.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="text-sm text-primary hover:underline font-medium"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Candidates",
      value: data.totalCandidates,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "In Interview",
      value: data?.byStatus?.interview,
      icon: PhoneCall,
      color: "text-purple-500",
    },
    {
      label: "Offers Extended",
      value: data?.byStatus?.offer,
      icon: FileText,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time pipeline overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 bg-muted rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {data?.recentCandidates?.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No candidates yet.{" "}
                  <Link href="/candidates/new" className="text-primary hover:underline">
                    Add the first one.
                  </Link>
                </div>
              ) : (
                data?.recentCandidates?.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/candidates/${candidate.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.position || candidate.currentCompany || "No role specified"}
                      </p>
                    </div>
                    <StatusBadge status={candidate.status} />
                  </Link>
                ))
              )}
            </div>
            <div className="p-4 border-t border-border/50 bg-muted/20 text-center">
              <Link
                href="/candidates"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all candidates &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {data?.recentActivity?.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No activity yet.
                </div>
              ) : (
                data?.recentActivity?.map((activity) => (
                  <div key={activity.id} className="p-4 flex gap-4">
                    <div className="mt-1.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <Link
                          href={`/candidates/${activity.candidateId}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {activity.candidateName}
                        </Link>{" "}
                        <span className="text-muted-foreground">
                          {activity.action.toLowerCase()}
                        </span>
                        {activity.newValue && (
                          <span className="font-medium"> to {activity.newValue}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-border/50 bg-muted/20 text-center">
              <Link href="/activity" className="text-xs font-medium text-primary hover:underline">
                View all activity &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
