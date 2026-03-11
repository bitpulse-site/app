import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Zap,
  Globe,
  Lock,
  BookOpen,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Activity,
  BrainCircuit,
  Radio,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';
import articlesData from '../data/articles';

/* ═══════════════════════════════════════════════════════════════════════
   SCROLLING MARQUEE DATA — ROW 1 (LEFT→RIGHT)
   ═══════════════════════════════════════════════════════════════════════ */

const MARQUEE_ITEMS = [
  { text: 'BTC/USDT LONG REVERSAL DETECTED', color: 'text-[#00FF9D]' },
  { text: 'ETH/USDT WHALE ACCUMULATION: $4.2M', color: 'text-cyan-400' },
  { text: 'SOL/USDT BREAKOUT — HIGH CONFIDENCE', color: 'text-[#00FF9D]' },
  { text: 'XRP/USDT $1.8M SHORT LIQUIDATED', color: 'text-[#FF3366]' },
  { text: 'BNB/USDT MOMENTUM SHIFT FLAGGED', color: 'text-cyan-400' },
  { text: 'AVAX/USDT SMART MONEY INFLOW: $2.1M', color: 'text-cyan-400' },
  { text: 'DOGE/USDT FUNDING RATE DIVERGENCE', color: 'text-yellow-400' },
  { text: 'ADA/USDT REGIME → ACCUMULATION', color: 'text-cyan-400' },
  { text: 'LINK/USDT ALGO SIGNAL: STRONG BUY', color: 'text-[#00FF9D]' },
  { text: 'ARB/USDT $3.6M BLOCK ORDER DETECTED', color: 'text-[#00FF9D]' },
];

/* ═══════════════════════════════════════════════════════════════════════
   SCROLLING MARQUEE DATA — ROW 2 (RIGHT→LEFT) — DARK POOL / WHALE
   ═══════════════════════════════════════════════════════════════════════ */

const MARQUEE_ITEMS_2 = [
  { text: 'DARK POOL: BTC 450 BTC BLOCK @ $67,180', color: 'text-purple-400' },
  { text: 'WHALE 0x7a3…f9e2 MOVED $8.4M ETH → BINANCE', color: 'text-[#FF3366]' },
  { text: 'OI SURGE: SOL PERPS +$120M (4H)', color: 'text-cyan-400' },
  { text: 'DARK POOL: ETH 2,200 ETH BLOCK @ $3,448', color: 'text-purple-400' },
  { text: 'WHALE 0xb1c…44a1 WITHDREW $5.1M USDC → COLD', color: 'text-[#00FF9D]' },
  { text: 'FUNDING: BTC PERPS -0.0042% (BEARISH TILT)', color: 'text-yellow-400' },
  { text: 'DARK POOL: BNB 8,500 BNB BLOCK @ $584', color: 'text-purple-400' },
  { text: 'WHALE 0x3f8…c7b0 DEPOSITED $12.6M BTC → KRAKEN', color: 'text-[#FF3366]' },
  { text: 'CVD DIVERGENCE: ETH SPOT VS PERPS', color: 'text-cyan-400' },
  { text: 'DARK POOL: AVAX 95K AVAX BLOCK @ $28.45', color: 'text-purple-400' },
];

/* ═══════════════════════════════════════════════════════════════════════
   AI INFERENCE LOG GENERATION
   ═══════════════════════════════════════════════════════════════════════ */

interface LogEntry {
  id: number;
  level: 'OK' | 'INFO' | 'SCAN' | 'WARN' | 'SYS';
  text: string;
  timestamp: string;
}

const LOG_TEMPLATES: { level: LogEntry['level']; messages: string[] }[] = [
  {
    level: 'SYS',
    messages: [
      'Neural engine heartbeat — all nodes responsive',
      'Model v6.0 checkpoint synced across 3 replicas',
      'Garbage collection: freed 2.4GB VRAM on GPU_03',
      'Rebalancing inference shards across edge cluster',
      'Tick buffer flushed — 0 missed ticks in 3600s window',
      'Watchdog: all 20 exchange feeds nominal',
    ],
  },
  {
    level: 'INFO',
    messages: [
      'Cross-exchange arb spread BTC: 0.04% (Binance↔Coinbase)',
      'ETH/USDT order book depth: $18.4M within 0.5% of mid',
      'Correlation matrix updated — BTC/SOL r=0.87 (rising)',
      'Market regime classifier output: RISK_ON (p=0.82)',
      'Volatility surface recalculated — BTC 30d IV: 52.3%',
      'Funding rates snapshot: 8/12 pairs positive (long bias)',
      'Aggregated OI delta: +$240M across top 10 perps',
    ],
  },
  {
    level: 'SCAN',
    messages: [
      'Scanning BTC/USDT 4H for mean-reversion setup...',
      'Analyzing cross-exchange liquidity imbalance on ETH...',
      'Running momentum oscillator sweep on L1 basket...',
      'Evaluating SOL/USDT volume profile anomaly...',
      'Scanning whale wallet 0x7a3…f9e2 transfer patterns...',
      'Processing on-chain flow data for BNB (24h delta)...',
      'Backtesting regime shift signal on AVAX/USDT...',
      'Calculating Sharpe decay across active positions...',
    ],
  },
  {
    level: 'WARN',
    messages: [
      'Short squeeze probability on ETH elevated to 68%',
      'BTC funding rate divergence exceeds 2σ threshold',
      'Unusual block trade detected: 450 BTC dark pool fill',
      'SOL/USDT bid-ask spread widening — liquidity thinning',
      'Drawdown guard: portfolio heat approaching 4.2% daily limit',
      'Latency spike on Bybit feed: 340ms (threshold: 200ms)',
    ],
  },
  {
    level: 'OK',
    messages: [
      'BTC/USDT Strong Buy signal generated — conf: 91%',
      'ETH/USDT entry validated — risk/reward ratio: 3.2:1',
      'Model v6.0 calibrated — MSE: 0.0014 on validation set',
      'SOL/USDT breakout confirmed on 3 timeframes',
      'Position sizing optimized — Kelly fraction: 2.1%',
      'Signal queue processed — 0 failures in last 100 signals',
    ],
  },
];

