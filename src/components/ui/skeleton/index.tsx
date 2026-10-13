'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/70 rounded-md ${className}`}
    />
  );
}

export function TenantTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((idx) => (
        <tr key={idx} className="border-b border-slate-100">
          {/* Lab Info */}
          <td className="py-4 px-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </td>

          {/* Owner */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </td>

          {/* Plan & Cycle */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          </td>

          {/* Status */}
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-24 rounded-full" />
          </td>

          {/* Days / Expiry */}
          <td className="py-4 px-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </td>

          {/* Actions */}
          <td className="py-4 px-4 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-14 rounded-lg" />
              <Skeleton className="h-7 w-18 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function PaymentLedgerSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((idx) => (
        <tr key={idx} className="border-b border-slate-100">
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-32 rounded" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-28 rounded" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-20 rounded" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-16 rounded" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="py-4 px-4 text-right">
            <Skeleton className="h-3.5 w-24 ml-auto rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function PlanCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28 rounded-lg" />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
            <Skeleton className="h-7 w-32 rounded" />
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
            <Skeleton className="h-3.5 w-3/4 rounded" />
          </div>

          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function TenantCardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="col-span-2 sm:col-span-1 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentCardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KpiSummarySkeleton() {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-1 -mx-3.5 px-3.5 scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4 sm:mx-0 sm:px-0 sm:pb-0">
      {[1, 2, 3, 4, 5].map((idx) => (
        <div
          key={idx}
          className="w-[165px] min-w-[165px] shrink-0 snap-start sm:w-auto bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs sm:shadow-xs space-y-2 sm:space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <Skeleton className="h-6 w-14 rounded" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

