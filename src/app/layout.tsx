import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Pathiq Super Admin — Platform Governance & Billing Cockpit',
  description:
    'Mission control panel for Pathiq diagnostic laboratory operating system. Tenant directories, offline UTR verification, and revenue management.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-teal-600 selection:text-white"
      >
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
