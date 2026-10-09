'use client';

import React, { useMemo } from 'react';
import {
  Search,
  Building2,
  RefreshCw,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';

interface TenantTableProps {
  tenants: AdminTenantListItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onApproveUtr: (tenant: AdminTenantListItem) => void;
}

export function TenantTable({
  tenants,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onApproveUtr,
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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            <span>Active</span>
          </span>
        );
      case 'TRIALING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="h-3 w-3" />
            <span>Trialing</span>
          </span>
        );
      case 'GRACE_PERIOD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" />
            <span>Grace (72h)</span>
          </span>
        );
      case 'LOCKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="h-3 w-3" />
            <span>Locked</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const renderDaysRemaining = (days: number, status: string) => {
    if (status === 'ACTIVE') {
      return (
        <span className="text-emerald-700 font-mono text-xs font-semibold">
          {days} days left
        </span>
      );
    }
    if (status === 'LOCKED') {
      return <span className="text-rose-600 font-mono text-xs font-semibold">Expired</span>;
    }
    if (days <= 0) {
      return <span className="text-amber-700 font-mono text-xs font-semibold">Ends Today</span>;
    }
    if (days <= 3) {
      return (
        <span className="text-amber-700 font-mono text-xs font-semibold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          {days} days left
        </span>
      );
    }
    return <span className="text-slate-600 font-mono text-xs">{days} days left</span>;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by lab name, owner, email, city, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition shadow-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition shadow-xs w-full sm:w-auto font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="TRIALING">Trialing (Evaluating)</option>
          <option value="ACTIVE">Active (Paid)</option>
          <option value="GRACE_PERIOD">Grace Period</option>
          <option value="LOCKED">Locked / Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Diagnostic Lab</th>
                <th className="py-3.5 px-4">Owner &amp; Direct Contact</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4 text-right">Pilot Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <p className="text-xs font-medium">Loading diagnostic laboratories...</p>
                  </td>
                </tr>
              ) : filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No laboratories found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add a new lab</p>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const rawPhone = t.phone ? t.phone.replace(/[^0-9]/g, '').slice(-10) : '';
                  const whatsappMessage = encodeURIComponent(
                    `Hi ${t.ownerName || 'Doctor'}, following up from Pathiq regarding your diagnostic lab ${t.labName}. How is your lab workflow going?`,
                  );

                  return (
                    <tr key={t.labId} className="hover:bg-slate-50/70 transition">
                      {/* Lab Name & Location */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{t.labName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{t.city || 'India'}</span>
                        </div>
                      </td>

                      {/* Owner & Contact */}
                      <td className="py-4 px-4">
                        <div className="text-slate-800 font-semibold text-xs">{t.ownerName || 'Lab Administrator'}</div>
                        {t.ownerEmail && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{t.ownerEmail}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                          {t.phone ? (
                            <>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" />
                                {t.phone}
                              </span>
                              {rawPhone && (
                                <a
                                  href={`https://wa.me/91${rawPhone}?text=${whatsappMessage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5 font-bold"
                                  title="Chat with owner on WhatsApp"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span className="text-[10px]">Chat</span>
                                </a>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">No phone entered</span>
                          )}
                        </div>
                      </td>

                      {/* Plan & Cycle */}
                      <td className="py-4 px-4 font-mono text-xs">
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {t.planName || t.planSlug}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                          {t.billingCycle || 'MONTHLY'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">{renderStatusBadge(t.status)}</td>

                      {/* Countdown */}
                      <td className="py-4 px-4">{renderDaysRemaining(t.daysRemaining, t.status)}</td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onApproveUtr(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                          <span>Approve UTR</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
