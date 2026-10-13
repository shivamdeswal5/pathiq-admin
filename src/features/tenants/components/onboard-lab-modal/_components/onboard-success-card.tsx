'use client';

import { CheckCircle2, MessageSquare } from 'lucide-react';
import type { AdminCreateTenantResponse } from '@/types/admin';

interface OnboardSuccessCardProps {
  createdResult: AdminCreateTenantResponse;
  rawPhone: string;
  onReset: () => void;
}

export function OnboardSuccessCard({
  createdResult,
  rawPhone,
  onReset,
}: OnboardSuccessCardProps) {
  const portalUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '') + '/login';

  const whatsappWelcomeText = encodeURIComponent(
    `Hi ${createdResult.ownerEmail}! Welcome to Pathiq Diagnostics. Your lab "${createdResult.labName}" is ready.\n\n` +
      `Portal: ${portalUrl}\n` +
      `Email: ${createdResult.ownerEmail}\n` +
      `Password: ${createdResult.tempPassword}\n` +
      `${createdResult.invoiceNumber ? `Tax Invoice: ${createdResult.invoiceNumber}\n` : ''}` +
      `Status: ${createdResult.status}\n\n` +
      `Please log in to set up your barcode printer and custom letterhead.`,
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Laboratory Onboarded Successfully!</span>
        </div>
        <p className="text-xs text-emerald-700">
          Tenant account provisioned and unlocked with plan{' '}
          <strong>{createdResult.planSlug}</strong>.
        </p>

        <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60 text-xs font-mono space-y-1.5 text-slate-800">
          <div>Lab: <strong>{createdResult.labName}</strong></div>
          <div>Login Email: <strong>{createdResult.ownerEmail}</strong></div>
          <div>Temporary Password: <strong>{createdResult.tempPassword}</strong></div>
          {createdResult.invoiceNumber && (
            <div>GST Tax Invoice: <strong>{createdResult.invoiceNumber}</strong></div>
          )}
          <div>
            Status: <span className="font-bold text-emerald-700">{createdResult.status}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {rawPhone && (
          <a
            href={`https://wa.me/91${rawPhone}?text=${whatsappWelcomeText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send Credentials via WhatsApp</span>
          </a>
        )}
        <button
          type="button"
          onClick={onReset}
          className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
        >
          Close &amp; View in Directory
        </button>
      </div>
    </div>
  );
}
