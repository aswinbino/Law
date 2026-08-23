import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check, Calculator, Flame, BookOpen, Search } from 'lucide-react';

const TRENDING = [
  "What is the fine for driving without a license in India?",
  "Penalty for riding without a helmet under Section 194D?",
  "What are the punishments for public nuisance under BNS?",
  "Fine for driving without valid PUCC certificate?",
];

const FINE_REF = {
  helmet:    { fine: '₹1,000',   statute: 'MV Act § 194D', detail: '+ 3-Month Licence Disqualification' },
  nolicense: { fine: '₹5,000',   statute: 'MV Act § 181',  detail: 'Possible vehicle seizure' },
  dui:       { fine: '₹10,000',  statute: 'MV Act § 185',  detail: 'Up to 6 months imprisonment (1st offence)' },
  puc:       { fine: '₹10,000',  statute: 'MV Act § 190(2)', detail: 'Mandatory Pollution Clearance' },
};

function QuickFineRef({ onSelectQuery }) {
  const [sel, setSel] = useState('helmet');
  const ref = FINE_REF[sel];

  return (
    <div className="space-y-4">
      {/* Quick Fine Reference */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" /> Instant Traffic Fine Reference
        </p>
        <select
          value={sel}
          onChange={(e) => setSel(e.target.value)}
          className="w-full bg-black border border-zinc-700 text-zinc-200 text-xs rounded-lg p-2.5 mb-3 focus:ring-1 focus:ring-white focus:outline-none"
        >
          <option value="helmet">Riding Without Helmet (§ 194D)</option>
          <option value="nolicense">Driving Without Licence (§ 181)</option>
          <option value="dui">Drunk Driving / DUI (§ 185)</option>
          <option value="puc">No PUCC Certificate (§ 190(2))</option>
        </select>
        <div className="bg-black border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-zinc-500 block font-mono">{ref.statute}</span>
            <span className="text-xs text-zinc-300 font-medium">{ref.detail}</span>
          </div>
          <span className="text-xl font-black text-white">{ref.fine}</span>
        </div>
      </div>

      {/* Trending Queries */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5" /> Frequent Legal Queries
        </p>
        <div className="space-y-1.5">
          {TRENDING.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelectQuery(q)}
              className="w-full text-left text-xs bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white p-2.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all flex justify-between items-center group"
            >
              <span className="line-clamp-1 flex-1">{q}</span>
              <Search className="w-3 h-3 text-zinc-600 group-hover:text-white transition shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* BNS Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Bharatiya Nyaya Sanhita (BNS)
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Indexed with updated BNS 2023 statutes alongside IPC mapping to return the latest applicable Indian laws.
        </p>
      </div>
    </div>
  );
}

export default function ChatBot({ presetPrompt, clearPreset }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am JurisBot India, your AI legal assistant. Ask me about traffic penalties, Bharatiya Nyaya Sanhita (BNS) sections, or civic fine structures.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (presetPrompt) { setInput(presetPrompt); clearPreset(); }
  }, [presetPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages((p) => [...p, { sender: 'user', text: userText }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages((p) => [...p, {
        sender: 'bot',
        text: data.answer || 'No statutory record found for this query.',
        sources: data.sources,
      }]);
    } catch {
      setMessages((p) => [...p, { sender: 'bot', text: 'Error connecting to the Indian Legal NLP server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      {/* Left: Quick Reference Panel */}
      <div className="lg:col-span-2 overflow-y-auto">
        <QuickFineRef onSelectQuery={(q) => setInput(q)} />
      </div>

      {/* Right: Chat Window */}
      <div className="lg:col-span-3 flex flex-col h-[650px] bg-black border border-zinc-800 rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2.5 bg-zinc-950">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Legal Assistant Window</p>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> RAG Grounded AI
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-zinc-700'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`relative group max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-white text-black rounded-tr-none font-medium'
                  : 'bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.sources?.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-zinc-800 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-zinc-500 font-semibold w-full">Verified Statutory Sources:</span>
                    {msg.sources.map((src, si) => (
                      <span key={si} className="text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded font-mono">
                        {src.statute || src.act_or_section}
                      </span>
                    ))}
                  </div>
                )}

                {msg.sender === 'bot' && (
                  <button
                    onClick={() => copy(msg.text, i)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition"
                  >
                    {copiedIdx === i ? <Check className="w-3 h-3 text-zinc-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              Retrieving Indian Legal Statutes...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Indian legal fines, BNS, or Motor Vehicle acts..."
            className="flex-1 bg-black border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-white transition placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-white hover:bg-zinc-200 text-black px-4 py-2.5 rounded-lg transition text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
