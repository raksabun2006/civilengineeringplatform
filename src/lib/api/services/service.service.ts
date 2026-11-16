import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  EngineeringServiceResponse,
  CreateEngineeringServiceRequest,
  UpdateEngineeringServiceRequest,
} from '@/types/api';

export const engineeringServiceApi = {
  async getServices(params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    activeOnly?: boolean;
  }): Promise<PagedResponse<EngineeringServiceResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<EngineeringServiceResponse>>>(
      ENDPOINTS.SERVICES.BASE,
      { params }
    );
    return res.data.data;
  },

  async getActiveServices(): Promise<EngineeringServiceResponse[]> {
    const res = await apiClient.get<ApiResponse<EngineeringServiceResponse[]>>(
      ENDPOINTS.SERVICES.ACTIVE
    );
    return res.data.data;
  },

  async getServiceById(id: string): Promise<EngineeringServiceResponse> {
    const res = await apiClient.get<ApiResponse<EngineeringServiceResponse>>(
      ENDPOINTS.SERVICES.BY_ID(id)
    );
    return res.data.data;
  },

  async createService(
    data: CreateEngineeringServiceRequest
  ): Promise<EngineeringServiceResponse> {
    const res = await apiClient.post<ApiResponse<EngineeringServiceResponse>>(
      ENDPOINTS.SERVICES.BASE,
      data
    );
    return res.data.data;
  },

  async updateService(
    id: string,
    data: UpdateEngineeringServiceRequest
  ): Promise<EngineeringServiceResponse> {
    const res = await apiClient.put<ApiResponse<EngineeringServiceResponse>>(
      ENDPOINTS.SERVICES.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.SERVICES.BY_ID(id));
  },
};