function generateLogEntry(id: number): LogEntry {
  const group = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const msg = group.messages[Math.floor(Math.random() * group.messages.length)];
  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  return { id, level: group.level, text: msg, timestamp: ts };
}

const LOG_LEVEL_COLORS: Record<LogEntry['level'], string> = {
  OK: 'text-[#00FF9D]',
  INFO: 'text-cyan-400',
  SCAN: 'text-yellow-400',
  WARN: 'text-[#FF3366]',
  SYS: 'text-gray-500',
};

/* ═══════════════════════════════════════════════════════════════════════
   DYNAMIC AD NODE — "ACTIVE PROCESSING NODE" CAMOUFLAGE
   ═══════════════════════════════════════════════════════════════════════ */

const NODE_DATA_TEMPLATES = [
  () => `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  () => `HASH_RATE: ${(80 + Math.random() * 120).toFixed(1)}TH/s`,
  () => `LIQ_VOL: $${(Math.random() * 50).toFixed(2)}M`,
  () => `NONCE: ${Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')}`,
  () => `BLK_${Math.floor(19000000 + Math.random() * 500000)}`,
  () => `δ${(Math.random() * 2 - 1).toFixed(4)}`,
  () => `SHA3: ${Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}…`,
  () => `GAS: ${Math.floor(10 + Math.random() * 90)} gwei`,
  () => `MEMPOOL: ${Math.floor(1000 + Math.random() * 9000)} txs`,
  () => `PEER_${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
  () => `SLOT_${Math.floor(8000000 + Math.random() * 200000)}`,
  () => `PROP: ${(Math.random() * 0.02).toFixed(5)}`,
  () => `EPOCH: ${Math.floor(Date.now() / 1000)}`,
  () => `SHARD_${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 16).toString(16)}`,
  () => `ORD_FLOW: ${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(3)}σ`,
  () => `VERIFY: ${Math.random() > 0.3 ? 'OK' : 'PEND'}`,
  () => `IV_SURF: ${(30 + Math.random() * 40).toFixed(1)}%`,
  () => `FUNDING: ${(Math.random() * 0.04 - 0.02).toFixed(4)}%`,
];

function generateNodeLine(): string {
  const count = 2 + Math.floor(Math.random() * 3);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = NODE_DATA_TEMPLATES[Math.floor(Math.random() * NODE_DATA_TEMPLATES.length)];
    parts.push(tpl());
  }
  return parts.join('  │  ');
}

interface DynamicAdNodeProps {
  className?: string;
  id?: string;
  /** When true, strips hard borders/backgrounds for ambient hero pillar mode */
  ambient?: boolean;
}

function DynamicAdNode({ className = '', id, ambient = false }: DynamicAdNodeProps) {
  const LINE_COUNT = 40;
  const [lines, setLines] = useState<string[]>(() =>
    Array.from({ length: LINE_COUNT }, () => generateNodeLine())
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, generateNodeLine()];
        if (next.length > LINE_COUNT) return next.slice(next.length - LINE_COUNT);
        return next;
      });
    }, 120 + Math.random() * 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      id={id}
      className={`${
        ambient
          ? 'bg-transparent overflow-hidden relative flex flex-col'
          : 'bg-[#060810] border border-dashed border-white/[0.06] rounded-xl overflow-hidden relative flex flex-col group'
      } ${className}`}
      style={
        ambient
          ? {
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.3) 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.3) 92%, transparent 100%)',
            }
          : undefined
      }
    >
      {/* Header — hidden in ambient mode */}
      {!ambient && (
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.015] border-b border-white/[0.04] flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1 w-1">
              <span className="absolute inset-0 rounded-full bg-[#00FF9D]/50 animate-ping" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-[#00FF9D]" />
            </span>
            <span className="font-mono text-[6px] md:text-[7px] text-gray-700 uppercase tracking-[0.2em]">
              proc.node
            </span>
          </div>
          <span className="font-mono text-[5px] md:text-[6px] text-[#00FF9D]/30 uppercase tracking-[0.15em]">
            active
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden px-2 py-1.5 space-y-px"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`font-mono text-[8px] md:text-[10px] leading-relaxed whitespace-nowrap truncate ${
              i === lines.length - 1
                ? 'text-[#00FF9D]/60'
                : i >= lines.length - 3
                ? 'text-[#00FF9D]/40'
                : 'text-[#00FF9D]/20'
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Scanline + vignette overlays — only in default mode */}
      {!ambient && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,8,16,0.7)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF9D]/10 to-transparent" />
        </>
      )}

      {/* Ambient mode gets a much subtler scanline */}
      {ambient && (
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.06)_50%)] bg-[length:100%_3px] pointer-events-none" />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA SIPHON WRAPPER — "Data feeding into the engine" effect
   Renders animated horizontal glow lines that travel from the pillar
   toward the center of the hero section.
   ═══════════════════════════════════════════════════════════════════════ */

