'use client';

import { useState, type FormEvent } from 'react';
import { X, AlertTriangle, Loader2, Save } from 'lucide-react';
import { AdminPlanItem } from '@/types/admin';
import { useUpdatePlanMutation } from '@/features/plans/api/plans.mutations';
import { getApiErrorMessage } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';

interface EditPlanModalProps {
  isOpen: boolean;
  plan: AdminPlanItem | null;
  onClose: () => void;
}

export function EditPlanModal({ isOpen, plan, onClose }: EditPlanModalProps) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-2xl relative max-h-[92dvh] overflow-y-auto">
        <EditPlanForm key={plan.id} plan={plan} onClose={onClose} />
      </div>
    </div>
  );
}

interface EditPlanFormProps {
  plan: AdminPlanItem;
  onClose: () => void;
}

function EditPlanForm({ plan, onClose }: EditPlanFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState(plan.name);
  const [description, setDescription] = useState(plan.description || '');
  const [monthlyPriceInr, setMonthlyPriceInr] = useState(plan.monthlyPriceInr);
  const [yearlyPriceInr, setYearlyPriceInr] = useState(plan.yearlyPriceInr);
  const [isActive, setIsActive] = useState(plan.isActive);
  const [isPublic, setIsPublic] = useState(plan.isPublic);
  const [serverError, setServerError] = useState<string | null>(null);

  const updateMutation = useUpdatePlanMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    try {
      await updateMutation.mutateAsync({
        id: plan.id,
        dto: {
          name: name.trim(),
          description: description.trim() || undefined,
          monthlyPriceInr: Number(monthlyPriceInr),
          yearlyPriceInr: Number(yearlyPriceInr),
          isActive,
          isPublic,
        },
      });
      toast.success(
        'Plan Updated',
        `Successfully saved settings for ${plan.name}.`,
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'Failed to update subscription plan');
      setServerError(errorMsg);
      toast.error('Plan Update Failed', errorMsg);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Edit Plan: {plan.name}</h2>
          <p className="text-xs text-slate-500 font-mono font-medium">Slug: {plan.slug}</p>
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly Price (₹ INR)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyPriceInr}
              onChange={(e) => setMonthlyPriceInr(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Yearly Price (₹ INR)
            </label>
            <input
              type="number"
              min="0"
              value={yearlyPriceInr}
              onChange={(e) => setYearlyPriceInr(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Plan Is Active</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Listed Publicly on Pricing Page</span>
          </label>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Plan Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
