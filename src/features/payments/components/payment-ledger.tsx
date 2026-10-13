'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, Copy, Check } from 'lucide-react';
import { AdminPaymentListItem } from '@/types/admin';
import { PaymentLedgerSkeleton, PaymentCardSkeleton } from '@/components/ui/skeleton';
import { PaymentCard } from './_components/payment-card';

interface PaymentLedgerProps {
  payments: AdminPaymentListItem[];
  loading: boolean;
}

export function PaymentLedger({ payments, loading }: PaymentLedgerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card List (< md) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <PaymentCardSkeleton />
        ) : payments.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-400 bg-white border border-slate-200/80 rounded-2xl">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No payment records found</p>
            <p className="text-xs text-slate-400 mt-1">Manual bank UTR approvals and webhooks will appear here</p>
          </div>
        ) : (
          payments.map((p) => <PaymentCard key={p.id} payment={p} />)
        )}
      </div>

      {/* Desktop Data Grid (md+) */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction / UTR Ref</th>
                <th className="py-3.5 px-4">Diagnostic Lab</th>
                <th className="py-3.5 px-4">Channel / Mode</th>
                <th className="py-3.5 px-4">Amount (₹)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Audit Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <PaymentLedgerSkeleton />
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No payment records found</p>
                    <p className="text-xs text-slate-400 mt-1">Manual bank UTR approvals and webhooks will appear here</p>
                  </td>
                </tr>
              ) : (
              payments.map((p) => {
                const amountInr = (p.amountInr || 0).toLocaleString('en-IN');
                const isManual = p.provider === 'MANUAL';
                const refText = p.providerPaymentId || p.providerOrderId || p.id;
                const isCopied = copiedId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    {/* Transaction / UTR Ref */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="truncate max-w-[180px]">{refText}</span>
                        <button
                          onClick={() => handleCopy(refText, p.id)}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition cursor-pointer"
                          title="Copy reference number"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'N/A'}
                      </div>
                    </td>

                    {/* Diagnostic Lab / Plan */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 text-xs">
                        {p.planName || 'Diagnostic Subscription'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Lab: {p.labId.slice(0, 8)}...
                      </div>
                    </td>

                    {/* Mode */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          isManual
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}
                      >
                        {p.method || p.provider}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{amountInr}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === 'SUCCESS' || p.status === 'CAPTURED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{p.status}</span>
                      </span>
                    </td>

                    {/* Audit Details */}
                    <td className="py-4 px-4 text-right text-xs font-mono text-slate-600">
                      {p.details?.approvedBy ? (
                        <div>
                          <span className="text-emerald-700 font-bold">Approved by {p.details.approvedBy}</span>
                          {p.details?.utr && (
                            <div className="text-[10px] text-slate-400">UTR: {p.details.utr}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">System Webhook</span>
                      )}
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
