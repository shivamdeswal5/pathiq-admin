'use client';

import React from 'react';
import { Building2, CheckCircle2, Clock, AlertTriangle, IndianRupee } from 'lucide-react';

interface KpiSummaryProps {
  stats: {
    total: number;
    active: number;
    trialing: number;
    expiringSoon: number;
    totalRevenueInr: number;
  };
}

export function KpiSummary({ stats }: KpiSummaryProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-teal-300 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{c.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                {c.badge}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{c.value}</span>
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Icon className={`h-4 w-4 ${c.iconColor}`} />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-medium">
              <span>{c.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
