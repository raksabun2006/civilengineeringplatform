import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  ClientResponse,
  CreateClientRequest,
  UpdateClientRequest,
} from '@/types/api';

export const clientService = {
  async getClients(params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: string;
    status?: string;
  }): Promise<PagedResponse<ClientResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<ClientResponse>>>(
      ENDPOINTS.CLIENTS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getClientById(id: string): Promise<ClientResponse> {
    const res = await apiClient.get<ApiResponse<ClientResponse>>(ENDPOINTS.CLIENTS.BY_ID(id));
    return res.data.data;
  },

  async createClient(data: CreateClientRequest): Promise<ClientResponse> {
    const res = await apiClient.post<ApiResponse<ClientResponse>>(ENDPOINTS.CLIENTS.BASE, data);
    return res.data.data;
  },

  async updateClient(id: string, data: UpdateClientRequest): Promise<ClientResponse> {
    const res = await apiClient.put<ApiResponse<ClientResponse>>(
      ENDPOINTS.CLIENTS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.CLIENTS.BY_ID(id));
  },
};

