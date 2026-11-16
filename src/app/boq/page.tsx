'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  FolderGit2,
  Printer,
  Download,
} from 'lucide-react';
import { exportBoqToExcel, printBoqPdf } from '@/lib/export/export-utils';
import { useLanguage } from '@/lib/i18n/language-context';
import { boqService } from '@/lib/api/services/boq.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  EstimateResponse,
  EstimateStatus,
  CreateEstimateRequest,
  CreateEstimateItemRequest,
  ProjectResponse,
  UnitOfMeasure,
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

export default function BoqPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [estimates, setEstimates] = useState<EstimateResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateResponse | null>(null);

  // Create BOQ Form State
  const [title, setTitle] = useState('');
  const [marginPercentage, setMarginPercentage] = useState(15);
  const [totalIndirectCost, setTotalIndirectCost] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState<CreateEstimateItemRequest[]>([
    {
      itemNumber: '1.01',
      description: 'Site Clearance & Excavation',
      unit: 'M3',
      quantity: 150,
      directCost: 12.5,
      markupPercentage: 15,
      notes: '',
    },
    {
      itemNumber: '2.01',
      description: 'Reinforced Concrete Grade 30 (Footing)',
      unit: 'M3',
      quantity: 85,
      directCost: 110,
      markupPercentage: 15,
      notes: '',
    },
  ]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load projects list
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

  // Fetch estimates when selected project changes
  const fetchEstimates = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await boqService.getEstimatesByProject(selectedProjectId);
      setEstimates(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleAddItemRow = () => {
    const nextNum = (items.length + 1).toFixed(2);
    setItems([
      ...items,
      {
        itemNumber: `${nextNum}`,
        description: '',
        unit: 'M3',
        quantity: 1,
        directCost: 0,
        markupPercentage: marginPercentage,
        notes: '',
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof CreateEstimateItemRequest, value: any) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    setItems(copy);
  };

  const calculatedDirectCost = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.directCost || 0),
    0
  );
  const calculatedGrandTotal =
    (calculatedDirectCost + Number(totalIndirectCost || 0)) * (1 + marginPercentage / 100);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setFormError('Please select a project first.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      await boqService.createEstimate({
        projectId: selectedProjectId,
        title,
        description: remarks,
        profitMarginRate: Number(marginPercentage),
        totalIndirectCost: Number(totalIndirectCost),
        currency: 'USD',
        items: items.map((i, idx) => ({
          itemCode: i.itemNumber || `BOQ-${idx + 1}`,
          description: i.description,
          unitOfMeasure: (i.unit as any) || 'M3',
          quantity: Number(i.quantity),
          unitRateMaterial: Number(i.directCost),
          notes: i.notes,
          displayOrder: idx + 1,
        })),
      });
      setCreateOpen(false);
      resetForm();
      fetchEstimates();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async (estimateId: string) => {
    try {
      await boqService.approveEstimate(estimateId);
      fetchEstimates();
      if (selectedEstimate?.id === estimateId) {
        const updated = await boqService.getEstimateById(estimateId);
        setSelectedEstimate(updated);
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const openView = async (est: EstimateResponse) => {
    setSelectedEstimate(est);
    setViewOpen(true);
    try {
      const full = await boqService.getEstimateById(est.id);
      setSelectedEstimate(full);
    } catch {
      // Ignored
    }
  };

  const resetForm = () => {
    setTitle('');
    setMarginPercentage(15);
    setTotalIndirectCost(0);
    setRemarks('');
    setItems([
      {
        itemNumber: '1.01',
        description: 'Earthwork & Foundation excavation',
        unit: 'M3',
        quantity: 100,
        directCost: 15,
        markupPercentage: 15,
        notes: '',
      },
    ]);
  };

  const unitOptions: UnitOfMeasure[] = [
    'M',
    'M2',
    'M3',
    'KG',
    'TON',
    'BAG',
    'LS',
    'SET',
    'TRIP',
    'DAY',
    'MONTH',
    'MAN_DAY',
  ];

  const getStatusBadge = (status: EstimateStatus) => {
    switch (status) {
      case 'APPROVED':
      case 'MANAGEMENT_APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'INTERNAL_REVIEW':
        return <Badge variant="warning">Under Review</Badge>;
      case 'QUOTED':
        return <Badge variant="purple">Quoted</Badge>;
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
            <Calculator className="h-6 w-6 text-blue-600" />
            <span>{t.boq.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.boq.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEstimates}
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
            {t.boq.newEstimate}
          </Button>
        </div>
      </div>

      {/* Project Selector Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <FolderGit2 className="h-4 w-4 text-blue-600" />
            <span>{language === 'km' ? 'ជ្រើសរើសគម្រោងដើម្បីពិនិត្យ BOQ:' : 'Select Project for BOQ:'}</span>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none flex-1 w-full"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} – {p.name} ({p.clientName || 'Civil'})
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
        ) : estimates.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description="No BOQ estimates created for this project yet."
            actionLabel={t.boq.newEstimate}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.boq.estimateCode}</TableHead>
                  <TableHead>{t.boq.estimateTitle}</TableHead>
                  <TableHead>{t.boq.directCost}</TableHead>
                  <TableHead>{t.boq.indirectCost}</TableHead>
                  <TableHead>{t.boq.margin}</TableHead>
                  <TableHead>{t.boq.totalAmount}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map((est) => (
                  <TableRow key={est.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {est.estimateCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">{est.title}</div>
                      <span className="text-[10px] text-slate-400">Ver. {est.version}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {formatCurrency(est.totalDirectCost)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {formatCurrency(est.totalIndirectCost)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700">
                      {est.marginPercentage}%
                    </TableCell>
                    <TableCell className="text-xs font-bold text-blue-600">
                      {formatCurrency(est.totalEstimatedAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(est.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {est.status !== 'APPROVED' && est.status !== 'MANAGEMENT_APPROVED' && (
                          <Button
                            variant="ghost"
                            size="iconSm"
                            onClick={() => handleApprove(est.id)}
                            title={t.boq.approveEstimate}
                          >
                            <CheckCircle2 className="h-4 w-4 text-slate-500 hover:text-emerald-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => {
                            const pName = projects.find((p) => p.id === selectedProjectId)?.name;
                            exportBoqToExcel(est, pName);
                          }}
                          title="Export to Excel (.csv)"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-600 hover:text-emerald-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => {
                            const pName = projects.find((p) => p.id === selectedProjectId)?.name;
                            printBoqPdf(est, pName);
                          }}
                          title="Export / Print PDF"
                        >
                          <Printer className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openView(est)}
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

      {/* CREATE BOQ MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t.boq.newEstimate}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t.boq.estimateTitle}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Substructure & Civil BOQ v1"
              />

              <Input
                label={t.boq.margin}
                type="number"
                step="0.1"
                required
                value={marginPercentage}
                onChange={(e) => setMarginPercentage(parseFloat(e.target.value) || 0)}
              />

              <Input
                label={t.boq.indirectCost + ' ($)'}
                type="number"
                step="0.01"
                value={totalIndirectCost}
                onChange={(e) => setTotalIndirectCost(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  Itemized Work Breakdown ({items.length})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItemRow}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {t.boq.addItem}
                </Button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">{t.boq.itemNumber}</TableHead>
                      <TableHead>{t.boq.itemDesc}</TableHead>
                      <TableHead className="w-24">{t.common.unit}</TableHead>
                      <TableHead className="w-24">{t.common.quantity}</TableHead>
                      <TableHead className="w-28">{t.common.unitPrice} ($)</TableHead>
                      <TableHead className="w-28 text-right">{t.common.total} ($)</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="p-2">
                          <input
                            type="text"
                            value={item.itemNumber}
                            onChange={(e) => handleItemChange(idx, 'itemNumber', e.target.value)}
                            className="w-full text-xs font-mono p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <input
                            type="text"
                            required
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            placeholder="Description..."
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                            className="w-full text-xs p-1 border rounded bg-white"
                          >
                            {unitOptions.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
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
                            value={item.directCost}
                            onChange={(e) =>
                              handleItemChange(idx, 'directCost', parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-xs p-1 border rounded"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right font-semibold text-xs text-slate-800">
                          {formatCurrency((item.quantity || 0) * (item.directCost || 0))}
                        </TableCell>
                        <TableCell className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
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

              {/* Summary Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-8 text-xs font-semibold">
                <div>
                  <span className="text-slate-500 mr-2">Total Direct Cost:</span>
                  <span className="text-slate-900">{formatCurrency(calculatedDirectCost)}</span>
                </div>
                <div>
                  <span className="text-slate-500 mr-2">Calculated Total with Margin:</span>
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

      {/* VIEW BOQ MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>{selectedEstimate?.title}</span>
              {selectedEstimate && getStatusBadge(selectedEstimate.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedEstimate && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.boq.estimateCode}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedEstimate.estimateCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.boq.directCost}</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(selectedEstimate.totalDirectCost)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.boq.margin}</span>
                  <span className="font-bold text-slate-800">
                    {selectedEstimate.marginPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.boq.totalAmount}</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(selectedEstimate.totalEstimatedAmount)}
                  </span>
                </div>
              </div>

              {selectedEstimate.items && selectedEstimate.items.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Item #</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Direct Cost</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEstimate.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.itemNumber}</TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.directCost)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedEstimate && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const pName = projects.find((p) => p.id === selectedProjectId)?.name;
                      exportBoqToExcel(selectedEstimate, pName);
                    }}
                    className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    <span>Export Excel (.csv)</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const pName = projects.find((p) => p.id === selectedProjectId)?.name;
                      printBoqPdf(selectedEstimate, pName);
                    }}
                    className="gap-1.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Print / PDF</span>
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedEstimate &&
                selectedEstimate.status !== 'APPROVED' &&
                selectedEstimate.status !== 'MANAGEMENT_APPROVED' && (
                  <Button
                    onClick={() => handleApprove(selectedEstimate.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    {t.boq.approveEstimate}
                  </Button>
                )}
              <Button variant="outline" size="sm" onClick={() => setViewOpen(false)} className="text-xs">
                {t.common.close}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

