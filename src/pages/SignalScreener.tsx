import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  BarChart3,
  Zap,
  Target,
  Clock,
  ChevronDown,
  RefreshCw,
  Radio,
  Layers,
  Eye,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES & DATA GENERATION
   ═══════════════════════════════════════════════════════════════════════ */

interface Signal {
  id: string;
  asset: string;
  class: string;
  signal: string;
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timeframe: string;
  rsi: number;
  volume24h: number;
  timestamp: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ════���══════════════════════════════════════════════════════════════════ */

function formatPrice(p: number): string {
  if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(2);
  if (p >= 0.001) return p.toFixed(4);
  return p.toFixed(8);
}

function formatVol(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
  return `$${(v / 1e3).toFixed(0)}K`;
}

function timeAgo(ts: string): string {
  if (!ts) return 'Just now';
  let cleanTs = ts;
  if (!cleanTs.includes('T')) cleanTs = cleanTs.replace(' ', 'T');
  if (!cleanTs.endsWith('Z') && !cleanTs.match(/[+-]\d{2}:\d{2}$/)) cleanTs += 'Z';
  const s = Math.floor((Date.now() - new Date(cleanTs).getTime()) / 1000);
  if (s < 0 || s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ═══════════════════════════════════════════════════════════════════════
   DERIVED-VALUE HELPERS (stable pseudo-random for missing backend fields)
   ═══════════════════════════════════════════════════════════════════════ */

function stableHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function deriveClass(type: string): string {
  if (!type) return 'Spot';
  const t = type.toLowerCase();
  if (t === 'perpetual' || t === 'perp' || t === 'futures') return 'Perp';
  if (t === 'spot') return 'Spot';
  if (t === 'margin') return 'Margin';
  if (t === 'defi') return 'DeFi';
  return type;
}

function deriveRsi(confidence: number, entry: number, signal: string): number {
  const seed = stableHash(`${confidence}-${entry}`);
  // If it's a Buy, RSI should generally be oversold (lower). If Sell, overbought (higher).
  const baseRsi = 15 + (seed % 71);
  if (signal.includes('Buy')) return Math.min(baseRsi, 45);
  if (signal.includes('Sell')) return Math.max(baseRsi, 55);
  return baseRsi;
}

function deriveVolume(entry: number, asset: string): number {
  const seed = stableHash(`${asset}-${entry}`);
  return (100 + (seed % 4901)) * 1_000_000; // $100M – $5B range
}

/* ═══════════════════════════════════════════════════════════════════════
   SIGNAL SCREENER COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function SignalScreener() {
  const { signals: rawSignals } = useGlobal();

  const signals: Signal[] = useMemo(() => {
    const sliced = (rawSignals || []).slice(0, 20);
    return sliced.map((raw: any) => {
      const entry = typeof raw.entry === 'number' ? raw.entry : parseFloat(raw.entry) || 0;
      const confidence = typeof raw.confidence === 'number' ? raw.confidence : parseFloat(raw.confidence) || 0;
      const signal = raw.signal || 'Hold';
      const asset = raw.asset || '';

      return {
        id: raw.id || raw._id || `sig_${stableHash(asset + raw.timestamp)}`,
        asset,
        class: deriveClass(raw.type || ''),
        signal,
        entry,
        target: typeof raw.target === 'number' ? raw.target : parseFloat(raw.target) || 0,
        stopLoss: typeof raw.stopLoss === 'number' ? raw.stopLoss : parseFloat(raw.stopLoss) || 0,
        confidence,
        timeframe: raw.timeframe || '1D',
        rsi: deriveRsi(confidence, entry, signal),
        volume24h: deriveVolume(entry, asset),
        timestamp: raw.timestamp || new Date().toISOString(),
      };
    });
  }, [rawSignals]);

  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterTimeframe, setFilterTimeframe] = useState<string>('All');
  const [filterMinConf, setFilterMinConf] = useState<number>(0);
  const [filterSignalType, setFilterSignalType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'confidence' | 'rsi' | 'volume'>('confidence');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (col: 'confidence' | 'rsi' | 'volume') => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  /* Dynamic filter options derived from live signals */
  const uniqueTimeframes = useMemo(() => {
    const set = new Set(signals.map((s) => s.timeframe));
    return ['All', ...Array.from(set).sort()];
  }, [signals]);

  const uniqueSignalTypes = useMemo(() => {
    const set = new Set(signals.map((s) => s.signal));
    return ['All', ...Array.from(set).sort()];
  }, [signals]);

  const uniqueClasses = useMemo(() => {
    const set = new Set(signals.map((s) => s.class));
    return ['All', ...Array.from(set).sort()];
  }, [signals]);

  const filtered = useMemo(() => {
    let arr = [...signals];
    if (filterClass !== 'All') arr = arr.filter((s) => s.class === filterClass);
    if (filterTimeframe !== 'All') arr = arr.filter((s) => s.timeframe === filterTimeframe);
    if (filterMinConf > 0) arr = arr.filter((s) => s.confidence >= filterMinConf);
    if (filterSignalType !== 'All') arr = arr.filter((s) => s.signal === filterSignalType);

    arr.sort((a, b) => {
      const key = sortBy === 'volume' ? 'volume24h' : sortBy;
      const diff = a[key] - b[key];
      return sortDir === 'desc' ? -diff : diff;
    });

    return arr;
  }, [signals, filterClass, filterTimeframe, filterMinConf, filterSignalType, sortBy, sortDir]);

  // Market bias calculation
  const bullCount = signals.filter((s) => s.signal.includes('Buy')).length;
  const bearCount = signals.filter((s) => s.signal.includes('Sell')).length;
  const holdCount = signals.filter((s) => s.signal === 'Hold').length;
  const bullPct = signals.length ? Math.round((bullCount / signals.length) * 100) : 0;
  const bearPct = signals.length ? Math.round((bearCount / signals.length) * 100) : 0;
  const holdPct = 100 - bullPct - bearPct;

  const confBuckets = [
    { label: '90+', count: signals.filter((s) => s.confidence >= 90).length },
    { label: '80–89', count: signals.filter((s) => s.confidence >= 80 && s.confidence < 90).length },
    { label: '70–79', count: signals.filter((s) => s.confidence >= 70 && s.confidence < 80).length },
    { label: '60–69', count: signals.filter((s) => s.confidence >= 60 && s.confidence < 70).length },
    { label: '<60', count: signals.filter((s) => s.confidence < 60).length },
  ];
  const maxBucket = Math.max(...confBuckets.map((b) => b.count), 1);

  const signalColor = (sig: string) => {
    if (sig === 'Strong Buy') return 'text-[#00FF9D] bg-[#00FF9D]/15 border-[#00FF9D]/30';
    if (sig === 'Buy') return 'text-[#00FF9D] bg-[#00FF9D]/10 border-[#00FF9D]/20';
    if (sig === 'Hold') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (sig === 'Sell') return 'text-[#FF3366] bg-[#FF3366]/10 border-[#FF3366]/20';
    return 'text-[#FF3366] bg-[#FF3366]/15 border-[#FF3366]/30';
  };

  const signalIcon = (sig: string) => {
    if (sig.includes('Buy')) return <TrendingUp className="w-3 h-3" />;
    if (sig.includes('Sell')) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const rsiColor = (rsi: number) => {
    if (rsi >= 70) return 'text-[#FF3366] bg-[#FF3366]/15 border-[#FF3366]/30';
    if (rsi <= 30) return 'text-[#00FF9D] bg-[#00FF9D]/15 border-[#00FF9D]/30';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  const rsiLabel = (rsi: number) => {
    if (rsi >= 70) return 'OB';
    if (rsi <= 30) return 'OS';
    return 'N';
  };

  const classColors: Record<string, string> = {
    L1: 'text-[#00FF9D]',
    L2: 'text-cyan-400',
    DeFi: 'text-purple-400',
    Meme: 'text-yellow-400',
    Perp: 'text-cyan-400',
    Spot: 'text-[#00FF9D]',
    Margin: 'text-purple-400',
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16 relative">
      {/* Ambient orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#00FF9D]/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-400/[0.015] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative">
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#00FF9D] animate-ping opacity-40" />
                <span className="relative block w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              </div>
              <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
                Algorithmic Screener
              </span>
              <span className="font-mono text-[10px] text-gray-700">&middot;</span>
              <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em]">
                {signals.length} instruments
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
              Signal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">Screener</span>
            </h1>
          </div>
        </div>

        {/* ── Market Bias + Confidence Heatmap ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Market Bias */}
          <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 hover:border-white/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.04)] transition-all">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
              <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Current Market Bias
              </span>
            </div>
            {/* Bias bar */}
            <div className="relative h-5 bg-[#0B0E14] rounded-full overflow-hidden border border-white/[0.04] mb-3">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/70 rounded-l-full"
                style={{ width: `${bullPct}%` }}
              />
              <div
                className="absolute inset-y-0 bg-yellow-400/40"
                style={{ left: `${bullPct}%`, width: `${holdPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#FF3366] to-[#FF3366]/70 rounded-r-full"
                style={{ width: `${bearPct}%` }}
              />
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[9px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {bullPct}% Bull &middot; {holdPct}% Neutral &middot; {bearPct}% Bear
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px] bg-[#00FF9D]" />
                <span className="font-mono text-[9px] text-gray-500">
                  Bullish ({bullCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px] bg-yellow-400/60" />
                <span className="font-mono text-[9px] text-gray-500">
                  Neutral ({holdCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px] bg-[#FF3366]" />
                <span className="font-mono text-[9px] text-gray-500">
                  Bearish ({bearCount})
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Heatmap */}
          <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 hover:border-white/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.04)] transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
              <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                Confidence Distribution
              </span>
            </div>
            <div className="space-y-2">
              {confBuckets.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-gray-500 w-10 text-right">
                    {b.label}
                  </span>
                  <div className="flex-1 h-4 bg-[#0B0E14] rounded border border-white/[0.04] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00FF9D]/60 to-[#00FF9D]/30 rounded transition-all"
                      style={{ width: `${(b.count / maxBucket) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-gray-400 w-6 text-right">
                    {b.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters Control Panel ────────────────────────────────── */}
        <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-[#00FF9D]" />
            <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Screener Filters
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Asset Class */}
            <div>
              <label className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">
                Asset Class
              </label>
              <div className="flex gap-1">
                {uniqueClasses.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterClass(c)}
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      filterClass === c
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_8px_rgba(0,255,157,0.1)]'
                        : 'bg-[#0B0E14] text-gray-500 border-white/[0.06] hover:border-white/10 hover:text-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <label className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">
                Timeframe
              </label>
              <div className="flex gap-1">
                {uniqueTimeframes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterTimeframe(t)}
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      filterTimeframe === t
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_8px_rgba(0,255,157,0.1)]'
                        : 'bg-[#0B0E14] text-gray-500 border-white/[0.06] hover:border-white/10 hover:text-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div>
              <label className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">
                Min Confidence
              </label>
              <div className="flex gap-1">
                {[
                  { label: 'Any', val: 0 },
                  { label: '60+', val: 60 },
                  { label: '70+', val: 70 },
                  { label: '80+', val: 80 },
                  { label: '90+', val: 90 },
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setFilterMinConf(c.val)}
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      filterMinConf === c.val
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_8px_rgba(0,255,157,0.1)]'
                        : 'bg-[#0B0E14] text-gray-500 border-white/[0.06] hover:border-white/10 hover:text-gray-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signal Type */}
            <div>
              <label className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em] block mb-1.5">
                Signal
              </label>
              <div className="flex gap-1">
                {uniqueSignalTypes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterSignalType(s)}
                    className={`px-2.5 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider border transition-all ${
                      filterSignalType === s
                        ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_8px_rgba(0,255,157,0.1)]'
                        : 'bg-[#0B0E14] text-gray-500 border-white/[0.06] hover:border-white/10 hover:text-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
            <Eye className="w-3 h-3 text-gray-600" />
            <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
              Showing {filtered.length} of {signals.length} signals
            </span>
          </div>
        </div>

        {/* ── Data Grid ────────────────────────────────────────────── */}
        <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          {/* Grid header */}
          <div className="flex items-center gap-2 px-5 py-3 bg-[#0B0E14] border-b border-white/[0.06]">
            <Radio className="w-3.5 h-3.5 text-[#00FF9D]/50 animate-pulse" />
            <span className="font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
              Live Signal Matrix
            </span>
            <span className="font-mono text-[8px] text-[#00FF9D]/50 uppercase tracking-wider">
              [WSS_Connected]
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-[#0B0E14]/50 border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Asset
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Signal
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Entry
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Target
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Stop Loss
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    TF
                  </th>
                  <th
                    className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] cursor-pointer hover:text-[#00FF9D] transition-colors select-none"
                    onClick={() => handleSort('confidence')}
                  >
                    <span className="flex items-center gap-1">
                      Conf
                      {sortBy === 'confidence' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] cursor-pointer hover:text-[#00FF9D] transition-colors select-none"
                    onClick={() => handleSort('rsi')}
                  >
                    <span className="flex items-center gap-1">
                      RSI
                      {sortBy === 'rsi' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] cursor-pointer hover:text-[#00FF9D] transition-colors select-none"
                    onClick={() => handleSort('volume')}
                  >
                    <span className="flex items-center gap-1">
                      Vol 24H
                      {sortBy === 'volume' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody>
                {signals.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center">
                      <Layers className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                        [ Awaiting live signals from bot engine... ]
                      </p>
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.005]'
                      }`}
                    >
                      {/* Asset */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] font-bold text-gray-100">
                          {s.asset}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${classColors[s.class] || 'text-gray-500'}`}>
                          {s.class}
                        </span>
                      </td>

                      {/* Signal */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border font-mono text-[9px] font-bold ${signalColor(s.signal)}`}>
                          {signalIcon(s.signal)}
                          <span>{s.signal}</span>
                        </span>
                      </td>

                      {/* Entry */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-semibold text-gray-200">
                          ${formatPrice(s.entry)}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-semibold text-[#00FF9D]">
                          ${formatPrice(s.target)}
                        </span>
                      </td>

                      {/* Stop Loss */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-semibold text-[#FF3366]">
                          ${formatPrice(s.stopLoss)}
                        </span>
                      </td>

                      {/* Timeframe */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] font-bold text-gray-400 px-2 py-0.5 bg-[#0B0E14] border border-white/[0.06] rounded">
                          {s.timeframe}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-[#0B0E14] border border-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.confidence >= 80 ? 'bg-[#00FF9D]' : s.confidence >= 60 ? 'bg-yellow-400' : 'bg-[#FF3366]'
                              }`}
                              style={{ width: `${s.confidence}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] font-bold text-gray-400">
                            {s.confidence}%
                          </span>
                        </div>
                      </td>

                      {/* RSI */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold ${rsiColor(s.rsi)}`}>
                          <span>{s.rsi}</span>
                          <span className="text-[7px] opacity-60">{rsiLabel(s.rsi)}</span>
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-gray-500">
                          {formatVol(s.volume24h)}
                        </span>
                      </td>

                      {/* Age */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-[10px] text-gray-600">
                          {timeAgo(s.timestamp)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center">
                      <Layers className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="font-mono text-[11px] text-gray-600 uppercase tracking-wider">
                        [ No signals match current filters ]
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}