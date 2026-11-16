import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  InvoiceResponse,
  CreateInvoiceRequest,
  PaymentResponse,
  RecordPaymentRequest,
  ExpenseResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@/types/api';

export const financeService = {
  // Invoices
  async getInvoicesByProject(projectId: string): Promise<InvoiceResponse[]> {
    const res = await apiClient.get<ApiResponse<InvoiceResponse[]>>(
      ENDPOINTS.INVOICES.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getInvoiceById(id: string): Promise<InvoiceResponse> {
    const res = await apiClient.get<ApiResponse<InvoiceResponse>>(ENDPOINTS.INVOICES.BY_ID(id));
    return res.data.data;
  },

  async createInvoice(data: CreateInvoiceRequest): Promise<InvoiceResponse> {
    const res = await apiClient.post<ApiResponse<InvoiceResponse>>(ENDPOINTS.INVOICES.BASE, data);
    return res.data.data;
  },

  async cancelInvoice(id: string): Promise<InvoiceResponse> {
    const res = await apiClient.patch<ApiResponse<InvoiceResponse>>(ENDPOINTS.INVOICES.CANCEL(id));
    return res.data.data;
  },

  async recordPayment(invoiceId: string, data: RecordPaymentRequest): Promise<PaymentResponse> {
    const res = await apiClient.post<ApiResponse<PaymentResponse>>(
      ENDPOINTS.INVOICES.PAYMENTS(invoiceId),
      data
    );
    return res.data.data;
  },

  // Expenses
  async getExpensesByProject(projectId: string): Promise<ExpenseResponse[]> {
    const res = await apiClient.get<ApiResponse<ExpenseResponse[]>>(
      ENDPOINTS.EXPENSES.BY_PROJECT(projectId)
    );
    return res.data.data;
  },

  async getExpenseById(id: string): Promise<ExpenseResponse> {
    const res = await apiClient.get<ApiResponse<ExpenseResponse>>(ENDPOINTS.EXPENSES.BY_ID(id));
    return res.data.data;
  },

  async createExpense(data: CreateExpenseRequest): Promise<ExpenseResponse> {
    const res = await apiClient.post<ApiResponse<ExpenseResponse>>(ENDPOINTS.EXPENSES.BASE, data);
    return res.data.data;
  },

  async updateExpense(id: string, data: UpdateExpenseRequest): Promise<ExpenseResponse> {
    const res = await apiClient.put<ApiResponse<ExpenseResponse>>(
      ENDPOINTS.EXPENSES.BY_ID(id),
      data
    );
    return res.data.data;
  },

  async approveExpense(id: string): Promise<ExpenseResponse> {
    const res = await apiClient.patch<ApiResponse<ExpenseResponse>>(ENDPOINTS.EXPENSES.APPROVE(id));
    return res.data.data;
  },

  async payExpense(id: string): Promise<ExpenseResponse> {
    const res = await apiClient.patch<ApiResponse<ExpenseResponse>>(ENDPOINTS.EXPENSES.PAY(id));
    return res.data.data;
  },
};

