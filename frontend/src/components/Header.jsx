import React, { useState } from 'react';
import { Scale, ShieldCheck, Sparkles, Bot, FileSearch } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', icon: Bot, label: 'AI Legal Assistant' },
    { id: 'vehicle', icon: FileSearch, label: 'Vehicle Fine Lookup' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10 backdrop-blur-md">
      {/* Tricolour accent strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white tracking-tight">JurisBot</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-black">INDIA</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">NLP Legal AI • BNS 2023 & MV Act Grounded</p>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Status badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>RAG Vector DB Active</span>
          </div>

        </div>
      </div>
    </header>
  );
}
