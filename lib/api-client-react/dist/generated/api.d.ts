import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActivityLog, Candidate, CandidateDetail, CandidateInput, CandidateList, CandidateStatusUpdate, CandidateUpdate, DashboardStats, ErrorResponse, HealthStatus, KanbanBoard, ListActivityParams, ListCandidatesParams, Note, NoteInput, NoteUpdate } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListCandidatesUrl: (params?: ListCandidatesParams) => string;
/**
 * @summary List candidates
 */
export declare const listCandidates: (params?: ListCandidatesParams, options?: RequestInit) => Promise<CandidateList>;
export declare const getListCandidatesQueryKey: (params?: ListCandidatesParams) => readonly ["/api/candidates", ...ListCandidatesParams[]];
export declare const getListCandidatesQueryOptions: <TData = Awaited<ReturnType<typeof listCandidates>>, TError = ErrorType<unknown>>(params?: ListCandidatesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCandidatesQueryResult = NonNullable<Awaited<ReturnType<typeof listCandidates>>>;
export type ListCandidatesQueryError = ErrorType<unknown>;
/**
 * @summary List candidates
 */
export declare function useListCandidates<TData = Awaited<ReturnType<typeof listCandidates>>, TError = ErrorType<unknown>>(params?: ListCandidatesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCandidateUrl: () => string;
/**
 * @summary Create a candidate
 */
export declare const createCandidate: (candidateInput: CandidateInput, options?: RequestInit) => Promise<Candidate>;
export declare const getCreateCandidateMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, {
        data: BodyType<CandidateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, {
    data: BodyType<CandidateInput>;
}, TContext>;
export type CreateCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof createCandidate>>>;
export type CreateCandidateMutationBody = BodyType<CandidateInput>;
export type CreateCandidateMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Create a candidate
 */
export declare const useCreateCandidate: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidate>>, TError, {
        data: BodyType<CandidateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCandidate>>, TError, {
    data: BodyType<CandidateInput>;
}, TContext>;
export declare const getGetCandidateUrl: (id: string) => string;
/**
 * @summary Get a candidate by ID
 */
export declare const getCandidate: (id: string, options?: RequestInit) => Promise<CandidateDetail>;
export declare const getGetCandidateQueryKey: (id: string) => readonly [`/api/candidates/${string}`];
export declare const getGetCandidateQueryOptions: <TData = Awaited<ReturnType<typeof getCandidate>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCandidateQueryResult = NonNullable<Awaited<ReturnType<typeof getCandidate>>>;
export type GetCandidateQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a candidate by ID
 */
export declare function useGetCandidate<TData = Awaited<ReturnType<typeof getCandidate>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCandidate>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCandidateUrl: (id: string) => string;
/**
 * @summary Update a candidate
 */
export declare const updateCandidate: (id: string, candidateUpdate: CandidateUpdate, options?: RequestInit) => Promise<Candidate>;
export declare const getUpdateCandidateMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, {
        id: string;
        data: BodyType<CandidateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, {
    id: string;
    data: BodyType<CandidateUpdate>;
}, TContext>;
export type UpdateCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof updateCandidate>>>;
export type UpdateCandidateMutationBody = BodyType<CandidateUpdate>;
export type UpdateCandidateMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update a candidate
 */
export declare const useUpdateCandidate: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidate>>, TError, {
        id: string;
        data: BodyType<CandidateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCandidate>>, TError, {
    id: string;
    data: BodyType<CandidateUpdate>;
}, TContext>;
export declare const getDeleteCandidateUrl: (id: string) => string;
/**
 * @summary Delete a candidate
 */
export declare const deleteCandidate: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteCandidateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, {
    id: string;
}, TContext>;
export type DeleteCandidateMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCandidate>>>;
export type DeleteCandidateMutationError = ErrorType<unknown>;
/**
 * @summary Delete a candidate
 */
export declare const useDeleteCandidate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCandidate>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCandidate>>, TError, {
    id: string;
}, TContext>;
export declare const getUpdateCandidateStatusUrl: (id: string) => string;
/**
 * @summary Update candidate status (Kanban move)
 */
export declare const updateCandidateStatus: (id: string, candidateStatusUpdate: CandidateStatusUpdate, options?: RequestInit) => Promise<Candidate>;
export declare const getUpdateCandidateStatusMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidateStatus>>, TError, {
        id: string;
        data: BodyType<CandidateStatusUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCandidateStatus>>, TError, {
    id: string;
    data: BodyType<CandidateStatusUpdate>;
}, TContext>;
export type UpdateCandidateStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateCandidateStatus>>>;
export type UpdateCandidateStatusMutationBody = BodyType<CandidateStatusUpdate>;
export type UpdateCandidateStatusMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update candidate status (Kanban move)
 */
export declare const useUpdateCandidateStatus: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCandidateStatus>>, TError, {
        id: string;
        data: BodyType<CandidateStatusUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCandidateStatus>>, TError, {
    id: string;
    data: BodyType<CandidateStatusUpdate>;
}, TContext>;
export declare const getListCandidateNotesUrl: (candidateId: string) => string;
/**
 * @summary List notes for a candidate
 */
export declare const listCandidateNotes: (candidateId: string, options?: RequestInit) => Promise<Note[]>;
export declare const getListCandidateNotesQueryKey: (candidateId: string) => readonly [`/api/candidates/${string}/notes`];
export declare const getListCandidateNotesQueryOptions: <TData = Awaited<ReturnType<typeof listCandidateNotes>>, TError = ErrorType<unknown>>(candidateId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidateNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCandidateNotes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCandidateNotesQueryResult = NonNullable<Awaited<ReturnType<typeof listCandidateNotes>>>;
export type ListCandidateNotesQueryError = ErrorType<unknown>;
/**
 * @summary List notes for a candidate
 */
export declare function useListCandidateNotes<TData = Awaited<ReturnType<typeof listCandidateNotes>>, TError = ErrorType<unknown>>(candidateId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCandidateNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCandidateNoteUrl: (candidateId: string) => string;
/**
 * @summary Create a note for a candidate
 */
export declare const createCandidateNote: (candidateId: string, noteInput: NoteInput, options?: RequestInit) => Promise<Note>;
export declare const getCreateCandidateNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidateNote>>, TError, {
        candidateId: string;
        data: BodyType<NoteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCandidateNote>>, TError, {
    candidateId: string;
    data: BodyType<NoteInput>;
}, TContext>;
export type CreateCandidateNoteMutationResult = NonNullable<Awaited<ReturnType<typeof createCandidateNote>>>;
export type CreateCandidateNoteMutationBody = BodyType<NoteInput>;
export type CreateCandidateNoteMutationError = ErrorType<unknown>;
/**
 * @summary Create a note for a candidate
 */
export declare const useCreateCandidateNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCandidateNote>>, TError, {
        candidateId: string;
        data: BodyType<NoteInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCandidateNote>>, TError, {
    candidateId: string;
    data: BodyType<NoteInput>;
}, TContext>;
export declare const getUpdateNoteUrl: (id: string) => string;
/**
 * @summary Update a note
 */
export declare const updateNote: (id: string, noteUpdate: NoteUpdate, options?: RequestInit) => Promise<Note>;
export declare const getUpdateNoteMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
        id: string;
        data: BodyType<NoteUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
    id: string;
    data: BodyType<NoteUpdate>;
}, TContext>;
export type UpdateNoteMutationResult = NonNullable<Awaited<ReturnType<typeof updateNote>>>;
export type UpdateNoteMutationBody = BodyType<NoteUpdate>;
export type UpdateNoteMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update a note
 */
export declare const useUpdateNote: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateNote>>, TError, {
        id: string;
        data: BodyType<NoteUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateNote>>, TError, {
    id: string;
    data: BodyType<NoteUpdate>;
}, TContext>;
export declare const getDeleteNoteUrl: (id: string) => string;
/**
 * @summary Delete a note
 */
export declare const deleteNote: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
    id: string;
}, TContext>;
export type DeleteNoteMutationResult = NonNullable<Awaited<ReturnType<typeof deleteNote>>>;
export type DeleteNoteMutationError = ErrorType<unknown>;
/**
 * @summary Delete a note
 */
export declare const useDeleteNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNote>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteNote>>, TError, {
    id: string;
}, TContext>;
export declare const getGetDashboardUrl: () => string;
/**
 * @summary Get dashboard statistics
 */
export declare const getDashboard: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardQueryKey: () => readonly ["/api/dashboard"];
export declare const getGetDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
export type GetDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard statistics
 */
export declare function useGetDashboard<TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListActivityUrl: (params?: ListActivityParams) => string;
/**
 * @summary Get recent activity logs
 */
export declare const listActivity: (params?: ListActivityParams, options?: RequestInit) => Promise<ActivityLog[]>;
export declare const getListActivityQueryKey: (params?: ListActivityParams) => readonly ["/api/activity", ...ListActivityParams[]];
export declare const getListActivityQueryOptions: <TData = Awaited<ReturnType<typeof listActivity>>, TError = ErrorType<unknown>>(params?: ListActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListActivityQueryResult = NonNullable<Awaited<ReturnType<typeof listActivity>>>;
export type ListActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent activity logs
 */
export declare function useListActivity<TData = Awaited<ReturnType<typeof listActivity>>, TError = ErrorType<unknown>>(params?: ListActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetKanbanUrl: () => string;
/**
 * @summary Get all candidates grouped by status for Kanban view
 */
export declare const getKanban: (options?: RequestInit) => Promise<KanbanBoard>;
export declare const getGetKanbanQueryKey: () => readonly ["/api/kanban"];
export declare const getGetKanbanQueryOptions: <TData = Awaited<ReturnType<typeof getKanban>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKanban>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKanban>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKanbanQueryResult = NonNullable<Awaited<ReturnType<typeof getKanban>>>;
export type GetKanbanQueryError = ErrorType<unknown>;
/**
 * @summary Get all candidates grouped by status for Kanban view
 */
export declare function useGetKanban<TData = Awaited<ReturnType<typeof getKanban>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKanban>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map