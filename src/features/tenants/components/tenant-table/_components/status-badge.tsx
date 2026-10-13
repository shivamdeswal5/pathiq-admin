import { CheckCircle2, Clock, AlertTriangle, Lock, PauseCircle, XCircle } from 'lucide-react';
import { SubscriptionStatus } from '@/types/admin';

interface StatusBadgeProps {
  status: SubscriptionStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
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
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
          <PauseCircle className="h-3 w-3" />
          <span>Suspended</span>
        </span>
      );
    case 'LOCKED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <Lock className="h-3 w-3" />
          <span>Locked</span>
        </span>
      );
    case 'CANCELED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <XCircle className="h-3 w-3" />
          <span>Canceled</span>
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          {status}
        </span>
      );
  }
}
