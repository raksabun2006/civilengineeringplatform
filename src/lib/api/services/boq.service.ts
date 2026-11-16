import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  EstimateResponse,
  CreateEstimateRequest,
  UpdateEstimateRequest,
} from '@/types/api';

export const boqService = {
  async getEstimatesByProject(projectId: string): Promise<EstimateResponse[]> {
    const res = await apiClient.get<ApiResponse<EstimateResponse[]>>(
      ENDPOINTS.ESTIMATES.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getEstimateById(id: string): Promise<EstimateResponse> {
    const res = await apiClient.get<ApiResponse<EstimateResponse>>(ENDPOINTS.ESTIMATES.BY_ID(id));
    return res.data.data;
  },

  async createEstimate(data: CreateEstimateRequest): Promise<EstimateResponse> {
    const res = await apiClient.post<ApiResponse<EstimateResponse>>(ENDPOINTS.ESTIMATES.BASE, data);
    return res.data.data;
  },

  async updateEstimate(id: string, data: UpdateEstimateRequest): Promise<EstimateResponse> {
    const res = await apiClient.put<ApiResponse<EstimateResponse>>(
      ENDPOINTS.ESTIMATES.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async approveEstimate(id: string): Promise<EstimateResponse> {
    const res = await apiClient.patch<ApiResponse<EstimateResponse>>(
      ENDPOINTS.ESTIMATES.APPROVE(id)
    );
    return res.data.data;
  },
};

