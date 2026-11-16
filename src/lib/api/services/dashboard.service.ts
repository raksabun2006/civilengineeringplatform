import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse, DashboardSummaryResponse } from '@/types/api';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryResponse> {
    const res = await apiClient.get<ApiResponse<DashboardSummaryResponse>>(ENDPOINTS.DASHBOARD.SUMMARY);
    return res.data.data;
  },
};

