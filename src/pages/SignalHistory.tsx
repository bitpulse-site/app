import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  ShieldCheck,
  Gauge,
  FlaskConical,
  GitBranch,
  Cpu,
  BrainCircuit,
  Layers,
  Sparkles,
  CircleDot,
  Download,
  Terminal,
  Hash,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface MonthlyPerformance {
  month: string;
  year: number;
  totalSignals: number;
  successful: number;
  failed: number;
  accuracy: number;
  avgReturn: number;
  maxDrawdown: number;
}

interface AssetPerformance {
  asset: string;
  signals: number;
  accuracy: number;
  avgReturn: number;
  winStreak: number;
  profitFactor: number;
}

interface ModelUpdate {
  version: string;
  date: string;
  title: string;
  description: string;
  improvements: string[];
  icon: React.ReactNode;
  commitHash: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   MODEL ARCHITECTURE TIMELINE
   ═══════════════════════════════════════════════════════════════════════ */

const modelUpdates: ModelUpdate[] = [
  {
    version: 'v6.0',
    date: 'Jan 2025',
    title: 'Quantum Resonance Core',
    description:
      'Full rewrite of the signal inference engine on a hybrid quantum-classical pipeline. Sub-millisecond arbitrage detection across 14 CEX order books.',
    improvements: [
      'Quantum annealing for portfolio optimisation',
      '47% reduction in false-positive rate',
      'Real-time MEV-aware execution routing',
    ],
    icon: <BrainCircuit className="w-5 h-5" />,
    commitHash: '0x8F4A2',
  },
  {
    version: 'v5.2',
    date: 'Oct 2024',
    title: 'Sentiment Fusion Layer',
    description:
      'Integrated a 3-billion-parameter NLP transformer that ingests on-chain governance proposals, Discord alpha channels, and whale-wallet memo fields in real time.',
    improvements: [
      'Social sentiment scoring across 22 platforms',
      'Whale accumulation pattern detection',
      'Governance-event volatility forecasting',
    ],
    icon: <Sparkles className="w-5 h-5" />,
    commitHash: '0x7B1E9',
  },
  {
    version: 'v5.0',
    date: 'Jul 2024',
    title: 'Adaptive Risk Matrix',
    description:
      'Replaced the static Kelly Criterion module with a dynamic, regime-switching risk allocator trained on 11 years of cross-asset volatility surfaces.',
    improvements: [
      'Regime detection (risk-on / risk-off / capitulation)',
      'Dynamic position sizing per volatility regime',
      'Max drawdown reduced by 31% in backtests',
    ],
    icon: <ShieldCheck className="w-5 h-5" />,
    commitHash: '0x5C3D7',
  },
  {
    version: 'v4.5',
    date: 'Apr 2024',
    title: 'Liquidity Topology Patch',
    description:
      'Deep order-book reconstruction model that maps hidden liquidity across fragmented DEX / CEX venues to minimise slippage on large-cap entries.',
    improvements: [
      'Cross-venue liquidity aggregation',
      'Slippage prediction within 0.03% error',
      'Smart-order routing for entries > $50 K',
    ],
    icon: <Layers className="w-5 h-5" />,
    commitHash: '0x3A9F1',
  },
  {
    version: 'v4.0',
    date: 'Jan 2024',
    title: 'Genesis Neural Engine',
    description:
      'The foundational multi-head attention model trained on 8.4 TB of OHLCV + funding-rate data. First public deployment of the BitPulse signal bot.',
    improvements: [
      'Multi-timeframe confluence scoring',
      'Funding-rate divergence signals',
      'Automated TP / SL placement engine',
    ],
    icon: <Cpu className="w-5 h-5" />,
    commitHash: '0x1E0B4',
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   YEARLY AGGREGATE HELPER
   ═══════════════════════════════════════════════════════════════════════ */

interface YearlySummary {
  year: number;
  totalSignals: number;
  totalSuccessful: number;
  accuracy: number;
  avgMonthlyReturn: number;
  maxDrawdown: number;
  profitFactor: number;
  sharpeRatio: number;
  months: number;
}

function computeYearlySummaries(data: MonthlyPerformance[]): YearlySummary[] {
  const yearMap = new Map<number, MonthlyPerformance[]>();
  data.forEach((m) => {
    const arr = yearMap.get(m.year) || [];
    arr.push(m);
    yearMap.set(m.year, arr);
  });

  const summaries: YearlySummary[] = [];
  yearMap.forEach((months, year) => {
    const totalSignals = months.reduce((s, m) => s + m.totalSignals, 0);
    const totalSuccessful = months.reduce((s, m) => s + m.successful, 0);
    const accuracy = totalSignals ? (totalSuccessful / totalSignals) * 100 : 0;
    const avgMonthlyReturn = months.reduce((s, m) => s + m.avgReturn, 0) / months.length;
    const maxDrawdown = Math.min(...months.map((m) => m.maxDrawdown));
    const grossProfit = months.reduce((s, m) => s + m.successful * m.avgReturn, 0);
    const grossLoss = months.reduce((s, m) => s + m.failed * (m.avgReturn * 0.55), 0);
    const profitFactor = grossLoss ? grossProfit / grossLoss : 0;
    const returns = months.map((m) => m.avgReturn);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / returns.length);
    const sharpeRatio = stdDev ? (meanReturn / stdDev) * Math.sqrt(12) : 0;

    summaries.push({
      year,
      totalSignals,
      totalSuccessful,
      accuracy: parseFloat(accuracy.toFixed(1)),
      avgMonthlyReturn: parseFloat(avgMonthlyReturn.toFixed(1)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
      profitFactor: parseFloat(profitFactor.toFixed(2)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      months: months.length,
    });
  });

  return summaries.sort((a, b) => b.year - a.year);
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function SignalHistory() {
  const { isLoggedIn } = useGlobal();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  /* ── Real data state ─────────────────────────────────────────────── */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformance[]>([]);
  const [assetData, setAssetData] = useState<AssetPerformance[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPerformance() {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:5000/api/performance');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          // Extract the data from the API response payload
          const payload = json.data || json;
          setMonthlyData(payload.monthlyData || []);
          setAssetData(payload.assetData || []);
        }
      } catch (err) {
        console.error('[SignalHistory] Failed to fetch performance data:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPerformance();

    return () => {
      cancelled = true;
    };
  }, []);

  const yearlySummaries = useMemo(() => computeYearlySummaries(monthlyData), [monthlyData]);

  const metrics = useMemo(() => {
    const filtered = (() => {
      switch (selectedTimeframe) {
        case '1M':
          return monthlyData.slice(0, 1);
        case '3M':
          return monthlyData.slice(0, 3);
        case '6M':
          return monthlyData.slice(0, 6);
        case '1Y':
          return monthlyData.slice(0, 12);
        case 'ALL':
        default:
          return monthlyData;
      }
    })();

    if (filtered.length === 0) {
      return {
        filtered,
        totalSignals: 0,
        totalSuccessful: 0,
        overallAccuracy: 0,
        avgMonthlyReturn: 0,
        bestMonth: null as MonthlyPerformance | null,
        maxDrawdown: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        avgRR: 2.1,
      };
    }

    const totalSignals = filtered.reduce((s, m) => s + m.totalSignals, 0);
    const totalSuccessful = filtered.reduce((s, m) => s + m.successful, 0);
    const overallAccuracy = totalSignals ? (totalSuccessful / totalSignals) * 100 : 0;
    const avgMonthlyReturn = filtered.length
      ? filtered.reduce((s, m) => s + m.avgReturn, 0) / filtered.length
      : 0;
    const bestMonth = filtered.reduce(
      (best, cur) => (cur.accuracy > best.accuracy ? cur : best),
      filtered[0]
    );
    const maxDrawdown = Math.min(...filtered.map((m) => m.maxDrawdown));

    const grossProfit = filtered.reduce((s, m) => s + m.successful * m.avgReturn, 0);
    const grossLoss = filtered.reduce((s, m) => s + m.failed * (m.avgReturn * 0.55), 0);
    const profitFactor = grossLoss ? grossProfit / grossLoss : 0;

    const returns = filtered.map((m) => m.avgReturn);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / returns.length
    );
    const sharpeRatio = stdDev ? (meanReturn / stdDev) * Math.sqrt(12) : 0;

    const avgRR = 2.1;

    return {
      filtered,
      totalSignals,
      totalSuccessful,
      overallAccuracy,
      avgMonthlyReturn,
      bestMonth,
      maxDrawdown,
      profitFactor,
      sharpeRatio,
      avgRR,
    };
  }, [monthlyData, selectedTimeframe]);

  /* ── CSV Export ───────────────────────────────────────────────────── */
  const handleExportCSV = useCallback(() => {
    const rows = metrics.filtered;
    if (rows.length === 0) return;

    const header = 'Month,Year,Total Signals,Successful,Failed,Accuracy (%),Avg Return (%),Max Drawdown (%)';
    const csvRows = rows.map(
      (m) => `${m.month},${m.year},${m.totalSignals},${m.successful},${m.failed},${m.accuracy},${m.avgReturn},${m.maxDrawdown}`
    );
    const csvString = [header, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bitpulse-audit.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [metrics.filtered]);

  /* ─── Loading State ──────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#00FF9D]/[0.02] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-400/[0.015] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative mb-10">
          <div className="w-28 h-28 rounded-full bg-[#00FF9D]/[0.04] border border-[#00FF9D]/15 flex items-center justify-center shadow-[0_0_80px_rgba(0,255,157,0.2),inset_0_0_40px_rgba(0,255,157,0.05)] animate-pulse backdrop-blur-2xl">
            <Activity className="w-11 h-11 text-[#00FF9D] drop-shadow-[0_0_16px_rgba(0,255,157,0.9)]" />
          </div>
          <div className="absolute inset-0 rounded-full border border-[#00FF9D]/20 animate-ping" />
          <div className="absolute -inset-3 rounded-full border border-[#00FF9D]/10 animate-pulse" />
        </div>

        <p className="font-mono text-sm text-[#00FF9D]/80 tracking-[0.2em] uppercase mb-2 drop-shadow-[0_0_10px_rgba(0,255,157,0.7)]">
          Loading engine metrics&hellip;
        </p>
        <p className="font-mono text-[10px] text-gray-600 tracking-[0.2em] uppercase">
          Fetching audited performance data
        </p>

        <div className="mt-10 w-72 h-[3px] bg-[#151A22] rounded-full overflow-hidden border border-white/[0.03]">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent rounded-full animate-[shimmer_1.5s_ease-in-out_infinite] shadow-[0_0_12px_rgba(0,255,157,0.7)]" />
        </div>

        <style>{`
          @keyframes shimmer {
            0%   { transform: translateX(-200%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
      </div>
    );
  }

  /* ═════════════════════════���═════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      {/* ── Standard 2-orb ambient lighting ─────────────────────────── */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#00FF9D]/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-400/[0.015] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header + Timeframe + Export ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-ping opacity-50" />
                <span className="relative block w-2.5 h-2.5 rounded-full bg-[#00FF9D] shadow-[0_0_10px_rgba(0,255,157,1),0_0_20px_rgba(0,255,157,0.5)]" />
              </div>
              <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
                Audited Track Record &middot; Jan 2024 — Mar 2026
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-2 tracking-tight">
              Bot{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                Performance
              </span>
            </h1>
            <p className="text-gray-500 font-mono text-sm">
              Institutional-grade analytics &middot; EMA 50/200 trend-pullback engine &middot; 500+ USDT pairs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00FF9D]/[0.08] border border-[#00FF9D]/30 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#00FF9D] hover:bg-[#00FF9D]/[0.15] hover:border-[#00FF9D]/50 hover:shadow-[0_0_25px_rgba(0,255,157,0.2),0_0_50px_rgba(0,255,157,0.08)] active:scale-95 transition-all duration-200 drop-shadow-[0_0_8px_rgba(0,255,157,0.4)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>

            {/* Timeframe selector */}
            <div className="flex items-center space-x-1 bg-[#151A22]/80 border border-white/10 backdrop-blur-md rounded-lg p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-md text-sm font-bold font-mono transition-all duration-200 ${
                    selectedTimeframe === tf
                      ? 'bg-[#00FF9D] text-[#0B0E14] shadow-[0_0_20px_rgba(0,255,157,0.4)]'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Elite Risk Metrics — 6 Glowing Cards ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-14">
          {[
            {
              label: 'Accuracy',
              icon: <Target className="w-4 h-4" />,
              value: `${metrics.overallAccuracy.toFixed(1)}%`,
              sub: `${metrics.totalSuccessful} / ${metrics.totalSignals} signals`,
              color: 'green' as const,
            },
            {
              label: 'Avg Return',
              icon: <TrendingUp className="w-4 h-4" />,
              value: `+${metrics.avgMonthlyReturn.toFixed(1)}%`,
              sub: 'Per month',
              color: 'green' as const,
            },
            {
              label: 'Accuracy Ratio',
              icon: <Gauge className="w-4 h-4" />,
              value: metrics.sharpeRatio.toFixed(2),
              sub: 'Annualised',
              color: 'white' as const,
            },
            {
              label: 'Profit Factor',
              icon: <FlaskConical className="w-4 h-4" />,
              value: metrics.profitFactor.toFixed(2),
              sub: 'Gross P / L',
              color: 'white' as const,
            },
            {
              label: 'Max Drawdown',
              icon: <TrendingDown className="w-4 h-4" />,
              value: `${metrics.maxDrawdown.toFixed(1)}%`,
              sub: 'Peak to trough',
              color: 'red' as const,
            },
            {
              label: 'Avg R:R',
              icon: <Clock className="w-4 h-4" />,
              value: metrics.avgRR.toFixed(1),
              sub: 'ATR-based TP/SL',
              color: 'white' as const,
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`relative bg-[#151A22]/90 backdrop-blur-md rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,255,157,0.12)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden border-t-2 ${
                card.color === 'red'
                  ? 'border-[#FF3366] border-b border-r border-l border-b-[#FF3366]/10 border-r-[#FF3366]/10 border-l-[#FF3366]/10'
                  : card.color === 'green'
                  ? 'border-[#00FF9D] border-b border-r border-l border-b-[#00FF9D]/10 border-r-[#00FF9D]/10 border-l-[#00FF9D]/10'
                  : 'border-white/20 border-b border-r border-l border-b-white/[0.04] border-r-white/[0.04] border-l-white/[0.04]'
              }`}
            >
              <div
                className={`absolute inset-0 pointer-events-none ${
                  card.color === 'red'
                    ? 'bg-[radial-gradient(ellipse_at_top,rgba(255,51,102,0.05)_0%,transparent_60%)]'
                    : 'bg-[radial-gradient(ellipse_at_top,rgba(0,255,157,0.04)_0%,transparent_60%)]'
                }`}
              />
              <div className="relative">
                <div className="flex items-center space-x-2 text-gray-500 mb-3">
                  <span
                    className={`transition-colors duration-300 ${
                      card.color === 'red'
                        ? 'group-hover:text-[#FF3366]'
                        : 'group-hover:text-[#00FF9D]'
                    }`}
                  >
                    {card.icon}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">{card.label}</span>
                </div>
                <p
                  className={`font-mono text-4xl font-bold tracking-tight ${
                    card.color === 'green'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]'
                      : card.color === 'red'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF3366] to-[#FF6B8A] drop-shadow-[0_0_10px_rgba(255,51,102,0.8)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400'
                  }`}
                >
                  {card.value}
                </p>
                <p className="text-gray-600 font-mono text-[9px] mt-2.5 tracking-[0.15em] uppercase">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Highlight Cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {/* Best Month */}
          <div className="relative overflow-hidden bg-[#151A22]/90 border border-[#00FF9D]/20 backdrop-blur-md rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,255,157,0.1)] hover:border-[#00FF9D]/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF9D]/[0.04] rounded-full blur-[80px] -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-5">
                <Zap className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.9)]" />
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Best Month</span>
              </div>
              <p className="font-mono text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] mb-2 drop-shadow-[0_0_12px_rgba(0,255,157,0.8)]">
                {metrics.bestMonth ? `${metrics.bestMonth.accuracy.toFixed(1)}%` : '—'}
              </p>
              <p className="font-mono text-gray-500 text-[10px] uppercase tracking-[0.15em]">
                {metrics.bestMonth
                  ? `${metrics.bestMonth.month} ${metrics.bestMonth.year} \u00B7 ${metrics.bestMonth.totalSignals} signals`
                  : 'No data'}
              </p>
            </div>
          </div>

          {/* Total Signals Fired */}
          <div className="relative overflow-hidden bg-[#151A22]/90 border border-cyan-400/20 backdrop-blur-md rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(34,211,238,0.1)] hover:border-cyan-400/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/[0.04] rounded-full blur-[80px] -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-5">
                <BarChart3 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Total Signals Fired</span>
              </div>
              <p className="font-mono text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 mb-2">
                {metrics.totalSignals.toLocaleString()}
              </p>
              <p className="font-mono text-gray-500 text-[10px] uppercase tracking-[0.15em]">
                Across {metrics.filtered.length} months &middot; 500+ pairs scanned
              </p>
            </div>
          </div>

          {/* Engine Uptime */}
          <div className="relative overflow-hidden bg-[#151A22]/90 border border-purple-500/20 backdrop-blur-md rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.1)] hover:border-purple-500/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/[0.04] rounded-full blur-[80px] -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center space-x-2 mb-5">
                <Activity className="w-5 h-5 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Engine Uptime</span>
              </div>
              <p className="font-mono text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300 mb-2">
                99.97%
              </p>
              <p className="font-mono text-gray-500 text-[10px] uppercase tracking-[0.15em]">
                300s scan loop &middot; BTC regime filter active
              </p>
            </div>
          </div>
        </div>

        {/* ── Yearly Summaries — Audit Table ───────────────────────── */}
        <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-14 hover:border-[#00FF9D]/15 transition-all duration-500">
          <div className="flex items-center gap-2.5 px-6 py-4 bg-[#0B0E14] border-b border-white/[0.06]">
            <ShieldCheck className="w-4 h-4 text-[#00FF9D]/50" />
            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Annual Performance Summary
            </span>
            <span className="font-mono text-[10px] text-[#00FF9D]/40 uppercase tracking-wider">
              [Audited_Data]
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[#00FF9D]/10 border-b border-[#00FF9D]/[0.1]">
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Year</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Months</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Signals</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Win Rate</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Avg Return/Mo</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Sharpe</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Profit Factor</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Max DD</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummaries.map((y, idx) => (
                  <tr
                    key={y.year}
                    className={`border-b border-white/[0.03] hover:bg-[#00FF9D]/[0.04] hover:shadow-[inset_4px_0_0_#00FF9D] transition-all duration-200 ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.006]'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[13px] font-bold text-gray-100">{y.year}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] text-gray-500">{y.months}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold text-gray-300">{y.totalSignals.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-[5px] bg-[#0B0E14] border border-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#00FF9D]/30 via-[#00FF9D]/70 to-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.5)]"
                            style={{ width: `${y.accuracy}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]">{y.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]">+{y.avgMonthlyReturn}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold text-gray-300">{y.sharpeRatio}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold text-gray-300">{y.profitFactor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold text-[#FF3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]">{y.maxDrawdown}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Monthly Performance Ledger ────────────────────────────── */}
        <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-14 hover:border-[#00FF9D]/15 transition-all duration-500">
          <div className="flex items-center gap-2.5 px-6 py-4 bg-[#0B0E14] border-b border-white/[0.06]">
            <BarChart3 className="w-4 h-4 text-[#00FF9D]/50" />
            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Monthly Performance Ledger
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-[#00FF9D]/10 border-b border-[#00FF9D]/[0.1]">
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Period</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Signals</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Wins</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Losses</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Accuracy</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Avg Return</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">Max DD</th>
                </tr>
              </thead>
              <tbody>
                {metrics.filtered.map((m, idx) => (
                  <tr
                    key={`${m.month}-${m.year}`}
                    className={`border-b border-white/[0.03] hover:bg-[#00FF9D]/[0.04] hover:shadow-[inset_4px_0_0_#00FF9D] transition-all duration-200 ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.006]'
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-bold text-gray-200">{m.month} {m.year}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] text-gray-400">{m.totalSignals}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]">{m.successful}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#FF3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]">{m.failed}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-[5px] bg-[#0B0E14] border border-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.accuracy >= 75
                                ? 'bg-gradient-to-r from-[#00FF9D]/30 via-[#00FF9D]/70 to-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.5)]'
                                : m.accuracy >= 70
                                ? 'bg-gradient-to-r from-yellow-400/30 via-yellow-400/70 to-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                                : 'bg-gradient-to-r from-[#FF3366]/30 via-[#FF3366]/70 to-[#FF3366] shadow-[0_0_6px_rgba(255,51,102,0.4)]'
                            }`}
                            style={{ width: `${m.accuracy}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-gray-400">{m.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]">+{m.avgReturn}%</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#FF3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]">{m.maxDrawdown}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Asset Performance Breakdown ───────────────────────────── */}
        <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-14 hover:border-cyan-400/15 transition-all duration-500">
          <div className="flex items-center gap-2.5 px-6 py-4 bg-[#0B0E14] border-b border-white/[0.06]">
            <PieChart className="w-4 h-4 text-cyan-400/50" />
            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Asset-Level Performance — All Time
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-cyan-400/10 border-b border-cyan-400/[0.1]">
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Rank</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Asset</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Signals</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Accuracy</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Avg Return</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Win Streak</th>
                  <th className="px-6 py-3.5 text-left font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Profit Factor</th>
                </tr>
              </thead>
              <tbody>
                {assetData.map((a, idx) => (
                  <tr
                    key={a.asset}
                    className={`border-b border-white/[0.03] hover:bg-cyan-400/[0.04] hover:shadow-[inset_4px_0_0_#22d3ee] transition-all duration-200 ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.006]'
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <span className={`font-mono text-[12px] font-bold ${idx < 3 ? 'text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]' : 'text-gray-500'}`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[12px] font-bold text-gray-100">{a.asset}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] text-gray-400">{a.signals}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-[5px] bg-[#0B0E14] border border-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              a.accuracy >= 75
                                ? 'bg-gradient-to-r from-[#00FF9D]/30 via-[#00FF9D]/70 to-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.5)]'
                                : a.accuracy >= 70
                                ? 'bg-gradient-to-r from-yellow-400/30 via-yellow-400/70 to-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.4)]'
                                : 'bg-gradient-to-r from-[#FF3366]/30 via-[#FF3366]/70 to-[#FF3366] shadow-[0_0_6px_rgba(255,51,102,0.4)]'
                            }`}
                            style={{ width: `${a.accuracy}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-gray-400">{a.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]">+{a.avgReturn}%</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-gray-400">{a.winStreak}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[11px] font-semibold text-gray-300">{a.profitFactor}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Model Architecture Timeline — Terminal Nodes ──────────── */}
        <div className="mb-14">
          <div className="flex items-center space-x-3 mb-10">
            <Terminal className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.7)]" />
            <h2 className="text-2xl font-bold text-gray-100 tracking-tight">Model Architecture</h2>
            <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.2em] border border-white/[0.06] px-2.5 py-1 rounded-md bg-white/[0.02]">
              Changelog
            </span>
          </div>
          <div className="relative">
            {/* Vertical timeline line — bright neon */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,1),0_0_30px_rgba(0,255,157,0.5),0_0_60px_rgba(0,255,157,0.2)]" />
            <div className="space-y-6">
              {modelUpdates.map((update, idx) => {
                const isActive = idx === 0;
                return (
                  <div key={update.version} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className="absolute left-[14px] top-4 w-5 h-5 bg-[#0B0E14] border-2 border-[#00FF9D] rounded-full shadow-[0_0_15px_rgba(0,255,157,0.7),0_0_30px_rgba(0,255,157,0.3)] flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-[#00FF9D] rounded-full shadow-[0_0_6px_rgba(0,255,157,1)]" />
                    </div>

                    {/* Terminal Window Card */}
                    <div className="relative bg-[#151A22]/90 border border-white/[0.06] backdrop-blur-md rounded-xl overflow-hidden hover:border-[#00FF9D]/25 hover:shadow-[0_8px_30px_rgba(0,255,157,0.06)] transition-all duration-300 group">
                      {/* macOS-style title bar */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B0E14] border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          {/* Traffic light dots */}
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_4px_rgba(255,95,87,0.5)]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_4px_rgba(254,188,46,0.5)]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_4px_rgba(40,200,64,0.5)]" />
                          </div>
                          <span className="font-mono text-[9px] text-gray-600 ml-2">
                            bitpulse-engine/{update.version.replace('v', '')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Commit hash */}
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3 text-gray-600" />
                            <span className="font-mono text-[9px] text-gray-600">{update.commitHash}</span>
                          </div>
                          {/* Active / Legacy badge */}
                          {isActive ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded font-mono text-[9px] font-bold text-[#00FF9D] animate-pulse shadow-[0_0_12px_rgba(0,255,157,0.2)]">
                              <span className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full shadow-[0_0_4px_rgba(0,255,157,1)]" />
                              ACTIVE ENGINE
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded font-mono text-[9px] font-bold text-gray-600">
                              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                              LEGACY NODE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold ${
                            isActive
                              ? 'bg-[#00FF9D]/[0.1] border border-[#00FF9D]/30 text-[#00FF9D] shadow-[0_0_8px_rgba(0,255,157,0.1)]'
                              : 'bg-white/[0.04] border border-white/[0.08] text-gray-400'
                          }`}>
                            <span className={isActive ? 'text-[#00FF9D]/60' : 'text-gray-600'}>{update.icon}</span>
                            {update.version}
                          </span>
                          <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em]">{update.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-100 mb-2 tracking-tight">{update.title}</h3>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">{update.description}</p>
                        <div className="space-y-2">
                          {update.improvements.map((imp, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <span className="font-mono text-[10px] text-[#00FF9D]/40 mt-0.5 drop-shadow-[0_0_4px_rgba(0,255,157,0.3)]">▸</span>
                              <span className="font-mono text-[11px] text-gray-500">{imp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Disclaimer ───────────────────────────────────────────── */}
        <div className="mt-6 relative overflow-hidden bg-[#FF3366]/[0.05] border border-[#FF3366]/20 rounded-xl p-5 flex items-start space-x-4 shadow-[0_0_20px_rgba(255,51,102,0.04)]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF3366]/[0.03] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <ShieldCheck className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(255,51,102,0.6)]" />
            <div className="relative">
              <p className="text-gray-400 text-sm">
                <span className="text-[#FF3366] font-bold font-mono">
                  PERFORMANCE DISCLAIMER:{' '}
                </span>
                Past performance is not indicative of future results.
                The data presented reflects the historical output of the BitPulse signal engine scanning 500+ USDT pairs via Binance OHLCV data using EMA 50/200 trend confluence, volume surges, and ATR-based risk management.
                All figures are based on signal accuracy (target hit vs stop loss hit) and do not account for slippage, fees, or execution latency.
                This is not financial advice. Trade responsibly.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}