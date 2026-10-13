'use client';

import { Building2, X } from 'lucide-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Onboard New Diagnostic Lab</h3>
          <p className="text-xs text-slate-500">
            Assisted tenant setup from sales call, WhatsApp, or demo request.
          </p>
        </div>
      </div>
    </>
  );
}
