'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Wrench,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { inventoryService } from '@/lib/api/services/inventory.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  MaterialResponse,
  EquipmentResponse,
  EquipmentStatus,
  MovementType,
  CreateMaterialRequest,
  CreateEquipmentRequest,
  AssignEquipmentRequest,
  ReturnEquipmentRequest,
  RecordMovementRequest,
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

export default function InventoryPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'movements'>('materials');
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  // Materials State
  const [materials, setMaterials] = useState<MaterialResponse[]>([]);
  const [matTotal, setMatTotal] = useState(0);
  const [matPage, setMatPage] = useState(0);
  const [matSearch, setMatSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Equipment State
  const [equipmentList, setEquipmentList] = useState<EquipmentResponse[]>([]);
  const [eqTotal, setEqTotal] = useState(0);
  const [eqPage, setEqPage] = useState(0);
  const [eqSearch, setEqSearch] = useState('');
  const [eqStatus, setEqStatus] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Material Modals
  const [matCreateOpen, setMatCreateOpen] = useState(false);
  const [matEditOpen, setMatEditOpen] = useState(false);
  const [matDeleteOpen, setMatDeleteOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponse | null>(null);

  // Equipment Modals
  const [eqCreateOpen, setEqCreateOpen] = useState(false);
  const [eqAssignOpen, setEqAssignOpen] = useState(false);
  const [eqReturnOpen, setEqReturnOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentResponse | null>(null);

  // Movement Modal
  const [movementOpen, setMovementOpen] = useState(false);

  // Material Form
  const [matForm, setMatForm] = useState<CreateMaterialRequest>({
    itemCode: '',
    name: '',
    category: 'CEMENT_AND_AGGREGATE',
    unitOfMeasure: 'BAG',
    initialStock: 0,
    reorderThreshold: 10,
    unitCost: 0,
    currency: 'USD',
    storageLocation: 'Phnom Penh Central Warehouse',
  });

  // Equipment Form
  const [eqForm, setEqForm] = useState<CreateEquipmentRequest>({
    assetCode: '',
    name: '',
    model: '',
    serialNumber: '',
    hourlyRate: 0,
    currency: 'USD',
  });

  // Assign Equipment Form
  const [assignProjectId, setAssignProjectId] = useState('');
  const [assignDeployDate, setAssignDeployDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [assignNotes, setAssignNotes] = useState('');

  // Return Equipment Form
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnCondition, setReturnCondition] = useState('GOOD');

  // Movement Form
  const [movementForm, setMovementForm] = useState<RecordMovementRequest>({
    materialId: '',
    projectId: '',
    movementType: 'PURCHASE_RECEIPT',
    quantity: 10,
    unitCost: 0,
    movementDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    notes: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch Projects for dropdowns
  useEffect(() => {
    projectService
      .getProjects({ page: 0, size: 50 })
      .then((p) => setProjects(p?.content || []))
      .catch(() => {});
  }, []);

  // Fetch Materials
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getMaterials({
        page: matPage,
        size: 10,
        search: matSearch || undefined,
        lowStockOnly: lowStockOnly || undefined,
      });
      setMaterials(data?.content || []);
      setMatTotal(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [matPage, matSearch, lowStockOnly]);

  // Fetch Equipment
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getEquipment({
        page: eqPage,
        size: 10,
        search: eqSearch || undefined,
        status: eqStatus || undefined,
      });
      setEquipmentList(data?.content || []);
      setEqTotal(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [eqPage, eqSearch, eqStatus]);

  useEffect(() => {
    if (activeTab === 'materials' || activeTab === 'movements') {
      fetchMaterials();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    }
  }, [activeTab, fetchMaterials, fetchEquipment]);

  // Material Actions
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await inventoryService.createMaterial({
        ...matForm,
        initialStock: Number(matForm.initialStock) || 0,
        reorderThreshold: Number(matForm.reorderThreshold) || 10,
        unitCost: Number(matForm.unitCost) || 0,
      });
      setMatCreateOpen(false);
      fetchMaterials();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;
    setFormLoading(true);
    try {
      await inventoryService.updateMaterial(selectedMaterial.id, {
        name: matForm.name,
        category: matForm.category,
        unitOfMeasure: matForm.unitOfMeasure,
        reorderThreshold: Number(matForm.reorderThreshold) || 10,
        unitCost: Number(matForm.unitCost) || 0,
        storageLocation: matForm.storageLocation,
      });
      setMatEditOpen(false);
      fetchMaterials();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    setFormLoading(true);
    try {
      await inventoryService.deleteMaterial(selectedMaterial.id);
      setMatDeleteOpen(false);
      fetchMaterials();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Equipment Actions
  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await inventoryService.createEquipment({
        ...eqForm,
        hourlyRate: Number(eqForm.hourlyRate),
      });
      setEqCreateOpen(false);
      fetchEquipment();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleAssignEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment || !assignProjectId) return;
    setFormLoading(true);
    try {
      await inventoryService.assignEquipment(selectedEquipment.id, {
        projectId: assignProjectId,
        deployedDate: assignDeployDate,
        notes: assignNotes,
      });
      setEqAssignOpen(false);
      fetchEquipment();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleReturnEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;
    setFormLoading(true);
    try {
      await inventoryService.returnEquipment(selectedEquipment.id, {
        returnDate,
        conditionOnReturn: returnCondition,
      });
      setEqReturnOpen(false);
      fetchEquipment();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Movement Action
  const handleRecordMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await inventoryService.recordMovement({
        ...movementForm,
        quantity: Number(movementForm.quantity),
        unitCost: Number(movementForm.unitCost),
      });
      setMovementOpen(false);
      fetchMaterials();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const openEditMaterial = (m: MaterialResponse) => {
    setSelectedMaterial(m);
    setMatForm({
      itemCode: m.itemCode,
      name: m.name,
      category: m.category,
      unitOfMeasure: m.unitOfMeasure,
      initialStock: m.currentStock,
      reorderThreshold: m.reorderThreshold,
      unitCost: m.unitCost,
      currency: m.currency || 'USD',
      storageLocation: m.storageLocation || '',
    });
    setMatEditOpen(true);
  };

  const openDeleteMaterial = (m: MaterialResponse) => {
    setSelectedMaterial(m);
    setMatDeleteOpen(true);
  };

  const openAssignEquipment = (eq: EquipmentResponse) => {
    setSelectedEquipment(eq);
    setAssignProjectId(projects[0]?.id || '');
    setEqAssignOpen(true);
  };

  const openReturnEquipment = (eq: EquipmentResponse) => {
    setSelectedEquipment(eq);
    setEqReturnOpen(true);
  };

  const getEquipmentStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'AVAILABLE_IN_YARD':
        return <Badge variant="success">Available in Yard</Badge>;
      case 'DEPLOYED_ON_SITE':
        return <Badge variant="default">Deployed on Site</Badge>;
      case 'UNDER_MAINTENANCE':
        return <Badge variant="warning">Maintenance</Badge>;
      case 'REPAIR_REQUIRED':
        return <Badge variant="destructive">Repair Required</Badge>;
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
            <Boxes className="h-6 w-6 text-blue-600" />
            <span>{t.inventory.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.inventory.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (activeTab === 'equipment' ? fetchEquipment() : fetchMaterials())}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-10 px-3 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t.common.refresh}
          </Button>

          {activeTab === 'materials' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMovementForm({ ...movementForm, materialId: materials[0]?.id || '' });
                  setMovementOpen(true);
                }}
                className="gap-2 h-10 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {t.inventory.recordMovement}
              </Button>
              <Button
                size="sm"
                onClick={() => setMatCreateOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
              >
                <Plus className="h-4 w-4" />
                {t.inventory.newMaterial}
              </Button>
            </>
          )}

          {activeTab === 'equipment' && (
            <Button
              size="sm"
              onClick={() => setEqCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-10 px-4 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              {t.inventory.newEquipment}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'materials'
              ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="h-4 w-4" />
          {t.inventory.materials} ({matTotal})
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`pb-3 flex items-center gap-2 cursor-pointer ${
            activeTab === 'equipment'
              ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" />
          {t.inventory.equipment} ({eqTotal})
        </button>
      </div>

      {/* MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <Card className="p-4 border-slate-200/80">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  placeholder={t.inventory.materials + '...'}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Low Stock Only</span>
              </label>
            </div>
          </Card>

          <Card className="border-slate-200/80 overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center text-xs text-red-500">{error}</div>
            ) : materials.length === 0 ? (
              <EmptyState
                title={t.common.noData}
                description="No materials recorded in catalog."
                actionLabel={t.inventory.newMaterial}
                onAction={() => setMatCreateOpen(true)}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.inventory.materialCode}</TableHead>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>{t.inventory.currentStock}</TableHead>
                    <TableHead>{t.inventory.minimumStock}</TableHead>
                    <TableHead>{t.inventory.unitCost}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((m) => {
                    const isLow = m.currentStock <= (m.minimumStock ?? m.reorderThreshold ?? 0);
                    return (
                      <TableRow key={m.id} className="hover:bg-slate-50/80">
                        <TableCell className="font-mono text-xs font-semibold text-blue-600">
                          {m.materialCode || m.itemCode}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 text-xs">{m.name}</div>
                          {m.supplierName && (
                            <span className="text-[10px] text-slate-400">By: {m.supplierName}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {(m.category || 'GENERAL').replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <span className={isLow ? 'text-amber-600' : 'text-slate-900'}>
                              {m.currentStock} {m.unit}
                            </span>
                            {isLow && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {m.minimumStock} {m.unit}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-800">
                          {formatCurrency(m.unitCost)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={() => openEditMaterial(m)}
                              title={t.common.edit}
                            >
                              <Edit2 className="h-4 w-4 text-slate-500 hover:text-amber-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={() => openDeleteMaterial(m)}
                              title={t.common.delete}
                            >
                              <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}

      {/* EQUIPMENT TAB */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <Card className="p-4 border-slate-200/80">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={eqSearch}
                  onChange={(e) => setEqSearch(e.target.value)}
                  placeholder={t.inventory.equipment + '...'}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={eqStatus}
                onChange={(e) => setEqStatus(e.target.value)}
                className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE_IN_YARD">AVAILABLE_IN_YARD</option>
                <option value="DEPLOYED_ON_SITE">DEPLOYED_ON_SITE</option>
                <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                <option value="REPAIR_REQUIRED">REPAIR_REQUIRED</option>
              </select>
            </div>
          </Card>

          <Card className="border-slate-200/80 overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center text-xs text-red-500">{error}</div>
            ) : equipmentList.length === 0 ? (
              <EmptyState
                title={t.common.noData}
                description="No equipment found in fleet."
                actionLabel={t.inventory.newEquipment}
                onAction={() => setEqCreateOpen(true)}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.inventory.equipmentCode}</TableHead>
                    <TableHead>Machine / Fleet Name</TableHead>
                    <TableHead>{t.inventory.model}</TableHead>
                    <TableHead>{t.inventory.hourlyRate}</TableHead>
                    <TableHead>{t.inventory.deployedProject}</TableHead>
                    <TableHead>{t.common.status}</TableHead>
                    <TableHead className="text-right">{t.common.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq) => (
                    <TableRow key={eq.id} className="hover:bg-slate-50/80">
                      <TableCell className="font-mono text-xs font-semibold text-blue-600">
                        {eq.equipmentCode}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900 text-xs">{eq.name}</div>
                        {eq.licensePlate && (
                          <span className="text-[10px] text-slate-400">Plate: {eq.licensePlate}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">{eq.model || '-'}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        {formatCurrency(eq.hourlyRate)}/hr
                      </TableCell>
                      <TableCell className="text-xs text-blue-600 font-medium">
                        {eq.currentProjectName || '-'}
                      </TableCell>
                      <TableCell>{getEquipmentStatusBadge(eq.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {eq.status === 'AVAILABLE_IN_YARD' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAssignEquipment(eq)}
                              className="h-7 text-[11px] text-blue-600 hover:bg-blue-50"
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              {t.inventory.assignToProject}
                            </Button>
                          )}
                          {eq.status === 'DEPLOYED_ON_SITE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReturnEquipment(eq)}
                              className="h-7 text-[11px] text-emerald-600 hover:bg-emerald-50"
                            >
                              <ArrowDownLeft className="h-3 w-3 mr-1" />
                              {t.inventory.returnToYard}
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
        </div>
      )}

      {/* CREATE MATERIAL MODAL */}
      <Dialog open={matCreateOpen} onOpenChange={setMatCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.inventory.newMaterial}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreateMaterial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.inventory.materialCode}
                required
                value={matForm.materialCode}
                onChange={(e) => setMatForm({ ...matForm, materialCode: e.target.value })}
                placeholder="e.g. MAT-CEM-01"
              />

              <Input
                label="Material Name"
                required
                value={matForm.name}
                onChange={(e) => setMatForm({ ...matForm, name: e.target.value })}
                placeholder="e.g. Portland Cement Grade 42.5"
              />

              <Input
                label="Category"
                value={matForm.category}
                onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}
              />

              <Input
                label={t.common.unit}
                required
                value={matForm.unit}
                onChange={(e) => setMatForm({ ...matForm, unit: e.target.value })}
                placeholder="BAG, TON, M3"
              />

              <Input
                label={t.inventory.currentStock}
                type="number"
                value={matForm.currentStock}
                onChange={(e) =>
                  setMatForm({ ...matForm, currentStock: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.inventory.minimumStock}
                type="number"
                value={matForm.minimumStock}
                onChange={(e) =>
                  setMatForm({ ...matForm, minimumStock: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.inventory.unitCost + ' ($)'}
                type="number"
                step="0.01"
                value={matForm.unitCost}
                onChange={(e) =>
                  setMatForm({ ...matForm, unitCost: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label="Supplier / Vendor"
                value={matForm.supplierName}
                onChange={(e) => setMatForm({ ...matForm, supplierName: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMatCreateOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE EQUIPMENT MODAL */}
      <Dialog open={eqCreateOpen} onOpenChange={setEqCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.inventory.newEquipment}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateEquipment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.inventory.equipmentCode}
                required
                value={eqForm.equipmentCode}
                onChange={(e) => setEqForm({ ...eqForm, equipmentCode: e.target.value })}
                placeholder="e.g. EXC-CAT-320"
              />

              <Input
                label="Equipment Name"
                required
                value={eqForm.name}
                onChange={(e) => setEqForm({ ...eqForm, name: e.target.value })}
                placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
              />

              <Input
                label={t.inventory.model}
                value={eqForm.model}
                onChange={(e) => setEqForm({ ...eqForm, model: e.target.value })}
                placeholder="CAT 320 GC"
              />

              <Input
                label={t.inventory.plate}
                value={eqForm.licensePlate}
                onChange={(e) => setEqForm({ ...eqForm, licensePlate: e.target.value })}
                placeholder="3C-8899 PP"
              />

              <Input
                label={t.inventory.hourlyRate + ' ($/hr)'}
                type="number"
                step="0.01"
                value={eqForm.hourlyRate}
                onChange={(e) =>
                  setEqForm({ ...eqForm, hourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEqCreateOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSIGN EQUIPMENT TO PROJECT MODAL */}
      <Dialog open={eqAssignOpen} onOpenChange={setEqAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.inventory.assignToProject}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAssignEquipment} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Select Project *</label>
              <select
                required
                value={assignProjectId}
                onChange={(e) => setAssignProjectId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectCode} – {p.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Deployment Date"
              type="date"
              required
              value={assignDeployDate}
              onChange={(e) => setAssignDeployDate(e.target.value)}
            />

            <Input
              label={t.common.notes}
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
              placeholder="Operator assignment or site details..."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEqAssignOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : 'Deploy Equipment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RECORD MOVEMENT MODAL */}
      <Dialog open={movementOpen} onOpenChange={setMovementOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.inventory.recordMovement}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRecordMovement} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Select Material *</label>
              <select
                required
                value={movementForm.materialId}
                onChange={(e) => setMovementForm({ ...movementForm, materialId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.materialCode} – {m.name} (Stock: {m.currentStock} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Movement Type *</label>
              <select
                value={movementForm.type}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, type: e.target.value as MovementType })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="PURCHASE_RECEIPT">PURCHASE_RECEIPT (Stock In)</option>
                <option value="DISPATCH_TO_SITE">DISPATCH_TO_SITE (Stock Out)</option>
                <option value="RETURN_FROM_SITE">RETURN_FROM_SITE</option>
                <option value="STOCK_ADJUSTMENT_PLUS">STOCK_ADJUSTMENT_PLUS</option>
                <option value="STOCK_ADJUSTMENT_SCRAP">STOCK_ADJUSTMENT_SCRAP</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Project (Optional)</label>
              <select
                value={movementForm.projectId}
                onChange={(e) => setMovementForm({ ...movementForm, projectId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="">None / Main Central Warehouse</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t.common.quantity}
                type="number"
                min="0.1"
                step="0.1"
                required
                value={movementForm.quantity}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, quantity: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label="Unit Cost ($)"
                type="number"
                step="0.01"
                value={movementForm.unitCost}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, unitCost: parseFloat(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              label="Delivery / Ref #"
              value={movementForm.referenceNumber}
              onChange={(e) =>
                setMovementForm({ ...movementForm, referenceNumber: e.target.value })
              }
              placeholder="e.g. DO-99882"
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMovementOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.confirm}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

