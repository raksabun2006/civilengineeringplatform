import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse, AuthResponse, UserResponse } from '@/types/api';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await apiClient.get<ApiResponse<UserResponse>>(ENDPOINTS.AUTH.ME);
    return res.data.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return res.data.data;
  },
};

