'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Files,
  Plus,
  Search,
  Filter,
  Trash2,
  Download,
  RefreshCw,
  FolderGit2,
  FileText,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { documentService } from '@/lib/api/services/document.service';
import { projectService } from '@/lib/api/services/project.service';
import {
  DocumentResponse,
  DocumentType,
  CreateDocumentRequest,
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

export default function DocumentsPage() {
  const { t, language, formatDate } = useLanguage();

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDocumentRequest>({
    projectId: '',
    title: '',
    type: 'STRUCTURAL_DRAWING',
    fileUrl: 'https://storage.engineerbiz.com.kh/docs/sample.pdf',
    fileName: 'structural-dwg-rev2.pdf',
    fileSize: 4500000,
    mimeType: 'application/pdf',
    notes: '',
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

  const fetchDocs = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocumentsByProject(selectedProjectId);
      setDocuments(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await documentService.createDocument({
        ...formData,
        projectId: selectedProjectId,
      });
      setCreateOpen(false);
      fetchDocs();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.common.confirmDelete)) return;
    try {
      await documentService.deleteDocument(id);
      fetchDocs();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const docTypes: DocumentType[] = [
    'ARCHITECTURAL_DRAWING',
    'STRUCTURAL_DRAWING',
    'MEP_DRAWING',
    'SOIL_TEST_REPORT',
    'BOQ_WORKSHEET',
    'SIGNED_CONTRACT',
    'VARIATION_ORDER',
    'BUILDING_PERMIT',
    'SITE_PROGRESS_PHOTO',
    'INVOICE_RECEIPT',
    'COMPLETION_CERTIFICATE',
    'OTHER',
  ];

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Files className="h-6 w-6 text-blue-600" />
            <span>{t.nav.documents}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Drawings, Engineering Plans, Test Reports, and Site Certificates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDocs}
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
            Upload Document
          </Button>
        </div>
      </div>

      {/* Project Selector Bar */}
      <Card className="p-4 border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
            <FolderGit2 className="h-4 w-4 text-blue-600" />
            <span>{language === 'km' ? 'ជ្រើសរើសគម្រោងដើម្បីពិនិត្យឯកសារ:' : 'Select Project:'}</span>
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
        ) : documents.length === 0 ? (
          <EmptyState
            title={t.common.noData}
            description="No documents or blueprints registered for this project."
            actionLabel="Upload Document"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Document Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded Date</TableHead>
                <TableHead className="text-right">{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-mono text-xs font-semibold text-blue-600">
                    {doc.documentCode}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-xs">{doc.title}</div>
                    {doc.notes && <span className="text-[10px] text-slate-400">{doc.notes}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="purple" className="text-[10px]">
                      {(doc.type || doc.documentType || 'SPECIFICATION').replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{doc.fileName}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatFileSize(doc.fileSize ?? doc.fileSizeBytes ?? 0)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{formatDate(doc.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-500 hover:text-blue-600"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload / Register Engineering Document</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs">{formError}</div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Document Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Structural Blueprint Drawing Revision 2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 block">Category *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {docTypes.map((d) => (
                    <option key={d} value={d}>
                      {d.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="File Name"
                required
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                placeholder="drawing-sheet-01.dwg"
              />

              <Input
                label="File URL / CDN Link"
                required
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              />

              <Input
                label="File Size (Bytes)"
                type="number"
                value={formData.fileSize}
                onChange={(e) =>
                  setFormData({ ...formData, fileSize: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              label={t.common.notes}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Engineering stamping and revision details..."
            />

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
    </div>
  );
}

