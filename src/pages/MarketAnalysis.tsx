import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  AlertCircle,
  Zap,
  Anchor,
  Scale,
  BrainCircuit,
  Waves,
  ArrowUpRight,
  ArrowDownRight,
  Fish,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rsi: number;
  sparkHistory: number[]; // last 12 micro-ticks for sparkline dots
  phase: 'Accumulation' | 'Markup' | 'Distribution' | 'Markdown';
}

interface WhaleEvent {
  id: string;
  asset: string;
  side: 'BUY' | 'SELL';
  sizeUsd: number;
  exchange: string;
  timestamp: number;
}

interface InstitutionalMetric {
  label: string;
  tag: string;
  value: string;
  sub: string;
  positive: boolean;
  icon: React.ReactNode;
}

/* ═══════════════════════════════════════════════════════════════════════
   SEEDED PRNG
   ═══════════════════════════════════════════════════════════════════════ */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA GENERATORS
   ═══════════════════════════════════════════════════════════════════════ */

const EXCHANGES = ['Binance', 'Coinbase', 'OKX', 'Bybit', 'Kraken', 'Bitfinex', 'dYdX', 'Hyperliquid'];

const ASSET_TEMPLATES = [
  { symbol: 'BTC', name: 'Bitcoin', basePrice: 67250, baseCap: 1320e9, baseVol: 28.5e9 },
  { symbol: 'ETH', name: 'Ethereum', basePrice: 3450, baseCap: 415e9, baseVol: 15.2e9 },
  { symbol: 'SOL', name: 'Solana', basePrice: 145.2, baseCap: 65e9, baseVol: 3.2e9 },
  { symbol: 'XRP', name: 'Ripple', basePrice: 0.542, baseCap: 29.5e9, baseVol: 1.8e9 },
  { symbol: 'BNB', name: 'BNB', basePrice: 585, baseCap: 88e9, baseVol: 1.2e9 },
  { symbol: 'ADA', name: 'Cardano', basePrice: 0.385, baseCap: 13.5e9, baseVol: 0.45e9 },
  { symbol: 'AVAX', name: 'Avalanche', basePrice: 28.5, baseCap: 10.8e9, baseVol: 0.68e9 },
  { symbol: 'DOT', name: 'Polkadot', basePrice: 6.85, baseCap: 9.2e9, baseVol: 0.28e9 },
  { symbol: 'LINK', name: 'Chainlink', basePrice: 14.2, baseCap: 8.5e9, baseVol: 0.52e9 },
  { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.082, baseCap: 11.8e9, baseVol: 0.62e9 },
];

function pickPhase(rsi: number): MarketData['phase'] {
  if (rsi < 35) return 'Accumulation';
  if (rsi < 55) return 'Markup';
  if (rsi < 72) return 'Distribution';
  return 'Markdown';
}

function generateInitialMarket(): MarketData[] {
  const rand = seededRandom(Date.now());
  return ASSET_TEMPLATES.map((t) => {
    const drift = 1 + (rand() - 0.48) * 0.06;
    const price = t.basePrice * drift;
    const change24h = (rand() - 0.42) * 8;
    const rsi = 20 + rand() * 60;
    const sparkHistory = Array.from({ length: 12 }, () => 30 + rand() * 40);
    return {
      symbol: t.symbol,
      name: t.name,
      price,
      change24h: parseFloat(change24h.toFixed(2)),
      volume24h: t.baseVol * (0.8 + rand() * 0.4),
      marketCap: t.baseCap * drift,
      rsi: parseFloat(rsi.toFixed(1)),
      sparkHistory,
      phase: pickPhase(rsi),
    };
  });
}

