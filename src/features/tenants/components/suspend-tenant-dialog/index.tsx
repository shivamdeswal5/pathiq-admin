'use client';

import { useState, type FormEvent } from 'react';
import { ShieldAlert, X, AlertTriangle, Loader2, PlayCircle, PauseCircle } from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';
import { useToggleTenantStatusMutation } from '../../api/tenants.mutations';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/lib/api-client';

interface SuspendTenantDialogProps {
  isOpen: boolean;
  tenant: AdminTenantListItem | null;
  onClose: () => void;
}

export function SuspendTenantDialog({ isOpen, tenant, onClose }: SuspendTenantDialogProps) {
  const toast = useToast();
  const [reason, setReason] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  const toggleMutation = useToggleTenantStatusMutation();

  if (!isOpen || !tenant) return null;

  const isCurrentlySuspended = tenant.status === 'SUSPENDED';
  const targetStatus = isCurrentlySuspended ? 'ACTIVE' : 'SUSPENDED';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    try {
      await toggleMutation.mutateAsync({
        labId: tenant.labId,
        status: targetStatus,
        reason: reason.trim() || undefined,
      });
      toast.success(
        isCurrentlySuspended ? 'Laboratory Resumed' : 'Laboratory Suspended',
        `Updated operational status for ${tenant.labName}.`,
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        `Failed to ${isCurrentlySuspended ? 'resume' : 'suspend'} laboratory`,
      );
      setServerError(errorMsg);
      toast.error('Status Update Failed', errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-7 shadow-2xl relative max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                isCurrentlySuspended
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {isCurrentlySuspended ? (
                <PlayCircle className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isCurrentlySuspended ? 'Resume Laboratory' : 'Suspend Laboratory'}
              </h2>
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

        {/* Warning Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs mb-4 flex items-start gap-2.5 ${
            isCurrentlySuspended
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-rose-50/70 border-rose-200 text-rose-800'
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 shrink-0 mt-0.5 ${
              isCurrentlySuspended ? 'text-emerald-600' : 'text-rose-600'
            }`}
          />
          <div>
            {isCurrentlySuspended ? (
              <p>
                Resuming will restore immediate laboratory access, re-enable order registration,
                and broadcast an unlock event to connected staff workstations.
              </p>
            ) : (
              <p>
                Suspending will immediately lock laboratory accession and block staff logins.
                Diagnostic reports already generated remain accessible for patient and legal
                compliance (NABL/NMC).
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for {isCurrentlySuspended ? 'Resuming' : 'Suspension'}{' '}
              <span className="text-slate-400 font-normal">(optional audit note)</span>
            </label>
            <input
              type="text"
              placeholder={
                isCurrentlySuspended
                  ? 'e.g. Account reinstated after payment'
                  : 'e.g. Billing default, investigation, or owner request'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
              disabled={toggleMutation.isPending}
              className={`px-5 py-2 font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-white ${
                isCurrentlySuspended
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {toggleMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating Status...</span>
                </>
              ) : isCurrentlySuspended ? (
                <>
                  <PlayCircle className="h-3.5 w-3.5" />
                  <span>Confirm Resume Lab</span>
                </>
              ) : (
                <>
                  <PauseCircle className="h-3.5 w-3.5" />
                  <span>Confirm Suspend Lab</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
