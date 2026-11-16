import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  MaterialResponse,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  EquipmentResponse,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  AssignEquipmentRequest,
  ReturnEquipmentRequest,
  InventoryMovementResponse,
  RecordMovementRequest,
  EquipmentStatus,
} from '@/types/api';

export const inventoryService = {
  // Materials
  async getMaterials(params?: {
    page?: number;
    size?: number;
    search?: string;
    lowStockOnly?: boolean;
  }): Promise<PagedResponse<MaterialResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<MaterialResponse>>>(
      ENDPOINTS.MATERIALS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getMaterialById(id: string): Promise<MaterialResponse> {
    const res = await apiClient.get<ApiResponse<MaterialResponse>>(ENDPOINTS.MATERIALS.BY_ID(id));
    return res.data.data;
  },

  async createMaterial(data: CreateMaterialRequest): Promise<MaterialResponse> {
    const res = await apiClient.post<ApiResponse<MaterialResponse>>(ENDPOINTS.MATERIALS.BASE, data);
    return res.data.data;
  },

  async updateMaterial(id: string, data: UpdateMaterialRequest): Promise<MaterialResponse> {
    const res = await apiClient.put<ApiResponse<MaterialResponse>>(
      ENDPOINTS.MATERIALS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async deleteMaterial(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.MATERIALS.BY_ID(id));
  },

  // Equipment
  async getEquipment(params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<PagedResponse<EquipmentResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<EquipmentResponse>>>(
      ENDPOINTS.EQUIPMENT.BASE,
      { params }
    );
    return res.data.data;
  },

  async getEquipmentByStatus(status: EquipmentStatus): Promise<EquipmentResponse[]> {
    const res = await apiClient.get<ApiResponse<EquipmentResponse[]>>(
      ENDPOINTS.EQUIPMENT.BY_STATUS,
      { params: { status } }
    );
    return res.data.data;
  },

  async getEquipmentById(id: string): Promise<EquipmentResponse> {
    const res = await apiClient.get<ApiResponse<EquipmentResponse>>(ENDPOINTS.EQUIPMENT.BY_ID(id));
    return res.data.data;
  },

  async createEquipment(data: CreateEquipmentRequest): Promise<EquipmentResponse> {
    const res = await apiClient.post<ApiResponse<EquipmentResponse>>(ENDPOINTS.EQUIPMENT.BASE, data);
    return res.data.data;
  },

  async updateEquipment(id: string, data: UpdateEquipmentRequest): Promise<EquipmentResponse> {
    const res = await apiClient.put<ApiResponse<EquipmentResponse>>(
      ENDPOINTS.EQUIPMENT.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async deleteEquipment(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.EQUIPMENT.BY_ID(id));
  },

  async assignEquipment(id: string, data: AssignEquipmentRequest): Promise<EquipmentResponse> {
    const res = await apiClient.post<ApiResponse<EquipmentResponse>>(
      ENDPOINTS.EQUIPMENT.ASSIGN(id),
      data
    );
    return res.data.data;
  },

  async returnEquipment(id: string, data: ReturnEquipmentRequest): Promise<EquipmentResponse> {
    const res = await apiClient.post<ApiResponse<EquipmentResponse>>(
      ENDPOINTS.EQUIPMENT.RETURN(id),
      data
    );
    return res.data.data;
  },

  // Movements
  async getMovementsByMaterial(materialId: string): Promise<InventoryMovementResponse[]> {
    const res = await apiClient.get<ApiResponse<InventoryMovementResponse[]>>(
      ENDPOINTS.MOVEMENTS.BY_MATERIAL(materialId)
    );
    return res.data.data;
  },

  async getMovementsByProject(projectId: string): Promise<InventoryMovementResponse[]> {
    const res = await apiClient.get<ApiResponse<InventoryMovementResponse[]>>(
      ENDPOINTS.MOVEMENTS.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async recordMovement(data: RecordMovementRequest): Promise<InventoryMovementResponse> {
    const res = await apiClient.post<ApiResponse<InventoryMovementResponse>>(
      ENDPOINTS.MOVEMENTS.BASE,
      data
    );
    return res.data.data;
  },
};

