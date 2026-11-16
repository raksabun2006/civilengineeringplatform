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
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';

interface NavItem {
  href: string;
  km: string;
  en: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({ className, isCollapsed = false, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { language, getLocalizedPath } = useLanguage();

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

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        'bg-[#0B192C] text-white flex flex-col h-screen select-none border-r border-[#152844] shrink-0 transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Brand Header with Close & Open Button on Top */}
      <div
        className={cn(
          'border-b border-[#152844]/60 shrink-0 flex items-center transition-all duration-300',
          isCollapsed ? 'h-20 justify-center px-2' : 'h-20 justify-between px-5'
        )}
      >
        {isCollapsed ? (
          /* When collapsed: Open button right on top of the sidebar */
          <button
            type="button"
            onClick={onToggle}
            title={language === 'km' ? 'ពង្រីកម៉ឺនុយ' : 'Expand Sidebar'}
            aria-label="Expand Sidebar"
            className="h-11 w-11 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center group"
          >
            <PanelLeftOpen className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          /* When expanded: Logo + Close button on top of the sidebar */
          <>
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-[#0C1E3C] border-2 border-amber-400/90 flex items-center justify-center shrink-0 shadow-xs">
                {/* Engineering Bars Icon */}
                <div className="flex items-end gap-1 h-5">
                  <div className="w-1.5 h-3 bg-blue-500 rounded-xs" />
                  <div className="w-1.5 h-5 bg-blue-400 rounded-xs" />
                  <div className="w-1.5 h-4 bg-blue-600 rounded-xs" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center text-xl font-bold tracking-tight">
                  <span className="text-[#3B82F6]">Engineer</span>
                  <span className="text-amber-400">Biz</span>
                </div>
                <span className="text-[10px] text-slate-400/80 font-medium tracking-wide truncate">
                  Enterprise Workspace
                </span>
              </div>
            </div>

            {/* Close Button on Top */}
            <button
              type="button"
              onClick={onToggle || onClose}
              title={language === 'km' ? 'បង្រួមម៉ឺនុយ' : 'Collapse Sidebar'}
              aria-label="Collapse Sidebar"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <PanelLeftClose className="h-5 w-5 hidden lg:block" />
              <X className="h-5 w-5 lg:hidden" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <div
        className={cn(
          'flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-slate-700',
          isCollapsed ? 'px-2 space-y-2' : 'px-3 space-y-1.5'
        )}
      >
        {navItems.map((item) => {
          const normalizedPath = pathname.replace(/^\/(km|en)(\/|$)/, '/');
          const isActive = normalizedPath === item.href || (item.href !== '/dashboard' && normalizedPath.startsWith(item.href));
          const targetHref = getLocalizedPath(item.href);
          const Icon = item.icon;
          const tooltip = language === 'km' ? `${item.km} (${item.en})` : `${item.en} (${item.km})`;

          if (isCollapsed) {
            return (
              <Link
                key={item.href}
                href={targetHref}
                onClick={handleNavClick}
                title={tooltip}
                className={cn(
                  'h-11 w-11 mx-auto flex items-center justify-center rounded-xl transition-all relative group',
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                )}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-400 rounded-l-full" />
                )}
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-white'
                  )}
                />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={targetHref}
              onClick={handleNavClick}
              className={cn(
                'group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 relative text-left',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              )}
            >
              {/* Active Indicator Bar on right edge */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-400 rounded-l-md" />
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
                    isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-300 group-hover:text-white'
                  )}
                >
                  {language === 'km' ? item.km : item.en}
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-tight truncate mt-0.5',
                    isActive ? 'text-slate-400 font-medium' : 'text-slate-400/90 font-medium group-hover:text-slate-300'
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
      {isCollapsed ? (
        <div className="p-3 border-t border-[#152844]/60 mt-auto flex justify-center">
          <a
            href="mailto:contact@engineerbiz.com.kh"
            title="EngineerBiz Support"
            className="h-10 w-10 rounded-xl bg-[#0e2140] border border-[#1a335e] flex items-center justify-center text-amber-400 hover:bg-[#183463] hover:text-amber-300 transition-colors"
          >
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          </a>
        </div>
      ) : (
        <div className="p-4 border-t border-[#152844]/60 mt-auto">
          <div className="bg-[#0e2140] border border-[#1a335e] rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  {language === 'km' ? 'ត្រូវការជំនួយ?' : 'Need Help?'}
                </p>
                <p className="text-[10px] text-slate-400">EngineerBiz Support</p>
              </div>
            </div>
            <a
              href="mailto:contact@engineerbiz.com.kh"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#254275] bg-[#12274b] text-[11px] font-medium text-slate-200 hover:text-white hover:bg-[#183463] transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
              {language === 'km' ? 'ទាក់ទងក្រុមជំនួយ' : 'Contact Support'}
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}

