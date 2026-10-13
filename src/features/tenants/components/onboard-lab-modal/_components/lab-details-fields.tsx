'use client';

import { Building2 } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OnboardLabFormValues } from '@/features/tenants/schemas/onboard-lab.schema';

interface LabDetailsFieldsProps {
  register: UseFormRegister<OnboardLabFormValues>;
  errors: FieldErrors<OnboardLabFormValues>;
}

export function LabDetailsFields({ register, errors }: LabDetailsFieldsProps) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
        <Building2 className="h-3.5 w-3.5 text-teal-600" />
        <span>1. Lab Facility Information</span>
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Diagnostic Lab Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Apex Clinical Laboratory"
            {...register('labName')}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition ${
              errors.labName
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
          {errors.labName && (
            <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.labName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            City / Address *
          </label>
          <input
            type="text"
            placeholder="e.g. Ambala Cantt, Haryana"
            {...register('city')}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition ${
              errors.city
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 focus:ring-teal-600/20 focus:border-teal-600'
            }`}
          />
          {errors.city && (
            <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.city.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
