export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
  },
  SERVICES: {
    BASE: '/engineering-services',
    ACTIVE: '/engineering-services/active',
    BY_ID: (id: string) => `/engineering-services/${id}`,
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    STATUS: (id: string) => `/projects/${id}/status`,
    STATUS_HISTORY: (id: string) => `/projects/${id}/status-history`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    MEMBER_BY_ID: (id: string, memberId: string) => `/projects/${id}/members/${memberId}`,
    PROGRESS: (id: string) => `/projects/${id}/progress`,
  },
  ESTIMATES: {
    BASE: '/estimates',
    BY_ID: (id: string) => `/estimates/${id}`,
    BY_PROJECT: (projectId: string) => `/estimates/project/${projectId}`,
    APPROVE: (id: string) => `/estimates/${id}/approve`,
  },
  QUOTATIONS: {
    BASE: '/quotations',
    BY_ID: (id: string) => `/quotations/${id}`,
    BY_PROJECT: (projectId: string) => `/quotations/project/${projectId}`,
    STATUS: (id: string) => `/quotations/${id}/status`,
  },
  CONTRACTS: {
    BASE: '/contracts',
    BY_ID: (id: string) => `/contracts/${id}`,
    BY_PROJECT: (projectId: string) => `/contracts/project/${projectId}`,
    AMENDMENTS: (id: string) => `/contracts/${id}/amendments`,
    APPROVE_AMENDMENT: (contractId: string, amendmentId: string) =>
      `/contracts/${contractId}/amendments/${amendmentId}/approve`,
  },
  INVOICES: {
    BASE: '/invoices',
    BY_ID: (id: string) => `/invoices/${id}`,
    BY_PROJECT: (projectId: string) => `/invoices/project/${projectId}`,
    CANCEL: (id: string) => `/invoices/${id}/cancel`,
    PAYMENTS: (id: string) => `/invoices/${id}/payments`,
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id: string) => `/expenses/${id}`,
    BY_PROJECT: (projectId: string) => `/expenses/project/${projectId}`,
    APPROVE: (id: string) => `/expenses/${id}/approve`,
    PAY: (id: string) => `/expenses/${id}/pay`,
  },
  MATERIALS: {
    BASE: '/materials',
    BY_ID: (id: string) => `/materials/${id}`,
  },
  EQUIPMENT: {
    BASE: '/equipment',
    BY_ID: (id: string) => `/equipment/${id}`,
    BY_STATUS: '/equipment/status',
    ASSIGN: (id: string) => `/equipment/${id}/assign`,
    RETURN: (id: string) => `/equipment/${id}/return`,
  },
  MOVEMENTS: {
    BASE: '/inventory/movements',
    BY_MATERIAL: (materialId: string) => `/inventory/movements/material/${materialId}`,
    BY_PROJECT: (projectId: string) => `/inventory/movements/project/${projectId}`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PERMISSIONS: '/users/permissions',
    ROLE: (id: string) => `/users/${id}/role`,
    STATUS: (id: string) => `/users/${id}/status`,
  },
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
    BY_PROJECT: (projectId: string) => `/documents/project/${projectId}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    READ_ALL: '/notifications/read-all',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
  COMPANY: {
    BASE: '/company',
  },
  AUDIT_LOGS: {
    BASE: '/audit-logs',
  },
};

