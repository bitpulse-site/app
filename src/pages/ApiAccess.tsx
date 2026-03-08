import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Check,
  Code,
  Zap,
  Shield,
  Globe,
  Copy,
  Check as CheckIcon,
  Cpu,
  Layers,
  Radio,
  Terminal,
  Server,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════ */

const features = [
  'Live signal ingestion from a Python bot scanning 500+ USDT pairs',
  'Real-time WebSocket delivery via Socket.io (<100ms latency)',
  'PostgreSQL-backed signal history with REST query access',
  'Institutional-grade scoring: EMA 50/200, RSI, Volume, ATR risk',
  'Automated TP / SL placement using 14-period ATR calculations',
  'BTC regime filter — signals suppressed during chop / sideways markets',
];

const infraCards = [
  {
    icon: Zap,
    title: 'Live Signals',
    tag: 'ENGINE_01',
    stat: '300s',
    description: 'Full-market scan every 300 seconds across 500+ pairs',
  },
  {
    icon: Shield,
    title: 'ATR Risk Engine',
    tag: 'RISK_01',
    stat: '14-ATR',
    description: 'Structured TP/SL placement via 14-period Average True Range',
  },
  {
    icon: Globe,
    title: 'Socket.io Streams',
    tag: 'STREAM_01',
    stat: 'WSS',
    description: 'Real-time push via Socket.io — new_signal event on every fire',
  },
  {
    icon: Code,
    title: 'REST + WebSocket',
    tag: 'PROTO_01',
    stat: 'API',
    description: 'GET /api/signals for history, POST with x-bot-api-key for ingestion',
  },
];

const institutionalFeatures = [
  'Unlimited real-time signals via Socket.io WebSocket',
  'REST API access — GET /api/signals (latest 20)',
  'Bot ingestion endpoint — POST /api/signals',
  'Full PostgreSQL signal history & audit trail',
  'Priority support & onboarding',
  'Custom x-bot-api-key provisioning',
  'Access to all 500+ scanned USDT pairs',
  '99.9% uptime SLA',
];

const curlExample = `# Fetch the latest 20 signals
curl -X GET "http://localhost:5000/api/signals" \\
  -H "Content-Type: application/json"

# Response (200 OK)
{
  "data": [
    {
      "id": "clx9k2m7b00...",
      "asset": "BTC/USDT",
      "type": "Perpetual",
      "signal": "Strong Buy",
      "entry": 67250.00,
      "target": 72000.00,
      "stopLoss": 64500.00,
      "timeframe": "1H",
      "confidence": 91,
      "timestamp": "2026-03-06T14:32:00.000Z"
    }
  ]
}

# Push a signal (bot ingestion — requires x-bot-api-key)
curl -X POST "http://localhost:5000/api/signals" \\
  -H "Content-Type: application/json" \\
  -H "x-bot-api-key: YOUR_API_KEY_HERE" \\
  -d '{
    "asset": "ETH/USDT",
    "type": "Perpetual",
    "signal": "Buy",
    "entry": 3450.50,
    "target": 3800.00,
    "stopLoss": 3200.00,
    "timeframe": "1H",
    "confidence": 80
  }'`;

/* ═══════════════════════════════════════════════════════════════════════
   COPY BLOCK
   ═══════════════════════════════════════════════════════════════════════ */

function CurlBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#050508] border border-white/[0.04] rounded-xl overflow-hidden border-t-2 border-t-[#00FF9D] shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00FF9D]/50" />
          <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
            cURL — BitPulse API
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-wider transition-all border border-white/[0.06] hover:border-[#00FF9D]/30 hover:shadow-[0_0_8px_rgba(0,255,157,0.08)]"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3 text-[#00FF9D]" />
              <span className="text-[#00FF9D]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-[12px] text-gray-300 leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function ApiAccess() {
  return (
    <div className="relative min-h-screen bg-[#0B0E14] pt-28 pb-16 overflow-hidden">
      {/* ── Ambient Orbs ───────────────────────────────────────────── */}
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-[#00FF9D]/[0.04] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-[#00CC7D]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[40%] w-[400px] h-[400px] bg-[#FF3366]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Institutional Signal Infrastructure
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-5 tracking-tight">
            BitPulse{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              API
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Programmatic access to a live algorithmic trading engine scanning
            500+ cryptocurrency pairs every 300 seconds. REST queries, real-time
            Socket.io streams, and bot-level ingestion via secured API key.
          </p>

          {/* System status pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
              <Cpu className="w-3 h-3 text-[#00FF9D]/70" />
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
                Engine <span className="text-[#00FF9D] font-bold">v6.0</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
              <Radio className="w-3 h-3 text-cyan-400/70 animate-pulse" />
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
                Socket.io <span className="text-cyan-400 font-bold">LIVE</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
              <Server className="w-3 h-3 text-gray-500" />
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
                Scan Rate{' '}
                <span className="text-gray-300 font-bold">300s</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── cURL Terminal Block ──────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-16">
          <CurlBlock code={curlExample} />
        </div>

        {/* ── Infrastructure Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {infraCards.map((card) => (
            <div
              key={card.tag}
              className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 text-center hover:border-[#00FF9D]/30 hover:shadow-[0_0_20px_rgba(0,255,157,0.08)] transition-all duration-300 group"
            >
              <span className="absolute top-3 right-3 font-mono text-[7px] text-gray-700 uppercase tracking-[0.2em]">
                {card.tag}
              </span>
              <div className="w-12 h-12 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-[0_0_15px_rgba(0,255,157,0.15)] transition-shadow">
                <card.icon className="w-6 h-6 text-[#00FF9D]" />
              </div>
              <p className="font-mono text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] mb-1">
                {card.stat}
              </p>
              <h3 className="text-base font-bold text-gray-100 mb-2 tracking-tight">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          ))}
        </div>

        {/* ── Data Coverage ────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl p-8 mb-16 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF9D]/[0.02] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-6">
              <Layers className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
              <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                Engine Architecture
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-[1px] bg-[#00FF9D]/60 flex-shrink-0 shadow-[0_0_4px_rgba(0,255,157,0.5)]" />
                  <span className="text-gray-400 text-sm leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pricing — Single Institutional Tier ──────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="font-mono text-[10px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
              Signal Infrastructure Access
            </span>
            <h2 className="text-3xl font-bold text-gray-100 mt-2 tracking-tight">
              Institutional Access
            </h2>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-2xl p-8 transition-all duration-300 bg-[#00FF9D]/[0.06] border-2 border-[#00FF9D]/50 shadow-[0_0_30px_rgba(0,255,157,0.15)] hover:shadow-[0_0_50px_rgba(0,255,157,0.25)]">
              {/* Tier tag */}
              <span className="absolute top-4 right-4 font-mono text-[7px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30">
                TIER_INSTITUTIONAL
              </span>

              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9D]/[0.04] rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />

              <h3 className="text-xl font-bold text-gray-100 mb-2 tracking-tight">
                Institutional
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  $99
                </span>
                <span className="text-gray-500 font-mono text-sm ml-1">
                  /month
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Full programmatic access to the BitPulse signal engine —
                REST API, real-time Socket.io streams, and bot-level ingestion
                with a dedicated API key.
              </p>
              <ul className="space-y-3 mb-8">
                {institutionalFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#00FF9D] flex-shrink-0" />
                    <span className="text-gray-400 font-mono text-[12px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center py-3.5 rounded-lg font-bold font-mono text-xs uppercase tracking-wider transition-all bg-[#00FF9D] text-[#0B0E14] hover:bg-[#00CC7D] shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
              >
                &gt; Request_API_Key
              </Link>
            </div>
          </div>
        </div>

        {/* ── Documentation CTA ────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#00FF9D]/[0.06] to-[#00FF9D]/[0.02] border border-[#00FF9D]/20 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(0,255,157,0.05)]">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-10 -translate-x-10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">
              Ready to integrate?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-mono text-sm">
              Read the full technical documentation covering REST endpoints,
              Socket.io event schemas, authentication headers, and integration
              examples in cURL, JavaScript, and Python.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/documentation"
                className="px-8 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
              >
                &gt; View_Documentation
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-[#151A22] text-gray-300 border border-white/10 rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:border-[#00FF9D]/30 hover:text-gray-100 transition-all"
              >
                &gt; Contact_Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}