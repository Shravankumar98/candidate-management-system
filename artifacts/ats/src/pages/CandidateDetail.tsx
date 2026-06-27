import { useState } from "react";
import { useParams } from "wouter";
import {
  useGetCandidate,
  useUpdateCandidateStatus,
  useListCandidateNotes,
  useCreateCandidateNote,
  useDeleteCandidate,
  CandidateStatus,
  getGetCandidateQueryKey,
  getListCandidateNotesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { getStoredAuthUser } from "@/lib/auth-storage";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Mail,
  Phone,
  Clock,
  FileText,
  Send,
  Calendar,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function CandidateDetail() {
  const { id } = useParams();
  const candidateId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [noteContent, setNoteContent] = useState("");

  const parsedUser = getStoredAuthUser<{ name?: string; email?: string }>();
  const authorName =
    parsedUser?.name || parsedUser?.email?.split("@")[0] || "Team Member";

  const { data: candidate, isLoading: isLoadingCandidate } = useGetCandidate(
    candidateId,
    {
      query: {
        enabled: !!candidateId,
        queryKey: getGetCandidateQueryKey(candidateId),
      },
    },
  );

  const { data: notes, isLoading: isLoadingNotes } = useListCandidateNotes(
    candidateId,
    {
      query: {
        enabled: !!candidateId,
        queryKey: getListCandidateNotesQueryKey(candidateId),
      },
    },
  );

  const updateStatus = useUpdateCandidateStatus();
  const createNote = useCreateCandidateNote();
  const deleteCandidate = useDeleteCandidate();

  if (isLoadingCandidate) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold">Candidate not found</h2>
        <p className="text-sm text-muted-foreground mt-1">
          This candidate may have been deleted.
        </p>
        <Button variant="link" asChild className="mt-3">
          <Link href="/candidates">Back to list</Link>
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: CandidateStatus) => {
    updateStatus.mutate(
      { id: candidateId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Moved to ${newStatus}`,
          });
          queryClient.invalidateQueries({
            queryKey: getGetCandidateQueryKey(candidateId),
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update status.",
          });
        },
      },
    );
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const previousNotes = queryClient.getQueryData(
      getListCandidateNotesQueryKey(candidateId),
    );

    const optimisticNote = {
      id: Date.now(),
      candidateId,
      content: noteContent,
      authorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData(
      getListCandidateNotesQueryKey(candidateId),
      (old: any) => [...(old || []), optimisticNote],
    );

    const contentToSave = noteContent;
    setNoteContent("");

    createNote.mutate(
      { candidateId, data: { content: contentToSave, authorName } },
      {
        onSuccess: () => {
          toast({ title: "Note added" });
          queryClient.invalidateQueries({
            queryKey: getListCandidateNotesQueryKey(candidateId),
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add note.",
          });
          queryClient.setQueryData(
            getListCandidateNotesQueryKey(candidateId),
            previousNotes,
          );
          setNoteContent(contentToSave);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteCandidate.mutate(
      { id: candidateId },
      {
        onSuccess: () => {
          toast({ title: "Candidate deleted" });
          setLocation("/candidates");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete candidate.",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-2 -ml-3 text-muted-foreground"
          >
            <Link href="/candidates">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to candidates
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {candidate.name}
            </h1>
            <StatusBadge status={candidate.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={candidate.status}
            onValueChange={(val: any) => handleStatusChange(val)}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CandidateStatus).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete candidate?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {candidate.name} and all their
                  notes and activity history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium truncate">
                      {candidate.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      {candidate.phone || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      {candidate.position || "No position specified"}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      {candidate.currentCompany || "No company specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      {candidate.yearsOfExperience !== null
                        ? `${candidate.yearsOfExperience} years experience`
                        : "Experience not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">
                      Added{" "}
                      {format(new Date(candidate.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {candidate.resumeUrl && (
                <>
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Resume</h4>
                      <p className="text-xs text-muted-foreground">
                        External document link
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4 mr-2" /> View Resume
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 bg-muted/20 border-b border-border/50">
                <div className="relative">
                  <Textarea
                    placeholder="Add a note about this candidate…"
                    className="min-h-[100px] resize-none pb-12"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                        handleAddNote();
                    }}
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteContent.trim() || createNote.isPending}
                    >
                      <Send className="w-3 h-3 mr-2" /> Post Note
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Posting as <span className="font-medium">{authorName}</span> ·
                  Cmd+Enter to submit
                </p>
              </div>
              <div className="divide-y divide-border/50">
                {isLoadingNotes ? (
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : !notes || notes.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No notes yet. Add one above.
                  </div>
                ) : (
                  [...notes].reverse().map((note) => (
                    <div key={note.id} className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {note.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(note.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                {candidate.activityLogs && candidate.activityLogs.length > 0 ? (
                  candidate.activityLogs.map((activity) => (
                    <div key={activity.id} className="p-4 flex gap-3">
                      <div className="mt-1.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-foreground capitalize">
                            {activity.action}
                          </span>
                          {activity.newValue && (
                            <span className="text-muted-foreground">
                              {" "}
                              → {activity.newValue}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(
                            new Date(activity.createdAt),
                            "MMM d, yyyy h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No activity recorded.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
