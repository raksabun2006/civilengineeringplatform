'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  RefreshCw,
  FolderGit2,
  DollarSign,
  CreditCard,
  QrCode,
  FileText,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { exportInvoiceToExcel } from '@/lib/export/export-utils';
import { useLanguage } from '@/lib/i18n/language-context';
import { financeService } from '@/lib/api/services/finance.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  InvoiceResponse,
  InvoiceStatus,
  InvoiceType,
  PaymentMethod,
  CreateInvoiceRequest,
  RecordPaymentRequest,
  ExpenseResponse,
  ExpenseStatus,
  ExpenseCategory,
  CreateExpenseRequest,
  ProjectResponse,
} from '@/types/api';
import { getErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

export default function FinancePage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Invoices & Expenses state
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [invoiceCreateOpen, setInvoiceCreateOpen] = useState(false);
  const [invoiceViewOpen, setInvoiceViewOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponse | null>(null);

  const [expenseCreateOpen, setExpenseCreateOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);

  // Invoice Form
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('PROGRESS_CLAIM');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [invoiceItems, setInvoiceItems] = useState([
    { description: 'Foundation Stage Milestone 1 (30%)', amount: 35000 },
  ]);

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BAKONG_KHQR');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Expense Form
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('RAW_MATERIALS');
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    projectService
      .getProjects({ page: 0, size: 50 })
      .then((res) => {
        const list = res?.content || [];
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        }
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const fetchFinanceData = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const [inv, exp] = await Promise.all([
        financeService.getInvoicesByProject(selectedProjectId),
        financeService.getExpensesByProject(selectedProjectId),
      ]);
      setInvoices(inv || []);
      setExpenses(exp || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  // Handle Invoice Creation
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await financeService.createInvoice({
        projectId: selectedProjectId,
        invoiceType,
        issueDate,
        dueDate,
        currency: 'USD',
        items: invoiceItems.map((i, index) => ({
          itemCode: `INV-ITEM-${index + 1}`,
          description: i.description,
          unitOfMeasure: 'LS',
          quantity: 1,
          unitPrice: Number(i.amount),
          displayOrder: index + 1,
        })),
      });
      setInvoiceCreateOpen(false);
      fetchFinanceData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Record Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setFormLoading(true);
    try {
      await financeService.recordPayment(selectedInvoice.id, {
        amount: Number(paymentAmount),
        paymentDate: new Date().toISOString().split('T')[0],
        currency: 'USD',
        paymentMethod,
        bankTransactionRef: paymentRef,
        notes: paymentNotes,
      });
      setPaymentOpen(false);
      const updated = await financeService.getInvoiceById(selectedInvoice.id);
      setSelectedInvoice(updated);
      fetchFinanceData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Create Expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await financeService.createExpense({
        projectId: selectedProjectId,
        title: expenseDesc || expenseCategory.replace('_', ' '),
        category: expenseCategory,
        amount: Number(expenseAmount),
        expenseDate: new Date().toISOString().split('T')[0],
        description: expenseDesc,
        vendorName,
        receiptNumber,
      });
      setExpenseCreateOpen(false);
      fetchFinanceData();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Approve Expense
  const handleApproveExpense = async (id: string) => {
    try {
      await financeService.approveExpense(id);
      fetchFinanceData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // Pay Expense
  const handlePayExpense = async (id: string) => {
    try {
      await financeService.payExpense(id);
      fetchFinanceData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const openViewInvoice = async (inv: InvoiceResponse) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balanceDue || 0);
    setInvoiceViewOpen(true);
    try {
      const full = await financeService.getInvoiceById(inv.id);
      setSelectedInvoice(full);
      setPaymentAmount(full.balanceDue || 0);
    } catch {
      // Ignored
    }
  };

  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Paid</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning">Partially Paid</Badge>;
      case 'ISSUED':
        return <Badge variant="purple">Issued</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getExpenseStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'REIMBURSED':
        return <Badge variant="success">Paid</Badge>;
      case 'APPROVED_BY_PM':
        return <Badge variant="purple">Approved</Badge>;
      case 'SUBMITTED':
        return <Badge variant="warning">Submitted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const expenseCategories: ExpenseCategory[] = [
    'RAW_MATERIALS',
    'EQUIPMENT_RENTAL',
    'SUBCONTRACTOR_WORK',
    'SITE_LABOR_WAGES',
    'PERMITS_LICENSES',
    'SITE_OFFICE_UTILITIES',
    'TRANSPORTATION',
    'CONSULTANT_FEES',
    'MISCELLANEOUS',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="h-6 w-6 text-blue-600" />
            <span>{t.finance.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.finance.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFinanceData}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-10 px-3 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t.common.refresh}
          </Button>

          {activeTab === 'invoices' ? (
            <Button
              size="sm"
              onClick={() => setInvoiceCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              {t.finance.newInvoice}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setExpenseCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              {t.finance.newExpense}
            </Button>
          )}
        </div>
      </div>

      {/* Project Selector Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <FolderGit2 className="h-4 w-4 text-blue-600" />
            <span>{language === 'km' ? 'ជ្រើសរើសគម្រោងដើម្បីពិនិត្យហិរញ្ញវត្ថុ:' : 'Select Project:'}</span>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none flex-1 w-full"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} – {p.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Navigation Tabs (Invoices vs Expenses) */}
      <div className="flex border-b border-slate-200 gap-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'invoices'
              ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          {t.finance.invoices} ({invoices.length})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'expenses'
              ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" />
          {t.finance.expenses} ({expenses.length})
        </button>
      </div>

      {/* INVOICES TAB CONTENT */}
      {activeTab === 'invoices' && (
        <Card className="border-slate-200/80 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-red-500">{error}</div>
          ) : invoices.length === 0 ? (
            <EmptyState
              title={t.common.noData}
              description="No invoices issued for this project."
              actionLabel={t.finance.newInvoice}
              onAction={() => setInvoiceCreateOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.finance.invoiceNumber}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{t.common.amount}</TableHead>
                  <TableHead>{t.finance.paidAmount}</TableHead>
                  <TableHead>{t.finance.balanceDue}</TableHead>
                  <TableHead>{t.finance.dueDate}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">
                      {(inv.type || inv.invoiceType || 'PROGRESS_CLAIM').replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-emerald-600 font-medium">
                      {formatCurrency(inv.paidAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-orange-600 font-bold">
                      {formatCurrency(inv.balanceDue)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDate(inv.dueDate)}</TableCell>
                    <TableCell>{getInvoiceStatusBadge(inv.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => openViewInvoice(inv)}
                        title={t.common.view}
                      >
                        <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* EXPENSES TAB CONTENT */}
      {activeTab === 'expenses' && (
        <Card className="border-slate-200/80 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-red-500">{error}</div>
          ) : expenses.length === 0 ? (
            <EmptyState
              title={t.common.noData}
              description="No expense claims logged for this project."
              actionLabel={t.finance.newExpense}
              onAction={() => setExpenseCreateOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>{t.finance.expenseCategory}</TableHead>
                  <TableHead>{t.common.description}</TableHead>
                  <TableHead>{t.finance.vendor}</TableHead>
                  <TableHead>{t.common.amount}</TableHead>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {exp.expenseCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple" className="text-[10px]">
                        {exp.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-800 font-medium">
                      {exp.description}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{exp.vendorName || '-'}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
                      {formatCurrency(exp.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{formatDate(exp.expenseDate)}</TableCell>
                    <TableCell>{getExpenseStatusBadge(exp.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {exp.status === 'SUBMITTED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveExpense(exp.id)}
                            className="h-7 text-[11px] text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {t.finance.approveExpense}
                          </Button>
                        )}
                        {exp.status === 'APPROVED_BY_PM' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayExpense(exp.id)}
                            className="h-7 text-[11px] bg-blue-600 text-white"
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            {t.finance.payExpense}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* CREATE INVOICE MODAL */}
      <Dialog open={invoiceCreateOpen} onOpenChange={setInvoiceCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.finance.newInvoice}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">Invoice Type *</label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="ADVANCE_PAYMENT">ADVANCE_PAYMENT</option>
                  <option value="PROGRESS_CLAIM">PROGRESS_CLAIM</option>
                  <option value="RETENTION_RELEASE">RETENTION_RELEASE</option>
                  <option value="FINAL_SETTLEMENT">FINAL_SETTLEMENT</option>
                  <option value="VARIATION_CLAIM">VARIATION_CLAIM</option>
                </select>
              </div>

              <Input
                label="Issue Date"
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />

              <Input
                label={t.finance.dueDate}
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Line Item */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-800">Invoice Line Item</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    label="Description"
                    required
                    value={invoiceItems[0].description}
                    onChange={(e) =>
                      setInvoiceItems([{ ...invoiceItems[0], description: e.target.value }])
                    }
                  />
                </div>
                <div>
                  <Input
                    label="Amount ($)"
                    type="number"
                    step="0.01"
                    required
                    value={invoiceItems[0].amount}
                    onChange={(e) =>
                      setInvoiceItems([
                        { ...invoiceItems[0], amount: parseFloat(e.target.value) || 0 },
                      ])
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInvoiceCreateOpen(false)}
                disabled={formLoading}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW INVOICE & RECORD PAYMENT MODAL */}
      <Dialog open={invoiceViewOpen} onOpenChange={setInvoiceViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>{selectedInvoice?.invoiceNumber}</span>
              {selectedInvoice && getInvoiceStatusBadge(selectedInvoice.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.common.total}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.finance.paidAmount}</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {formatCurrency(selectedInvoice.paidAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.finance.balanceDue}</span>
                  <span className="font-bold text-orange-600 text-sm">
                    {formatCurrency(selectedInvoice.balanceDue)}
                  </span>
                </div>
              </div>

              {/* Payments History */}
              <div className="border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">
                    Payment Receipts ({selectedInvoice.payments?.length || 0})
                  </span>
                  {selectedInvoice.balanceDue > 0 && (
                    <Button
                      size="sm"
                      onClick={() => setPaymentOpen(true)}
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    >
                      <CreditCard className="h-3 w-3" />
                      {t.finance.recordPayment}
                    </Button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {!selectedInvoice.payments || selectedInvoice.payments.length === 0 ? (
                    <p className="text-center py-3 text-slate-400">No payments recorded yet.</p>
                  ) : (
                    selectedInvoice.payments.map((p) => (
                      <div key={p.id} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {formatCurrency(p.amount)} via {p.paymentMethod}
                          </span>
                          <span className="text-[10px] text-slate-400">Ref: {p.paymentReference}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{formatDate(p.paymentDate)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedInvoice && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportInvoiceToExcel(selectedInvoice)}
                  className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span>Export Excel (.csv)</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                <Printer className="h-4 w-4 text-blue-600" />
                <span>Print / PDF</span>
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setInvoiceViewOpen(false)} className="text-xs">
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECORD PAYMENT MODAL (WITH BAKONG KHQR / BANK / CASH) */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.finance.recordPayment}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRecordPayment} className="space-y-4">
            <Input
              label="Payment Amount ($)"
              type="number"
              step="0.01"
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">
                {t.finance.paymentMethod} *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="BAKONG_KHQR">Bakong KHQR</option>
                <option value="BANK_TRANSFER">Bank Transfer (ABA / Canadia)</option>
                <option value="CASH">Cash Payment</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>

            <Input
              label={t.finance.paymentRef}
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="e.g. TXN-9988231 or Bank Slip #"
            />

            <Input
              label={t.common.notes}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Remarks..."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {formLoading ? t.common.loading : t.common.confirm}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE EXPENSE MODAL */}
      <Dialog open={expenseCreateOpen} onOpenChange={setExpenseCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.finance.newExpense}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreateExpense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.finance.expenseCategory} *
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {expenseCategories.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.common.amount + ' ($)'}
                type="number"
                step="0.01"
                required
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
              />

              <Input
                label={t.finance.vendor}
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. Chip Mong Concrete"
              />

              <Input
                label={t.finance.receiptNumber}
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="e.g. REC-10293"
              />
            </div>

            <Input
              label={t.common.description}
              required
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              placeholder="e.g. Ready mix concrete delivery for column casting"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setExpenseCreateOpen(false)}
                disabled={formLoading}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

