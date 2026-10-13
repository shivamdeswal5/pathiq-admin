'use client';

import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { KpiSummarySkeleton } from '@/components/ui/skeleton';

interface KpiSummaryProps {
  stats: {
    total: number;
    active: number;
    trialing: number;
    expiringSoon: number;
    totalRevenueInr: number;
  };
  isLoading?: boolean;
}

export function KpiSummary({ stats, isLoading }: KpiSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return <KpiSummarySkeleton />;
  }

  const cards = [
    {
      title: 'Total Labs Registered',
      value: stats.total,
      subtitle: 'Across India',
      icon: Building2,
      iconColor: 'text-teal-600',
      badge: 'Pilot Directory',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'Active Paid Subscriptions',
      value: stats.active,
      subtitle: 'Unlocked Diagnostics',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      badge: 'Revenue Generating',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'In 14-Day Free Trial',
      value: stats.trialing,
      subtitle: 'Evaluating Platform',
      icon: Clock,
      iconColor: 'text-sky-600',
      badge: 'Conversion Pipeline',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      title: 'Expiring Soon (≤3 Days)',
      value: stats.expiringSoon,
      subtitle: 'Urgent WhatsApp Follow-up',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      badge: 'Grace & UTR Priority',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Platform Cash Collected',
      value: `₹${stats.totalRevenueInr.toLocaleString('en-IN')}`,
      subtitle: 'Verified Bank UTRs & UPI',
      icon: IndianRupee,
      iconColor: 'text-teal-700',
      badge: 'Gross Revenue',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  ];

  return (
    <div className="space-y-1.5 sm:space-y-0">
      {/* Mobile-only section header with collapse toggle */}
      <div className="flex sm:hidden items-center justify-between px-0.5 text-xs text-slate-500 font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Platform Overview
          </span>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-medium border border-teal-200/60">
            5 Metrics
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 active:scale-95 transition cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <span>Expand</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Collapsed 1-line glance bar for mobile */}
      {isCollapsed && (
        <div
          onClick={() => setIsCollapsed(false)}
          className="sm:hidden bg-white border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs cursor-pointer shadow-2xs hover:border-teal-300 transition"
        >
          <div className="flex items-center gap-2.5 text-slate-700 font-semibold overflow-x-auto scrollbar-none">
            <span className="flex items-center gap-1 shrink-0 text-slate-800">
              <Building2 className="h-3.5 w-3.5 text-teal-600" /> {stats.total} Labs
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 shrink-0 text-slate-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {stats.active} Paid
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 shrink-0 text-slate-800">
              <IndianRupee className="h-3.5 w-3.5 text-teal-700" /> ₹{stats.totalRevenueInr.toLocaleString('en-IN')}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
        </div>
      )}

      {/* Cards container: horizontal snap-rail on mobile, 5-col grid on desktop */}
      <div
        className={`${
          isCollapsed ? 'hidden sm:grid' : 'flex sm:grid'
        } overflow-x-auto snap-x snap-mandatory gap-2.5 pb-1 -mx-3.5 px-3.5 scrollbar-none sm:grid-cols-2 lg:grid-cols-5 sm:gap-4 sm:mx-0 sm:px-0 sm:pb-0`}
      >
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="w-[165px] min-w-[165px] shrink-0 snap-start sm:w-auto bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col justify-between shadow-2xs sm:shadow-xs hover:border-teal-300 transition"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  {c.title}
                </span>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.iconColor}`} />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2 sm:mt-3">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {c.value}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${c.badgeColor} truncate max-w-[85px] sm:max-w-none`}
                >
                  {c.badge}
                </span>
              </div>
              <div className="mt-1.5 sm:mt-3 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                <span>{c.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
