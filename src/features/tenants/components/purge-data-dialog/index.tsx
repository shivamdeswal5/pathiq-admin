'use client';

import { useState, type FormEvent } from 'react';
import { Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { AdminTenantListItem } from '@/types/admin';
import { usePurgeTestDataMutation } from '../../api/tenants.mutations';
import { getApiErrorMessage } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

interface PurgeDataDialogProps {
  isOpen: boolean;
  tenant: AdminTenantListItem | null;
  onClose: () => void;
}

export function PurgeDataDialog({ isOpen, tenant, onClose }: PurgeDataDialogProps) {
  const { toast } = useToast();
  const [confirmInput, setConfirmInput] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [purgeResult, setPurgeResult] = useState<{
    reports: number;
    invoices: number;
    patients: number;
  } | null>(null);

  const purgeMutation = usePurgeTestDataMutation();

  if (!isOpen || !tenant) return null;

  const handleClose = () => {
    setConfirmInput('');
    setServerError(null);
    setPurgeResult(null);
    onClose();
  };

  const handlePurge = async (e: FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim() !== 'PURGE') return;
    setServerError(null);

    try {
      const res = await purgeMutation.mutateAsync(tenant.labId);
      setPurgeResult(res.deletedCounts);
      toast.success(
        'Data Purged Successfully',
        `Test records deleted for ${tenant.labName}. Test catalog and logins preserved.`,
      );
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'Failed to purge laboratory test data');
      setServerError(errorMsg);
      toast.error('Data Purge Failed', errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 sm:p-7 shadow-2xl relative max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Purge Demo Test Records</h2>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px]">
                {tenant.labName}
              </p>
            </div>

          </div>
          <button
            type="button"
            onClick={handleClose}
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

        {purgeResult ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <p className="font-bold mb-1">Pilot test data successfully purged!</p>
              <ul className="space-y-1 list-disc list-inside text-emerald-700">
                <li>Deleted {purgeResult.reports} dummy test reports</li>
                <li>Deleted {purgeResult.patients} test patients</li>
                <li>Deleted {purgeResult.invoices} test invoices</li>
              </ul>
              <p className="mt-2 text-[11px] text-emerald-600">
                Test panels, parameter reference ranges, and lab staff logins were kept intact.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePurge} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Caution: This action cannot be undone.</p>
                <p className="mt-0.5 text-slate-600">
                  This will permanently delete dummy reports, patient files, and invoices created during testing. The lab profile and configured test catalog will NOT be affected.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type <span className="font-mono text-rose-600 font-bold">PURGE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="PURGE"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={confirmInput.trim() !== 'PURGE' || purgeMutation.isPending}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {purgeMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Purging Data...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Data Purge</span>
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
