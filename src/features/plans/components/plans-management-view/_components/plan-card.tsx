import { Check, Edit3, Shield, Zap, Sparkles } from 'lucide-react';
import { AdminPlanItem } from '@/types/admin';

interface PlanCardProps {
  plan: AdminPlanItem;
  onEdit: (plan: AdminPlanItem) => void;
}

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function PlanCard({ plan, onEdit }: PlanCardProps) {
  const gstMonthly = Math.round(plan.monthlyPriceInr * 0.18);
  const totalMonthly = plan.monthlyPriceInr + gstMonthly;

  const getBadgeIcon = (slug: string) => {
    switch (slug) {
      case 'STARTER':
        return <Shield className="h-4 w-4 text-emerald-600" />;
      case 'GROWTH':
        return <Zap className="h-4 w-4 text-teal-600" />;
      case 'SCALE':
        return <Sparkles className="h-4 w-4 text-purple-600" />;
      default:
        return <Zap className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        {/* Header & Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
              {getBadgeIcon(plan.slug)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                {plan.slug}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                plan.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {plan.isActive ? 'Active' : 'Archived'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 mb-5 min-h-[36px]">
          {plan.description || 'Enterprise diagnostic laboratory operating system tier.'}
        </p>

        {/* Pricing Matrix */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-5 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-medium">Monthly Rate</span>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">
                {INR_FORMATTER.format(plan.monthlyPriceInr)}
              </span>
              <span className="text-[10px] text-slate-400">/mo</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
            <span>Incl. 18% GST:</span>
            <span className="font-semibold text-slate-700">
              {INR_FORMATTER.format(totalMonthly)}/mo
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
            <span>Annual (Prepaid):</span>
            <span className="font-semibold text-slate-700">
              {INR_FORMATTER.format(plan.yearlyPriceInr)}/yr
            </span>
          </div>
        </div>

        {/* Entitlements Highlights */}
        <div className="space-y-2 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Key Entitlements
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>
                Max Workstations:{' '}
                <strong>{String(plan.featureEntitlements?.maxUsers ?? 'Unlimited')}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>
                Monthly Accessions:{' '}
                <strong>{String(plan.featureEntitlements?.maxMonthlyAccessions ?? 'Unlimited')}</strong>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>
                WhatsApp Alerts:{' '}
                <strong>
                  {plan.featureEntitlements?.whatsappAlerts ? 'Included' : 'Add-on'}
                </strong>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onEdit(plan)}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        <Edit3 className="h-3.5 w-3.5" />
        <span>Edit Pricing &amp; Entitlements</span>
      </button>
    </div>
  );
}
