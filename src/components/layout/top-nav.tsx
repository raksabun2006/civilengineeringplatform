'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { notificationService } from '@/lib/api/services/document.service';
import { NotificationResponse } from '@/types/api';
import Link from 'next/link';
import { CambodiaFlag, UkFlag } from '@/components/ui/country-flag';

export function TopNav({
  onMenuClick,
  sidebarOpen = true,
}: {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      notificationService
        .getUnreadCount()
        .then((c) => setUnreadCount(c || 0))
        .catch(() => {});

      notificationService
        .getNotifications({ page: 0, size: 5 })
        .then((res) => setNotifications(res?.content || []))
        .catch(() => {});
    }
  }, [user]);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'ចដ';

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40 shadow-2xs">
      {/* Left: Mobile Menu Button & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          title={language === 'km' ? 'បើកម៉ឺនុយ' : 'Open Menu'}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200/60 transition-all cursor-pointer shrink-0 lg:hidden"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.topNav.searchPlaceholder}
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative h-10 w-10 rounded-xl border border-slate-200/70 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">{t.topNav.notifications}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      await notificationService.markAllAsRead().catch(() => {});
                      setUnreadCount(0);
                    }}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    {t.topNav.markAllRead}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">{t.topNav.noNotifications}</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Single Country Flag (Click to toggle language, no bg or border) */}
        <button
          type="button"
          onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
          title={
            language === 'km'
              ? 'ភាសាខ្មែរ (ចុចដើម្បីប្តូរទៅជា English)'
              : 'English (Click to switch to ភាសាខ្មែរ)'
          }
          aria-label="Toggle language"
          className="p-1 rounded-sm hover:opacity-80 transition-opacity cursor-pointer shrink-0 inline-flex items-center justify-center"
        >
          {language === 'km' ? (
            <CambodiaFlag className="w-7 h-5 rounded-xs object-cover" />
          ) : (
            <UkFlag className="w-7 h-5 rounded-xs object-cover" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pl-2 pr-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all cursor-pointer"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user?.fullName || 'ចាន់ ដារ៉ា'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {user?.jobTitle || user?.role || 'Project Manager'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  {user?.role}
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-500" />
                  {t.topNav.settings}
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  {t.topNav.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

