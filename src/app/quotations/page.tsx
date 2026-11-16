'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Eye,
  Printer,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FolderGit2,
  Trash2,
} from 'lucide-react';
import { exportQuotationToExcel } from '@/lib/export/export-utils';
import { useLanguage } from '@/lib/i18n/language-context';
import { quotationService } from '@/lib/api/services/quotation.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  QuotationResponse,
  QuotationStatus,
  CreateQuotationRequest,
  CreateQuotationItemRequest,
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

export default function QuotationsPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [quotations, setQuotations] = useState<QuotationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationResponse | null>(null);

  // Form
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [vatPercentage, setVatPercentage] = useState(10);
  const [terms, setTerms] = useState(
    '1. 30% Advance Payment on contract signing.\n2. 60% Monthly progress claim.\n3. 10% Retention released after 1 year defects liability.'
  );
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState<CreateQuotationItemRequest[]>([
    { description: 'Substructure Civil Construction Works', unit: 'LS', quantity: 1, unitPrice: 45000 },
    { description: 'Structural Reinforced Concrete Frame', unit: 'M3', quantity: 250, unitPrice: 320 },
  ]);
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

  const fetchQuotations = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await quotationService.getQuotationsByProject(selectedProjectId);
      setQuotations(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleAddItem = () => {
    setItems([...items, { description: '', unit: 'LS', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: keyof CreateQuotationItemRequest, val: any) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: val };
    setItems(copy);
  };

  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );
  const calculatedDiscount = calculatedSubtotal * (Number(discountPercentage || 0) / 100);
  const calculatedVat = (calculatedSubtotal - calculatedDiscount) * (Number(vatPercentage || 0) / 100);
  const calculatedGrandTotal = calculatedSubtotal - calculatedDiscount + calculatedVat;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await quotationService.createQuotation({
        projectId: selectedProjectId,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil,
        discountRate: Number(discountPercentage) || 0,
        taxRate: Number(vatPercentage) || 0,
        currency: 'USD',
        paymentTerms: terms,
        scopeOfWork: remarks,
        items: items.map((i, idx) => ({
          itemCode: `ITEM-${idx + 1}`,
          description: i.description,
          unitOfMeasure: (i.unitOfMeasure as any) || 'LS',
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      });
      setCreateOpen(false);
      fetchQuotations();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: QuotationStatus) => {
    try {
      await quotationService.updateStatus(id, status);
      fetchQuotations();
      if (selectedQuotation?.id === id) {
        setSelectedQuotation({ ...selectedQuotation, status });
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const openView = async (q: QuotationResponse) => {
    setSelectedQuotation(q);
    setViewOpen(true);
    try {
      const full = await quotationService.getQuotationById(q.id);
      setSelectedQuotation(full);
    } catch {
      // Ignored
    }
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'CLIENT_ACCEPTED':
        return <Badge variant="success">Client Accepted</Badge>;
      case 'SENT_TO_CLIENT':
        return <Badge variant="purple">Sent to Client</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'CLIENT_REJECTED':
      case 'EXPIRED':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            <span>{t.quotations.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.quotations.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuotations}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-10 px-3 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t.common.refresh}
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            {t.quotations.newQuotation}
          </Button>
        </div>
      </div>

      {/* Project Selector Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <FolderGit2 className="h-4 w-4 text-blue-600" />
            <span>{language === 'km' ? 'ជ្រើសរើសគម្រោងដើម្បីពិនិត្យសម្រង់តម្លៃ:' : 'Select Project:'}</span>
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

      {/* Table */}
      <Card className="border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-red-500">{error}</div>
        ) : quotations.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description="No quotations issued for this project yet."
            actionLabel={t.quotations.newQuotation}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.quotations.code}</TableHead>
                  <TableHead>{t.quotations.client}</TableHead>
                  <TableHead>{t.quotations.subtotal}</TableHead>
                  <TableHead>{t.quotations.vat}</TableHead>
                  <TableHead>{t.quotations.total}</TableHead>
                  <TableHead>{t.quotations.validUntil}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {q.quotationCode}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-900">
                      {q.clientName || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {formatCurrency(q.subtotal)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">{q.vatPercentage}%</TableCell>
                    <TableCell className="text-xs font-bold text-blue-600">
                      {formatCurrency(q.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(q.validUntil)}
                    </TableCell>
                    <TableCell>{getStatusBadge(q.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => exportQuotationToExcel(q)}
                          title="Export to Excel (.csv)"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-600 hover:text-emerald-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openView(q)}
                          title={t.common.view}
                        >
                          <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* CREATE QUOTATION MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t.quotations.newQuotation}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t.quotations.validUntil}
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />

              <Input
                label={t.quotations.discount}
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
              />

              <Input
                label={t.quotations.vat}
                type="number"
                min="0"
                max="100"
                value={vatPercentage}
                onChange={(e) => setVatPercentage(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Quotation Items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  Quotation Items ({items.length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Item
                </Button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24">Unit</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-28">Unit Price ($)</TableHead>
                      <TableHead className="w-28 text-right">Total ($)</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="p-2">
                          <input
                            type="text"
                            required
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="Deliverable description..."
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                            placeholder="Unit"
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right font-semibold text-xs text-slate-800">
                          {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                        </TableCell>
                        <TableCell className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-8 text-xs font-semibold">
                <div>
                  <span className="text-slate-500 mr-2">Subtotal:</span>
                  <span className="text-slate-900">{formatCurrency(calculatedSubtotal)}</span>
                </div>
                <div>
                  <span className="text-slate-500 mr-2">Total Amount (Inc. VAT):</span>
                  <span className="text-blue-600 font-bold">
                    {formatCurrency(calculatedGrandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
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

      {/* VIEW & PRINT QUOTATION MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>{selectedQuotation?.quotationCode}</span>
              {selectedQuotation && getStatusBadge(selectedQuotation.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-4 py-2 text-xs" id="quotation-print-area">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.quotations.client}</span>
                  <span className="font-bold text-slate-800">{selectedQuotation.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.quotations.validUntil}</span>
                  <span className="font-bold text-slate-800">
                    {formatDate(selectedQuotation.validUntil)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Subtotal</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(selectedQuotation.subtotal)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.quotations.total}</span>
                  <span className="font-bold text-blue-600 text-sm">
                    {formatCurrency(selectedQuotation.totalAmount)}
                  </span>
                </div>
              </div>

              {selectedQuotation.items && selectedQuotation.items.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Total Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuotation.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-slate-900">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalPrice)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Update Status:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'SENT_TO_CLIENT')}
                  className="h-7 text-[11px]"
                >
                  Mark as Sent
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'CLIENT_ACCEPTED')}
                  className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Client Accepted
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedQuotation.id, 'CLIENT_REJECTED')}
                  className="h-7 text-[11px]"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Client Rejected
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedQuotation && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportQuotationToExcel(selectedQuotation)}
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

            <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="text-xs">
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

