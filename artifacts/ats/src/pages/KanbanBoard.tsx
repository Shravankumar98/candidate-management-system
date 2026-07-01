import { useState, useRef } from "react";
import {
  useGetKanban,
  useUpdateCandidateStatus,
  CandidateStatus,
  getGetKanbanQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "wouter";

const COLUMNS: CandidateStatus[] = [
  CandidateStatus.applied,
  CandidateStatus.screening,
  CandidateStatus.interview,
  CandidateStatus.offer,
  CandidateStatus.selected,
  CandidateStatus.rejected,
];

export default function KanbanBoard() {
  const { data, isLoading } = useGetKanban();
  const updateStatus = useUpdateCandidateStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, candidateId: number) => {
    setDraggedId(candidateId);
    e.dataTransfer.setData("text/plain", candidateId.toString());
    // required for styling the dragged ghost image minimally
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: CandidateStatus) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("text/plain");
    const id = parseInt(idStr, 10);

    if (!id || isNaN(id)) return;

    // Optimistic UI updates
    const previousData = queryClient.getQueryData(getGetKanbanQueryKey());

    queryClient.setQueryData(getGetKanbanQueryKey(), (old: any) => {
      if (!old) return old;

      let movedCandidate: any = null;

      // Find and remove from original column
      const newColumns = old.columns.map((col: any) => {
        const cands = col.candidates.filter((c: any) => {
          if (c.id === id) {
            movedCandidate = { ...c, status };
            return false;
          }
          return true;
        });
        return { ...col, candidates: cands };
      });

      // Add to new column
      if (movedCandidate) {
        const destCol = newColumns.find((c: any) => c.status === status);
        if (destCol) {
          destCol.candidates.unshift(movedCandidate);
        }
      }

      return { columns: newColumns };
    });

    updateStatus.mutate(
      { id:idStr, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetKanbanQueryKey() });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "Could not move candidate.",
          });
          queryClient.setQueryData(getGetKanbanQueryKey(), previousData);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground text-sm">
            Drag and drop candidates across stages
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="min-w-[300px] w-[300px] flex-shrink-0 bg-muted/30 rounded-xl p-3 h-full"
            >
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ensure columns exist even if data is missing some
  const boardColumns = COLUMNS.map((status) => {
    const col = data?.columns?.find((c) => c.status === status);
    return { status, candidates: col?.candidates || [] };
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground text-sm">
          Drag and drop candidates across stages
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {boardColumns.map((col) => (
          <div
            key={col.status}
            className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col bg-muted/20 border border-border/50 rounded-xl max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            <div className="p-3 border-b border-border/50 flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <span className="capitalize text-sm font-semibold">
                  {col.status}
                </span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {col.candidates.length}
                </span>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
              {col.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, candidate.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-card border border-border shadow-sm rounded-lg p-4 cursor-grab hover:border-primary/50 transition-colors ${
                    draggedId === candidate.id
                      ? "opacity-50 border-primary"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      {candidate.name}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 truncate">
                    {candidate.position ||
                      candidate.currentCompany ||
                      "No role specified"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-1 overflow-hidden">
                      {candidate.skills?.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-muted rounded truncate max-w-[80px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {col.candidates.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
