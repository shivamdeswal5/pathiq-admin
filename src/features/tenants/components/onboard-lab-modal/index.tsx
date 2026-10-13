'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { useCreateTenantMutation } from '../../api/tenants.mutations';
import { AdminCreateTenantResponse } from '@/types/admin';
import { getApiErrorMessage } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import {
  onboardLabSchema,
  type OnboardLabFormValues,
} from '@/features/tenants/schemas/onboard-lab.schema';
import { ModalHeader } from './_components/modal-header';
import { LabDetailsFields } from './_components/lab-details-fields';
import { OwnerFields } from './_components/owner-fields';
import { BillingModeFields } from './_components/billing-mode-fields';
import { OnboardSuccessCard } from './_components/onboard-success-card';

interface OnboardLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardLabModal({ isOpen, onClose }: OnboardLabModalProps) {
  const { toast } = useToast();
  const createMutation = useCreateTenantMutation();
  const [createdResult, setCreatedResult] = useState<AdminCreateTenantResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<OnboardLabFormValues>({
    resolver: zodResolver(onboardLabSchema),
    defaultValues: {
      labName: '',
      city: '',
      phoneNumber: '',
      ownerFullName: '',
      ownerEmail: '',
      ownerPassword: '',
      planSlug: 'GROWTH',
      billingCycle: 'MONTHLY',
      paymentStatus: 'PAID',
      utrNumber: '',
      notes: '',
    },
  });

  const watchedPhone = useWatch({ control, name: 'phoneNumber' }) || '';
  const rawPhone = watchedPhone.replace(/[^0-9]/g, '').slice(-10);

  if (!isOpen) return null;

  const handleReset = () => {
    reset();
    setCreatedResult(null);
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: OnboardLabFormValues) => {
    setServerError(null);

    try {
      const res = await createMutation.mutateAsync({
        labName: values.labName.trim(),
        city: values.city.trim(),
        phoneNumber: values.phoneNumber.trim(),
        ownerFullName: values.ownerFullName.trim(),
        ownerEmail: values.ownerEmail.trim().toLowerCase(),
        ownerPassword: values.ownerPassword?.trim() || undefined,
        planSlug: values.planSlug,
        billingCycle: values.billingCycle,
        paymentStatus: values.paymentStatus,
        utrNumber: values.paymentStatus === 'PAID' ? values.utrNumber?.trim() : undefined,
        notes: values.notes?.trim() || undefined,
      });

      setCreatedResult(res);
      toast.success(
        'Laboratory Onboarded',
        `${res.labName} provisioned successfully with plan ${res.planSlug}!`,
      );
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(
        err,
        'Failed to onboard laboratory. Check email and UTR uniqueness.',
      );
      setServerError(errorMsg);
      toast.error('Onboarding Failed', errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative">
        <ModalHeader onClose={handleReset} />

        {createdResult ? (
          <OnboardSuccessCard
            createdResult={createdResult}
            rawPhone={rawPhone}
            onReset={handleReset}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {serverError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{serverError}</span>
              </div>
            )}

            <LabDetailsFields register={register} errors={errors} />
            <OwnerFields register={register} errors={errors} />
            <BillingModeFields
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Provisioning Tenant...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Confirm &amp; Provision Lab</span>
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
