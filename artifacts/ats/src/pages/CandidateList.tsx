import { useState } from "react";
import { useListCandidates, ListCandidatesStatus, ListCandidatesSortBy, ListCandidatesSortOrder } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "wouter";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<ListCandidatesStatus | "all">("all");
  const [sortBy, setSortBy] = useState<ListCandidatesSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<ListCandidatesSortOrder>("desc");

  // Basic debounce implementation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timeoutId = setTimeout(() => setDebouncedSearch(e.target.value), 500);
    return () => clearTimeout(timeoutId);
  };

  const { data, isLoading } = useListCandidates({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    sortBy,
    sortOrder
  });

  const toggleSort = (field: ListCandidatesSortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const renderSortIcon = (field: ListCandidatesSortBy) => {
    if (sortBy !== field) return <SlidersHorizontal className="w-3 h-3 ml-1 opacity-20" />;
    return sortOrder === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground text-sm">Manage and track your pipeline</p>
        </div>
        <Button asChild>
          <Link href="/candidates/new">Add Candidate</Link>
        </Button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, skills..." 
              className="pl-9 h-9"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={status} onValueChange={(val: any) => { setStatus(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(ListCandidatesStatus).map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px] cursor-pointer" onClick={() => toggleSort("name")}>
                  <div className="flex items-center">Candidate {renderSortIcon("name")}</div>
                </TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("yearsOfExperience")}>
                  <div className="flex items-center">Exp. {renderSortIcon("yearsOfExperience")}</div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("createdAt")}>
                  <div className="flex items-center">Added {renderSortIcon("createdAt")}</div>
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-[150px] mb-2" /><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : !data || data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((candidate) => (
                  <TableRow key={candidate.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium text-foreground">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground">{candidate.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{candidate.position || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={candidate.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{candidate.yearsOfExperience ? `${candidate.yearsOfExperience} yrs` : "—"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{format(new Date(candidate.createdAt), "MMM d, yyyy")}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/candidates/${candidate.id}`}>View Profile</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {((data.page - 1) * data.limit) + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} candidates
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <div className="font-medium px-2">{page} / {data.totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