function generateWhaleEvent(rand: () => number): WhaleEvent {
  const assets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'AVAX'];
  const asset = assets[Math.floor(rand() * assets.length)];
  const side = rand() > 0.48 ? 'BUY' : 'SELL';
  const sizeUsd = 500_000 + rand() * 14_500_000;
  const exchange = EXCHANGES[Math.floor(rand() * EXCHANGES.length)];
  return {
    id: `${Date.now()}-${Math.floor(rand() * 100000)}`,
    asset,
    side: side as 'BUY' | 'SELL',
    sizeUsd,
    exchange,
    timestamp: Date.now() - Math.floor(rand() * 120_000),
  };
}

function generateSentiment(rand: () => number): { buy: number; hold: number; sell: number } {
  const buy = 38 + Math.floor(rand() * 25);
  const sell = 10 + Math.floor(rand() * 20);
  const hold = 100 - buy - sell;
  return { buy, hold, sell };
}

/* ═══════════════════════════════════════════════════════════════════════
   FORMATTERS
   ═══════════════════════════════════════════════════════════════════════ */

const formatPrice = (price: number) => {
  if (price < 1) return `$${price.toFixed(4)}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

const formatWhaleSize = (num: number) => {
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${(num / 1e3).toFixed(0)}K`;
};

const timeAgo = (ts: number) => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
};

/* ═══════════════════════════════════════════════════════════════════════
   SPARKLINE DOTS (micro visual)
   ═══════════════════════════════════════════════════════════════════════ */

