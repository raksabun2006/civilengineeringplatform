import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  ContractResponse,
  CreateContractRequest,
  UpdateContractRequest,
  ContractAmendmentResponse,
  CreateAmendmentRequest,
} from '@/types/api';

export const contractService = {
  async getContractsByProject(projectId: string): Promise<ContractResponse[]> {
    const res = await apiClient.get<ApiResponse<ContractResponse[]>>(
      ENDPOINTS.CONTRACTS.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getContractById(id: string): Promise<ContractResponse> {
    const res = await apiClient.get<ApiResponse<ContractResponse>>(ENDPOINTS.CONTRACTS.BY_ID(id));
    return res.data.data;
  },

  async createContract(data: CreateContractRequest): Promise<ContractResponse> {
    const res = await apiClient.post<ApiResponse<ContractResponse>>(ENDPOINTS.CONTRACTS.BASE, data);
    return res.data.data;
  },

  async updateContract(id: string, data: UpdateContractRequest): Promise<ContractResponse> {
    const res = await apiClient.put<ApiResponse<ContractResponse>>(
      ENDPOINTS.CONTRACTS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async addAmendment(
    contractId: string,
    data: CreateAmendmentRequest
  ): Promise<ContractAmendmentResponse> {
    const res = await apiClient.post<ApiResponse<ContractAmendmentResponse>>(
      ENDPOINTS.CONTRACTS.AMENDMENTS(contractId),
      data
    );
    return res.data.data;
  },

  async approveAmendment(
    contractId: string,
    amendmentId: string
  ): Promise<ContractAmendmentResponse> {
    const res = await apiClient.patch<ApiResponse<ContractAmendmentResponse>>(
      ENDPOINTS.CONTRACTS.APPROVE_AMENDMENT(contractId, amendmentId)
    );
    return res.data.data;
  },
};

