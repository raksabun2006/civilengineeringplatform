import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PermissionResponse,
  UserRole,
  UserStatus,
} from '@/types/api';

export const userService = {
  async getUsers(params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<PagedResponse<UserResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<UserResponse>>>(
      ENDPOINTS.USERS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getUserById(id: string): Promise<UserResponse> {
    const res = await apiClient.get<ApiResponse<UserResponse>>(ENDPOINTS.USERS.BY_ID(id));
    return res.data.data;
  },

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const res = await apiClient.post<ApiResponse<UserResponse>>(ENDPOINTS.USERS.BASE, data);
    return res.data.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    const res = await apiClient.put<ApiResponse<UserResponse>>(ENDPOINTS.USERS.BY_ID(id), data);
    return res.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.BY_ID(id));
  },

  async getPermissions(): Promise<PermissionResponse[]> {
    const res = await apiClient.get<ApiResponse<PermissionResponse[]>>(
      ENDPOINTS.USERS.PERMISSIONS
    );
    return res.data.data;
  },

  async updateUserRole(id: string, role: UserRole): Promise<UserResponse> {
    const res = await apiClient.patch<ApiResponse<UserResponse>>(ENDPOINTS.USERS.ROLE(id), { role });
    return res.data.data;
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<UserResponse> {
    const res = await apiClient.patch<ApiResponse<UserResponse>>(
      ENDPOINTS.USERS.STATUS(id),
      { status }
    );
    return res.data.data;
  },
};

