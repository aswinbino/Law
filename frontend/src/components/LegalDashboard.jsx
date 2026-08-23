import React, { useState } from 'react';
import { Calculator, Flame, BookOpen, Search } from 'lucide-react';

export default function LegalDashboard({ onSelectQuery }) {
  const [selectedViolation, setSelectedViolation] = useState('helmet');

  const violationFines = {
    helmet: { fine: "₹1,000", statute: "MV Act § 194D", detail: "+ 3 Months Licence Disqualification" },
    nolicense: { fine: "₹5,000", statute: "MV Act § 181", detail: "Possible vehicle seizure" },
    dui: { fine: "₹10,000", statute: "MV Act § 185", detail: "Up to 6 Months Imprisonment (First Offence)" },
    puc: { fine: "₹10,000", statute: "MV Act § 190(2)", detail: "Mandatory Pollution Clearance requirement" },
  };

  const trendingQueries = [
    "What is the fine for driving without a license in India?",
    "Penalty for riding without a helmet under Section 194D?",
    "What are the punishments for public nuisance under BNS?",
    "Fine for driving without valid PUCC certificate?",
  ];

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Quick Fine Calculator Widget */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-orange-400 font-semibold text-xs tracking-wider uppercase">
          <Calculator className="w-4 h-4" /> Instant Traffic Fine Reference
        </div>
        
        <label className="text-xs text-slate-400 block mb-1">Select Offence:</label>
        <select
          value={selectedViolation}
          onChange={(e) => setSelectedViolation(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 mb-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="helmet">Riding Without Helmet (Section 194D)</option>
          <option value="nolicense">Driving Without License (Section 181)</option>
          <option value="dui">Drunk Driving / DUI (Section 185)</option>
          <option value="puc">No Pollution Certificate / PUCC (Section 190(2))</option>
        </select>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 block">{violationFines[selectedViolation].statute}</span>
            <span className="text-xs text-slate-300 font-medium">{violationFines[selectedViolation].detail}</span>
          </div>
          <span className="text-lg font-bold text-orange-400">{violationFines[selectedViolation].fine}</span>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <Flame className="w-4 h-4" /> Frequent NLP Queries
        </div>
        <div className="flex flex-col gap-2">
          {trendingQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectQuery(q)}
              className="text-left text-xs bg-slate-900 hover:bg-slate-800/80 text-slate-300 p-2.5 rounded-lg border border-slate-800/80 transition flex justify-between items-center group"
            >
              <span className="line-clamp-1">{q}</span>
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* New Acts Reference Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
          <BookOpen className="w-4 h-4" /> Bharatiya Nyaya Sanhita (BNS)
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Indexed with updated BNS statutes alongside traditional Indian Penal Code (IPC) mapping to return the latest applicable laws.
        </p>
      </div>
    </div>
  );
}
