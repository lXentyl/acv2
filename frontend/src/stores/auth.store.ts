import { create } from 'zustand';
import type { User, Tenant } from '@/types';
import { authApi } from '@/api/auth';
import { storeTokens, clearTokens, getStoredTokens } from '@/api/client';

interface AuthState {
    user: User | null;
    tenant: Tenant | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (payload: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        tenant_name?: string;
    }) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    tenant: null,
    isAuthenticated: !!getStoredTokens(),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const tokens = await authApi.login({ email, password });
            storeTokens(tokens);
            const user = await authApi.getProfile();
            localStorage.setItem('acv2_tenant_id', user.tenant_id);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Error al iniciar sesión';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const tokens = await authApi.register(payload);
            storeTokens(tokens);
            const user = await authApi.getProfile();
            localStorage.setItem('acv2_tenant_id', user.tenant_id);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Error al registrarse';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    logout: () => {
        clearTokens();
        set({ user: null, tenant: null, isAuthenticated: false });
        window.location.href = '/auth/login';
    },

    loadUser: async () => {
        const tokens = getStoredTokens();
        if (!tokens) {
            set({ isAuthenticated: false });
            return;
        }
        set({ isLoading: true });
        try {
            const user = await authApi.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch {
            clearTokens();
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
