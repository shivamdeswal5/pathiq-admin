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

interface TenantRowProps {
  tenant: AdminTenantListItem;
  onApproveUtr: (tenant: AdminTenantListItem) => void;
  onExtendTrial: (tenant: AdminTenantListItem) => void;
  onToggleSuspend: (tenant: AdminTenantListItem) => void;
  onImpersonate: (tenant: AdminTenantListItem) => void;
  onPurgeData: (tenant: AdminTenantListItem) => void;
}

export function TenantRow({
  tenant,
  onApproveUtr,
  onExtendTrial,
  onToggleSuspend,
  onImpersonate,
  onPurgeData,
}: TenantRowProps) {
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
    <tr className="hover:bg-slate-50/70 transition">
      {/* Lab Name & Location */}
      <td className="py-4 px-4">
        <div className="font-bold text-slate-900">{tenant.labName}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 text-slate-400" />
          <span>{tenant.city || 'India'}</span>
        </div>
      </td>

      {/* Owner & Contact */}
      <td className="py-4 px-4">
        <div className="text-slate-800 font-semibold text-xs">
          {tenant.ownerName || 'Lab Administrator'}
        </div>
        {tenant.ownerEmail && (
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Mail className="h-3 w-3 text-slate-400" />
            <span>{tenant.ownerEmail}</span>
          </div>
        )}
        <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
          {tenant.phone ? (
            <>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                {tenant.phone}
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
          {tenant.planName || tenant.planSlug}
        </span>
        <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
          {tenant.billingCycle || 'MONTHLY'}
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <StatusBadge status={tenant.status} />
      </td>

      {/* Countdown */}
      <td className="py-4 px-4">{renderDaysRemaining(tenant.daysRemaining, tenant.status)}</td>

      {/* Operational Actions */}
      <td className="py-4 px-4 text-right">
        <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
          {/* Login as Lab (Impersonate) */}
          <button
            onClick={() => onImpersonate(tenant)}
            title="Launch Support Impersonation Session (Login as Lab)"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
          >
            <Eye className="h-3 w-3 text-indigo-600" />
            <span>Login</span>
          </button>

          {/* Extend Trial */}
          <button
            onClick={() => onExtendTrial(tenant)}
            title="Extend lab trial period"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
          >
            <Clock className="h-3 w-3 text-amber-600" />
            <span>+Trial</span>
          </button>

          {/* Suspend / Resume */}
          <button
            onClick={() => onToggleSuspend(tenant)}
            title={isSuspended ? 'Resume lab access' : 'Suspend lab access'}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              isSuspended
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
            }`}
          >
            {isSuspended ? (
              <>
                <PlayCircle className="h-3 w-3 text-emerald-600" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <PauseCircle className="h-3 w-3 text-rose-600" />
                <span>Suspend</span>
              </>
            )}
          </button>

          {/* Purge Demo Test Data */}
          <button
            onClick={() => onPurgeData(tenant)}
            title="Purge demo test records before going live (keeps catalog and profiles)"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 border border-slate-200 transition cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Purge Demo</span>
          </button>


          {/* Approve UTR */}
          <button
            onClick={() => onApproveUtr(tenant)}
            title="Record offline UTR activation"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-teal-600" />
            <span>UTR</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
