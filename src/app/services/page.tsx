'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { engineeringServiceApi } from '@/lib/api/services/service.service';
import {
  EngineeringServiceResponse,
  ServiceCategory,
  CreateEngineeringServiceRequest,
  UpdateEngineeringServiceRequest,
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

export default function ServicesPage() {
  const { t, language, formatCurrency } = useLanguage();

  const [services, setServices] = useState<EngineeringServiceResponse[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<EngineeringServiceResponse | null>(null);

  // Form matching backend DTO
  const [formData, setFormData] = useState<CreateEngineeringServiceRequest>({
    code: '',
    name: '',
    category: 'STRUCTURAL_DESIGN',
    description: '',
    standardRate: 0,
    currency: 'USD',
    unitOfMeasure: 'M2',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await engineeringServiceApi.getServices({
        page,
        size: pageSize,
        search: search || undefined,
        category: categoryFilter || undefined,
      });
      setServices(data?.content || []);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, categoryFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await engineeringServiceApi.createService(formData);
      setCreateOpen(false);
      resetForm();
      fetchServices();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await engineeringServiceApi.updateService(selectedService.id, {
        name: formData.name,
        nameKh: formData.nameKh,
        category: formData.category,
        description: formData.description,
        standardRate: formData.standardRate,
        currency: 'USD',
        unitOfMeasure: formData.unitOfMeasure,
        isActive: selectedService.isActive ?? true,
      });
      setEditOpen(false);
      resetForm();
      fetchServices();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    setFormLoading(true);
    try {
      await engineeringServiceApi.deleteService(selectedService.id);
      setDeleteOpen(false);
      fetchServices();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (service: EngineeringServiceResponse) => {
    setSelectedService(service);
    setFormData({
      code: service.code,
      name: service.name,
      nameKh: service.nameKh || '',
      category: service.category,
      description: service.description || '',
      standardRate: service.standardRate,
      currency: 'USD',
      unitOfMeasure: service.unitOfMeasure || 'M2',
    });
    setEditOpen(true);
  };

  const openDelete = (service: EngineeringServiceResponse) => {
    setSelectedService(service);
    setDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      nameKh: '',
      category: 'STRUCTURAL_DESIGN',
      description: '',
      standardRate: 0,
      currency: 'USD',
      unitOfMeasure: 'M2',
    });
    setFormError(null);
  };

  const categories: ServiceCategory[] = [
    'STRUCTURAL_DESIGN',
    'MEP_DESIGN',
    'CIVIL_INFRASTRUCTURE',
    'GEOTECHNICAL',
    'PROJECT_MANAGEMENT',
    'CONSTRUCTION_SUPERVISION',
    'TOPOGRAPHICAL_SURVEY',
    'ARCHITECTURAL_COORDINATION',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span>{t.services.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.services.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-10 px-3 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t.common.refresh}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            {t.services.newService}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.services.serviceName + '...'}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none w-full sm:w-auto"
          >
            <option value="">{language === 'km' ? 'ប្រភេទសេវាកម្មទាំងអស់' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-red-500">{error}</div>
        ) : services.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description={t.common.noDataDesc}
            actionLabel={t.services.newService}
            onAction={() => {
              resetForm();
              setCreateOpen(true);
            }}
          />
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.services.serviceCode}</TableHead>
                  <TableHead>{t.services.serviceName}</TableHead>
                  <TableHead>{t.services.category}</TableHead>
                  <TableHead>{t.services.baseRate}</TableHead>
                  <TableHead>{t.services.unit}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {item.code}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">{item.name}</div>
                      {item.description && (
                        <span className="text-[10px] text-slate-400 block line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple" className="text-[10px]">
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 text-xs">
                      {formatCurrency(item.standardRate)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{item.unitOfMeasure}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openEdit(item)}
                          title={t.common.edit}
                        >
                          <Edit2 className="h-4 w-4 text-slate-500 hover:text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openDelete(item)}
                          title={t.common.delete}
                        >
                          <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                {t.common.showing} {services.length} {t.common.of} {totalElements} {t.common.entries}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(page + 1) * pageSize >= totalElements}
                  onClick={() => setPage(page + 1)}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.services.newService}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.services.serviceCode}
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. STR-001"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.services.category} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as ServiceCategory })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.services.serviceName}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Structural Design & Analysis"
              />

              <Input
                label={t.services.baseRate}
                type="number"
                step="0.01"
                required
                value={formData.standardRate}
                onChange={(e) =>
                  setFormData({ ...formData, standardRate: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.services.unit}
                required
                value={formData.unitOfMeasure}
                onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                placeholder="e.g. M2, Project, Day"
              />
            </div>

            <Input
              label={t.services.description}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Scope and deliverables of this service..."
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

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.common.edit}: {selectedService?.name}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.services.category} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as ServiceCategory })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.services.serviceName}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                label={t.services.baseRate}
                type="number"
                step="0.01"
                required
                value={formData.standardRate}
                onChange={(e) =>
                  setFormData({ ...formData, standardRate: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.services.unit}
                required
                value={formData.unitOfMeasure}
                onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
              />
            </div>

            <Input
              label={t.services.description}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
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

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">{t.common.confirmDelete}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-600">{t.common.confirmDeleteMsg}</p>
          <p className="text-xs font-bold text-slate-900 mt-2">{selectedService?.name}</p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={formLoading}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? t.common.loading : t.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
