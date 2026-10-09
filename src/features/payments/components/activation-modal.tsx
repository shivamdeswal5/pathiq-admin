'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Loader2, Building2 } from 'lucide-react';
import { AdminTenantListItem, PlanSlug, BillingCycle } from '@/types/admin';
import { useManualActivationMutation } from '../api/payments.mutations';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: AdminTenantListItem | null;
}

function ActivationModalForm({
  tenant,
  onClose,
}: {
  tenant: AdminTenantListItem;
  onClose: () => void;
}) {
  const activateMutation = useManualActivationMutation();

  const [selectedPlan, setSelectedPlan] = useState<PlanSlug>(tenant.planSlug || 'GROWTH');
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('MONTHLY');
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState(`Verified offline UPI payment for ${tenant.labName}`);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMsg('Please enter a valid 12-digit bank UTR / IMPS reference.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await activateMutation.mutateAsync({
        labId: tenant.labId,
        planSlug: selectedPlan,
        billingCycle: selectedCycle,
        utrNumber: utrNumber.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccessMsg(
        `Subscription activated successfully! Tax Invoice ${res.invoiceNumber} generated for ${res.planName}.`,
      );
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        errorResponse?.response?.data?.message ||
          errorResponse.message ||
          'Failed to activate subscription. Check UTR uniqueness.',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Approve Offline Bank UTR</h3>
            <p className="text-xs text-slate-500">
              Direct subscription activation via UPI, NEFT, or IMPS.
            </p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Target Lab Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <Building2 className="h-3.5 w-3.5 text-teal-600" />
                <span>{tenant.labName}</span>
              </div>
              <div className="text-slate-500">
                Owner: <span className="text-slate-700 font-medium">{tenant.ownerName || 'Doctor'}</span>{' '}
                {tenant.phone && `(${tenant.phone})`}
              </div>
              <div className="text-slate-500">
                Current Status: <span className="font-bold text-teal-700">{tenant.status}</span>
              </div>
            </div>

            {/* Plan Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Subscription Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['STARTER', 'GROWTH', 'SCALE'] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      selectedPlan === plan
                        ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>{plan}</div>
                    <div className="text-[10px] font-normal opacity-90">
                      {plan === 'STARTER' ? '₹499' : plan === 'GROWTH' ? '₹999' : '₹1,999'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Billing Cycle:</span>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCycle('MONTHLY')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCycle === 'MONTHLY' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('YEARLY')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCycle === 'YEARLY' ? 'bg-white shadow-xs text-teal-700' : 'text-slate-600'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* UTR Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bank UTR / UPI Transaction Reference (12 digits) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 429381749281"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Checked against duplicate spending; creates immutable payment entry &amp; GST tax invoice.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Internal Verification Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Verified via PhonePe QR transfer on Axis Bank statement"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={activateMutation.isPending}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {activateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying UTR...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm UTR &amp; Unlock</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ActivationModal({ isOpen, onClose, tenant }: ActivationModalProps) {
  if (!isOpen || !tenant) return null;

  return (
    <ActivationModalForm
      key={tenant.labId}
      tenant={tenant}
      onClose={onClose}
    />
  );
}
