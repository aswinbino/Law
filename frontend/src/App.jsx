import React, { useState } from 'react';
import Header from './components/Header';
import LegalDisclaimer from './components/LegalDisclaimer';
import ChatBot from './components/ChatBot';
import VehicleFineLookup from './components/VehicleFineLookup';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [preset, setPreset] = useState('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <LegalDisclaimer />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <ChatBot presetPrompt={preset} clearPreset={() => setPreset('')} />
        )}
        {activeTab === 'vehicle' && (
          <VehicleFineLookup />
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <span className="font-semibold text-zinc-400">JurisBot India — Statutory AI</span>
          <span>Motor Vehicles Act (1988/2019) • Bharatiya Nyaya Sanhita (BNS 2023) • Municipal Laws</span>
        </div>
      </footer>
    </div>
  );
}
