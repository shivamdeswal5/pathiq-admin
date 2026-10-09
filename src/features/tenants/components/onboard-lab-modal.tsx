'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useCreateTenantMutation } from '../api/tenants.mutations';
import { PlanSlug, BillingCycle, AdminCreateTenantResponse } from '@/types/admin';

interface OnboardLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardLabModal({ isOpen, onClose }: OnboardLabModalProps) {
  const createMutation = useCreateTenantMutation();

  const [labName, setLabName] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ownerFullName, setOwnerFullName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [planSlug, setPlanSlug] = useState<PlanSlug>('GROWTH');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [paymentStatus, setPaymentStatus] = useState<'TRIAL' | 'PAID'>('PAID');
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [createdResult, setCreatedResult] = useState<AdminCreateTenantResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setLabName('');
    setCity('');
    setPhoneNumber('');
    setOwnerFullName('');
    setOwnerEmail('');
    setOwnerPassword('');
    setPlanSlug('GROWTH');
    setBillingCycle('MONTHLY');
    setPaymentStatus('PAID');
    setUtrNumber('');
    setNotes('');
    setCreatedResult(null);
    setFormError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim() || !city.trim() || !phoneNumber.trim() || !ownerFullName.trim() || !ownerEmail.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    if (paymentStatus === 'PAID' && !utrNumber.trim()) {
      setFormError('Please enter the 12-digit Bank UTR reference for the offline payment.');
      return;
    }

    setFormError(null);

    try {
      const res = await createMutation.mutateAsync({
        labName: labName.trim(),
        city: city.trim(),
        phoneNumber: phoneNumber.trim(),
        ownerFullName: ownerFullName.trim(),
        ownerEmail: ownerEmail.trim(),
        ownerPassword: ownerPassword.trim() || undefined,
        planSlug,
        billingCycle,
        paymentStatus,
        utrNumber: paymentStatus === 'PAID' ? utrNumber.trim() : undefined,
        notes: notes.trim() || undefined,
      });

      setCreatedResult(res);
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setFormError(
        errorResponse?.response?.data?.message ||
          errorResponse.message ||
          'Failed to onboard laboratory. Check email and UTR uniqueness.',
      );
    }
  };

  const rawPhone = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
  const whatsappWelcomeText = createdResult
    ? encodeURIComponent(
        `Hi ${createdResult.ownerEmail}! Welcome to Pathiq Diagnostics. Your lab "${createdResult.labName}" is ready.\n\n` +
          `Portal: http://localhost:3000/login\n` +
          `Email: ${createdResult.ownerEmail}\n` +
          `Password: ${createdResult.tempPassword}\n` +
          `${createdResult.invoiceNumber ? `Tax Invoice: ${createdResult.invoiceNumber}\n` : ''}` +
          `Status: ${createdResult.status}\n\n` +
          `Please log in to set up your barcode printer and custom letterhead.`,
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={handleReset}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
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

        {createdResult ? (
          /* Success Screen */
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
                <div>Status: <span className="font-bold text-emerald-700">{createdResult.status}</span></div>
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
                onClick={handleReset}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Close &amp; View in Directory
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Lab Information Section */}
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
                    required
                    placeholder="e.g. Apex Clinical Laboratory"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    City / Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ambala Cantt, Haryana"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
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
                    required
                    placeholder="Dr. / Pathologist Name"
                    value={ownerFullName}
                    onChange={(e) => setOwnerFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Owner Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@lab.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  />
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
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Plan Tier & Billing Cycle */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                <span>3. Subscription Plan &amp; Billing</span>
              </span>

              <div className="grid grid-cols-3 gap-2">
                {(['STARTER', 'GROWTH', 'SCALE'] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setPlanSlug(plan)}
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

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Billing Cycle:</span>
                <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      billingCycle === 'MONTHLY' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('YEARLY')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      billingCycle === 'YEARLY' ? 'bg-white shadow-xs text-teal-700' : 'text-slate-600'
                    }`}
                  >
                    Annual (2 Months Free)
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Mode & Bank UTR */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Onboarding Mode:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('PAID')}
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
                  onClick={() => setPaymentStatus('TRIAL')}
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
                      required
                      placeholder="e.g. 429381749281 (12 digits)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Payment Verification Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Verified via Axis UPI QR transfer"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
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
