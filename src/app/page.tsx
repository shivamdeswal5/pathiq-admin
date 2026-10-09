'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AdminHeader } from '@/components/layout/admin-header';
import { KpiSummary } from '@/features/dashboard/components/kpi-summary';
import { TenantTable } from '@/features/tenants/components/tenant-table';
import { PaymentLedger } from '@/features/payments/components/payment-ledger';
import { OnboardLabModal } from '@/features/tenants/components/onboard-lab-modal';
import { ActivationModal } from '@/features/payments/components/activation-modal';
import { useTenantsQuery } from '@/features/tenants/api/tenants.queries';
import { usePaymentsQuery } from '@/features/payments/api/payments.queries';
import { AdminTenantListItem } from '@/types/admin';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userEmail, loading: authLoading, isAuthenticated, handleLogout } = useAuth();

  // URL-driven tab & filter state
  const activeTab = searchParams.get('tab') === 'payments' ? 'payments' : 'tenants';
  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'ALL';

  const updateUrlParams = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'status' && value === 'ALL')) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`/${query}`);
  };

  const handleTabChange = (tab: 'tenants' | 'payments') => {
    updateUrlParams({ tab });
  };

  const handleSearchChange = (q: string) => {
    updateUrlParams({ q });
  };

  const handleStatusFilterChange = (status: string) => {
    updateUrlParams({ status });
  };

  // Queries
  const {
    data: tenants = [],
    isLoading: tenantsLoading,
    isFetching: tenantsFetching,
    refetch: refetchTenants,
  } = useTenantsQuery();

  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    isFetching: paymentsFetching,
    refetch: refetchPayments,
  } = usePaymentsQuery();

  const payments = useMemo(() => paymentsData?.items || [], [paymentsData]);

  // Modals state
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [selectedTenantForUtr, setSelectedTenantForUtr] = useState<AdminTenantListItem | null>(null);

  const handleRefreshAll = () => {
    refetchTenants();
    refetchPayments();
  };

  const openUtrModal = (tenant: AdminTenantListItem) => {
    setSelectedTenantForUtr(tenant);
    setActivationModalOpen(true);
  };

  // Compute KPI stats
  const stats = useMemo(() => {
    const total = tenants.length;
    const active = tenants.filter((t) => t.status === 'ACTIVE').length;
    const trialing = tenants.filter((t) => t.status === 'TRIALING').length;
    const expiringSoon = tenants.filter(
      (t) => (t.status === 'TRIALING' || t.status === 'GRACE_PERIOD') && t.daysRemaining <= 3,
    ).length;

    const totalRevenueInr = payments.reduce((acc, p) => acc + (p.amountInr || 0), 0);

    return { total, active, trialing, expiringSoon, totalRevenueInr };
  }, [tenants, payments]);

  // Auth gatekeeper
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Checking administrator privileges...</p>
        </div>
      </div>
    );
  }

  const isRefreshing = tenantsFetching || paymentsFetching;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-600 selection:text-white">
      <AdminHeader
        userEmail={userEmail}
        onRefresh={handleRefreshAll}
        refreshing={isRefreshing}
        onOpenOnboardModal={() => setOnboardModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Dashboard */}
        <KpiSummary stats={stats} />

        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabChange('tenants')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'tenants'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Diagnostic Laboratories</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'tenants' ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tenants.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('payments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Platform Payment Ledger</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'payments' ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {payments.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Pathiq Operations v1.0.0 — India Standalone Edition
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tenants' ? (
          <TenantTable
            tenants={tenants}
            loading={tenantsLoading}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusFilterChange}
            onApproveUtr={openUtrModal}
          />
        ) : (
          <PaymentLedger payments={payments} loading={paymentsLoading} />
        )}
      </main>

      {/* Onboard New Lab Modal */}
      <OnboardLabModal
        isOpen={onboardModalOpen}
        onClose={() => setOnboardModalOpen(false)}
      />

      {/* Approve Offline UTR Modal */}
      <ActivationModal
        isOpen={activationModalOpen}
        onClose={() => {
          setActivationModalOpen(false);
          setSelectedTenantForUtr(null);
        }}
        tenant={selectedTenantForUtr}
      />
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
