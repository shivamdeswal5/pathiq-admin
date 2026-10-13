'use client';

import { useState } from 'react';
import { RefreshCw, Tag, Sparkles } from 'lucide-react';
import { AdminPlanItem } from '@/types/admin';
import { useAdminPlansQuery } from '@/features/plans/api/plans.queries';
import { PlanCard } from './_components/plan-card';
import { EditPlanModal } from './_components/edit-plan-modal';
import { PlanCardSkeleton } from '@/components/ui/skeleton';

export function PlansManagementView() {
  const { data: plans = [], isLoading, refetch } = useAdminPlansQuery();
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<AdminPlanItem | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Tag className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Platform Subscription Plans</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic commercial pricing, annual discount structures, and feature entitlements for Indian diagnostic laboratories.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto min-h-[38px]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Plans</span>
        </button>
      </div>

      {/* Grid of Plans */}
      {isLoading ? (
        <PlanCardSkeleton />
      ) : plans.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-700">No platform plans found</p>
          <p className="text-xs text-slate-400 mt-1">Initialize default plans in database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(p) => setSelectedPlanForEdit(p)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditPlanModal
        isOpen={Boolean(selectedPlanForEdit)}
        plan={selectedPlanForEdit}
        onClose={() => setSelectedPlanForEdit(null)}
      />
    </div>
  );
}
