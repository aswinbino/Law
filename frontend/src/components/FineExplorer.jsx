import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, FileText, IndianRupee, RefreshCw, MapPin, Building2, Scale } from 'lucide-react';

export default function FineExplorer() {
  const [fines, setFines] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/fines');
      if (res.ok) {
        const data = await res.json();
        setFines(data.fines || []);
      } else {
        throw new Error('Failed to fetch fines list');
      }
    } catch (err) {
      console.warn('Using local fallback fine records:', err);
      setFines([
        {
          id: 'MVA-181',
          title: 'Driving Without a Valid Licence',
          act_or_section: 'Motor Vehicles Act § 181',
          category: 'Traffic Offence',
          baseFine: '₹5,000',
          baseFineAmount: 5000,
          penaltyDetails: 'Statutory fine of ₹5,000 and/or imprisonment up to 3 months.',
          description: 'Driving a motor vehicle without holding an effective driving licence issued under Section 3.',
          jurisdiction: 'All India (MoRTH)'
        },
        {
          id: 'MVA-194D',
          title: 'Riding Two-Wheeler Without Helmet',
          act_or_section: 'Motor Vehicles Act § 194D',
          category: 'Traffic Safety Offence',
          baseFine: '₹1,000 + Licence Disqualification for 3 Months',
          baseFineAmount: 1000,
          penaltyDetails: 'Fine of ₹1,000 and mandatory licence disqualification for 3 months.',
          description: 'Riding a two-wheeler without wearing protective headgear (helmet) conforming to BIS specifications.',
          jurisdiction: 'All India (MoRTH)'
        },
        {
          id: 'MVA-185',
          title: 'Drunk Driving (First Offence)',
          act_or_section: 'Motor Vehicles Act § 185',
          category: 'Criminal Traffic Offence',
          baseFine: '₹10,000',
          baseFineAmount: 10000,
          penaltyDetails: 'Fine of ₹10,000 and/or imprisonment up to 6 months.',
          description: 'Driving a motor vehicle with alcohol content exceeding 30 mg per 100 ml of blood.',
          jurisdiction: 'All India (MoRTH)'
        },
        {
          id: 'MCA-LITTER',
          title: 'Public Littering & Waste Dumping',
          act_or_section: 'Municipal Corporation Act & Solid Waste Rules 2016',
          category: 'Civic & Environmental Penalty',
          baseFine: '₹500 to ₹5,000',
          baseFineAmount: 1000,
          penaltyDetails: 'Fine ranging from ₹500 for 1st offence up to ₹5,000 for repeated public dumping.',
          description: 'Throwing garbage, plastics, or dumping waste in municipal public spaces.',
          jurisdiction: 'Municipal Corporations (MCD, BMC, BBMP, GCC)'
        },
        {
          id: 'BNS-270',
          title: 'Public Nuisance & Noise Pollution',
          act_or_section: 'Bharatiya Nyaya Sanhita (BNS) § 270',
          category: 'Civic Penal Code',
          baseFine: '₹1,000',
          baseFineAmount: 1000,
          penaltyDetails: 'Fine up to ₹1,000 upon conviction for public nuisance.',
          description: 'Doing any act causing common injury, danger, or annoyance to the public.',
          jurisdiction: 'All India (Bharatiya Nyaya Sanhita)'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFines = fines.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.act_or_section.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 glass-panel-indian shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">Official Indian Legal Fine Directory (₹ INR)</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Browse statutory penalties, Motor Vehicle provisions, Bharatiya Nyaya Sanhita 2023, & Municipal fine structures.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-lg rupee-badge">
              {filteredFines.length} Penalties Indexed (₹)
            </span>
          </div>
        </div>

        {/* Search input & Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by act, section number, offence title (e.g. helmet, licence, drunk, litter)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-700/80 focus:border-amber-500 focus:outline-none text-sm placeholder-slate-500"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-200 rounded-xl border border-slate-700/80 focus:border-amber-500 focus:outline-none text-sm font-semibold"
            >
              <option value="ALL">All Categories</option>
              <option value="Traffic Offence">Traffic Offences</option>
              <option value="Traffic Safety Offence">Traffic Safety</option>
              <option value="Civic & Environmental Penalty">Civic & Environmental</option>
              <option value="Criminal Traffic Offence">Criminal Traffic</option>
              <option value="Civic Penal Code">BNS Penal Code</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Legal Fine Cards with Rupee Focus */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mr-3" />
          <span>Loading Indian Legal Fine records in ₹ INR...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFines.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 glass-card-indian flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.act_or_section}
                  </span>
                  
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full rupee-badge flex items-center gap-1 shadow-md">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {item.baseFine}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-1">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Jurisdiction:
                  </span>
                  <span className="text-slate-300 font-medium">{item.jurisdiction || 'All India'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20">
                  <span className="font-bold text-amber-300 text-[11px] block mb-1 uppercase tracking-wider">
                    Statutory Penalty & Fine Details:
                  </span>
                  <p className="text-slate-200 font-medium text-xs leading-normal">
                    {item.penaltyDetails}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredFines.length === 0 && !loading && (
        <div className="text-center p-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="font-bold text-slate-200">No matching legal fine records found.</p>
          <p className="text-xs">Try searching with keywords like "helmet", "licence", "drunk", "litter", or "BNS".</p>
        </div>
      )}

    </div>
  );
}
