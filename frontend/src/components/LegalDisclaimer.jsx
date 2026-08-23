import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function LegalDisclaimer() {
  return (
    <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto px-4 py-2">
      <ShieldAlert className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
      <p className="text-[11px] text-zinc-500 leading-tight">
        <span className="text-zinc-300 font-semibold">Bar Council Notice:</span> JurisBot India provides statutory information based on the Motor Vehicles Act, Bharatiya Nyaya Sanhita (BNS 2023) & Municipal Codes. It does not constitute legal counsel under the Advocates Act.
      </p>
    </div>
  );
}
