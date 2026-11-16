'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderGit2,
  Calculator,
  FileSpreadsheet,
  FileText,
  Wallet,
  Boxes,
  UserCheck,
  Files,
  Settings,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';

interface NavItem {
  href: string;
  km: string;
  en: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      km: 'ផ្ទាំងគ្រប់គ្រង',
      en: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/clients',
      km: 'អតិថិជន',
      en: 'Clients',
      icon: Users,
    },
    {
      href: '/services',
      km: 'សេវាកម្មវិស្វកម្ម',
      en: 'Engineering Services',
      icon: Briefcase,
    },
    {
      href: '/projects',
      km: 'គម្រោង',
      en: 'Projects',
      icon: FolderGit2,
    },
    {
      href: '/boq',
      km: 'បរិមាណការងារ និងការប៉ាន់ស្មាន',
      en: 'BOQ & Estimation',
      icon: Calculator,
    },
    {
      href: '/quotations',
      km: 'សម្រង់តម្លៃ',
      en: 'Quotations',
      icon: FileSpreadsheet,
    },
    {
      href: '/contracts',
      km: 'កិច្ចសន្យា',
      en: 'Contracts',
      icon: FileText,
    },
    {
      href: '/finance',
      km: 'ហិរញ្ញវត្ថុ',
      en: 'Finance',
      icon: Wallet,
    },
    {
      href: '/inventory',
      km: 'សម្ភារៈ និងឧបករណ៍',
      en: 'Materials & Equipment',
      icon: Boxes,
    },
    {
      href: '/team',
      km: 'បុគ្គលិក / ក្រុមការងារ',
      en: 'Employees / Team',
      icon: UserCheck,
    },
    {
      href: '/documents',
      km: 'ឯកសារគម្រោង',
      en: 'Project Documents',
      icon: Files,
    },
    {
      href: '/settings',
      km: 'ការកំណត់ក្រុមហ៊ុន',
      en: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-[#0B1528] text-white flex flex-col h-screen select-none border-r border-[#152542] shrink-0',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-[#152542]/60">
        <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
          {/* Engineering Bars Icon */}
          <div className="flex items-end gap-1 h-5">
            <div className="w-1.5 h-3 bg-amber-400 rounded-xs" />
            <div className="w-1.5 h-5 bg-blue-400 rounded-xs" />
            <div className="w-1.5 h-4 bg-amber-400 rounded-xs" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-lg font-bold tracking-tight">
            <span className="text-white">Engineer</span>
            <span className="text-amber-400">Biz</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Engineering Platform
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 relative text-left',
                isActive
                  ? 'bg-white text-[#0B1528] shadow-md font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-white/6'
              )}
            >
              {/* Active Indicator Bar on right edge */}
              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1 bg-amber-400 rounded-l-full" />
              )}
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-white'
                )}
              />
              <div className="flex flex-col min-w-0 pr-1">
                <span
                  className={cn(
                    'text-[13px] leading-tight truncate',
                    isActive ? 'font-semibold text-slate-900' : 'text-slate-200'
                  )}
                >
                  {language === 'km' ? item.km : item.en}
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-tight truncate',
                    isActive ? 'text-slate-500 font-medium' : 'text-slate-400'
                  )}
                >
                  {language === 'km' ? item.en : item.km}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Support Box at Bottom */}
      <div className="p-4 border-t border-[#152542]/60">
        <div className="bg-[#121F38] border border-[#1E3156] rounded-xl p-3.5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-7 w-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">
                {language === 'km' ? 'ត្រូវការជំនួយ?' : 'Need Help?'}
              </p>
              <p className="text-[10px] text-slate-400">EngineerBiz Support</p>
            </div>
          </div>
          <a
            href="mailto:contact@engineerbiz.com.kh"
            className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#2B4370] bg-[#172747] text-[11px] text-slate-200 hover:text-white hover:bg-[#1E335C] transition-colors"
          >
            <HelpCircle className="h-3 w-3 text-amber-400" />
            {language === 'km' ? 'ទំនាក់ទំនងក្រុមជំនួយ' : 'Contact Support'}
          </a>
        </div>
      </div>
    </aside>
  );
}

