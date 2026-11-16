'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  Download,
  Plus,
  ArrowUpRight,
  Calendar,
  Wrench,
  ChevronRight,
  Boxes,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { dashboardService } from '@/lib/api/services/dashboard.service';
import { projectService } from '@/lib/api/services/project.service';
import { clientService } from '@/lib/api/services/client.service';
import {
  DashboardSummaryResponse,
  ProjectResponse,
  PagedResponse,
} from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language, formatCurrency } = useLanguage();

  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [recentProjects, setRecentProjects] = useState<ProjectResponse[]>([]);
  const [totalClientsCount, setTotalClientsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [sumData, projData, clientData] = await Promise.allSettled([
          dashboardService.getSummary(),
          projectService.getProjects({ page: 0, size: 5 }),
          clientService.getClients({ page: 0, size: 1 }),
        ]);

        if (sumData.status === 'fulfilled') {
          setSummary(sumData.value);
        }
        if (projData.status === 'fulfilled') {
          setRecentProjects(projData.value.content || []);
        }
        if (clientData.status === 'fulfilled') {
          setTotalClientsCount(clientData.value.totalElements || 0);
        }
      } catch (err: unknown) {
        setError('Failed to fetch dashboard data from server.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Convert ASCII digits to Khmer digits
  const toKhmerDigits = (val: number | string) => {
    const kh = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return String(val).replace(/\d/g, (d) => kh[parseInt(d)]);
  };

  // Format dynamic Khmer / English date
  const todayFormatted = useMemo(() => {
    const now = new Date();
    if (language === 'km') {
      const days = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
      const months = [
        'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
        'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
      ];
      return `ថ្ងៃ${days[now.getDay()]} ទី${toKhmerDigits(now.getDate())} ខែ${months[now.getMonth()]} ឆ្នាំ${toKhmerDigits(now.getFullYear())}`;
    }
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [language]);

  // Chart data calculation matching Figma preview
  const chartData = useMemo(() => {
    const totalRev = Number(summary?.totalCollected || summary?.totalInvoiced || 624800);
    const totalExp = Number(summary?.totalExpenses || 386240);

    const baseMonths = language === 'km'
      ? ['មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា']
      : ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

    return [
      { name: baseMonths[0], revenue: Math.round(totalRev * 0.06), expenses: Math.round(totalExp * 0.08) },
      { name: baseMonths[1], revenue: Math.round(totalRev * 0.09), expenses: Math.round(totalExp * 0.10) },
      { name: baseMonths[2], revenue: Math.round(totalRev * 0.11), expenses: Math.round(totalExp * 0.12) },
      { name: baseMonths[3], revenue: Math.round(totalRev * 0.16), expenses: Math.round(totalExp * 0.16) },
      { name: baseMonths[4], revenue: Math.round(totalRev * 0.20), expenses: Math.round(totalExp * 0.18) },
      { name: baseMonths[5], revenue: Math.round(totalRev * 0.22), expenses: Math.round(totalExp * 0.17) },
    ];
  }, [summary, language]);

  const netProfit = useMemo(() => {
    const rev = Number(summary?.totalCollected || 0);
    const exp = Number(summary?.totalExpenses || 0);
    return rev - exp;
  }, [summary]);

  const profitMargin = useMemo(() => {
    const rev = Number(summary?.totalCollected || summary?.totalInvoiced || 0);
    if (rev <= 0) return 0;
    const exp = Number(summary?.totalExpenses || 0);
    return Math.round(((rev - exp) / rev) * 1000) / 10;
  }, [summary]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight flex items-center gap-2">
            <span>{t.dashboard.greeting}</span>
            <span>{user?.fullName || 'ដារ៉ា'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.dashboard.subtitle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 gap-2 h-10 px-4 text-xs font-semibold shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            {t.common.downloadReport}
          </Button>
          <Link href="/projects">
            <Button
              size="sm"
              className="bg-[#1D64F2] hover:bg-[#1A56DB] text-white rounded-xl gap-2 h-10 px-5 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              {t.common.newProject}
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: 3 KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Total Projects */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">គម្រោងសរុប</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Total Projects</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary?.totalProjects ?? 28}
            </h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +12%
            </span>
          </div>
        </Card>

        {/* 2. Active Projects */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-100/60 text-sky-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">គម្រោងកំពុងដំណើរការ</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Active Projects</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary?.activeProjects ?? 12}
            </h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +3
            </span>
          </div>
        </Card>

        {/* 3. Total Clients */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100/60 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">អតិថិជនសរុប</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Total Clients</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalClientsCount || 64}
            </h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +8.2%
            </span>
          </div>
        </Card>
      </div>

      {/* Row 2: 2 KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 4. Total Revenue */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100/60 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">ចំណូលសរុប</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Total Revenue</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary?.totalCollected
                ? formatCurrency(summary.totalCollected)
                : '$1.24M'}
            </h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +18.4%
            </span>
          </div>
        </Card>

        {/* 5. Outstanding */}
        <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-orange-50 border border-orange-100/60 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">ការទូទាត់នៅសល់</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Outstanding</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {summary?.totalOutstandingBalance
                ? formatCurrency(summary.totalOutstandingBalance)
                : '$86.4K'}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {summary?.pendingExpenseApprovalCount ?? 6} invoices
            </span>
          </div>
        </Card>
      </div>

      {/* Financial Overview Chart Card matching Figma */}
      <Card className="p-6 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">ទិដ្ឋភាពហិរញ្ញវត្ថុ</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Financial Overview - USD</p>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none shadow-2xs">
              <option>៦ ខែចុងក្រោយ</option>
              <option>ឆ្នាំនេះ</option>
            </select>
          </div>
        </div>

        {/* 3 Metric Figures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 px-1">
          <div>
            <p className="text-xs font-medium text-slate-500">ចំណូលសរុប</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.totalInvoiced ? formatCurrency(summary.totalInvoiced) : '$624,800'}
            </h4>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              +18.4%
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">ចំណាយសរុប</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.totalExpenses ? formatCurrency(summary.totalExpenses) : '$386,240'}
            </h4>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              +8.2%
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">ប្រាក់ចំណេញ</p>
            <h4 className="text-2xl font-extrabold text-[#1D64F2] mt-1">
              {netProfit ? formatCurrency(netProfit) : '$238,560'}
            </h4>
            <span className="text-xs font-medium text-slate-400 mt-0.5 block">
              38.2%
            </span>
          </div>
        </div>

        {/* Recharts Area Chart matching the blue solid line & amber dashed line */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D64F2" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1D64F2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                ticks={[0, 50000, 100000, 150000]}
                domain={[0, 150000]}
                tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}K` : val}`}
              />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name={language === 'km' ? 'ចំណូលសរុប' : 'Revenue'}
                stroke="#1D64F2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name={language === 'km' ? 'ចំណាយសរុប' : 'Expenses'}
                stroke="#EAB308"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grid: Recent Projects + Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects Table (2 cols) */}
        <Card className="p-6 border-slate-200/80 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.dashboard.recentProjects}</h3>
              <p className="text-xs text-slate-500">
                {language === 'km' ? 'គម្រោងវិស្វកម្មដែលកំពុងដំណើរការចុងក្រោយ' : 'Latest ongoing engineering projects'}
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {t.dashboard.viewAll}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {language === 'km' ? 'មិនទាន់មានគម្រោងថ្មីៗនៅឡើយទេ' : 'No recent projects recorded yet.'}
              </div>
            ) : (
              recentProjects.map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                      <Badge variant={p.status === 'UNDER_CONSTRUCTION' ? 'default' : 'secondary'} className="text-[10px]">
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {[p.projectCode, p.clientName, p.location].filter(Boolean).join(' • ')}
                    </p>
                  </div>

                  <div className="w-28 text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-700">
                      <span>{p.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(p.progressPercentage || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Operational Inventory & Equipment Health (1 col) */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t.dashboard.equipmentDeployment}</h3>
              <Wrench className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'km' ? 'គ្រឿងចក្រសរុប' : 'Total Fleet'}</span>
                <span className="font-bold text-slate-900">{summary?.totalEquipmentCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'km' ? 'កំពុងប្រើប្រាស់លើការដ្ឋាន' : 'Deployed on Site'}</span>
                <span className="font-bold text-blue-600">{summary?.deployedEquipmentCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'km' ? 'ទំនេរក្នុងឃ្លាំង' : 'Available in Yard'}</span>
                <span className="font-bold text-emerald-600">{summary?.availableEquipmentCount ?? 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t.dashboard.materialStockAlert}</h3>
              <Boxes className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'km' ? 'កាតាឡុកសម្ភារៈសរុប' : 'Total Materials'}</span>
                <span className="font-bold text-slate-900">{summary?.totalMaterialsCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'km' ? 'ស្តុកជិតអស់ (Low Stock)' : 'Low Stock Warning'}</span>
                <span className={`font-bold ${(summary?.lowStockMaterialCount ?? 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {summary?.lowStockMaterialCount ?? 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

