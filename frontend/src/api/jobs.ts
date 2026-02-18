import { api } from './client';
import type {
    Job,
    JobNote,
    JobStatusHistory,
    ApiResponse,
    PaginatedResponse,
    JobStatus,
} from '@/types';

/** Jobs API service */
export const jobsApi = {
    list: async (params?: {
        page?: number;
        limit?: number;
        status?: JobStatus;
        search?: string;
    }): Promise<PaginatedResponse<Job>> => {
        const { data } = await api.get<PaginatedResponse<Job>>('/jobs', { params });
        return data;
    },

    getById: async (id: string): Promise<Job> => {
        const { data } = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
        return data.data;
    },

    create: async (payload: Partial<Job>): Promise<Job> => {
        const { data } = await api.post<ApiResponse<Job>>('/jobs', payload);
        return data.data;
    },

    update: async (id: string, payload: Partial<Job>): Promise<Job> => {
        const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}`, payload);
        return data.data;
    },

    updateStatus: async (
        id: string,
        status: JobStatus,
        notes?: string
    ): Promise<Job> => {
        const { data } = await api.patch<ApiResponse<Job>>(`/jobs/${id}/status`, {
            status,
            notes,
        });
        return data.data;
    },

    getHistory: async (id: string): Promise<JobStatusHistory[]> => {
        const { data } = await api.get<ApiResponse<JobStatusHistory[]>>(
            `/jobs/${id}/history`
        );
        return data.data;
    },

    addNote: async (id: string, content: string): Promise<JobNote> => {
        const { data } = await api.post<ApiResponse<JobNote>>(`/jobs/${id}/notes`, {
            content,
        });
        return data.data;
    },

    getNotes: async (id: string): Promise<JobNote[]> => {
        const { data } = await api.get<ApiResponse<JobNote[]>>(`/jobs/${id}/notes`);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/jobs/${id}`);
    },
};
