import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

const VEHICLE_TYPES = [
  { id: 'two_wheeler', label: 'Two-Wheeler', icon: '🏍️', class: 'LMV / Motorcycle' },
  { id: 'car',        label: 'Car / Jeep',   icon: '🚗', class: 'LMV (Non-Transport)' },
  { id: 'auto',       label: 'Auto Rickshaw', icon: '🛺', class: 'Three-Wheeler' },
  { id: 'truck',      label: 'Truck / Bus',  icon: '🚛', class: 'HMV / Transport' },
];

const VIOLATIONS = {
  no_helmet:    { label: 'No Helmet (Rider/Pillion)',         section: 'MVA § 194D',    fine: 1000,  vehicles: ['two_wheeler'], extra: '+ 3-Month Licence Disqualification' },
  no_licence:   { label: 'Driving Without Valid Licence',     section: 'MVA § 181',     fine: 5000,  vehicles: ['two_wheeler','car','auto','truck'], extra: 'May include vehicle seizure' },
  drunk:        { label: 'Drunk Driving / DUI (1st Offence)', section: 'MVA § 185',     fine: 10000, vehicles: ['two_wheeler','car','auto','truck'], extra: '+ Imprisonment up to 6 months' },
  no_seatbelt:  { label: 'No Seat Belt',                      section: 'MVA § 194B',    fine: 1000,  vehicles: ['car','truck'], extra: 'Applies to all occupants' },
  speed_lmv:    { label: 'Over-Speeding (LMV)',               section: 'MVA § 183',     fine: 2000,  vehicles: ['car','auto'], extra: 'Up to ₹2,000 for Light Motor Vehicles' },
  speed_hmv:    { label: 'Over-Speeding (HMV)',               section: 'MVA § 183',     fine: 4000,  vehicles: ['truck'], extra: 'Up to ₹4,000 for Heavy Vehicles' },
  no_pucc:      { label: 'No Pollution Certificate (PUCC)',   section: 'MVA § 190(2)',  fine: 10000, vehicles: ['two_wheeler','car','auto','truck'], extra: '+ Licence suspension 3 months' },
  dangerous:    { label: 'Dangerous Driving / Phone Use',     section: 'MVA § 184',     fine: 5000,  vehicles: ['two_wheeler','car','auto','truck'], extra: '+ Imprisonment up to 1 year' },
  overload:     { label: 'Overloading Passengers',            section: 'MVA § 194A',    fine: 1000,  vehicles: ['auto','truck'], extra: '₹1,000 per extra passenger' },
  no_insurance: { label: 'Driving Without Insurance',         section: 'MVA § 196',     fine: 2000,  vehicles: ['two_wheeler','car','auto','truck'], extra: '+ Imprisonment up to 3 months' },
};

const validateReg = (n) => /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/i.test(n.replace(/[\s-]/g, ''));