function SparkDots({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[2px] h-4">
      {data.map((v, i) => {
        const height = 3 + ((v - min) / range) * 13;
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all ${
              isLast
                ? positive
                  ? 'bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.6)]'
                  : 'bg-[#FF3366] shadow-[0_0_4px_rgba(255,51,102,0.6)]'
                : positive
                ? 'bg-[#00FF9D]/40'
                : 'bg-[#FF3366]/40'
            }`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RSI PILL
   ═══════════════════════════════════════════════════════════════════════ */

function RsiBadge({ rsi }: { rsi: number }) {
  let label: string;
  let classes: string;
  if (rsi < 30) {
    label = 'Oversold';
    classes =
      'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/40 shadow-[0_0_8px_rgba(0,255,157,0.15)]';
  } else if (rsi > 70) {
    label = 'Overbought';
    classes =
      'bg-[#FF3366]/15 text-[#FF3366] border-[#FF3366]/40 shadow-[0_0_8px_rgba(255,51,102,0.15)]';
  } else {
    label = 'Neutral';
    classes = 'bg-white/5 text-gray-400 border-white/10';
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="font-mono text-xs font-bold text-gray-200">{rsi.toFixed(1)}</span>
      <span
        className={`font-mono text-[9px] font-bold uppercase tracking-[0.1em] border rounded-md px-1.5 py-0.5 ${classes}`}
      >
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PHASE BADGE
   ═══════════════════════════════════════════════════════════════════════ */

function PhaseBadge({ phase }: { phase: MarketData['phase'] }) {
  const map: Record<string, string> = {
    Accumulation: 'text-[#00FF9D] bg-[#00FF9D]/10 border-[#00FF9D]/30',
    Markup: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    Distribution: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    Markdown: 'text-[#FF3366] bg-[#FF3366]/10 border-[#FF3366]/30',
  };
  return (
    <span
      className={`font-mono text-[9px] font-bold uppercase tracking-[0.1em] border rounded-md px-1.5 py-0.5 ${map[phase]}`}
    >
      {phase}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function MarketAnalysis() {
  /* ── State ───────────────────────────────────────────────────────── */
  const [marketData, setMarketData] = useState<MarketData[]>(() => generateInitialMarket());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [whaleEvents, setWhaleEvents] = useState<WhaleEvent[]>(() => {
    const rand = seededRandom(Date.now() + 77);
    return Array.from({ length: 6 }, () => generateWhaleEvent(rand));
  });
  const [sentiment] = useState(() => {
    const rand = seededRandom(Date.now() + 55);
    return generateSentiment(rand);
  });
  const tickCount = useRef(0);

  /* ── Institutional top metrics (derived) ─────────────────────────── */
  const institutionalMetrics: InstitutionalMetric[] = (() => {
    const totalVol = marketData.reduce((s, c) => s + c.volume24h, 0);
    const btc = marketData.find((c) => c.symbol === 'BTC');
    const btcChange = btc?.change24h ?? 0;
    const longRatio = 50 + (btcChange > 0 ? btcChange * 2.1 : btcChange * 1.6);
    const openInterest = totalVol * 1.42;
    const liquidations = totalVol * 0.012 * (1 + Math.abs(btcChange) * 0.08);

    const avgRsi = marketData.reduce((s, c) => s + c.rsi, 0) / marketData.length;
    let regime: string;
    let regimePositive: boolean;
    if (avgRsi < 35) {
      regime = 'Capitulation';
      regimePositive = false;
    } else if (avgRsi < 48) {
      regime = 'Accumulation';
      regimePositive = true;
    } else if (avgRsi < 62) {
      regime = 'Risk-On';
      regimePositive = true;
    } else {
      regime = 'Euphoria';
      regimePositive = false;
    }

    return [
      {
        label: 'Global Open Interest',
        tag: '[OI]',
        value: formatLargeNumber(openInterest),
        sub: `${((openInterest / totalVol - 1) * 100).toFixed(1)}% of vol`,
        positive: true,
        icon: <Anchor className="w-4 h-4" />,
      },
      {
        label: '24h Liquidations',
        tag: '[LIQ]',
        value: formatLargeNumber(liquidations),
        sub: `${liquidations > 500e6 ? 'High volatility' : 'Normal range'}`,
        positive: liquidations < 500e6,
        icon: <Zap className="w-4 h-4" />,
      },
      {
        label: 'BTC Long / Short',
        tag: '[L/S]',
        value: `${longRatio.toFixed(1)}% L`,
        sub: `${(100 - longRatio).toFixed(1)}% Short`,
        positive: longRatio >= 50,
        icon: <Scale className="w-4 h-4" />,
      },
      {
        label: 'AI Market Regime',
        tag: '[REGIME]',
        value: regime,
        sub: `Avg RSI ${avgRsi.toFixed(1)}`,
        positive: regimePositive,
        icon: <BrainCircuit className="w-4 h-4" />,
      },
    ];
  })();

  /* ── Live tick engine (every 3 s) ────────────────────────────────── */
  const tick = useCallback(() => {
    tickCount.current += 1;
    setMarketData((prev) =>
      prev.map((coin) => {
        const jitter = 1 + (Math.random() - 0.5) * 0.004;
        const newPrice = coin.price * jitter;
        const newChange = coin.change24h + (Math.random() - 0.5) * 0.15;
        const newVol = coin.volume24h * (1 + (Math.random() - 0.5) * 0.01);
        const newRsi = Math.max(8, Math.min(95, coin.rsi + (Math.random() - 0.5) * 1.5));
        const newSpark = [...coin.sparkHistory.slice(1), 30 + Math.random() * 40];
        return {
          ...coin,
          price: newPrice,
          change24h: parseFloat(newChange.toFixed(2)),
          volume24h: newVol,
          marketCap: coin.marketCap * jitter,
          rsi: parseFloat(newRsi.toFixed(1)),
          sparkHistory: newSpark,
          phase: pickPhase(newRsi),
        };
      })
    );
    setLastUpdated(new Date());

    // Inject a new whale event every other tick
    if (tickCount.current % 2 === 0) {
      const rand = seededRandom(Date.now());
      setWhaleEvents((prev) => [generateWhaleEvent(rand), ...prev.slice(0, 7)]);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [tick]);

  /* ════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
              <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
                Real-Time Feed &middot; 3 s Refresh
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-2 tracking-tight">
              Market{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                Analysis
              </span>
            </h1>
            <p className="text-gray-500 font-mono text-sm">
              Institutional-grade cryptocurrency intelligence &middot; Quant terminal
            </p>
          </div>
          <div className="mt-6 sm:mt-0 flex items-center space-x-3 bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-lg px-4 py-2">
            <Activity className="w-4 h-4 text-[#00FF9D] animate-pulse" />
            <span className="font-mono text-xs text-gray-500">
              Updated{' '}
              <span className="text-gray-300">{lastUpdated.toLocaleTimeString()}</span>
            </span>
          </div>
        </div>

        {/* ── Institutional Top Metrics ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {institutionalMetrics.map((m) => (
            <div
              key={m.label}
              className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:shadow-[0_0_30px_rgba(0,255,157,0.2)] hover:border-[#00FF9D]/40 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-2 text-gray-500 mb-3">
                <span className="group-hover:text-[#00FF9D] transition-colors">{m.icon}</span>
                <span className="text-[10px] font-bold font-mono uppercase tracking-[0.15em]">
                  {m.label}
                </span>
                <span className="font-mono text-[9px] text-[#00FF9D]/40 ml-auto">{m.tag}</span>
              </div>
              <p
                className={`font-mono text-3xl font-bold text-transparent bg-clip-text ${
                  m.positive
                    ? 'bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]'
                    : 'bg-gradient-to-r from-[#FF3366] to-[#FF6B8A]'
                }`}
              >
                {m.value}
              </p>
              <p className="text-gray-600 text-[10px] font-mono mt-2 tracking-wide">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid: Table + Sidebars ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* ── Crypto Table (2 cols) ──────────────────────────────── */}
          <div className="lg:col-span-2 bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] transition-all">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-100 flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                <span>Top Cryptocurrencies</span>
                <span className="flex items-center space-x-1.5 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                  <span className="font-mono text-[10px] text-[#00FF9D]/60 uppercase tracking-[0.15em]">
                    [WSS_CONNECTED]
                  </span>
                </span>
              </h2>
              <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em] hidden sm:block">
                {marketData.length} Assets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="text-left text-[9px] text-gray-600 uppercase tracking-[0.2em] font-mono">
                    <th className="pb-4 pr-3">#</th>
                    <th className="pb-4 pr-4">Asset</th>
                    <th className="pb-4 pr-4 text-right">Price</th>
                    <th className="pb-4 pr-4 text-right">24 h</th>
                    <th className="pb-4 pr-4 text-right hidden sm:table-cell">Volume</th>
                    <th className="pb-4 pr-4 text-right hidden md:table-cell">Mkt Cap</th>
                    <th className="pb-4 pr-4 text-right">RSI</th>
                    <th className="pb-4 pr-2 text-center">Trend</th>
                    <th className="pb-4 text-right">Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {marketData.map((coin, idx) => {
                    const positive = coin.change24h >= 0;
                    return (
                      <tr
                        key={coin.symbol}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-3.5 pr-3 font-mono text-[10px] text-gray-600">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold font-mono ${
                                positive
                                  ? 'bg-[#00FF9D]/10 border-[#00FF9D]/30 text-[#00FF9D]'
                                  : 'bg-[#FF3366]/10 border-[#FF3366]/30 text-[#FF3366]'
                              }`}
                            >
                              {coin.symbol[0]}
                            </div>
                            <div>
                              <p className="text-gray-100 font-semibold text-sm">{coin.name}</p>
                              <p className="text-gray-600 text-[10px] font-mono">{coin.symbol}/USDT</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono text-sm font-semibold text-gray-100">
                          {formatPrice(coin.price)}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <span
                            className={`inline-flex items-center space-x-1 font-mono text-sm font-bold ${
                              positive
                                ? 'text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]'
                                : 'text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]'
                            }`}
                          >
                            {positive ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {positive ? '+' : ''}
                              {coin.change24h.toFixed(2)}%
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono text-xs text-gray-500 hidden sm:table-cell">
                          {formatLargeNumber(coin.volume24h)}
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono text-xs text-gray-500 hidden md:table-cell">
                          {formatLargeNumber(coin.marketCap)}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <RsiBadge rsi={coin.rsi} />
                        </td>
                        <td className="py-3.5 pr-2">
                          <div className="flex justify-center">
                            <SparkDots data={coin.sparkHistory} positive={positive} />
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <PhaseBadge phase={coin.phase} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Right Sidebar ──────────────────────────────────────── */}
          <div className="space-y-6">
            {/* ── Whale Tracker ─────────────────────────────────────── */}
            <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] hover:border-[#00FF9D]/30 transition-all">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2.5">
                  <Fish className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                  <span>Whale Tracker</span>
                </h2>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                  <span className="font-mono text-[9px] text-[#00FF9D]/60 uppercase tracking-[0.15em]">
                    [LIVE]
                  </span>
                </span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto scrollbar-thin">
                {whaleEvents.map((evt) => {
                  const isBuy = evt.side === 'BUY';
                  return (
                    <div
                      key={evt.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isBuy
                          ? 'bg-[#00FF9D]/[0.04] border-[#00FF9D]/10 hover:border-[#00FF9D]/30'
                          : 'bg-[#FF3366]/[0.04] border-[#FF3366]/10 hover:border-[#FF3366]/30'
                      }`}
                    >
                      {/* Direction icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isBuy
                            ? 'bg-[#00FF9D]/15 text-[#00FF9D]'
                            : 'bg-[#FF3366]/15 text-[#FF3366]'
                        }`}
                      >
                        {isBuy ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-100">
                            {evt.asset}
                          </span>
                          <span
                            className={`font-mono text-[9px] font-bold uppercase tracking-wider ${
                              isBuy ? 'text-[#00FF9D]' : 'text-[#FF3366]'
                            }`}
                          >
                            {evt.side}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-600">
                          {evt.exchange} &middot; {timeAgo(evt.timestamp)}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-sm font-bold flex-shrink-0 ${
                          isBuy
                            ? 'text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]'
                            : 'text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]'
                        }`}
                      >
                        {formatWhaleSize(evt.sizeUsd)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Aggregate whale stats */}
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-600 text-[9px] font-mono uppercase tracking-[0.2em] mb-1">
                    Net Buy Vol
                  </p>
                  <p className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                    {formatWhaleSize(
                      whaleEvents
                        .filter((e) => e.side === 'BUY')
                        .reduce((s, e) => s + e.sizeUsd, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-[9px] font-mono uppercase tracking-[0.2em] mb-1">
                    Net Sell Vol
                  </p>
                  <p className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF3366] to-[#FF6B8A]">
                    {formatWhaleSize(
                      whaleEvents
                        .filter((e) => e.side === 'SELL')
                        .reduce((s, e) => s + e.sizeUsd, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Market Sentiment ──────────────────────────────────── */}
            <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] hover:border-[#00FF9D]/30 transition-all">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2.5">
                  <PieChart className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                  <span>Market Sentiment</span>
                </h2>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                  <span className="font-mono text-[9px] text-[#00FF9D]/60 uppercase tracking-[0.15em]">
                    [AGGR]
                  </span>
                </span>
              </div>

              <div className="space-y-4">
                {/* Buy */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-400 text-sm font-medium">Buy</span>
                    <span className="font-mono text-sm font-bold text-[#00FF9D]">
                      {sentiment.buy}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#0B0E14] rounded-full overflow-hidden border border-white/[0.03]">
                    <div
                      className="h-full rounded-full bg-[#00FF9D] shadow-[0_0_8px_rgba(0,255,157,0.3)] transition-all duration-700"
                      style={{ width: `${sentiment.buy}%` }}
                    />
                  </div>
                </div>
                {/* Hold */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-400 text-sm font-medium">Hold</span>
                    <span className="font-mono text-sm font-bold text-gray-400">
                      {sentiment.hold}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#0B0E14] rounded-full overflow-hidden border border-white/[0.03]">
                    <div
                      className="h-full rounded-full bg-gray-500 transition-all duration-700"
                      style={{ width: `${sentiment.hold}%` }}
                    />
                  </div>
                </div>
                {/* Sell */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-400 text-sm font-medium">Sell</span>
                    <span className="font-mono text-sm font-bold text-[#FF3366]">
                      {sentiment.sell}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#0B0E14] rounded-full overflow-hidden border border-white/[0.03]">
                    <div
                      className="h-full rounded-full bg-[#FF3366] shadow-[0_0_8px_rgba(255,51,102,0.3)] transition-all duration-700"
                      style={{ width: `${sentiment.sell}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Micro summary */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-[9px] font-mono uppercase tracking-[0.2em] mb-1">
                    Bull / Bear
                  </p>
                  <p className="font-mono text-lg font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                      {sentiment.buy}
                    </span>
                    <span className="text-gray-700 mx-1">/</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3366] to-[#FF6B8A]">
                      {sentiment.sell}
                    </span>
                  </p>
                </div>
                <div
                  className={`font-mono text-[10px] font-bold uppercase tracking-[0.12em] border rounded-md px-2.5 py-1 ${
                    sentiment.buy > sentiment.sell
                      ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/40 shadow-[0_0_8px_rgba(0,255,157,0.15)]'
                      : 'bg-[#FF3366]/15 text-[#FF3366] border-[#FF3366]/40 shadow-[0_0_8px_rgba(255,51,102,0.15)]'
                  }`}
                >
                  {sentiment.buy > sentiment.sell ? 'Bullish Bias' : 'Bearish Bias'}
                </div>
              </div>
            </div>

            {/* ── Order Book Imbalance ──────────────────────────────── */}
            <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] hover:border-[#00FF9D]/30 transition-all">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2.5">
                  <Waves className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                  <span>OB Imbalance</span>
                </h2>
                <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                  Top 5 Bids
                </span>
              </div>

              <div className="space-y-2">
                {marketData.slice(0, 5).map((coin) => {
                  const bidPct = 40 + ((coin.rsi / 100) * 30);
                  const askPct = 100 - bidPct;
                  return (
                    <div key={coin.symbol} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-gray-400">
                          {coin.symbol}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-[#00FF9D]">
                            {bidPct.toFixed(0)}%
                          </span>
                          <span className="font-mono text-[10px] text-[#FF3366]">
                            {askPct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex h-1.5 rounded-full overflow-hidden gap-[1px]">
                        <div
                          className="bg-[#00FF9D] rounded-l-full shadow-[0_0_4px_rgba(0,255,157,0.3)]"
                          style={{ width: `${bidPct}%` }}
                        />
                        <div
                          className="bg-[#FF3366] rounded-r-full shadow-[0_0_4px_rgba(255,51,102,0.3)]"
                          style={{ width: `${askPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Risk Warning ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#FF3366]/[0.06] border border-[#FF3366]/20 rounded-xl p-6 flex items-start space-x-4 shadow-[0_0_20px_rgba(255,51,102,0.05)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF3366]/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <AlertCircle className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(255,51,102,0.6)]" />
          <div className="relative">
            <h3 className="text-gray-100 font-bold mb-1.5 flex items-center gap-2">
              Market Risk Warning
              <span className="font-mono text-[9px] text-[#FF3366]/60 uppercase tracking-[0.15em]">
                [COMPLIANCE]
              </span>
            </h3>
            <p className="text-gray-500 text-sm font-mono leading-relaxed">
              Cryptocurrency markets are highly volatile. Prices can fluctuate significantly in short
              periods. This data is for informational purposes only and should not be considered as
              investment advice. Always conduct your own research and consider your risk tolerance
              before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}