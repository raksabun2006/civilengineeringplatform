'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Load saved preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('civilbiz_sidebar_open');
      if (saved !== null) {
        setDesktopSidebarOpen(saved === 'true');
      }
    } catch (_) {}
  }, []);

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('civilbiz_sidebar_open', String(next));
      } catch (_) {}
      return next;
    });
  };

  // If on login page, don't show the dashboard shell
  const normalizedPath = pathname ? pathname.replace(/^\/(km|en)(\/|$)/, '/') : '';
  if (pathname === '/login' || pathname === '/' || normalizedPath === '/login' || normalizedPath === '/' || normalizedPath === '') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">EngineerBiz Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Collapsible Sidebar (Icon Rail when collapsed, Full width when expanded) */}
      <div className="hidden lg:flex shrink-0 h-screen">
        <Sidebar
          isCollapsed={!desktopSidebarOpen}
          onToggle={toggleDesktopSidebar}
          onClose={toggleDesktopSidebar}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col z-50 animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          sidebarOpen={desktopSidebarOpen}
          onMenuClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setMobileOpen(true);
            } else {
              toggleDesktopSidebar();
            }
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

