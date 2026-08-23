import React, { useState } from 'react';
import { Calculator, IndianRupee, AlertCircle, CheckSquare, Square, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

const OFFENCE_CHECKLIST = [
  { id: 'MVA-181', title: 'Driving Without Licence', act: 'MVA § 181', amount: 5000, fineText: '₹5,000' },
  { id: 'MVA-194D', title: 'Riding Without Helmet', act: 'MVA § 194D', amount: 1000, fineText: '₹1,000 + 3-Mo Suspension' },
  { id: 'MVA-185', title: 'Drunk Driving 1st Offence', act: 'MVA § 185', amount: 10000, fineText: '₹10,000' },
  { id: 'MVA-184', title: 'Using Phone / Dangerous Driving', act: 'MVA § 184', amount: 2000, fineText: '₹2,000' },
  { id: 'MVA-194B', title: 'Driving Without Seatbelt', act: 'MVA § 194B', amount: 1000, fineText: '₹1,000' },
  { id: 'MVA-183', title: 'Over-Speeding (Cars/LMV)', act: 'MVA § 183', amount: 2000, fineText: '₹2,000' },
  { id: 'MCA-LITTER', title: 'Public Littering & Waste Dumping', act: 'Municipal Act', amount: 1000, fineText: '₹1,000' },
  { id: 'BNS-270', title: 'Public Nuisance & Noise', act: 'BNS § 270', amount: 1000, fineText: '₹1,000' },
];

export default function ChallanCalculator() {
  const [selectedOffences, setSelectedOffences] = useState([]);

  const toggleOffence = (id) => {
    if (selectedOffences.includes(id)) {
      setSelectedOffences(selectedOffences.filter((item) => item !== id));
    } else {
      setSelectedOffences([...selectedOffences, id]);
    }
  };

  const selectedItems = OFFENCE_CHECKLIST.filter((item) => selectedOffences.includes(item.id));
  const totalFineRupees = selectedItems.reduce((sum, item) => sum + item.amount, 0);

  // Format Indian Rupees numbering system (e.g. ₹15,000)
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalFineRupees);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Panel */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 glass-panel-indian shadow-xl text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-lg mb-1">
          <Calculator className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          Indian Traffic & Civic Challan Estimator (₹ INR)
        </h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Select multiple statutory violations to calculate the total estimated court/police compound fine in Indian Rupees (₹) as per the Motor Vehicles (Amendment) Act 2019 & Municipal Acts.
        </p>
      </div>

      {/* Checklist and Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Offence Selection Checklist */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Select Applicable Statutory Offences:
          </h3>

          <div className="space-y-2">
            {OFFENCE_CHECKLIST.map((item) => {
              const isSelected = selectedOffences.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleOffence(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md text-amber-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-slate-100">{item.title}</p>
                      <p className="text-xs text-amber-400/90 font-medium">{item.act}</p>
                    </div>
                  </div>

                  <span className="font-extrabold text-sm rupee-badge px-3 py-1 rounded-lg">
                    {item.fineText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Summary Box */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-amber-500/40 glass-panel-indian shadow-2xl space-y-4 sticky top-28">
            <h3 className="text-sm font-bold text-amber-300 border-b border-slate-800 pb-3 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              Challan Summary (₹ INR)
            </h3>

            {selectedItems.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <span className="text-slate-300 truncate max-w-[140px]">{item.title}</span>
                      <span className="font-bold text-amber-300">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-amber-500/30 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold block">Total Statutory Fine:</span>
                  <p className="text-3xl font-black text-amber-400 tracking-tight">
                    {formattedTotal}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold">No offences selected.</p>
                <p className="text-[11px] text-slate-500">Tick offences on the left to compute total fine in Rupees.</p>
              </div>
            )}

            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedOffences([])}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-amber-300 bg-slate-800/80 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Calculation
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
