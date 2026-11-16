'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Edit2,
  Eye,
  RefreshCw,
  Calendar,
  DollarSign,
  UserPlus,
  Trash2,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { projectService } from '@/lib/api/services/project.service';
import { clientService } from '@/lib/api/services/client.service';
import { userService } from '@/lib/api/services/user.service';
import {
  ProjectResponse,
  ProjectStatus,
  CreateProjectRequest,
  UpdateProjectRequest,
  ClientResponse,
  ProjectMemberResponse,
  ProjectRole,
  ProjectProgressResponse,
  UserResponse,
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

export default function ProjectsPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'progress' | 'status'>('overview');

  // Related data for details modal
  const [members, setMembers] = useState<ProjectMemberResponse[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProjectProgressResponse[]>([]);

  // Forms
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
    location: '',
    city: 'Phnom Penh',
    clientId: '',
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '',
    contractValue: 0,
    estimatedBudget: 0,
    currency: 'USD',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Assign Member Form
  const [memberUserId, setMemberUserId] = useState('');
  const [memberRole, setMemberRole] = useState<ProjectRole>('SITE_ENGINEER');

  // Record Progress Form
  const [newProgress, setNewProgress] = useState(0);
  const [progressRemarks, setProgressRemarks] = useState('');

  // Status Change Form
  const [newStatus, setNewStatus] = useState<ProjectStatus>('UNDER_CONSTRUCTION');
  const [statusRemarks, setStatusRemarks] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects({
        page,
        size: pageSize,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setProjects(data?.content || []);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
    // Preload clients and users for select menus
    clientService
      .getClients({ page: 0, size: 50 })
      .then((c) => setClients(c?.content || []))
      .catch(() => {});
    userService
      .getUsers({ page: 0, size: 50 })
      .then((u) => setUsers(u?.content || []))
      .catch(() => {});
  }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await projectService.createProject(formData);
      setCreateOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await projectService.updateProject(selectedProject.id, formData);
      setEditOpen(false);
      fetchProjects();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const openDetails = async (project: ProjectResponse) => {
    setSelectedProject(project);
    setActiveTab('overview');
    setDetailsOpen(true);
    setNewProgress(Number(project.completionPercentage || 0));
    setNewStatus(project.status);

    try {
      const [m, p] = await Promise.all([
        projectService.getMembers(project.id),
        projectService.getProgressHistory(project.id),
      ]);
      setMembers(m || []);
      setProgressLogs(p || []);
    } catch {
      // Ignored
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !memberUserId) return;
    setFormLoading(true);
    try {
      await projectService.addMember(selectedProject.id, {
        userId: memberUserId,
        role: memberRole,
      });
      const updated = await projectService.getMembers(selectedProject.id);
      setMembers(updated || []);
      setMemberUserId('');
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedProject) return;
    try {
      await projectService.removeMember(selectedProject.id, memberId);
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleRecordProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormLoading(true);
    try {
      await projectService.recordProgress(selectedProject.id, {
        progressPercentage: Number(newProgress),
        reportDate: new Date().toISOString().split('T')[0],
        remarks: progressRemarks,
      });
      setProgressRemarks('');
      const updatedLogs = await projectService.getProgressHistory(selectedProject.id);
      setProgressLogs(updatedLogs || []);
      fetchProjects();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangeStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setFormLoading(true);
    try {
      const updated = await projectService.updateProjectStatus(selectedProject.id, {
        newStatus,
        remarks: statusRemarks,
      });
      setSelectedProject(updated);
      setStatusRemarks('');
      fetchProjects();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (project: ProjectResponse) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      location: project.location || '',
      city: project.city || 'Phnom Penh',
      clientId: project.clientId,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      targetEndDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : '',
      contractValue: project.contractValue || 0,
      estimatedBudget: project.estimatedBudget,
      currency: 'USD',
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      city: 'Phnom Penh',
      clientId: clients[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: '',
      contractValue: 0,
      estimatedBudget: 0,
      currency: 'USD',
    });
    setFormError(null);
  };

  const projectStatuses: ProjectStatus[] = [
    'PLANNING',
    'BIDDING',
    'DESIGN_PHASE',
    'PERMITTING',
    'UNDER_CONSTRUCTION',
    'ON_HOLD',
    'HANDOVER',
    'DEFECTS_LIABILITY',
    'COMPLETED',
    'CANCELLED',
  ];

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'UNDER_CONSTRUCTION':
        return <Badge variant="default">Under Construction</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PLANNING':
        return <Badge variant="purple">Planning</Badge>;
      case 'ON_HOLD':
        return <Badge variant="warning">On Hold</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
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
            <FolderGit2 className="h-6 w-6 text-blue-600" />
            <span>{t.projects.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.projects.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
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
            {t.projects.newProject}
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
              placeholder={t.projects.name + '...'}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none w-full sm:w-auto"
          >
            <option value="">{language === 'km' ? 'ស្ថានភាពគម្រោងទាំងអស់' : 'All Statuses'}</option>
            {projectStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
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
        ) : projects.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description={t.common.noDataDesc}
            actionLabel={t.projects.newProject}
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
                  <TableHead>{t.projects.projectCode}</TableHead>
                  <TableHead>{t.projects.name}</TableHead>
                  <TableHead>{t.projects.client}</TableHead>
                  <TableHead>{t.projects.budget}</TableHead>
                  <TableHead>{t.projects.progress}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {project.projectCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">{project.name}</div>
                      {project.location && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {project.clientName || 'Civil Client'}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-900">
                      {formatCurrency(project.estimatedBudget)}
                    </TableCell>
                    <TableCell className="w-36">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                        <span>{project.completionPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(project.completionPercentage || 0, 100)}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openDetails(project)}
                          title={t.projects.details}
                        >
                          <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openEdit(project)}
                          title={t.common.edit}
                        >
                          <Edit2 className="h-4 w-4 text-slate-500 hover:text-amber-600" />
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
                {t.common.showing} {projects.length} {t.common.of} {totalElements} {t.common.entries}
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
            <DialogTitle>{t.projects.newProject}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.projects.name}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aeon Mall 3 Extension"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.projects.client} *
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  <option value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.clientCode})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.projects.location}
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Khan Meanchey, Phnom Penh"
              />

              <Input
                label={t.projects.budget}
                type="number"
                step="0.01"
                required
                value={formData.estimatedBudget}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedBudget: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label="Contract Value ($)"
                type="number"
                step="0.01"
                value={formData.contractValue || 0}
                onChange={(e) =>
                  setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.projects.startDate}
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <Input
                label={t.projects.targetEndDate}
                type="date"
                value={formData.targetEndDate || ''}
                onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
              />
            </div>

            <Input
              label={t.common.description}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Engineering scope and structural details..."
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
            <DialogTitle>{t.common.edit}: {selectedProject?.name}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.projects.name}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.projects.client} *
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.projects.location}
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <Input
                label={t.projects.budget}
                type="number"
                step="0.01"
                required
                value={formData.estimatedBudget}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedBudget: parseFloat(e.target.value) || 0 })
                }
              />

              <Input
                label={t.projects.startDate}
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <Input
                label={t.projects.targetEndDate}
                type="date"
                value={formData.targetEndDate || ''}
                onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
              />
            </div>

            <Input
              label={t.common.description}
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

      {/* PROJECT DETAILS & ACTIONS MODAL */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-blue-600" />
                {selectedProject?.name}
              </span>
              {selectedProject && getStatusBadge(selectedProject.status)}
            </DialogTitle>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-2.5 cursor-pointer ${
                activeTab === 'members'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.projects.members} ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`pb-2.5 cursor-pointer ${
                activeTab === 'progress'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.projects.progress} & Timeline
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`pb-2.5 cursor-pointer ${
                activeTab === 'status'
                  ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.projects.changeStatus}
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && selectedProject && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.projects.projectCode}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedProject.projectCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.projects.budget}</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(selectedProject.estimatedBudget)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contract Value</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(selectedProject.contractValue)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.projects.progress}</span>
                  <span className="font-bold text-emerald-600">
                    {selectedProject.completionPercentage || 0}%
                  </span>
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{selectedProject.location || 'No site location registered'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>
                    {formatDate(selectedProject.startDate)} ➔ {formatDate(selectedProject.targetEndDate)}
                  </span>
                </div>
                <p className="text-slate-600 pt-2 border-t border-slate-100">
                  {selectedProject.description || 'No description provided.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Members */}
          {activeTab === 'members' && (
            <div className="space-y-4 py-2">
              <form onSubmit={handleAddMember} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-slate-700">Staff Member</label>
                  <select
                    required
                    value={memberUserId}
                    onChange={(e) => setMemberUserId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="">Select staff...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.jobTitle || u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-44 space-y-1">
                  <label className="text-xs font-medium text-slate-700">Project Role</label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as ProjectRole)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                    <option value="PROJECT_ENGINEER">PROJECT_ENGINEER</option>
                    <option value="STRUCTURAL_ENGINEER">STRUCTURAL_ENGINEER</option>
                    <option value="MEP_ENGINEER">MEP_ENGINEER</option>
                    <option value="SITE_ENGINEER">SITE_ENGINEER</option>
                    <option value="QA_QC_ENGINEER">QA_QC_ENGINEER</option>
                    <option value="QUANTITY_SURVEYOR">QUANTITY_SURVEYOR</option>
                    <option value="SAFETY_OFFICER">SAFETY_OFFICER</option>
                  </select>
                </div>

                <Button type="submit" size="sm" disabled={formLoading} className="h-9 px-3 text-xs gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  {t.projects.addMember}
                </Button>
              </form>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {members.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">No members assigned yet.</p>
                ) : (
                  members.map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{m.userName}</span>
                        <span className="text-[10px] text-slate-400">
                          {m.userJobTitle} • {m.userEmail}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="purple" className="text-[10px]">
                          {m.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => handleRemoveMember(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Progress Logs */}
          {activeTab === 'progress' && (
            <div className="space-y-4 py-2">
              <form onSubmit={handleRecordProgress} className="p-3 bg-slate-50 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Current Progress % (0 - 100)"
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newProgress}
                    onChange={(e) => setNewProgress(parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Site Remarks / Milestones Completed"
                    value={progressRemarks}
                    onChange={(e) => setProgressRemarks(e.target.value)}
                    placeholder="e.g. Foundation slab concrete poured"
                  />
                </div>
                <Button type="submit" size="sm" disabled={formLoading} className="text-xs">
                  {t.projects.recordProgress}
                </Button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {progressLogs.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">No progress logs recorded.</p>
                ) : (
                  progressLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-slate-100 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-blue-600">{log.progressPercentage}%</span>
                        <span className="text-slate-500 ml-2">{log.remarks || 'No remarks'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{formatDate(log.reportDate)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Status Change */}
          {activeTab === 'status' && (
            <form onSubmit={handleChangeStatus} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {projectStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Reason / Remarks"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="e.g. Client permits approved by municipal authorities"
              />

              <Button type="submit" disabled={formLoading} className="text-xs">
                {formLoading ? t.common.loading : 'Update Project Status'}
              </Button>
            </form>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
