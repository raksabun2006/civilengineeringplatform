'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  RefreshCw,
  FolderGit2,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { contractService } from '@/lib/api/services/contract.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  ContractResponse,
  ContractStatus,
  ContractType,
  CreateContractRequest,
  CreateAmendmentRequest,
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

export default function ContractsPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [voOpen, setVoOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractResponse | null>(null);

  // Contract Form
  const [formData, setFormData] = useState({
    title: '',
    contractNumber: '',
    contractType: 'LUMP_SUM' as ContractType,
    originalValue: 0,
    retentionPercentage: 10,
    effectiveDate: new Date().toISOString().split('T')[0],
    completionDate: '',
    signedDate: new Date().toISOString().split('T')[0],
    currency: 'USD',
    termsAndConditions: '',
  });

  // VO Form
  const [voData, setVoData] = useState({
    title: '',
    reason: '',
    amountAdjustment: 0,
    daysExtension: 0,
  });

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

  const fetchContracts = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await contractService.getContractsByProject(selectedProjectId);
      setContracts(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await contractService.createContract({
        projectId: selectedProjectId,
        title: formData.title,
        contractType: formData.contractType,
        originalValue: Number(formData.originalValue),
        retentionPercentage: Number(formData.retentionPercentage),
        effectiveDate: formData.effectiveDate,
        completionDate: formData.completionDate,
        signedDate: formData.signedDate,
        currency: formData.currency || 'USD',
        termsAndConditions: formData.termsAndConditions,
      });
      setCreateOpen(false);
      fetchContracts();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateVO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;
    setFormLoading(true);
    try {
      await contractService.addAmendment(selectedContract.id, {
        title: voData.title,
        reason: voData.reason,
        amountAdjustment: Number(voData.amountAdjustment),
        daysExtension: Number(voData.daysExtension),
      });
      setVoOpen(false);
      const updated = await contractService.getContractById(selectedContract.id);
      setSelectedContract(updated);
      fetchContracts();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleApproveVO = async (amendmentId: string) => {
    if (!selectedContract) return;
    try {
      await contractService.approveAmendment(selectedContract.id, amendmentId);
      const updated = await contractService.getContractById(selectedContract.id);
      setSelectedContract(updated);
      fetchContracts();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const openView = async (c: ContractResponse) => {
    setSelectedContract(c);
    setViewOpen(true);
    try {
      const full = await contractService.getContractById(c.id);
      setSelectedContract(full);
    } catch {
      // Ignored
    }
  };

  const contractTypes: ContractType[] = [
    'LUMP_SUM',
    'UNIT_PRICE_REMEASUREMENT',
    'COST_PLUS_FEE',
    'DESIGN_AND_BUILD',
    'CONSULTANCY_TIME_BASED',
  ];

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'PENDING_SIGNATURE':
        return <Badge variant="warning">Pending Signature</Badge>;
      case 'VARIATION_PENDING':
        return <Badge variant="purple">VO Pending</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>;
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
            <FileText className="h-6 w-6 text-blue-600" />
            <span>{t.contracts.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.contracts.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContracts}
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
            {t.contracts.newContract}
          </Button>
        </div>
      </div>

      {/* Project Selector Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <FolderGit2 className="h-4 w-4 text-blue-600" />
            <span>{language === 'km' ? 'ជ្រើសរើសគម្រោងដើម្បីពិនិត្យកិច្ចសន្យា:' : 'Select Project:'}</span>
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
        ) : contracts.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description="No contracts recorded for this project yet."
            actionLabel={t.contracts.newContract}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.contracts.code}</TableHead>
                  <TableHead>{t.contracts.titleField}</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>{t.contracts.contractValue}</TableHead>
                  <TableHead>{t.contracts.retention}</TableHead>
                  <TableHead>{t.contracts.period}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {c.contractCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">{c.title}</div>
                      {c.contractNumber && (
                        <span className="text-[10px] text-slate-400">Ref: {c.contractNumber}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple" className="text-[10px]">
                        {(c.type || c.contractType || 'LUMP_SUM').replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
                      {formatCurrency(c.contractValue)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{c.retentionPercentage}%</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(c.startDate)} ➔ {formatDate(c.endDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => openView(c)}
                        title={t.common.view}
                      >
                        <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* CREATE CONTRACT MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.contracts.newContract}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreateContract} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.contracts.titleField}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Main Structural EPC Contract"
              />

              <Input
                label={t.contracts.contractNumber}
                value={formData.contractNumber}
                onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                placeholder="e.g. CTR-2026-088"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">Contract Type *</label>
                <select
                  value={formData.contractType}
                  onChange={(e) =>
                    setFormData({ ...formData, contractType: e.target.value as ContractType })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {contractTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.contracts.contractValue}
                type="number"
                step="0.01"
                required
                value={formData.originalValue}
                onChange={(e) =>
                  setFormData({ ...formData, originalValue: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.contracts.retention}
                type="number"
                value={formData.retentionPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, retentionPercentage: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label="Contract Effective Date"
                type="date"
                required
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />

              <Input
                label="Contract Completion Date"
                type="date"
                required
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              />
            </div>

            <Input
              label={t.contracts.scope}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              placeholder="Terms and conditions..."
            />

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

      {/* VIEW CONTRACT & VARIATION ORDERS (VO) MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>{selectedContract?.title}</span>
              {selectedContract && getStatusBadge(selectedContract.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.contracts.code}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedContract.contractCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.contracts.contractValue}</span>
                  <span className="font-bold text-blue-600 text-sm">
                    {formatCurrency(selectedContract.contractValue)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.contracts.retention}</span>
                  <span className="font-bold text-slate-800">
                    {selectedContract.retentionPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Period</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedContract.startDate)} ➔ {formatDate(selectedContract.endDate)}
                  </span>
                </div>
              </div>

              {/* Variation Orders Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    Variation Orders (VO Amendments) ({selectedContract.amendments?.length || 0})
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setVoOpen(true)}
                    className="h-7 text-xs gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {t.contracts.newVO}
                  </Button>
                </div>

                <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
                  {!selectedContract.amendments || selectedContract.amendments.length === 0 ? (
                    <p className="p-4 text-center text-slate-400">
                      No Variation Orders submitted for this contract.
                    </p>
                  ) : (
                    selectedContract.amendments.map((vo) => (
                      <div key={vo.id} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-600">{vo.voNumber}</span>
                            <span className="font-semibold text-slate-900">{vo.title}</span>
                            <Badge variant={vo.status === 'CLIENT_APPROVED' ? 'success' : 'warning'}>
                              {vo.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{vo.scopeChanges}</p>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {formatCurrency(vo.costImpact)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              +{vo.scheduleImpactDays} days
                            </span>
                          </div>

                          {vo.status !== 'CLIENT_APPROVED' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveVO(vo.id)}
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approve VO
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE VO MODAL */}
      <Dialog open={voOpen} onOpenChange={setVoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.contracts.newVO}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateVO} className="space-y-3">
            <Input
              label="VO Title"
              required
              value={voData.title}
              onChange={(e) => setVoData({ ...voData, title: e.target.value })}
              placeholder="e.g. Additional Retaining Wall Height"
            />

            <Input
              label="Reason for Amendment"
              required
              value={voData.reason}
              onChange={(e) => setVoData({ ...voData, reason: e.target.value })}
              placeholder="Details of architectural or structural modification..."
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t.contracts.costImpact}
                type="number"
                step="0.01"
                required
                value={voData.amountAdjustment}
                onChange={(e) =>
                  setVoData({ ...voData, amountAdjustment: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.contracts.scheduleImpact}
                type="number"
                value={voData.daysExtension}
                onChange={(e) =>
                  setVoData({ ...voData, daysExtension: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVoOpen(false)}>
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

