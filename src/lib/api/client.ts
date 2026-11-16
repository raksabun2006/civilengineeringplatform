import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, AuthResponse } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('engineerbiz_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('engineerbiz_refresh_token');
      if (!refreshToken || originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        // Clear auth and let the app handle redirection
        localStorage.removeItem('engineerbiz_access_token');
        localStorage.removeItem('engineerbiz_refresh_token');
        localStorage.removeItem('engineerbiz_user');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<ApiResponse<AuthResponse>>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        if (refreshResponse.data?.data?.accessToken) {
          const newAccess = refreshResponse.data.data.accessToken;
          const newRefresh = refreshResponse.data.data.refreshToken;
          localStorage.setItem('engineerbiz_access_token', newAccess);
          if (newRefresh) {
            localStorage.setItem('engineerbiz_refresh_token', newRefresh);
          }
          if (refreshResponse.data.data.user) {
            localStorage.setItem('engineerbiz_user', JSON.stringify(refreshResponse.data.data.user));
          }

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

          processQueue(null);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr as Error);
        localStorage.removeItem('engineerbiz_access_token');
        localStorage.removeItem('engineerbiz_refresh_token');
        localStorage.removeItem('engineerbiz_user');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiRes = error.response?.data as ApiResponse<unknown> | undefined;
    if (apiRes?.message) {
      return apiRes.message;
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response?.status === 409) {
      return 'Resource conflict or duplicate code/record detected.';
    }
    if (error.response?.status === 500) {
      return 'Internal server error occurred on the backend.';
    }
    return error.message || 'Network request failed';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

