'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  CreditCard,
  Save,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { companyService } from '@/lib/api/services/document.service';
import { CompanyProfileResponse, CompanyProfileRequest } from '@/types/api';
import { getErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyProfileRequest>({
    companyNameEn: '',
    companyNameKm: '',
    registrationNumber: '',
    vatTin: '',
    email: '',
    phone: '',
    website: '',
    addressLine1: '',
    city: 'Phnom Penh',
    country: 'Cambodia',
    defaultCurrency: 'USD',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankSwiftCode: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getProfile();
      if (data) {
        setFormData({
          companyNameEn: data.companyNameEn || '',
          companyNameKm: data.companyNameKm || '',
          registrationNumber: data.registrationNumber || '',
          vatTin: data.vatTin || '',
          email: data.email || '',
          phone: data.phone || '',
          website: data.website || '',
          addressLine1: data.addressLine1 || '',
          city: data.city || 'Phnom Penh',
          country: data.country || 'Cambodia',
          defaultCurrency: data.defaultCurrency || 'USD',
          bankName: data.bankName || '',
          bankAccountName: data.bankAccountName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankSwiftCode: data.bankSwiftCode || '',
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await companyService.updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-blue-600" />
            <span>{t.settings.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.settings.subtitle}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProfile}
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-10 px-3 text-xs self-start"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t.common.refresh}
        </Button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{t.common.success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Corporate Legal Profile */}
          <Card className="p-6 border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'km' ? 'ព័ត៌មានផ្លូវការរបស់ក្រុមហ៊ុន' : 'Company Legal Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.settings.companyNameEn}
                required
                value={formData.companyNameEn}
                onChange={(e) => setFormData({ ...formData, companyNameEn: e.target.value })}
              />

              <Input
                label={t.settings.companyNameKm}
                required
                value={formData.companyNameKm}
                onChange={(e) => setFormData({ ...formData, companyNameKm: e.target.value })}
              />

              <Input
                label={t.settings.regNumber}
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />

              <Input
                label={t.settings.vatTin}
                value={formData.vatTin}
                onChange={(e) => setFormData({ ...formData, vatTin: e.target.value })}
              />

              <Input
                label={t.settings.email}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label={t.settings.phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label={t.settings.website}
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />

              <Input
                label={t.settings.address}
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              />
            </div>
          </Card>

          {/* Banking & Settlement Details */}
          <Card className="p-6 border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'km' ? 'គណនីធនាគារ និងការទូទាត់' : 'Banking & Disbursement Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.settings.bankName}
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. Advanced Bank of Asia (ABA)"
              />

              <Input
                label={t.settings.bankAccountName}
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                placeholder="e.g. ENGINEERBIZ CO LTD"
              />

              <Input
                label={t.settings.bankAccountNumber}
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                placeholder="000 123 456"
              />

              <Input
                label={t.settings.bankSwiftCode}
                value={formData.bankSwiftCode}
                onChange={(e) => setFormData({ ...formData, bankSwiftCode: e.target.value })}
                placeholder="ABARKHPP"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-11 px-6 text-xs font-semibold shadow-xs"
            >
              <Save className="h-4 w-4" />
              {saving ? t.common.loading : t.common.save}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

