'use client';

import { ShieldCheck, Lock } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OnboardLabFormValues } from '@/features/tenants/schemas/onboard-lab.schema';

interface OwnerFieldsProps {
  register: UseFormRegister<OnboardLabFormValues>;
  errors: FieldErrors<OnboardLabFormValues>;
}

export function OwnerFields({ register, errors }: OwnerFieldsProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
        <span>2. Owner / Biochemist Account</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Dr. / Pathologist Name"
            {...register('ownerFullName')}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition ${
              errors.ownerFullName
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
          {errors.ownerFullName && (
            <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.ownerFullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Owner Email Address *
          </label>
          <input
            type="email"
            placeholder="owner@lab.com"
            {...register('ownerEmail')}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition ${
              errors.ownerEmail
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
          {errors.ownerEmail && (
            <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.ownerEmail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            WhatsApp Phone *
          </label>
          <input
            type="tel"
            placeholder="e.g. 9876543210"
            maxLength={10}
            {...register('phoneNumber')}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition ${
              errors.phoneNumber
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
          <span>Custom Password (Optional)</span>
          <span className="text-[10px] text-slate-400 font-normal">Auto-generated if left empty</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Leave blank for secure auto-generated password"
            {...register('ownerPassword')}
            className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 font-mono transition ${
              errors.ownerPassword
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
        </div>
        {errors.ownerPassword && (
          <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.ownerPassword.message}</p>
        )}
      </div>
    </div>
  );
}
