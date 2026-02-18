import { api } from './client';
import type {
    Material,
    InventoryMovement,
    ApiResponse,
    PaginatedResponse,
    MovementType,
} from '@/types';

/** Inventory API service */
export const inventoryApi = {
    listMaterials: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
    }): Promise<PaginatedResponse<Material>> => {
        const { data } = await api.get<PaginatedResponse<Material>>('/materials', {
            params,
        });
        return data;
    },

    getMaterial: async (id: string): Promise<Material> => {
        const { data } = await api.get<ApiResponse<Material>>(`/materials/${id}`);
        return data.data;
    },

    createMaterial: async (payload: Partial<Material>): Promise<Material> => {
        const { data } = await api.post<ApiResponse<Material>>('/materials', payload);
        return data.data;
    },

    updateMaterial: async (
        id: string,
        payload: Partial<Material>
    ): Promise<Material> => {
        const { data } = await api.patch<ApiResponse<Material>>(
            `/materials/${id}`,
            payload
        );
        return data.data;
    },

    recordMovement: async (
        materialId: string,
        payload: {
            movement_type: MovementType;
            quantity: number;
            reference_job_id?: string;
            notes?: string;
        }
    ): Promise<InventoryMovement> => {
        const { data } = await api.post<ApiResponse<InventoryMovement>>(
            `/materials/${materialId}/movements`,
            payload
        );
        return data.data;
    },

    getMovements: async (
        materialId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PaginatedResponse<InventoryMovement>> => {
        const { data } = await api.get<PaginatedResponse<InventoryMovement>>(
            `/materials/${materialId}/movements`,
            { params }
        );
        return data;
    },

    getAlerts: async (): Promise<Material[]> => {
        const { data } = await api.get<ApiResponse<Material[]>>('/materials/alerts');
        return data.data;
    },
};
