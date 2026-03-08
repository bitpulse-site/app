import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Briefcase,
  CheckCircle,
  XCircle,
  Minus,
  Activity,
  Target,
  ShieldAlert,
  Radio,
  Terminal,
  Zap,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';

export default function Portfolio() {
  const { isLoggedIn, takenTrades, ignoredTrades, closeTrade, updateTradePnL } =
    useGlobal();
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'ignored'>(
    'active'
  );
  const [wssFlash, setWssFlash] = useState(false);

  // ── Simulate live PnL updates every 3 seconds ──────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      takenTrades.forEach((trade) => {
        if (trade.status === 'active') {
          const fluctuation = (Math.random() - 0.5) * 100;
          updateTradePnL(trade.id, trade.simulatedPnL + fluctuation);
        }
      });
      // Flash WSS indicator on each tick
      setWssFlash(true);
      setTimeout(() => setWssFlash(false), 600);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoggedIn, takenTrades, updateTradePnL]);

  // ── Login Wall ──────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-[#00FF9D]/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,255,157,0.15)]">
            <Briefcase className="w-12 h-12 text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4 font-mono tracking-tight">
            Portfolio{' '}
            <span className="text-[#00FF9D]">Access Required</span>
          </h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto font-mono text-sm leading-relaxed">
            Authenticate to access position management, live P&L tracking, and
            risk analytics.
          </p>
          <Link
            to="/?login=true"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:shadow-[0_0_50px_rgba(0,255,157,0.5)]"
          >
            <span>Authenticate</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived data ────────────────────────────────────────────────────
  const activeTrades = takenTrades.filter((t) => t.status === 'active');
  const closedTrades = takenTrades.filter((t) => t.status === 'closed');

  const totalInvested = takenTrades.reduce((sum, t) => sum + t.amount, 0);
  const totalPnL = takenTrades.reduce((sum, t) => sum + t.simulatedPnL, 0);
  const goodTrades = closedTrades.filter((t) => t.simulatedPnL > 0).length;
  const badTrades = closedTrades.filter((t) => t.simulatedPnL <= 0).length;
  const winRate =
    closedTrades.length > 0 ? (goodTrades / closedTrades.length) * 100 : 0;

  const getPnLColor = (pnl: number) =>
    pnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF3366]';
  const getPnLGlow = (pnl: number) =>
    pnl >= 0
      ? 'text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]'
      : 'text-[#FF3366] drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]';
  const getPnLIcon = (pnl: number) =>
    pnl >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );

  const pnlPositive = totalPnL >= 0;

  // ── Tab config ──────────────────────────────────────────────────────
  const tabs = [
    {
      key: 'active' as const,
      label: 'Active_Positions',
      count: activeTrades.length,
    },
    {
      key: 'closed' as const,
      label: 'Closed_Trades',
      count: closedTrades.length,
    },
    {
      key: 'ignored' as const,
      label: 'Ignored_Signals',
      count: ignoredTrades.length,
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header + WSS Indicator ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
              <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
                Position Management Terminal
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-2 tracking-tight">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                Portfolio
              </span>
            </h1>
            <p className="text-gray-500 font-mono text-sm">
              Live P&L tracking &middot; Risk analytics &middot; Position
              management
            </p>
          </div>

          {/* WSS Live Sync */}
          <div className="mt-4 sm:mt-0 flex items-center gap-3 px-4 py-2.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full transition-all duration-300 ${
                  wssFlash
                    ? 'bg-[#00FF9D]/80 scale-150 opacity-0'
                    : 'bg-[#00FF9D]/30 scale-100 opacity-100'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-shadow ${
                  wssFlash
                    ? 'bg-[#00FF9D] shadow-[0_0_12px_rgba(0,255,157,0.8)]'
                    : 'bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.5)]'
                }`}
              />
            </span>
            <span className="font-mono text-[10px] font-bold text-[#00FF9D]/80 uppercase tracking-[0.15em]">
              [WSS: LIVE_SYNC]
            </span>
            <span className="font-mono text-[9px] text-gray-600">
              3s tick
            </span>
          </div>
        </div>

        {/* ── Live Risk Dashboard — 4 Metric Cards ─────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Invested */}
          <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:shadow-[0_0_25px_rgba(0,255,157,0.12)] hover:border-[#00FF9D]/30 transition-all duration-300 group">
            <div className="flex items-center space-x-2 text-gray-500 mb-3">
              <Briefcase className="w-4 h-4 group-hover:text-[#00FF9D] transition-colors" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.15em]">
                Total Invested
              </span>
            </div>
            <p className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              ${totalInvested.toLocaleString()}
            </p>
            <p className="text-gray-600 text-[10px] font-mono mt-2 tracking-wide">
              Across {takenTrades.length} positions
            </p>
          </div>

          {/* Total P&L — Glows based on direction */}
          <div
            className={`bg-[#151A22]/90 border backdrop-blur-md rounded-xl p-5 transition-all duration-300 group ${
              pnlPositive
                ? 'border-[#00FF9D]/15 shadow-[0_0_20px_rgba(0,255,157,0.1)] hover:shadow-[0_0_35px_rgba(0,255,157,0.2)] hover:border-[#00FF9D]/40'
                : 'border-[#FF3366]/15 shadow-[0_0_20px_rgba(255,51,102,0.1)] hover:shadow-[0_0_35px_rgba(255,51,102,0.2)] hover:border-[#FF3366]/40'
            }`}
          >
            <div className="flex items-center space-x-2 text-gray-500 mb-3">
              <Activity
                className={`w-4 h-4 ${
                  pnlPositive
                    ? 'group-hover:text-[#00FF9D]'
                    : 'group-hover:text-[#FF3366]'
                } transition-colors`}
              />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.15em]">
                Total P&L
              </span>
            </div>
            <p
              className={`font-mono text-3xl font-bold ${getPnLGlow(totalPnL)}`}
            >
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </p>
            <p className="text-gray-600 text-[10px] font-mono mt-2 tracking-wide">
              {pnlPositive ? 'Unrealised profit' : 'Unrealised loss'}
            </p>
          </div>

          {/* Win Rate + Visual Bar */}
          <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:shadow-[0_0_25px_rgba(0,255,157,0.12)] hover:border-[#00FF9D]/30 transition-all duration-300 group">
            <div className="flex items-center space-x-2 text-gray-500 mb-3">
              <Target className="w-4 h-4 group-hover:text-[#00FF9D] transition-colors" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.15em]">
                Win Rate
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {winRate.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                <span className="text-[#00FF9D]">{goodTrades}W</span>
                <span className="text-gray-700">/</span>
                <span className="text-[#FF3366]">{badTrades}L</span>
              </div>
            </div>
            {/* W/L Visual Bar */}
            <div className="mt-3 flex h-1.5 rounded-full overflow-hidden gap-[1px]">
              <div
                className="bg-[#00FF9D] rounded-l-full shadow-[0_0_4px_rgba(0,255,157,0.4)] transition-all duration-500"
                style={{
                  width: `${closedTrades.length > 0 ? (goodTrades / closedTrades.length) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-[#FF3366] rounded-r-full shadow-[0_0_4px_rgba(255,51,102,0.4)] transition-all duration-500"
                style={{
                  width: `${closedTrades.length > 0 ? (badTrades / closedTrades.length) * 100 : 50}%`,
                }}
              />
            </div>
          </div>

          {/* Active Trades */}
          <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:shadow-[0_0_25px_rgba(0,255,157,0.12)] hover:border-[#00FF9D]/30 transition-all duration-300 group">
            <div className="flex items-center space-x-2 text-gray-500 mb-3">
              <Zap className="w-4 h-4 group-hover:text-[#00FF9D] transition-colors" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.15em]">
                Active Positions
              </span>
            </div>
            <p className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              {activeTrades.length}
            </p>
            <p className="text-gray-600 text-[10px] font-mono mt-2 tracking-wide">
              {closedTrades.length} closed &middot;{' '}
              {ignoredTrades.length} ignored
            </p>
          </div>
        </div>

        {/* ── Terminal Tabs ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-8 bg-[#151A22]/60 border border-white/[0.04] rounded-lg p-1 w-fit backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#00FF9D] text-[#0B0E14] shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <span
                className={`transition-all ${
                  activeTab === tab.key
                    ? 'opacity-100 w-2'
                    : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {'>'}
              </span>
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  activeTab === tab.key
                    ? 'bg-[#0B0E14]/20 text-[#0B0E14]'
                    : 'bg-white/[0.04] text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════
           ACTIVE TRADES TABLE
           ════════════════════════════════════════════════════════════ */}
        {activeTab === 'active' && (
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-[#0B0E14]/80">
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Entry
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Risk Band
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Live P&L
                    </th>
                    <th className="px-6 py-4 text-right text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {activeTrades.length > 0 ? (
                    activeTrades.map((trade) => (
                      <tr
                        key={trade.id}
                        className="hover:bg-white/[0.02] transition-colors group/row"
                      >
                        {/* Position — merged Asset + Type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="flex flex-col">
                              <span className="text-gray-100 font-bold font-mono text-sm">
                                Signal #{trade.signalId}
                              </span>
                              <span
                                className={`inline-flex items-center w-fit mt-1 px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-[0.15em] border ${
                                  trade.type === 'Spot'
                                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20'
                                    : 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20'
                                }`}
                              >
                                {trade.type}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-gray-200">
                          ${trade.amount.toLocaleString()}
                        </td>
                        {/* Entry */}
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-400">
                          ${trade.entryPrice.toLocaleString()}
                        </td>
                        {/* Risk Band */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-[#00FF9D]">
                                TP ${trade.targetPrice.toLocaleString()}
                              </span>
                            </div>
                            {/* Visual risk band bar */}
                            <div className="w-24 h-1 rounded-full overflow-hidden flex gap-[1px]">
                              <div className="flex-1 bg-[#FF3366]/60 rounded-l-full" />
                              <div className="flex-[2] bg-yellow-400/40" />
                              <div className="flex-1 bg-[#00FF9D]/60 rounded-r-full" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-[#FF3366]">
                                SL ${trade.stopLoss.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Live P&L */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`flex items-center space-x-1.5 font-mono text-sm font-bold ${getPnLGlow(
                              trade.simulatedPnL
                            )}`}
                          >
                            {getPnLIcon(trade.simulatedPnL)}
                            <span>
                              {trade.simulatedPnL >= 0 ? '+' : ''}$
                              {trade.simulatedPnL.toFixed(2)}
                            </span>
                          </span>
                        </td>
                        {/* Close Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() =>
                              closeTrade(trade.id, trade.simulatedPnL)
                            }
                            className="px-3.5 py-2 bg-[#FF3366]/10 border border-[#FF3366]/20 text-[#FF3366] font-mono text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg hover:bg-[#FF3366]/20 hover:border-[#FF3366]/40 hover:shadow-[0_0_15px_rgba(255,51,102,0.2)] transition-all duration-200"
                          >
                            Close_Pos
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <Terminal className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                        <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.15em] mb-1">
                          [ System Idle ]
                        </p>
                        <p className="font-mono text-[10px] text-gray-700 tracking-wide">
                          Awaiting algorithmic allocation —{' '}
                          <Link
                            to="/"
                            className="text-[#00FF9D]/60 hover:text-[#00FF9D] transition-colors"
                          >
                            Browse signals
                          </Link>
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
           CLOSED TRADES TABLE
           ════════════════════════════════════════════════════════════ */}
        {activeTab === 'closed' && (
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#0B0E14]/80">
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Final P&L
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {closedTrades.length > 0 ? (
                    closedTrades.map((trade) => (
                      <tr
                        key={trade.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className="text-gray-100 font-bold font-mono text-sm">
                              Signal #{trade.signalId}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-[0.15em] border ${
                                trade.type === 'Spot'
                                  ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20'
                                  : 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20'
                              }`}
                            >
                              {trade.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-gray-200">
                          ${trade.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`font-mono text-sm font-bold ${getPnLGlow(
                              trade.simulatedPnL
                            )}`}
                          >
                            {trade.simulatedPnL >= 0 ? '+' : ''}$
                            {trade.simulatedPnL.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trade.simulatedPnL > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.1em] bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 shadow-[0_0_6px_rgba(0,255,157,0.1)]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Win
                            </span>
                          ) : trade.simulatedPnL < 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.1em] bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20 shadow-[0_0_6px_rgba(255,51,102,0.1)]">
                              <XCircle className="w-3.5 h-3.5" />
                              Loss
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.1em] bg-white/5 text-gray-400 border border-white/10">
                              <Minus className="w-3.5 h-3.5" />
                              Break-Even
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <Terminal className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                        <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.15em] mb-1">
                          [ No Closed Positions ]
                        </p>
                        <p className="font-mono text-[10px] text-gray-700 tracking-wide">
                          Close active positions to populate the trade ledger
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
           IGNORED SIGNALS TABLE
           ══════════��═════════════════════════════════════════════════ */}
        {activeTab === 'ignored' && (
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-[#0B0E14]/80">
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Asset
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Signal
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Ignored At
                    </th>
                    <th className="px-6 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                      Hypothetical Outcome
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {ignoredTrades.length > 0 ? (
                    ignoredTrades.map((ignored) => (
                      <tr
                        key={ignored.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-gray-100">
                          {ignored.asset}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-md font-mono text-[9px] font-bold uppercase tracking-[0.12em] border ${
                              ignored.signal.includes('Buy')
                                ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/20'
                                : ignored.signal.includes('Sell')
                                ? 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20'
                                : 'bg-white/5 text-gray-400 border-white/10'
                            }`}
                          >
                            {ignored.signal}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                          {new Date(ignored.ignoredAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`font-mono text-sm font-bold ${getPnLGlow(
                                ignored.wouldHavePnL
                              )}`}
                            >
                              {ignored.wouldHavePnL >= 0 ? '+' : ''}$
                              {ignored.wouldHavePnL.toFixed(2)}
                            </span>
                            <span
                              className={`font-mono text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded border ${
                                ignored.wouldHavePnL >= 0
                                  ? 'bg-[#00FF9D]/10 text-[#00FF9D]/70 border-[#00FF9D]/20'
                                  : 'bg-[#FF3366]/10 text-[#FF3366]/70 border-[#FF3366]/20'
                              }`}
                            >
                              {ignored.wouldHavePnL >= 0
                                ? 'Missed Gain'
                                : 'Avoided Loss'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <ShieldAlert className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                        <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.15em] mb-1">
                          [ No Ignored Signals ]
                        </p>
                        <p className="font-mono text-[10px] text-gray-700 tracking-wide">
                          All signals have been actioned or are pending review
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}