export default function VehicleFineLookup() {
  const [regNum, setRegNum]       = useState('');
  const [vType, setVType]         = useState('');
  const [owner, setOwner]         = useState('');
  const [checked, setChecked]     = useState([]);
  const [result, setResult]       = useState(null);
  const [errors, setErrors]       = useState({});

  const available = vType
    ? Object.entries(VIOLATIONS).filter(([, v]) => v.vehicles.includes(vType))
    : [];

  const toggle = (k) =>
    setChecked((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);

  const validate = () => {
    const e = {};
    if (!regNum.trim()) e.reg = 'Vehicle registration number is required.';
    else if (!validateReg(regNum)) e.reg = 'Enter a valid Indian format e.g. MH12AB1234';
    if (!vType) e.vtype = 'Please select a vehicle type.';
    if (!checked.length) e.viol = 'Select at least one violation.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const fines = checked.map((k) => ({ key: k, ...VIOLATIONS[k] }));
    const total = fines.reduce((s, f) => s + f.fine, 0);
    const vInfo = VEHICLE_TYPES.find((v) => v.id === vType);

    setResult({
      regNum: regNum.toUpperCase().replace(/[\s-]/g, ''),
      owner: owner || 'Not Provided',
      vClass: vInfo?.class || '',
      vLabel: vInfo?.label || '',
      fines,
      total,
      at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });
  };

  const reset = () => {
    setRegNum(''); setVType(''); setOwner('');
    setChecked([]); setResult(null); setErrors({});
  };

  const formatted = result
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(result.total)
    : null;

  return (
    <div className="max-w-3xl mx-auto w-full">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="text-center pb-2">
            <h2 className="text-xl font-extrabold text-white">Vehicle Fine Lookup</h2>
            <p className="text-xs text-zinc-500 mt-1">Enter vehicle details and select violations to generate an instant challan estimate.</p>
          </div>

          {/* Grid: Reg + Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Registration Number <span className="text-white">*</span>
              </label>
              <input
                type="text"
                value={regNum}
                onChange={(e) => setRegNum(e.target.value.toUpperCase())}
                placeholder="e.g. MH12AB1234"
                className={`w-full bg-black border rounded-lg px-3.5 py-2.5 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-white transition placeholder:text-zinc-700 ${
                  errors.reg ? 'border-white/50' : 'border-zinc-800'
                }`}
              />
              {errors.reg && <p className="text-zinc-400 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.reg}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Owner / Driver Name <span className="text-zinc-600 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white transition placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Vehicle Type <span className="text-white">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VEHICLE_TYPES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { setVType(v.id); setChecked([]); }}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all ${
                    vType === v.id
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
            {errors.vtype && <p className="text-zinc-400 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.vtype}</p>}
          </div>

          {/* Violations */}
          {vType && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-2">
                Select Violations <span className="text-white">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {available.map(([key, rule]) => {
                  const on = checked.includes(key);
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-pointer transition-all ${
                        on ? 'bg-white border-white' : 'bg-black border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(key)}
                        className="w-4 h-4 shrink-0 accent-black"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${on ? 'text-black' : 'text-zinc-200'}`}>{rule.label}</p>
                        <p className={`text-[10px] font-mono ${on ? 'text-zinc-700' : 'text-zinc-500'}`}>{rule.section}</p>
                      </div>
                      <span className={`text-xs font-extrabold shrink-0 px-2 py-0.5 rounded ${on ? 'text-black' : 'text-white'}`}>
                        ₹{rule.fine.toLocaleString('en-IN')}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.viol && <p className="text-zinc-400 text-[11px] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.viol}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-extrabold py-3.5 rounded-xl transition-all text-sm"
          >
            <FileText className="w-4 h-4" />
            Generate Challan Report
          </button>
        </form>
      ) : (
        /* Result */
        <div className="space-y-4">
          {/* Vehicle Banner */}
          <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-bold text-white text-sm">Challan Report Generated</span>
              </div>
              <span className="text-[10px] text-zinc-500">{result.at} IST</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Registration', value: result.regNum, mono: true },
                { label: 'Owner / Driver', value: result.owner },
                { label: 'Vehicle Class', value: result.vClass },
                { label: 'Violations', value: `${result.fines.length} offence(s)` },
              ].map((item) => (
                <div key={item.label} className="bg-black border border-zinc-800 rounded-lg p-3">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-0.5">{item.label}</span>
                  <span className={`font-bold text-white ${item.mono ? 'font-mono tracking-widest' : ''}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fine Breakdown */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-1.5 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" /> Statutory Fine Breakdown (₹ INR)
            </p>
            {result.fines.map((fine) => (
              <div key={fine.key} className="flex items-center justify-between bg-black border border-zinc-800 rounded-lg px-4 py-3 gap-3">
                <div>
                  <p className="text-xs font-bold text-white">{fine.label}</p>
                  <p className="text-[10px] font-mono text-zinc-500">{fine.section}</p>
                  <p className="text-[10px] text-zinc-600 italic mt-0.5">{fine.extra}</p>
                </div>
                <span className="text-sm font-extrabold text-white whitespace-nowrap">
                  ₹{fine.fine.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Total Payable Fine (₹ INR)</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">As per MV Amendment Act 2019</p>
            </div>
            <p className="text-3xl font-black text-black">{formatted}</p>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-zinc-600 text-center px-4 leading-relaxed">
            ⚖️ This is an informational challan estimate based on statutory MV Act fines. Official challans are issued by Traffic Police / e-Challan system.
          </p>

          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-950 text-white font-semibold py-3 rounded-xl transition border border-zinc-700 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Check Another Vehicle
          </button>
        </div>
      )}
    </div>
  );
}
