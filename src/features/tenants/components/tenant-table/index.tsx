'use client';

import { useMemo } from 'react';
import { Search, Building2 } from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';
import { TableHeader } from './_components/table-header';
import { TenantRow } from './_components/tenant-row';
import { TenantCard } from './_components/tenant-card';
import { TenantTableSkeleton, TenantCardSkeleton } from '@/components/ui/skeleton';

interface TenantTableProps {
  tenants: AdminTenantListItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onApproveUtr: (tenant: AdminTenantListItem) => void;
  onExtendTrial: (tenant: AdminTenantListItem) => void;
  onToggleSuspend: (tenant: AdminTenantListItem) => void;
  onImpersonate: (tenant: AdminTenantListItem) => void;
  onPurgeData: (tenant: AdminTenantListItem) => void;
}

export function TenantTable({
  tenants,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onApproveUtr,
  onExtendTrial,
  onToggleSuspend,
  onImpersonate,
  onPurgeData,
}: TenantTableProps) {
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.labName.toLowerCase().includes(q) ||
        (t.ownerName && t.ownerName.toLowerCase().includes(q)) ||
        (t.ownerEmail && t.ownerEmail.toLowerCase().includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q));

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by lab name, owner, city, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition shadow-xs w-full sm:w-auto font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="TRIALING">Trialing (Evaluating)</option>
          <option value="ACTIVE">Active (Paid)</option>
          <option value="GRACE_PERIOD">Grace Period</option>
          <option value="SUSPENDED">Suspended (Admin Hold)</option>
          <option value="LOCKED">Locked / Expired</option>
        </select>
      </div>

      {/* Mobile Cards View (< md) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <TenantCardSkeleton />
        ) : filteredTenants.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-400 bg-white border border-slate-200/80 rounded-2xl">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No laboratories found</p>
            <p className="text-xs text-slate-400 mt-1">
              Adjust your search filter or onboard a new diagnostic lab
            </p>
          </div>
        ) : (
          filteredTenants.map((t) => (
            <TenantCard
              key={t.labId}
              tenant={t}
              onApproveUtr={onApproveUtr}
              onExtendTrial={onExtendTrial}
              onToggleSuspend={onToggleSuspend}
              onImpersonate={onImpersonate}
              onPurgeData={onPurgeData}
            />
          ))
        )}
      </div>

      {/* Desktop Data Grid (md+) */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <TableHeader />
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TenantTableSkeleton />
              ) : filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No laboratories found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or onboard a new lab
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <TenantRow
                    key={t.labId}
                    tenant={t}
                    onApproveUtr={onApproveUtr}
                    onExtendTrial={onExtendTrial}
                    onToggleSuspend={onToggleSuspend}
                    onImpersonate={onImpersonate}
                    onPurgeData={onPurgeData}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
