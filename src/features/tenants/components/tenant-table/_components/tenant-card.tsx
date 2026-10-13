import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  PauseCircle,
  PlayCircle,
  Eye,
  Trash2,
} from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';
import { StatusBadge } from './status-badge';

interface TenantCardProps {
  tenant: AdminTenantListItem;
  onApproveUtr: (tenant: AdminTenantListItem) => void;
  onExtendTrial: (tenant: AdminTenantListItem) => void;
  onToggleSuspend: (tenant: AdminTenantListItem) => void;
  onImpersonate: (tenant: AdminTenantListItem) => void;
  onPurgeData: (tenant: AdminTenantListItem) => void;
}

export function TenantCard({
  tenant,
  onApproveUtr,
  onExtendTrial,
  onToggleSuspend,
  onImpersonate,
  onPurgeData,
}: TenantCardProps) {
  const rawPhone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '').slice(-10) : '';
  const whatsappMessage = encodeURIComponent(
    `Hi ${tenant.ownerName || 'Doctor'}, following up from Pathiq regarding your diagnostic lab ${tenant.labName}. How is your lab workflow going?`,
  );

  const renderDaysRemaining = (days: number, status: string) => {
    if (status === 'ACTIVE') {
      return <span className="text-emerald-700 font-mono text-xs font-semibold">{days} days left</span>;
    }
    if (status === 'SUSPENDED') {
      return <span className="text-rose-600 font-mono text-xs font-semibold">Suspended</span>;
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

  const isSuspended = tenant.status === 'SUSPENDED';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5 hover:border-teal-200 transition">
      {/* Header: Name, Location, Status */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-sm truncate">{tenant.labName}</h3>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{tenant.city || 'India'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={tenant.status} />
          <div className="text-[11px]">{renderDaysRemaining(tenant.daysRemaining, tenant.status)}</div>
        </div>
      </div>

      {/* Metadata: Owner & Plan */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Contact</span>
          <div className="font-semibold text-slate-800 truncate text-[11px]">
            {tenant.ownerName || 'Lab Administrator'}
          </div>
          {tenant.ownerEmail && (
            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate">{tenant.ownerEmail}</span>
            </div>
          )}
          {tenant.phone && (
            <div className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-1">
              <Phone className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{tenant.phone}</span>
              {rawPhone && (
                <a
                  href={`https://wa.me/91${rawPhone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-0.5"
                  title="WhatsApp chat"
                >
                  <MessageSquare className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Plan &amp; Cycle</span>
            <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-200 inline-block font-mono">
              {tenant.planName || tenant.planSlug}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold font-mono mt-1">
            {tenant.billingCycle || 'MONTHLY'}
          </div>
        </div>
      </div>

      {/* Action Buttons (Touch-Optimized Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
        <button
          onClick={() => onImpersonate(tenant)}
          title="Launch Support Impersonation Session (Login as Lab)"
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer min-h-[40px]"
        >
          <Eye className="h-3.5 w-3.5 text-indigo-600" />
          <span>Login</span>
        </button>

        <button
          onClick={() => onExtendTrial(tenant)}
          title="Extend lab trial period"
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer min-h-[40px]"
        >
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          <span>+Trial</span>
        </button>

        <button
          onClick={() => onToggleSuspend(tenant)}
          title={isSuspended ? 'Resume lab access' : 'Suspend lab access'}
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[40px] ${
            isSuspended
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
          }`}
        >
          {isSuspended ? (
            <>
              <PlayCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <PauseCircle className="h-3.5 w-3.5 text-rose-600" />
              <span>Suspend</span>
            </>
          )}
        </button>

        <button
          onClick={() => onPurgeData(tenant)}
          title="Purge demo test records before going live (keeps catalog and profiles)"
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 border border-slate-200 transition cursor-pointer min-h-[40px]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Purge Demo</span>
        </button>


        <button
          onClick={() => onApproveUtr(tenant)}
          title="Record offline UTR activation"
          className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition cursor-pointer min-h-[40px]"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>Approve UTR</span>
        </button>
      </div>
    </div>
  );
}
