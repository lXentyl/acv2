import { api } from './client';
import type {
    LoginCredentials,
    RegisterPayload,
    AuthTokens,
    User,
    ApiResponse,
} from '@/types';

/** Auth API service */
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
        const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/login', credentials);
        return data.data;
    },

    register: async (payload: RegisterPayload): Promise<AuthTokens> => {
        const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/register', payload);
        return data.data;
    },

    refresh: async (refreshToken: string): Promise<AuthTokens> => {
        const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return data.data;
    },

    getProfile: async (): Promise<User> => {
        const { data } = await api.get<ApiResponse<User>>('/auth/profile');
        return data.data;
    },
};
