import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { AuthProvider } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'EngineerBiz – Engineering Management Platform',
  description: 'Enterprise Civil Engineering & Construction Business Management System',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-[#F8FAFC]">
        <LanguageProvider>
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
