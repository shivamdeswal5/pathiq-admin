'use client';

import { CreditCard } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { OnboardLabFormValues } from '@/features/tenants/schemas/onboard-lab.schema';

interface BillingModeFieldsProps {
  register: UseFormRegister<OnboardLabFormValues>;
  setValue: UseFormSetValue<OnboardLabFormValues>;
  watch: UseFormWatch<OnboardLabFormValues>;
  errors: FieldErrors<OnboardLabFormValues>;
}

export function BillingModeFields({ register, setValue, watch, errors }: BillingModeFieldsProps) {
  const planSlug = watch('planSlug');
  const billingCycle = watch('billingCycle');
  const paymentStatus = watch('paymentStatus');

  return (
    <div className="space-y-3 pt-2 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
        <CreditCard className="h-3.5 w-3.5 text-teal-600" />
        <span>3. Subscription Plan &amp; Billing</span>
      </span>

      {/* Plan Selector */}
      <div className="grid grid-cols-3 gap-2">
        {(['STARTER', 'GROWTH', 'SCALE'] as const).map((plan) => (
          <button
            key={plan}
            type="button"
            onClick={() => setValue('planSlug', plan, { shouldValidate: true })}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
              planSlug === plan
                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div>{plan}</div>
            <div className="text-[10px] font-normal opacity-90">
              {plan === 'STARTER' ? '₹499/mo' : plan === 'GROWTH' ? '₹999/mo' : '₹1,999/mo'}
            </div>
          </button>
        ))}
      </div>

      {/* Billing Cycle Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-700">Billing Cycle:</span>
        <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setValue('billingCycle', 'MONTHLY', { shouldValidate: true })}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingCycle === 'MONTHLY' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setValue('billingCycle', 'YEARLY', { shouldValidate: true })}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingCycle === 'YEARLY' ? 'bg-white shadow-xs text-teal-700' : 'text-slate-600'
            }`}
          >
            Annual (2 Months Free)
          </button>
        </div>
      </div>

      {/* Payment Status Selector */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-700">Onboarding Mode:</span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('paymentStatus', 'PAID', { shouldValidate: true })}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              paymentStatus === 'PAID'
                ? 'bg-teal-50 border-teal-300 text-teal-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="text-xs font-bold">Paid Offline via UPI / IMPS</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Records payment &amp; generates official Tax Invoice
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue('paymentStatus', 'TRIAL', { shouldValidate: true })}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              paymentStatus === 'TRIAL'
                ? 'bg-sky-50 border-sky-300 text-sky-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="text-xs font-bold">14-Day Free Trial</div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Free evaluation without upfront payment
            </div>
          </button>
        </div>

        {paymentStatus === 'PAID' && (
          <div className="space-y-2 pt-1 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bank UTR / UPI Reference Number *
              </label>
              <input
                type="text"
                placeholder="e.g. 429381749281 (12 digits)"
                maxLength={12}
                {...register('utrNumber')}
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 transition ${
                  errors.utrNumber
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
                }`}
              />
              {errors.utrNumber && (
                <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.utrNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Payment Verification Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Verified via Axis UPI QR transfer"
                {...register('notes')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
