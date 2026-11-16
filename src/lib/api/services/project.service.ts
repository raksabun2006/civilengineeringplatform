import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PagedResponse,
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMemberResponse,
  AddProjectMemberRequest,
  ProjectProgressResponse,
  RecordProgressRequest,
  ProjectStatusHistoryResponse,
  ProjectStatus,
} from '@/types/api';

export const projectService = {
  async getProjects(params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    clientId?: string;
  }): Promise<PagedResponse<ProjectResponse>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<ProjectResponse>>>(
      ENDPOINTS.PROJECTS.BASE,
      { params }
    );
    return res.data.data;
  },

  async getProjectById(id: string): Promise<ProjectResponse> {
    const res = await apiClient.get<ApiResponse<ProjectResponse>>(ENDPOINTS.PROJECTS.BY_ID(id));
    return res.data.data;
  },

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    const res = await apiClient.post<ApiResponse<ProjectResponse>>(ENDPOINTS.PROJECTS.BASE, data);
    return res.data.data;
  },

  async updateProject(id: string, data: UpdateProjectRequest): Promise<ProjectResponse> {
    const res = await apiClient.put<ApiResponse<ProjectResponse>>(
      ENDPOINTS.PROJECTS.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async updateProjectStatus(
    id: string,
    data: { newStatus: ProjectStatus; remarks?: string }
  ): Promise<ProjectResponse> {
    const res = await apiClient.patch<ApiResponse<ProjectResponse>>(
      ENDPOINTS.PROJECTS.STATUS(id),
      data
    );
    return res.data.data;
  },

  async getStatusHistory(id: string): Promise<ProjectStatusHistoryResponse[]> {
    const res = await apiClient.get<ApiResponse<ProjectStatusHistoryResponse[]>>(
      ENDPOINTS.PROJECTS.STATUS_HISTORY(id)
    );
    return res.data.data;
  },

  async getMembers(id: string): Promise<ProjectMemberResponse[]> {
    const res = await apiClient.get<ApiResponse<ProjectMemberResponse[]>>(
      ENDPOINTS.PROJECTS.MEMBERS(id)
    );
    return res.data.data;
  },

  async addMember(id: string, data: AddProjectMemberRequest): Promise<ProjectMemberResponse> {
    const res = await apiClient.post<ApiResponse<ProjectMemberResponse>>(
      ENDPOINTS.PROJECTS.MEMBERS(id),
      data
    );
    return res.data.data;
  },

  async removeMember(id: string, memberId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.PROJECTS.MEMBER_BY_ID(id, memberId));
  },

  async getProgressHistory(id: string): Promise<ProjectProgressResponse[]> {
    const res = await apiClient.get<ApiResponse<ProjectProgressResponse[]>>(
      ENDPOINTS.PROJECTS.PROGRESS(id)
    );
    return res.data.data;
  },

  async recordProgress(
    id: string,
    data: RecordProgressRequest
  ): Promise<ProjectProgressResponse> {
    const res = await apiClient.post<ApiResponse<ProjectProgressResponse>>(
      ENDPOINTS.PROJECTS.PROGRESS(id),
      data
    );
    return res.data.data;
  },
};