function DataSiphonWrapper({
  side,
  children,
}: {
  /** 'left' = lines travel rightward; 'right' = lines travel leftward */
  side: 'left' | 'right';
  children: React.ReactNode;
}) {
  const isLeft = side === 'left';

  return (
    <div className="hidden xl:flex relative w-[160px] h-[600px]">
      {/* The ambient ad node itself */}
      {children}

      {/* Siphon lines container — sits on the inward edge */}
      <div
        className={`absolute top-0 bottom-0 ${
          isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'
        } w-20 overflow-hidden pointer-events-none`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 30%, black 70%, transparent 90%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 10%, black 30%, black 70%, transparent 90%)',
        }}
      >
        {/* Siphon line 1 */}
        <div
          className="absolute h-px w-full"
          style={{
            top: '22%',
            background: isLeft
              ? 'linear-gradient(to right, rgba(0,255,157,0.25), rgba(0,255,157,0))'
              : 'linear-gradient(to left, rgba(0,255,157,0.25), rgba(0,255,157,0))',
            animation: `siphon-pulse-1 4s ease-in-out infinite`,
          }}
        />
        {/* Siphon line 2 */}
        <div
          className="absolute h-px w-full"
          style={{
            top: '38%',
            background: isLeft
              ? 'linear-gradient(to right, rgba(0,255,255,0.15), rgba(0,255,255,0))'
              : 'linear-gradient(to left, rgba(0,255,255,0.15), rgba(0,255,255,0))',
            animation: `siphon-pulse-2 5.5s ease-in-out infinite`,
          }}
        />
        {/* Siphon line 3 */}
        <div
          className="absolute h-px w-full"
          style={{
            top: '55%',
            background: isLeft
              ? 'linear-gradient(to right, rgba(0,255,157,0.2), rgba(0,255,157,0))'
              : 'linear-gradient(to left, rgba(0,255,157,0.2), rgba(0,255,157,0))',
            animation: `siphon-pulse-3 3.8s ease-in-out infinite`,
          }}
        />
        {/* Siphon line 4 */}
        <div
          className="absolute h-px w-full"
          style={{
            top: '71%',
            background: isLeft
              ? 'linear-gradient(to right, rgba(0,255,255,0.12), rgba(0,255,255,0))'
              : 'linear-gradient(to left, rgba(0,255,255,0.12), rgba(0,255,255,0))',
            animation: `siphon-pulse-4 6.2s ease-in-out infinite`,
          }}
        />
        {/* Siphon line 5 — very faint */}
        <div
          className="absolute h-px w-full"
          style={{
            top: '84%',
            background: isLeft
              ? 'linear-gradient(to right, rgba(0,255,157,0.1), rgba(0,255,157,0))'
              : 'linear-gradient(to left, rgba(0,255,157,0.1), rgba(0,255,157,0))',
            animation: `siphon-pulse-5 4.6s ease-in-out infinite`,
          }}
        />

        {/* Traveling particle dots */}
        <div
          className="absolute w-1 h-1 rounded-full bg-[#00FF9D]/40"
          style={{
            top: '35%',
            animation: isLeft
              ? 'siphon-particle-ltr 3s ease-in-out infinite'
              : 'siphon-particle-rtl 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-0.5 h-0.5 rounded-full bg-cyan-400/30"
          style={{
            top: '60%',
            animation: isLeft
              ? 'siphon-particle-ltr 4.2s ease-in-out 1s infinite'
              : 'siphon-particle-rtl 4.2s ease-in-out 1s infinite',
          }}
        />
        <div
          className="absolute w-0.5 h-0.5 rounded-full bg-[#00FF9D]/25"
          style={{
            top: '78%',
            animation: isLeft
              ? 'siphon-particle-ltr 3.5s ease-in-out 2s infinite'
              : 'siphon-particle-rtl 3.5s ease-in-out 2s infinite',
          }}
        />
      </div>

      {/* Vertical glow line on the inner edge of the pillar */}
      <div
        className={`absolute top-[15%] bottom-[15%] ${
          isLeft ? 'right-0' : 'left-0'
        } w-px pointer-events-none`}
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(0,255,157,0.08) 20%, rgba(0,255,157,0.15) 50%, rgba(0,255,157,0.08) 80%, transparent)',
          animation: 'siphon-edge-glow 3s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ORDER BOOK AD NODE — TABLE-INTEGRATED SIDE PANEL
   ═══════════════════════════════════════════════════════════════════════ */

interface OrderBookEntry {
  id: number;
  side: 'BUY' | 'SELL';
  amount: string;
  asset: string;
  price: string;
  timestamp: string;
}

const OB_ASSETS = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'AVAX', 'LINK', 'ARB'];
const OB_BASE_PRICES: Record<string, number> = {
  BTC: 67250,
  ETH: 3450,
  SOL: 145,
  XRP: 0.542,
  BNB: 585,
  AVAX: 28.5,
  LINK: 14.2,
  ARB: 1.08,
};

