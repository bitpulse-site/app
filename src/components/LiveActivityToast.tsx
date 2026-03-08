import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  Fish,
  TrendingDown,
  Radio,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

type EventType = 'WHALE_ORDER' | 'LIQUIDATION' | 'ALGO_ALERT';

interface TradeEvent {
  type: EventType;
  message: React.ReactNode;
  tag: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   EVENT COLOUR MAP
   ═══════════════════════════════════════════════════════════════════════ */

const EVENT_STYLES: Record<
  EventType,
  {
    border: string;
    glow: string;
    text: string;
    bg: string;
    pingOuter: string;
    pingInner: string;
    bar: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  WHALE_ORDER: {
    border: 'border-[#00FF9D]/40',
    glow: 'shadow-[0_8px_40px_rgba(0,255,157,0.18)]',
    text: 'text-[#00FF9D]',
    bg: 'bg-[#00FF9D]',
    pingOuter: 'bg-[#00FF9D]/20',
    pingInner: 'bg-[#00FF9D]/10',
    bar: 'bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]',
    icon: <Fish className="w-5 h-5 text-[#00FF9D] relative z-10" />,
    label: 'WHALE_ORDER',
  },
  LIQUIDATION: {
    border: 'border-[#FF3366]/40',
    glow: 'shadow-[0_8px_40px_rgba(255,51,102,0.18)]',
    text: 'text-[#FF3366]',
    bg: 'bg-[#FF3366]',
    pingOuter: 'bg-[#FF3366]/20',
    pingInner: 'bg-[#FF3366]/10',
    bar: 'bg-gradient-to-r from-[#FF3366] to-[#FF6B8A]',
    icon: <AlertTriangle className="w-5 h-5 text-[#FF3366] relative z-10" />,
    label: 'LIQUIDATION',
  },
  ALGO_ALERT: {
    border: 'border-cyan-400/40',
    glow: 'shadow-[0_8px_40px_rgba(34,211,238,0.18)]',
    text: 'text-cyan-400',
    bg: 'bg-cyan-400',
    pingOuter: 'bg-cyan-400/20',
    pingInner: 'bg-cyan-400/10',
    bar: 'bg-gradient-to-r from-cyan-400 to-cyan-300',
    icon: <Zap className="w-5 h-5 text-cyan-400 relative z-10" />,
    label: 'ALGO_SIGNAL',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
   PROCEDURAL EVENT GENERATOR
   ═══════════════════════════════════════════════════════════════════════ */

const ASSETS = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'AVAX/USDT',
  'DOGE/USDT',
  'ADA/USDT',
  'LINK/USDT',
  'ARB/USDT',
];

const EXCHANGES = [
  'Binance',
  'OKX',
  'Bybit',
  'Coinbase',
  'Kraken',
  'Bitfinex',
  'dYdX',
  'Hyperliquid',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(): string {
  const r = Math.random();
  if (r < 0.3) return `$${(100 + Math.floor(Math.random() * 900)).toLocaleString()}K`;
  if (r < 0.7) return `$${(1 + Math.random() * 9).toFixed(1)}M`;
  return `$${(10 + Math.random() * 40).toFixed(1)}M`;
}

function generateEvent(): TradeEvent {
  const roll = Math.random();
  const asset = pick(ASSETS);
  const amount = randomAmount();
  const exchange = pick(EXCHANGES);

  if (roll < 0.4) {
    // WHALE ORDER
    const actions = [
      <>
        Whale accumulated{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{amount}</span> of{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{asset}</span> on {exchange}.
      </>,
      <>
        Institutional block buy detected:{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{amount}</span>{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{asset}</span> via {exchange} OTC desk.
      </>,
      <>
        Smart money wallet moved{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{amount}</span> into{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{asset}</span> — {exchange} flow.
      </>,
      <>
        Whale alert:{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{amount}</span> market buy on{' '}
        <span className="font-mono font-bold text-[#00FF9D]">{asset}</span> spotted on {exchange}.
      </>,
    ];
    return { type: 'WHALE_ORDER', message: pick(actions), tag: 'WHALE.TRACK' };
  }

  if (roll < 0.7) {
    // LIQUIDATION
    const sides = ['Long', 'Short'];
    const side = pick(sides);
    const actions = [
      <>
        <span className="font-mono font-bold text-[#FF3366]">{amount}</span>{' '}
        {side} liquidated on{' '}
        <span className="font-mono font-bold text-[#FF3366]">{asset}</span> — {exchange} perps.
      </>,
      <>
        Cascading {side.toLowerCase()} liquidation:{' '}
        <span className="font-mono font-bold text-[#FF3366]">{amount}</span>{' '}
        <span className="font-mono font-bold text-[#FF3366]">{asset}</span> wiped on {exchange}.
      </>,
      <>
        {exchange} {side.toLowerCase()} squeeze:{' '}
        <span className="font-mono font-bold text-[#FF3366]">{amount}</span> liquidated across{' '}
        <span className="font-mono font-bold text-[#FF3366]">{asset}</span> positions.
      </>,
    ];
    return { type: 'LIQUIDATION', message: pick(actions), tag: 'LIQ.ENGINE' };
  }

  // ALGO ALERT
  const confidences = ['High', 'Very High', 'Critical'];
  const confidence = pick(confidences);
  const signals = ['Strong Buy', 'Reversal', 'Breakout', 'Momentum Shift'];
  const signal = pick(signals);
  const actions = [
    <>
      {confidence}-confidence{' '}
      <span className="font-mono font-bold text-cyan-400">{signal}</span> signal generated for{' '}
      <span className="font-mono font-bold text-cyan-400">{asset}</span> — volume{' '}
      <span className="font-mono font-bold text-cyan-400">{amount}</span>.
    </>,
    <>
      AI model v6.0 flagged{' '}
      <span className="font-mono font-bold text-cyan-400">{asset}</span>:{' '}
      <span className="font-mono font-bold text-cyan-400">{signal}</span> pattern detected with{' '}
      <span className="font-mono font-bold text-cyan-400">{amount}</span> OI shift.
    </>,
    <>
      Algo intercepted{' '}
      <span className="font-mono font-bold text-cyan-400">{signal}</span> on{' '}
      <span className="font-mono font-bold text-cyan-400">{asset}</span> — {confidence.toLowerCase()}{' '}
      conviction, {exchange} flow.
    </>,
  ];
  return { type: 'ALGO_ALERT', message: pick(actions), tag: 'ALGO.RADAR' };
}

/* ═══════════════════════════════════════════════════════════════════════
   TOAST DURATION
   ═══════════════════════════════════════════════════════════════════════ */

const TOAST_DURATION_MS = 5000;

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function LiveActivityToast() {
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState<TradeEvent | null>(null);
  const [barWidth, setBarWidth] = useState(100);
  const barAnimRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (barAnimRef.current) cancelAnimationFrame(barAnimRef.current);
  }, []);

  const show = useCallback(() => {
    const newEvent = generateEvent();
    setEvent(newEvent);
    setBarWidth(100);
    setVisible(true);
    startTimeRef.current = performance.now();

    // Animate countdown bar via rAF for silky 60 fps
    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / TOAST_DURATION_MS);
      setBarWidth(remaining * 100);
      if (remaining > 0) {
        barAnimRef.current = requestAnimationFrame(tick);
      }
    };
    barAnimRef.current = requestAnimationFrame(tick);

    // Auto-dismiss
    setTimeout(dismiss, TOAST_DURATION_MS);
  }, [dismiss]);

  useEffect(() => {
    // First toast after 10 s
    const initial = setTimeout(show, 10000);

    // Recurring every 30–50 s
    const interval = setInterval(show, 30000 + Math.random() * 20000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
      if (barAnimRef.current) cancelAnimationFrame(barAnimRef.current);
    };
  }, [show]);

  const style = event ? EVENT_STYLES[event.type] : EVENT_STYLES.WHALE_ORDER;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-700 transform ${
        visible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`relative bg-[#151A22]/95 backdrop-blur-xl border ${style.border} rounded-xl overflow-hidden ${style.glow} max-w-[380px]`}
      >
        {/* ── Content ──────────────────────────────────────────────── */}
        <div className="p-4 flex items-start gap-4">
          {/* Radar icon with ping animation */}
          <div className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center">
            {/* Outer ping */}
            <span
              className={`absolute inset-0 rounded-full ${style.pingInner} animate-ping`}
              style={{ animationDuration: '2s' }}
            />
            {/* Inner pulse */}
            <span
              className={`absolute inset-1 rounded-full ${style.pingOuter} animate-pulse`}
            />
            {/* Icon ring */}
            <div
              className={`relative w-11 h-11 rounded-full border ${style.border} flex items-center justify-center bg-[#0B0E14]/60`}
            >
              {style.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Micro header */}
            <div className="flex items-center gap-2 mb-1.5">
              <Radio className={`w-3 h-3 ${style.text} animate-pulse`} />
              <span
                className={`font-mono text-[9px] font-bold uppercase tracking-[0.15em] ${style.text}`}
              >
                [SYS.INTERCEPT]
              </span>
              <span className="font-mono text-[9px] text-gray-700">•</span>
              <span className="font-mono text-[9px] text-gray-600">
                {event?.tag ?? ''}
              </span>
              <span className="font-mono text-[9px] text-gray-700 ml-auto">
                0.{Math.floor(Math.random() * 4) + 1}s ago
              </span>
            </div>

            {/* Message body */}
            <p className="text-[13px] font-medium text-gray-300 leading-relaxed">
              {event?.message}
            </p>
          </div>
        </div>

        {/* ── Visual Countdown Bar (1 px at bottom) ────────────────── */}
        <div className="h-[2px] w-full bg-white/[0.03]">
          <div
            className={`h-full ${style.bar} transition-none`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}