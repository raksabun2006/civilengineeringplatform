import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  QuotationResponse,
  CreateQuotationRequest,
  UpdateQuotationRequest,
  QuotationStatus,
} from '@/types/api';

export const quotationService = {
  async getQuotationsByProject(projectId: string): Promise<QuotationResponse[]> {
    const res = await apiClient.get<ApiResponse<QuotationResponse[]>>(
      ENDPOINTS.QUOTATIONS.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getQuotationById(id: string): Promise<QuotationResponse> {
    const res = await apiClient.get<ApiResponse<QuotationResponse>>(ENDPOINTS.QUOTATIONS.BY_ID(id));
    return res.data.data;
  },

  async createQuotation(data: CreateQuotationRequest): Promise<QuotationResponse> {
    const res = await apiClient.post<ApiResponse<QuotationResponse>>(ENDPOINTS.QUOTATIONS.BASE, data);
    return res.data.data;
  },

  async updateQuotation(id: string, data: UpdateQuotationRequest): Promise<QuotationResponse> {
    const res = await apiClient.put<ApiResponse<QuotationResponse>>(
      ENDPOINTS.QUOTATIONS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async updateStatus(id: string, status: QuotationStatus): Promise<QuotationResponse> {
    const res = await apiClient.patch<ApiResponse<QuotationResponse>>(
      ENDPOINTS.QUOTATIONS.STATUS(id),
      { status }
    );
    return res.data.data;
  },
};