function generateOrderBookEntry(id: number): OrderBookEntry {
  const side: 'BUY' | 'SELL' = Math.random() > 0.48 ? 'BUY' : 'SELL';
  const asset = OB_ASSETS[Math.floor(Math.random() * OB_ASSETS.length)];
  const basePrice = OB_BASE_PRICES[asset] || 100;
  const spread = basePrice * (Math.random() * 0.002 - 0.001);
  const price = basePrice + (side === 'BUY' ? -Math.abs(spread) : Math.abs(spread));

  let amount: string;
  if (asset === 'BTC') {
    amount = (0.01 + Math.random() * 8).toFixed(2);
  } else if (asset === 'ETH') {
    amount = (0.1 + Math.random() * 60).toFixed(2);
  } else if (asset === 'XRP') {
    amount = (100 + Math.random() * 50000).toFixed(0);
  } else {
    amount = (1 + Math.random() * 500).toFixed(2);
  }

  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  let priceStr: string;
  if (basePrice < 1) {
    priceStr = `$${price.toFixed(4)}`;
  } else if (basePrice < 100) {
    priceStr = `$${price.toFixed(2)}`;
  } else {
    priceStr = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return { id, side, amount, asset, price: priceStr, timestamp: ts };
}

function OrderBookAdNode() {
  const MAX_ENTRIES = 60;
  const [entries, setEntries] = useState<OrderBookEntry[]>(() =>
    Array.from({ length: 20 }, (_, i) => generateOrderBookEntry(i))
  );
  const idRef = useRef(20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      idRef.current += 1;
      const entry = generateOrderBookEntry(idRef.current);
      setEntries((prev) => {
        const next = [...prev, entry];
        if (next.length > MAX_ENTRIES) return next.slice(next.length - MAX_ENTRIES);
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  // Calculate live aggregated stats
  const stats = useMemo(() => {
    const recent = entries.slice(-30);
    const buys = recent.filter((e) => e.side === 'BUY').length;
    const sells = recent.length - buys;
    const buyRatio = recent.length > 0 ? Math.round((buys / recent.length) * 100) : 50;
    return { buys, sells, buyRatio, total: recent.length };
  }, [entries]);

  return (
    <div className="hidden xl:flex flex-col border-l border-white/[0.06] bg-[#0A0D13]/80 relative overflow-hidden w-[300px] max-h-[410px]">
      {/* ── Header — matches table th styling ──────────────────────── */}
      <div className="bg-[#151A22] border-b border-white/10 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-[#00FF9D]/50 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF9D]" />
          </span>
          <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            Aggregated_Order_Book
          </span>
        </div>
        <span className="font-mono text-[7px] text-[#00FF9D]/40 uppercase tracking-[0.15em]">
          Live
        </span>
      </div>

      {/* ── Buy/Sell Ratio Bar ─────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[8px] text-[#00FF9D] font-bold uppercase tracking-wider">
            Buy {stats.buyRatio}%
          </span>
          <span className="font-mono text-[8px] text-[#FF3366] font-bold uppercase tracking-wider">
            {100 - stats.buyRatio}% Sell
          </span>
        </div>
        <div className="h-1 bg-[#FF3366]/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00FF9D] rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(0,255,157,0.4)]"
            style={{ width: `${stats.buyRatio}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[7px] text-gray-700 uppercase tracking-wider">
            {stats.buys} orders
          </span>
          <span className="font-mono text-[7px] text-gray-700 uppercase tracking-wider">
            {stats.sells} orders
          </span>
        </div>
      </div>

      {/* ── Column Headers ─────────────────────────────────────────── */}
      <div className="flex items-center px-4 py-2 border-b border-white/[0.03] flex-shrink-0">
        <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em] w-10">Side</span>
        <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em] flex-1">Amount</span>
        <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em] text-right flex-1">Price</span>
        <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em] text-right w-14">Time</span>
      </div>

      {/* ── Scrolling Order Flow ───────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5"
      >
        {entries.map((entry) => {
          const isBuy = entry.side === 'BUY';
          return (
            <div
              key={entry.id}
              className={`flex items-center px-4 py-[5px] border-b border-white/[0.015] transition-colors ${
                isBuy
                  ? 'hover:bg-[#00FF9D]/[0.02]'
                  : 'hover:bg-[#FF3366]/[0.02]'
              }`}
            >
              <span
                className={`font-mono text-[8px] font-bold uppercase tracking-wider w-10 flex-shrink-0 ${
                  isBuy
                    ? 'text-[#00FF9D] drop-shadow-[0_0_3px_rgba(0,255,157,0.3)]'
                    : 'text-[#FF3366] drop-shadow-[0_0_3px_rgba(255,51,102,0.3)]'
                }`}
              >
                {entry.side}
              </span>
              <span className="font-mono text-[9px] text-gray-400 flex-1 truncate">
                <span className="text-gray-200 font-bold">{entry.amount}</span>{' '}
                <span className="text-gray-600">{entry.asset}</span>
              </span>
              <span
                className={`font-mono text-[9px] font-bold text-right flex-1 ${
                  isBuy ? 'text-[#00FF9D]/70' : 'text-[#FF3366]/70'
                }`}
              >
                {entry.price}
              </span>
              <span className="font-mono text-[7px] text-gray-700 text-right w-14 flex-shrink-0 tabular-nums">
                {entry.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer Stats ──��───────────────────────────────────────── */}
      <div className="px-4 py-2 border-t border-white/[0.04] flex items-center justify-between flex-shrink-0 bg-[#0A0D13]">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1 w-1">
            <span className="absolute inset-0 rounded-full bg-[#00FF9D]/40 animate-ping" />
            <span className="relative inline-flex rounded-full h-1 w-1 bg-[#00FF9D]" />
          </span>
          <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em]">
            {entries.length} fills streamed
          </span>
        </div>
        <span className="font-mono text-[7px] text-[#00FF9D]/30 uppercase tracking-[0.15em]">
          200ms
        </span>
      </div>

      {/* ── Scanline Overlay ──────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

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
   SIGNAL INTERFACE (matches backend schema)
   ═══════════════════════════════════════════════════════════════════════ */

interface Signal {
  id: string;
  asset: string;
  type: string;
  signal: string;
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timeframe: string;
  timestamp: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const { isLoggedIn, signals: rawSignals, login, register } = useGlobal();
  const [searchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Map raw signals to typed Signal interface with real confidence & timeframe
  const signals: Signal[] = useMemo(() => {
    return (rawSignals || []).map((raw: any) => ({
      id: raw.id || raw._id || '',
      asset: raw.asset || '',
      type: raw.type || '',
      signal: raw.signal || 'Hold',
      entry: typeof raw.entry === 'number' ? raw.entry : parseFloat(raw.entry) || 0,
      target: typeof raw.target === 'number' ? raw.target : parseFloat(raw.target) || 0,
      stopLoss: typeof raw.stopLoss === 'number' ? raw.stopLoss : parseFloat(raw.stopLoss) || 0,
      confidence: typeof raw.confidence === 'number' ? raw.confidence : parseFloat(raw.confidence) || 0,
      timeframe: raw.timeframe || '1D',
      timestamp: raw.timestamp || new Date().toISOString(),
    }));
  }, [rawSignals]);

  // AI Inference Log state
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateLogEntry(i));
    }
    return initial;
  });
  const logIdRef = useRef(8);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Check URL params for login/register triggers
  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setShowLoginModal(true);
    }
    if (searchParams.get('register') === 'true') {
      setShowRegisterModal(true);
    }
  }, [searchParams]);

  // AI Inference Log — push new entries at randomized intervals
  useEffect(() => {
    const pushLog = () => {
      logIdRef.current += 1;
      const entry = generateLogEntry(logIdRef.current);
      setLogEntries((prev) => {
        const next = [...prev, entry];
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 400 + Math.random() * 800;
      timeoutId = setTimeout(() => {
        pushLog();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-scroll log container
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logEntries]);

  const featuredArticles = articlesData.slice(0, 6);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Strong Buy':
        return 'text-[#00FF9D] bg-[#00FF9D]/20 border-[#00FF9D]/30';
      case 'Buy':
        return 'text-[#00FF9D] bg-[#00FF9D]/15 border-[#00FF9D]/30';
      case 'Strong Sell':
        return 'text-[#FF3366] bg-[#FF3366]/20 border-[#FF3366]/30';
      case 'Sell':
        return 'text-[#FF3366] bg-[#FF3366]/15 border-[#FF3366]/30';
      case 'Hold':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-400/15 border-gray-400/30';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'Strong Buy':
      case 'Buy':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'Strong Sell':
      case 'Sell':
        return <TrendingDown className="w-3.5 h-3.5" />;
      case 'Hold':
        return <Minus className="w-3.5 h-3.5" />;
      default:
        return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getSignalStatus = (signal: string) => {
    switch (signal) {
      case 'Strong Buy':
      case 'Buy':
        return 'buy';
      case 'Strong Sell':
      case 'Sell':
        return 'sell';
      case 'Hold':
        return 'hold';
      default:
        return 'hold';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const result = await login(loginForm.username, loginForm.password);
    if (result.success) {
      setLoginSuccess(result.message);
      setTimeout(() => {
        setShowLoginModal(false);
        setLoginSuccess('');
        setLoginForm({ username: '', password: '' });
      }, 1500);
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    const result = await register(registerForm.username, registerForm.password);
    if (result.success) {
      setRegisterSuccess(result.message);
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess('');
        setRegisterForm({ username: '', password: '', confirmPassword: '' });
      }, 1500);
    } else {
      setRegisterError(result.message);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-16">
      {/* ── Massive Ambient Glow Orbs ──────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-[#00FF9D]/[0.07] rounded-full blur-[200px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-[#00CC7D]/[0.05] rounded-full blur-[180px]" />
        <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] bg-[#FF3366]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-[60%] right-[25%] w-[350px] h-[350px] bg-cyan-400/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
         LOGIN MODAL
         ════════════════════════════════════════════════════════════════ */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151A22] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
              <span className="font-mono text-[10px] text-[#00FF9D]/60 uppercase tracking-[0.2em]">
                Secure Authentication
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight">
              Log In
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.15em] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 font-mono focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.15em] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 font-mono focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                  placeholder="Enter password"
                />
              </div>
              {loginError && (
                <p className="text-[#FF3366] text-sm font-mono">{loginError}</p>
              )}
              {loginSuccess && (
                <p className="text-[#00FF9D] text-sm font-mono">{loginSuccess}</p>
              )}
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
              >
                Authenticate
              </button>
            </form>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-200 transition-colors font-mono text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
         REGISTER MODAL
         ════════════════════════════════════════════════════════════════ */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151A22] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
              <span className="font-mono text-[10px] text-[#00FF9D]/60 uppercase tracking-[0.2em]">
                Create Account
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight">
              Register
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.15em] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 font-mono focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                  placeholder="Choose username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.15em] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 font-mono focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                  placeholder="Create password"
                />
                <p className="text-gray-600 text-[10px] font-mono mt-1.5 tracking-wide">
                  8+ chars, uppercase, lowercase, number, symbol
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.15em] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 font-mono focus:outline-none focus:border-[#00FF9D]/50 focus:ring-1 focus:ring-[#00FF9D]/20 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                  placeholder="Confirm password"
                />
              </div>
              {registerError && (
                <p className="text-[#FF3366] text-sm font-mono">{registerError}</p>
              )}
              {registerSuccess && (
                <p className="text-[#00FF9D] text-sm font-mono">{registerSuccess}</p>
              )}
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
              >
                Create Account
              </button>
            </form>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-200 transition-colors font-mono text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
         HERO SECTION — FRAMED WITH LEFT + RIGHT AMBIENT DATA PILLARS
         ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-8"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(128,128,128,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* ── Data Siphon Keyframe Animations ─────────────────────── */}
        <style>{`
          @keyframes siphon-pulse-1 {
            0%, 100% { opacity: 0; transform: scaleX(0.3); }
            15% { opacity: 1; transform: scaleX(1); }
            40% { opacity: 0.6; transform: scaleX(0.8); }
            60% { opacity: 0; transform: scaleX(0.2); }
          }
          @keyframes siphon-pulse-2 {
            0%, 100% { opacity: 0; transform: scaleX(0.2); }
            20% { opacity: 0.8; transform: scaleX(1); }
            50% { opacity: 0.4; transform: scaleX(0.6); }
            70% { opacity: 0; transform: scaleX(0.1); }
          }
          @keyframes siphon-pulse-3 {
            0%, 100% { opacity: 0; transform: scaleX(0.4); }
            10% { opacity: 0.7; transform: scaleX(0.9); }
            35% { opacity: 1; transform: scaleX(1); }
            55% { opacity: 0.3; transform: scaleX(0.5); }
            75% { opacity: 0; transform: scaleX(0.15); }
          }
          @keyframes siphon-pulse-4 {
            0%, 100% { opacity: 0; transform: scaleX(0.1); }
            25% { opacity: 0.6; transform: scaleX(0.7); }
            45% { opacity: 0.9; transform: scaleX(1); }
            65% { opacity: 0.2; transform: scaleX(0.4); }
            80% { opacity: 0; transform: scaleX(0.05); }
          }
          @keyframes siphon-pulse-5 {
            0%, 100% { opacity: 0; transform: scaleX(0.3); }
            30% { opacity: 0.5; transform: scaleX(0.8); }
            50% { opacity: 0.8; transform: scaleX(1); }
            70% { opacity: 0.2; transform: scaleX(0.3); }
          }
          @keyframes siphon-particle-ltr {
            0% { left: 0%; opacity: 0; }
            10% { opacity: 0.8; }
            80% { opacity: 0.4; }
            100% { left: 90%; opacity: 0; }
          }
          @keyframes siphon-particle-rtl {
            0% { right: 0%; opacity: 0; }
            10% { opacity: 0.8; }
            80% { opacity: 0.4; }
            100% { right: 90%; opacity: 0; }
          }
          @keyframes siphon-edge-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
        `}</style>

        <div className="grid grid-cols-1 xl:grid-cols-[160px_1fr_160px] gap-8 max-w-[1600px] mx-auto px-4">
          {/* ── LEFT AMBIENT DATA PILLAR ──────────────────────────── */}
          <DataSiphonWrapper side="left">
            <DynamicAdNode
              id="ad-hero-left-skyscraper"
              className="w-[160px] h-[600px]"
              ambient
            />
          </DataSiphonWrapper>

          {/* ── CENTER: HERO CONTENT ──────────────────────────────── */}
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center space-y-8">
              {/* System Health Micro-Widget */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/5 rounded-full backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                  <span className="font-mono text-[9px] text-[#00FF9D]/70 uppercase tracking-[0.15em]">
                    Neural_Engine: Online
                  </span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/5 rounded-full backdrop-blur-md">
                  <Radio className="w-3 h-3 text-cyan-400/60 animate-pulse" />
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.15em]">
                    Latency: <span className="text-gray-300">12ms</span>
                  </span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/5 rounded-full backdrop-blur-md">
                  <Cpu className="w-3 h-3 text-gray-600" />
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.15em]">
                    Model: <span className="text-gray-300">v6.0</span>
                  </span>
                </div>
              </div>

              {/* AI-Powered badge */}
              <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-full shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                <span className="w-2 h-2 bg-[#00FF9D] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
                <span className="text-[#00FF9D] text-sm font-bold uppercase tracking-[0.15em]">
                  The Neural Nexus
                </span>
              </div>

              {/* Headline */}
              <h1
                id="hero-headline"
                data-testid="hero-headline"
                className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.95]"
              >
                Institutional-Grade
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] via-[#00FF9D] to-[#00CC7D]/60">
                  Crypto Intelligence
                </span>
              </h1>

              {/* Subheadline */}
              <p
                id="hero-subheadline"
                data-testid="hero-subheadline"
                className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                Advanced algorithmic trading signals, portfolio management, and
                institutional-grade market analysis for professional traders and
                investors.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to=""
                  className="flex items-center space-x-3 px-10 py-5 bg-[#00FF9D] text-[#0B0E14] rounded-xl font-bold text-lg tracking-tight hover:bg-[#00CC7D] transition-all shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:shadow-[0_0_50px_rgba(0,255,157,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5" />
                  <span>App Coming Soon</span>
                </Link>
                <Link
                  to="/articles"
                  className="flex items-center space-x-3 px-10 py-5 bg-[#151A22]/80 border border-white/10 text-gray-100 rounded-xl font-semibold text-lg hover:bg-[#1A1F2A] hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] transition-all"
                >
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <span>Explore Articles</span>
                </Link>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
               AI INFERENCE TERMINAL
               ═══════════════════════════════════════════════════════════ */}
            <div className="max-w-3xl mx-auto mt-14">
              <div className="relative bg-[#050508]/90 border border-white/[0.06] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_2px_rgba(0,255,157,0.05)] backdrop-blur-md">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF3366]/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400/40" />
                    <span className="w-2 h-2 rounded-full bg-[#00FF9D]/40" />
                    <span className="font-mono text-[8px] text-gray-700 ml-2 uppercase tracking-[0.15em]">
                      neural.inference.terminal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 rounded-full bg-[#00FF9D]/60 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF9D]" />
                    </span>
                    <span className="font-mono text-[7px] text-[#00FF9D]/50 uppercase tracking-[0.2em]">
                      Live
                    </span>
                  </div>
                </div>

                {/* Log body */}
                <div
                  ref={logContainerRef}
                  className="h-48 overflow-y-auto px-4 py-3 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5"
                >
                  {logEntries.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-2">
                      <span className="font-mono text-[9px] text-gray-700 flex-shrink-0 tabular-nums">
                        {entry.timestamp}
                      </span>
                      <span
                        className={`font-mono text-[9px] font-bold flex-shrink-0 w-10 ${LOG_LEVEL_COLORS[entry.level]}`}
                      >
                        [{entry.level}]
                      </span>
                      <span className="font-mono text-[10px] text-gray-400 leading-relaxed">
                        {entry.text}
                      </span>
                    </div>
                  ))}
                  {/* Blinking cursor */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-mono text-[9px] text-gray-700 flex-shrink-0">
                      {new Date().toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    <span className="font-mono text-[9px] text-[#00FF9D] font-bold flex-shrink-0 w-10">
                      [SYS]
                    </span>
                    <span className="inline-block w-1.5 h-3.5 bg-[#00FF9D]/60 animate-pulse" />
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#00FF9D]/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* ── RIGHT AMBIENT DATA PILLAR ─────────────────────────── */}
          <DataSiphonWrapper side="right">
            <DynamicAdNode
              id="ad-hero-right-skyscraper"
              className="w-[160px] h-[600px]"
              ambient
            />
          </DataSiphonWrapper>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         DUAL LIVE MARKET MARQUEE
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-0 overflow-hidden border-y border-white/[0.03]">
        {/* Row 1 — Left to Right */}
        <div className="py-3 border-b border-white/[0.02]">
          <div className="flex animate-marquee-ltr whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <span
                key={`m1-${idx}`}
                className="inline-flex items-center gap-2 mx-8 flex-shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-[#00FF9D]/40" />
                <span
                  className={`font-mono text-[11px] font-bold uppercase tracking-[0.1em] ${item.color}`}
                >
                  {item.text}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — Right to Left */}
        <div className="py-3">
          <div className="flex animate-marquee-rtl whitespace-nowrap">
            {[...MARQUEE_ITEMS_2, ...MARQUEE_ITEMS_2].map((item, idx) => (
              <span
                key={`m2-${idx}`}
                className="inline-flex items-center gap-2 mx-8 flex-shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-purple-400/40" />
                <span
                  className={`font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${item.color}`}
                >
                  {item.text}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0E14] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0E14] to-transparent pointer-events-none z-10" />

        <style>{`
          @keyframes marquee-ltr {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-rtl {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-ltr {
            animation: marquee-ltr 45s linear infinite;
          }
          .animate-marquee-rtl {
            animation: marquee-rtl 50s linear infinite;
          }
        `}</style>
      </section>

      {/* ═════════════════════���══════════════════════════════════════════
         AD PLACEMENT — LEADERBOARD (728×90)
         ════════════════════════════════════════════════════════════════ */}
      {/*<DynamicAdNode
        id="ad-leaderboard"
        className="w-full max-w-[728px] h-[90px] mx-auto my-12"
      />*/}
      
      {/* BEGIN AADS AD UNIT 2430100 */}
      <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
        <iframe 
          data-aa="2430100" 
          src="//ad.a-ads.com/2430100/?size=728x90&background_color=000000&title_color=226400" 
          style={{ border: 0, padding: 0, width: '70%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto' }}
        ></iframe>
      </div>
      {/* END AADS AD UNIT 2430100 */}

      {/* ════════════════════════════════════════════════════════════════
         TERMINAL FEATURES GRID
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* MODULE_01 — AI Signals */}
            <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#00FF9D]/40 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />
              <span className="absolute top-4 left-4 font-mono text-[8px] text-gray-700 uppercase tracking-[0.2em]">
                Module_01
              </span>
              <div className="relative w-16 h-16 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] transition-all">
                <BarChart3 className="w-8 h-8 text-[#00FF9D]" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 tracking-tight">
                AI Signals
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                ML algorithms analyze patterns 24/7 for high-confidence trading
                signals.
              </p>
              <span className="mt-4 font-mono text-[9px] text-[#00FF9D]/40 uppercase tracking-[0.15em]">
                [ALWAYS_ACTIVE]
              </span>
            </div>

            {/* MODULE_02 — Portfolio */}
            <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#00FF9D]/40 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />
              <span className="absolute top-4 left-4 font-mono text-[8px] text-gray-700 uppercase tracking-[0.2em]">
                Module_02 (Coming Soon)
              </span>
              <div className="relative w-16 h-16 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] transition-all">
                <Shield className="w-8 h-8 text-[#00FF9D]" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 tracking-tight">
                Portfolio
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Monitor positions, P&L, and performance metrics in real-time.
              </p>
              <span className="mt-4 font-mono text-[9px] text-[#00FF9D]/40 uppercase tracking-[0.15em]">
                [RISK_MANAGED]
              </span>
            </div>

            {/* MODULE_03 — Analysis */}
            <div className="relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#00FF9D]/40 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />
              <span className="absolute top-4 left-4 font-mono text-[8px] text-gray-700 uppercase tracking-[0.2em]">
                Module_03
              </span>
              <div className="relative w-16 h-16 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.15)] transition-all">
                <Globe className="w-8 h-8 text-[#00FF9D]" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-2 tracking-tight">
                Analysis
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Deep-dive research from industry experts and AI systems.
              </p>
              <span className="mt-4 font-mono text-[9px] text-[#00FF9D]/40 uppercase tracking-[0.15em]">
                [RESEARCH_DESK]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         LIVE TRADING SIGNALS TABLE + ORDER BOOK AD NODE
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
                <span className="font-mono text-[10px] text-[#00FF9D]/60 uppercase tracking-[0.2em]">
                  Real-Time Feed &middot; Engine v6.0
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                Live Trading{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                  Signals
                </span>
              </h2>
              <p className="text-gray-500 font-mono text-sm">
                Algorithm-based signals updated in real-time
              </p>
            </div>
            <Link
              to="/signals"
              className="flex items-center space-x-1.5 text-[#00FF9D] font-mono text-sm font-bold hover:underline mt-4 sm:mt-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            {/* ── TABLE + ORDER BOOK GRID ──────────────────────────── */}
            <div className="bg-[#151A22]/80 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden">
              <div className="flex flex-col xl:flex-row w-full">
                {/* ── LEFT: Signals Table ──────────────────────────── */}
                <div className="flex-lg overflow-x-auto min-w-0 w-full">
                  <table className="w-full min-w-[750px]">
                    <thead>
                      <tr className="bg-[#151A22] border-b border-white/10">
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Asset
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Signal
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Entry
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Target
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Stop Loss
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Time
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Confidence
                        </th>
                        <th className="px-5 py-4 text-left text-[9px] font-bold font-mono text-gray-600 uppercase tracking-[0.2em]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {signals.slice(0, 5).map((signal, index) => (
                        <tr
                          key={signal.id}
                          data-testid={`signal-row-${signal.asset
                            .toLowerCase()
                            .replace('/', '')}`}
                          className={`transition-colors ${
                            index === 0
                              ? 'bg-[#00FF9D]/[0.02] animate-fresh-signal hover:bg-[#00FF9D]/[0.04]'
                              : 'hover:bg-white/[0.02]'
                          } ${
                            index !== signals.slice(0, 5).length - 1
                              ? 'border-b border-white/[0.03]'
                              : ''
                          }`}
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {index === 0 && (
                                <span className="relative flex h-2 w-2 flex-shrink-0">
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#00FF9D]/50 animate-ping" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                                </span>
                              )}
                              <div className="flex flex-col">
                                <span className="text-gray-100 font-bold font-mono text-sm">
                                  {signal.asset}
                                </span>
                                <span className="text-gray-600 text-[10px] font-mono uppercase tracking-wider">
                                  {signal.type}
                                  {index === 0 && (
                                    <span className="ml-2 text-[#00FF9D]/60 font-bold">
                                      [NEW]
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              id={`signal-${signal.asset
                                .toLowerCase()
                                .replace('/', '')}-status`}
                              data-status={getSignalStatus(signal.signal)}
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border ${getSignalColor(
                                signal.signal
                              )}`}
                            >
                              {getSignalIcon(signal.signal)}
                              <span>{signal.signal}</span>
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-white font-mono font-bold text-sm">
                              $
                              {signal.entry.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[#00FF9D] font-mono font-bold text-sm drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]">
                              $
                              {signal.target.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[#FF3366] font-mono font-bold text-sm drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]">
                              $
                              {signal.stopLoss.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-[#0B0E14] border border-white/10 rounded-md text-gray-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                              {signal.timeframe}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-20 h-2 bg-[#0B0E14] border border-white/[0.03] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    signal.confidence >= 80
                                      ? 'bg-[#00FF9D] shadow-[0_0_8px_rgba(0,255,157,0.5)]'
                                      : signal.confidence >= 60
                                      ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                                      : 'bg-[#FF3366] shadow-[0_0_8px_rgba(255,51,102,0.4)]'
                                  }`}
                                  style={{ width: `${signal.confidence}%` }}
                                />
                              </div>
                              <span className="text-gray-400 font-mono text-xs font-bold">
                                {signal.confidence}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/signal/${signal.id}`}
                              className="inline-flex items-center space-x-1 text-gray-500 text-xs font-mono hover:text-[#00FF9D] transition-colors group"
                            >
                              <span>{timeAgo(signal.timestamp)}</span>
                              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── RIGHT: Order Book Ad Node ────────────────────── */}
                {/*<OrderBookAdNode />*/}

                {/* ── RIGHT: Order Book Ad Node ────────────────────── */}
                <div className="hidden xl:flex flex-col border-l border-white/[0.06] bg-[#0A0D13]/80 relative overflow-hidden w-[300px] min-h-[410px] items-center justify-center p-4">
                  {/* BEGIN AADS AD UNIT 2430105 */}
                  <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
                    <iframe 
                     data-aa="2430105" 
                     src="//acceptable.a-ads.com/2430105/?size=Adaptive&background_color=0c0000&title_color=d9d9d9" 
                      style={{ border: 0, padding: 0, width: '100%', height: '100%', minHeight: '250px', overflow: 'hidden', display: 'block', margin: 'auto' }}
                    ></iframe>
                  </div>
                  {/* END AADS AD UNIT 2430105 */}
                </div>

              </div>
            </div>

            {/* Fresh signal pulse animation */}
            <style>{`
              @keyframes fresh-signal {
                0%, 100% { background-color: rgba(0, 255, 157, 0.015); }
                50% { background-color: rgba(0, 255, 157, 0.04); }
              }
              .animate-fresh-signal {
                animation: fresh-signal 3s ease-in-out infinite;
              }
            `}</style>
          </div>

          {/* Risk Warning */}
          <div className="mt-6 relative overflow-hidden bg-[#FF3366]/[0.05] border border-[#FF3366]/20 rounded-xl p-5 flex items-start space-x-4 shadow-[0_0_20px_rgba(255,51,102,0.04)]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF3366]/[0.03] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <AlertTriangle className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(255,51,102,0.6)]" />
            <div className="relative">
              <p className="text-gray-400 text-sm">
                <span className="text-[#FF3366] font-bold font-mono">
                  RISK WARNING:{' '}
                </span>
                Trading digital assets involves substantial risk and market volatility.
                These signals are derived from proprietary quantitative models and should not be construed as financial advice.
                Always perform independent due diligence and exercise strict risk management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         AD PLACEMENT — IN-FEED BILLBOARD (970×250)
         ════════════════════════════════════════════════════════════════ */}
      {/*<DynamicAdNode
        id="ad-infeed-billboard"
        className="w-full max-w-[970px] h-[250px] mx-auto my-16"
      />*/}
      
      {/* BEGIN AADS AD UNIT 2430097 */}
      <div id="frame" style={{ width: '100%', margin: 'auto', position: 'relative', zIndex: 99998 }}>
        <iframe 
          data-aa="2430097" 
          src="//acceptable.a-ads.com/2430097/?size=Adaptive&background_color=000000&title_color=003f02&title_hover_color=07336e" 
          style={{ border: 0, padding: 0, width: '70%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto' }}
        ></iframe>
      </div>
      {/* END AADS AD UNIT 2430097 */}

      {/* ════════════════════════════════════════════════════════════════
         LATEST ARTICLES
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <BookOpen className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                <span className="font-mono text-[10px] text-[#00FF9D]/60 uppercase tracking-[0.2em]">
                  Research Desk &middot; Deep Dive
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                  <span className="font-mono text-[8px] text-[#00FF9D]/40 uppercase tracking-[0.15em]">
                    [UPDATED]
                  </span>
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-100 tracking-tight">
                Latest{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                  Articles
                </span>
              </h2>
              <p className="text-gray-500 font-mono text-sm mt-2">
                In-depth analysis from our expert team
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                data-testid={`article-card-${article.id}`}
                className="group relative bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/30 hover:shadow-[0_0_20px_rgba(0,255,157,0.08)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF9D]/[0.02] rounded-full blur-2xl -translate-y-6 translate-x-6 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-md px-2 py-0.5">
                      {article.category}
                    </span>
                    <span className="font-mono text-[10px] text-gray-600">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2.5 group-hover:text-[#00FF9D] transition-colors line-clamp-2 leading-snug tracking-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-600">
                      {article.date}
                    </span>
                    <span className="flex items-center space-x-1 text-[#00FF9D] font-mono text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/articles"
              className="inline-flex items-center space-x-2 px-10 py-4 bg-[#151A22]/80 border border-white/10 text-gray-100 rounded-xl font-bold font-mono text-sm uppercase tracking-wider hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] transition-all"
            >
              <span>View All Research</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}