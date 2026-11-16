'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Shield,
  Mail,
  Phone,
  Briefcase,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { userService } from '@/lib/api/services/user.service';
import {
  UserResponse,
  UserRole,
  UserStatus,
  CreateUserRequest,
  UpdateUserRequest,
  PermissionResponse,
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

export default function TeamPage() {
  const { t, language, formatDate } = useLanguage();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    fullName: '',
    phone: '',
    jobTitle: '',
    role: 'ENGINEER',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers({
        page,
        size: pageSize,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data?.content || []);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await userService.createUser(formData);
      setCreateOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    try {
      await userService.updateUserStatus(userId, status);
      fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const openView = (user: UserResponse) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      fullName: '',
      phone: '',
      jobTitle: '',
      role: 'ENGINEER',
    });
    setFormError(null);
  };

  const roles: UserRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'PROJECT_MANAGER',
    'ENGINEER',
    'ACCOUNTANT',
    'PROCUREMENT_OFFICER',
    'STAFF',
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="navy">Super Admin</Badge>;
      case 'ADMIN':
        return <Badge variant="purple">Admin</Badge>;
      case 'PROJECT_MANAGER':
        return <Badge variant="default">Project Manager</Badge>;
      case 'ENGINEER':
        return <Badge variant="success">Engineer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'INVITED':
        return <Badge variant="warning">Invited</Badge>;
      case 'INACTIVE':
      case 'SUSPENDED':
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
            <UserCheck className="h-6 w-6 text-blue-600" />
            <span>{t.team.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.team.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
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
            {t.team.newUser}
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.team.fullName + '...'}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ')}
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
        ) : users.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description="No staff members registered."
            actionLabel={t.team.newUser}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.team.fullName}</TableHead>
                  <TableHead>{t.team.email}</TableHead>
                  <TableHead>{t.team.jobTitle}</TableHead>
                  <TableHead>{t.team.role}</TableHead>
                  <TableHead>{t.team.status}</TableHead>
                  <TableHead>{t.team.lastLogin}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-slate-50/80">
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">{u.fullName}</div>
                      {u.phone && <span className="text-[10px] text-slate-400">{u.phone}</span>}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{u.email}</TableCell>
                    <TableCell className="text-xs text-slate-700">{u.jobTitle || '-'}</TableCell>
                    <TableCell>{getRoleBadge(u.role)}</TableCell>
                    <TableCell>{getStatusBadge(u.status)}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(u.lastLoginAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => openView(u)}
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

      {/* CREATE USER MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t.team.newUser}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.team.fullName}
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Chan Dara"
              />

              <Input
                label={t.team.email}
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="dara.chan@engineerbiz.com.kh"
              />

              <Input
                label={t.team.phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+855 12 999 888"
              />

              <Input
                label={t.team.jobTitle}
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Senior Structural Engineer"
              />

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-700 block">System Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? t.common.loading : t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW USER DETAILS MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser?.fullName}</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Job Title:</span>
                  <span className="font-semibold text-slate-800">{selectedUser.jobTitle || '-'}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">
                  System Permissions ({selectedUser.permissions?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                  {selectedUser.permissions?.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 font-mono"
                    >
                      {p}
                    </span>
                  ))}
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
    </div>
  );
}

