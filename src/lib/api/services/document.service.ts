import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  DocumentResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  NotificationResponse,
  CompanyProfileResponse,
  CompanyProfileRequest,
} from '@/types/api';

export const documentService = {
  async getDocuments(params?: {
    page?: number;
    size?: number;
    category?: string;
  }): Promise<PagedResponse<DocumentResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<DocumentResponse>>>(
      ENDPOINTS.DOCUMENTS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getDocumentsByProject(projectId: string): Promise<DocumentResponse[]> {
    const res = await apiClient.get<ApiResponse<DocumentResponse[]>>(
      ENDPOINTS.DOCUMENTS.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getDocumentById(id: string): Promise<DocumentResponse> {
    const res = await apiClient.get<ApiResponse<DocumentResponse>>(ENDPOINTS.DOCUMENTS.BY_ID(id));
    return res.data.data;
  },

  async createDocument(data: CreateDocumentRequest): Promise<DocumentResponse> {
    const res = await apiClient.post<ApiResponse<DocumentResponse>>(ENDPOINTS.DOCUMENTS.BASE, data);
    return res.data.data;
  },

  async updateDocument(id: string, data: UpdateDocumentRequest): Promise<DocumentResponse> {
    const res = await apiClient.put<ApiResponse<DocumentResponse>>(
      ENDPOINTS.DOCUMENTS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.DOCUMENTS.BY_ID(id));
  },
};

export const notificationService = {
  async getNotifications(params?: {
    page?: number;
    size?: number;
  }): Promise<PagedResponse<NotificationResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<NotificationResponse>>>(
      ENDPOINTS.NOTIFICATIONS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<ApiResponse<number>>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return res.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },
};

export const companyService = {
  async getProfile(): Promise<CompanyProfileResponse> {
    const res = await apiClient.get<ApiResponse<CompanyProfileResponse>>(ENDPOINTS.COMPANY.BASE);
    return res.data.data;
  },

  async updateProfile(data: CompanyProfileRequest): Promise<CompanyProfileResponse> {
    const res = await apiClient.post<ApiResponse<CompanyProfileResponse>>(
      ENDPOINTS.COMPANY.BASE,
      data
    );
    return res.data.data;
  },
};

