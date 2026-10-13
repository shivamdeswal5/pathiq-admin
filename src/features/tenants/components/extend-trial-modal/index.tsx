'use client';

import { useState, type FormEvent } from 'react';
import { Clock, X, AlertTriangle, Loader2, Calendar } from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';
import { useExtendTrialMutation } from '../../api/tenants.mutations';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api-client';

interface ExtendTrialModalProps {
  isOpen: boolean;
  tenant: AdminTenantListItem | null;
  onClose: () => void;
}

const PRESET_DAYS = [7, 14, 30] as const;

export function ExtendTrialModal({ isOpen, tenant, onClose }: ExtendTrialModalProps) {
  const toast = useToast();
  const [selectedDays, setSelectedDays] = useState<number>(14);
  const [reason, setReason] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [nowTimestamp] = useState(() => Date.now());

  const extendMutation = useExtendTrialMutation();

  if (!isOpen || !tenant) return null;

  const currentEndDate = tenant.trialEnd ? new Date(tenant.trialEnd) : new Date(nowTimestamp);
  const baseDate = currentEndDate.getTime() > nowTimestamp ? currentEndDate : new Date(nowTimestamp);
  const calculatedNewEndDate = new Date(baseDate.getTime() + selectedDays * 24 * 60 * 60 * 1000);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    try {
      await extendMutation.mutateAsync({
        labId: tenant.labId,
        days: selectedDays,
        reason: reason.trim() || undefined,
      });
      toast.success(
        'Trial Extended Successfully',
        `Added ${selectedDays} days to ${tenant.labName}.`,
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'Failed to extend trial period');
      setServerError(errorMsg);
      toast.error('Extension Failed', errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-7 shadow-2xl relative max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Extend Trial Period</h2>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px]">
                {tenant.labName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Extension Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_DAYS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSelectedDays(days)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedDays === days
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  +{days} Days
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custom Days
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={selectedDays}
              onChange={(e) => setSelectedDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* New End Date Preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>New Expiry Date:</span>
            </span>
            <span className="font-bold text-slate-900">
              {calculatedNewEndDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Admin Note <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Haryana pilot lab requested onboarding extension"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={extendMutation.isPending}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {extendMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Extending...</span>
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  <span>Confirm +{selectedDays} Days</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
