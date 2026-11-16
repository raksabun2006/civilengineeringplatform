'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Building,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { clientService } from '@/lib/api/services/client.service';
import {
  ClientResponse,
  ClientType,
  ClientStatus,
  CreateClientRequest,
  UpdateClientRequest,
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

export default function ClientsPage() {
  const { t, language, formatCurrency, formatDate } = useLanguage();

  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponse | null>(null);

  // Form states matching backend DTO
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: '',
    nameKhmer: '',
    clientType: 'CORPORATE',
    vatTin: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    billingAddress: '',
    city: 'Phnom Penh',
    paymentTermDays: 30,
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getClients({
        page,
        size: pageSize,
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });
      setClients(data?.content || []);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await clientService.createClient(formData);
      setCreateOpen(false);
      resetForm();
      fetchClients();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await clientService.updateClient(selectedClient.id, {
        name: formData.name,
        nameKhmer: formData.nameKhmer,
        clientType: formData.clientType,
        status: selectedClient.status,
        vatTin: formData.vatTin,
        primaryContactName: formData.primaryContactName,
        primaryContactEmail: formData.primaryContactEmail,
        primaryContactPhone: formData.primaryContactPhone,
        billingAddress: formData.billingAddress,
        city: formData.city,
        paymentTermDays: formData.paymentTermDays,
        notes: formData.notes,
      });
      setEditOpen(false);
      resetForm();
      fetchClients();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    setFormLoading(true);
    try {
      await clientService.deleteClient(selectedClient.id);
      setDeleteOpen(false);
      fetchClients();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (client: ClientResponse) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      nameKhmer: client.nameKhmer || '',
      clientType: client.clientType,
      vatTin: client.vatTin || '',
      primaryContactName: client.primaryContactName || '',
      primaryContactEmail: client.primaryContactEmail || '',
      primaryContactPhone: client.primaryContactPhone || '',
      billingAddress: client.billingAddress || '',
      city: client.city || 'Phnom Penh',
      paymentTermDays: client.paymentTermDays || 30,
      notes: client.notes || '',
    });
    setEditOpen(true);
  };

  const openView = (client: ClientResponse) => {
    setSelectedClient(client);
    setViewOpen(true);
  };

  const openDelete = (client: ClientResponse) => {
    setSelectedClient(client);
    setDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameKhmer: '',
      clientType: 'CORPORATE',
      vatTin: '',
      primaryContactName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      billingAddress: '',
      city: 'Phnom Penh',
      paymentTermDays: 30,
      notes: '',
    });
    setFormError(null);
  };

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'PROSPECT':
        return <Badge variant="default">Prospect</Badge>;
      case 'DORMANT':
        return <Badge variant="warning">Dormant</Badge>;
      case 'BLACKLISTED':
        return <Badge variant="destructive">Blacklisted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-blue-600" />
            <span>{t.clients.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.clients.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
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
            {t.clients.newClient}
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.clients.name + '...'}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="">{language === 'km' ? 'ប្រភេទអតិថិជនទាំងអស់' : 'All Types'}</option>
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="CORPORATE">CORPORATE</option>
              <option value="GOVERNMENT">GOVERNMENT</option>
              <option value="JOINT_VENTURE">JOINT_VENTURE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="">{language === 'km' ? 'ស្ថានភាពទាំងអស់' : 'All Statuses'}</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PROSPECT">PROSPECT</option>
              <option value="DORMANT">DORMANT</option>
              <option value="BLACKLISTED">BLACKLISTED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-red-500">{error}</div>
        ) : clients.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description={t.common.noDataDesc}
            actionLabel={t.clients.newClient}
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
                  <TableHead>{t.clients.clientCode}</TableHead>
                  <TableHead>{t.clients.name}</TableHead>
                  <TableHead>{t.clients.type}</TableHead>
                  <TableHead>{t.clients.contactPerson}</TableHead>
                  <TableHead>{t.clients.phone}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {client.clientCode}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">
                        {language === 'km' && client.nameKhmer ? client.nameKhmer : client.name}
                      </div>
                      {client.vatTin && (
                        <span className="text-[10px] text-slate-400 block">
                          TIN: {client.vatTin}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600 font-medium">{client.clientType}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {client.primaryContactName || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      {client.primaryContactPhone || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openView(client)}
                          title={t.common.view}
                        >
                          <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openEdit(client)}
                          title={t.common.edit}
                        >
                          <Edit2 className="h-4 w-4 text-slate-500 hover:text-amber-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          onClick={() => openDelete(client)}
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
                {t.common.showing} {clients.length} {t.common.of} {totalElements} {t.common.entries}
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
            <DialogTitle>{t.clients.newClient}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.clients.name}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Borey Peng Huoth"
              />

              <Input
                label="ឈ្មោះជាភាសាខ្មែរ (Khmer Name)"
                value={formData.nameKhmer || ''}
                onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                placeholder="ឧ. បុរី ប៉េង ហួត"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.clients.type} *
                </label>
                <select
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value as ClientType })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  <option value="CORPORATE">CORPORATE</option>
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="GOVERNMENT">GOVERNMENT</option>
                  <option value="JOINT_VENTURE">JOINT_VENTURE</option>
                </select>
              </div>

              <Input
                label={t.clients.contactPerson}
                value={formData.primaryContactName || ''}
                onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                placeholder="e.g. Sok Visal"
              />

              <Input
                label={t.clients.phone}
                required
                value={formData.primaryContactPhone}
                onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                placeholder="+855 12 345 678"
              />

              <Input
                label={t.clients.email}
                type="email"
                value={formData.primaryContactEmail || ''}
                onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                placeholder="contact@client.com"
              />

              <Input
                label={t.clients.taxId}
                value={formData.vatTin || ''}
                onChange={(e) => setFormData({ ...formData, vatTin: e.target.value })}
                placeholder="K001-9023456"
              />

              <Input
                label={t.clients.paymentTerms}
                type="number"
                value={formData.paymentTermDays}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTermDays: parseInt(e.target.value) || 30 })
                }
              />
            </div>

            <Input
              label={t.clients.address}
              value={formData.billingAddress || ''}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              placeholder="e.g. #123 St. 271, Phnom Penh"
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
            <DialogTitle>{t.common.edit}: {selectedClient?.name}</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.clients.name}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">
                  {t.clients.type} *
                </label>
                <select
                  value={formData.clientType}
                  onChange={(e) => setFormData({ ...formData, clientType: e.target.value as ClientType })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                >
                  <option value="CORPORATE">CORPORATE</option>
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="GOVERNMENT">GOVERNMENT</option>
                  <option value="JOINT_VENTURE">JOINT_VENTURE</option>
                </select>
              </div>

              <Input
                label={t.clients.contactPerson}
                value={formData.primaryContactName || ''}
                onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
              />

              <Input
                label={t.clients.phone}
                required
                value={formData.primaryContactPhone}
                onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
              />

              <Input
                label={t.clients.email}
                type="email"
                value={formData.primaryContactEmail || ''}
                onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
              />

              <Input
                label={t.clients.paymentTerms}
                type="number"
                value={formData.paymentTermDays}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTermDays: parseInt(e.target.value) || 30 })
                }
              />
            </div>

            <Input
              label={t.clients.address}
              value={formData.billingAddress || ''}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
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

      {/* VIEW DETAILS MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>{selectedClient?.name}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">{t.clients.clientCode}</span>
                  <span className="font-mono font-bold text-slate-800">{selectedClient.clientCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.common.status}</span>
                  {getStatusBadge(selectedClient.status)}
                </div>
                <div>
                  <span className="text-slate-400 block">{t.clients.type}</span>
                  <span className="font-semibold text-slate-800">{selectedClient.clientType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.clients.paymentTerms}</span>
                  <span className="font-semibold text-slate-800">{selectedClient.paymentTermDays || 30} Days</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{selectedClient.primaryContactName || 'No contact person specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{selectedClient.primaryContactPhone || 'No phone number'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{selectedClient.primaryContactEmail || 'No email address'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{selectedClient.billingAddress || selectedClient.city || 'No physical address'}</span>
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

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">{t.common.confirmDelete}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-600">{t.common.confirmDeleteMsg}</p>
          <p className="text-xs font-bold text-slate-900 mt-2">{selectedClient?.name}</p>

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
