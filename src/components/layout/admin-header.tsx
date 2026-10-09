'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Plus, LogOut, UserCheck } from 'lucide-react';

interface AdminHeaderProps {
  userEmail: string | null;
  onRefresh: () => void;
  refreshing: boolean;
  onOpenOnboardModal: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  userEmail,
  onRefresh,
  refreshing,
  onOpenOnboardModal,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Pathiq
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Platform Operations &amp; Laboratory Provisioning
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
            <UserCheck className="h-3.5 w-3.5 text-teal-600" />
            <span className="truncate max-w-[180px]">{userEmail}</span>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer disabled:opacity-50"
          title="Refresh platform data"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          onClick={onOpenOnboardModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Onboard New Lab</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
          title="Sign out of Admin Session"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
