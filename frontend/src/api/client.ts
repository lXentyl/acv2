import axios from 'axios';
import type { AuthTokens } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Axios instance with auth interceptors */
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach JWT access token
api.interceptors.request.use((config) => {
    const tokens = getStoredTokens();
    if (tokens?.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    // Attach tenant ID from stored context
    const tenantId = localStorage.getItem('acv2_tenant_id');
    if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
    }
    return config;
});

// Response interceptor: handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokens = getStoredTokens();
                if (!tokens?.refresh_token) {
                    clearTokens();
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }

                const { data } = await axios.post<AuthTokens>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh_token: tokens.refresh_token }
                );

                storeTokens(data);
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);
            } catch {
                clearTokens();
                window.location.href = '/auth/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Token storage helpers
export function storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('acv2_tokens', JSON.stringify(tokens));
}

export function getStoredTokens(): AuthTokens | null {
    const raw = localStorage.getItem('acv2_tokens');
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthTokens;
    } catch {
        return null;
    }
}

export function clearTokens(): void {
    localStorage.removeItem('acv2_tokens');
    localStorage.removeItem('acv2_tenant_id');
}
