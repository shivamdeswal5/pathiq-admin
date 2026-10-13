import { useState } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { AdminPaymentListItem } from '@/types/admin';

interface PaymentCardProps {
  payment: AdminPaymentListItem;
}

export function PaymentCard({ payment: p }: PaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const amountInr = (p.amountInr || 0).toLocaleString('en-IN');
  const isManual = p.provider === 'MANUAL';
  const refText = p.providerPaymentId || p.providerOrderId || p.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(refText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3 hover:border-teal-200 transition">
      {/* Header: Amount and Status */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Collected</span>
          <span className="text-lg font-black text-slate-900 font-mono">₹{amountInr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isManual
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            {p.method || p.provider}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              p.status === 'SUCCESS' || p.status === 'CAPTURED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>{p.status}</span>
          </span>
        </div>
      </div>

      {/* Reference & Date */}
      <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Ref / UTR:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800">
            <span className="truncate max-w-[200px]">{refText}</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-600 p-1 rounded transition cursor-pointer"
              title="Copy reference number"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Date &amp; Time:</span>
          <span>
            {p.createdAt
              ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Plan & Audit Trail */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
        <div>
          <span className="text-slate-500">Plan: </span>
          <span className="font-bold text-slate-800">{p.planName || 'Diagnostic Subscription'}</span>
        </div>
        <div className="font-mono text-[10px]">
          {p.details?.approvedBy ? (
            <span className="text-emerald-700 font-bold">Approved by {p.details.approvedBy}</span>
          ) : (
            <span className="text-slate-400">System Webhook</span>
          )}
        </div>
      </div>
    </div>
  );
}
