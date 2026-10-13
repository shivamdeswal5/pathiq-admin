
export function TableHeader() {
  return (
    <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
      <tr>
        <th className="py-3.5 px-4">Diagnostic Lab</th>
        <th className="py-3.5 px-4">Owner &amp; Direct Contact</th>
        <th className="py-3.5 px-4">Plan Tier</th>
        <th className="py-3.5 px-4">Status</th>
        <th className="py-3.5 px-4">Validity</th>
        <th className="py-3.5 px-4 text-right">Operational Levers</th>
      </tr>
    </thead>
  );
}
