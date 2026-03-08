import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  Code,
  Zap,
  Shield,
  ChevronRight,
  Terminal,
  Globe,
  Lock,
  Copy,
  Check,
  Radio,
  Cpu,
  Layers,
  Database,
  Activity,
  Key,
  Clock,
  Wifi,
  Target,
  AlertTriangle,
  BarChart3,
  Settings,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   DOC SECTIONS STRUCTURE
   ═══════════════════════════════════════════════════════════════════════ */

interface DocItem {
  id: string;
  title: string;
}

interface DocSection {
  id: string;
  title: string;
  tag: string;
  icon: React.ElementType;
  items: DocItem[];
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    tag: 'ONBOARD',
    icon: Book,
    items: [
      { id: 'quick-start', title: 'Quick Start Guide' },
      { id: 'creating-account', title: 'Creating an Account' },
      { id: 'understanding-signals', title: 'Understanding Signals' },
      { id: 'portfolio-setup', title: 'Portfolio Setup' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    tag: 'API_SPEC',
    icon: Code,
    items: [
      { id: 'authentication', title: 'Authentication' },
      { id: 'rate-limits', title: 'Rate Limits' },
      { id: 'endpoints-overview', title: 'Endpoints Overview' },
      { id: 'websocket-streams', title: 'WebSocket Streams' },
    ],
  },
  {
    id: 'signals',
    title: 'Trading Signals',
    tag: 'SIGNALS',
    icon: Zap,
    items: [
      { id: 'signal-types', title: 'Signal Types' },
      { id: 'confidence-scores', title: 'Confidence Scores' },
      { id: 'timeframes', title: 'Timeframes' },
      { id: 'risk-management', title: 'Risk Management' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    tag: 'SECURITY',
    icon: Shield,
    items: [
      { id: 'account-security', title: 'Account Security' },
      { id: 'two-factor-auth', title: 'Two-Factor Auth' },
      { id: 'api-key-management', title: 'API Key Management' },
      { id: 'best-practices', title: 'Best Practices' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   COPY-TO-CLIPBOARD CODE BLOCK
   ═══════════════════════════════════════════════════════════════════════ */

function CodeBlock({
  code,
  language = 'javascript',
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#050508] border border-white/[0.04] rounded-lg overflow-hidden border-t-2 border-t-[#00FF9D] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/[0.04]">
        <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-wider transition-all border border-white/[0.06] hover:border-[#00FF9D]/30 hover:shadow-[0_0_8px_rgba(0,255,157,0.08)]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#00FF9D]" />
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
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[13px] text-gray-300 leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION HEADING HELPER
   ═══════════════════════════════════════════════════════════════════════ */

function SectionTitle({
  icon: Icon,
  tag,
  children,
}: {
  icon: React.ElementType;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
        <span className="font-mono text-[9px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
          [{tag}]
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 tracking-tight">
        {children}
      </h2>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-sm font-bold text-[#00FF9D] uppercase tracking-[0.12em] mt-10 mb-4 border-l-2 border-[#00FF9D]/40 pl-4">
      {children}
    </h3>
  );
}

function Endpoint({
  method,
  path,
}: {
  method: string;
  path: string;
}) {
  const methodColor =
    method === 'GET'
      ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30'
      : method === 'POST'
      ? 'bg-cyan-400/15 text-cyan-400 border-cyan-400/30'
      : method === 'DELETE'
      ? 'bg-[#FF3366]/15 text-[#FF3366] border-[#FF3366]/30'
      : 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30';

  return (
    <div className="flex items-center gap-3 my-4 px-4 py-3 bg-[#0B0E14] border border-white/[0.06] rounded-lg">
      <span
        className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${methodColor}`}
      >
        {method}
      </span>
      <span className="font-mono text-sm text-[#00FF9D]">{path}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 w-1.5 h-1.5 rounded-[1px] bg-[#00FF9D]/60 flex-shrink-0 shadow-[0_0_4px_rgba(0,255,157,0.5)]" />
      <span>{children}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DOC CONTENT MAP
   ═══════════════════════════════════════════════════════════════════════ */

function DocContent({ activeDoc }: { activeDoc: string }) {
  switch (activeDoc) {
    /* ─── GETTING STARTED ──────────────────────────────────────────── */
    case 'quick-start':
      return (
        <div>
          <SectionTitle icon={Book} tag="Onboard_01">
            Quick Start Guide
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            Welcome to BitPulse. This guide will have you consuming
            institutional-grade algorithmic trading signals in under 5 minutes.
            The platform is powered by a Python signal engine that scans 500+
            USDT pairs on Binance every 300 seconds, backed by a Node.js API
            server with PostgreSQL persistence and real-time Socket.io delivery.
          </p>
          <SubHeading>Step 1 — Create Your Account</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Click the profile icon in the top navigation bar and select{' '}
            <span className="font-mono text-[#00FF9D]">"Register"</span>.
            Provide a username and a password conforming to our security policy
            (8+ characters, mixed case, digit, symbol). You'll be authenticated
            immediately upon registration.
          </p>
          <SubHeading>Step 2 — Explore Live Signals</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Navigate to the Signals dashboard. Signals are pushed in real time
            via Socket.io the moment the Python engine fires them. Each signal
            displays:
          </p>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              Asset pair — e.g.{' '}
              <span className="font-mono text-[#00FF9D]">BTC/USDT</span>
            </Bullet>
            <Bullet>
              Signal classification —{' '}
              <span className="font-mono text-[#00FF9D]">Strong Buy</span>,{' '}
              <span className="font-mono text-[#00FF9D]">Buy</span>,{' '}
              <span className="font-mono text-yellow-400">Hold</span>,{' '}
              <span className="font-mono text-[#FF3366]">Sell</span>,{' '}
              <span className="font-mono text-[#FF3366]">Strong Sell</span>
            </Bullet>
            <Bullet>Entry price, target (TP), and stop loss (SL) — calculated via ATR-14</Bullet>
            <Bullet>Confidence score (0–100)</Bullet>
            <Bullet>Timeframe of the scan (e.g. 1H)</Bullet>
          </ul>
          <SubHeading>Step 3 — Take Your First Trade</SubHeading>
          <p className="text-gray-400 leading-loose mb-6">
            Click any signal to view the full analysis breakdown. Use the{' '}
            <span className="font-mono text-[#00FF9D]">"Take Trade"</span>{' '}
            button to add it to your portfolio. Customise investment amount and
            risk parameters as needed. Your position's live P&L will update
            every 3 seconds.
          </p>
          <SubHeading>Step 4 — Integrate via API (Optional)</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            For programmatic access, request an API key from the{' '}
            <Link
              to="/contact"
              className="text-[#00FF9D] hover:underline"
            >
              Contact
            </Link>{' '}
            page. Here's a minimal fetch example:
          </p>
          <CodeBlock
            code={`const res = await fetch('http://localhost:5000/api/signals', {
  headers: { 'Content-Type': 'application/json' }
});

const data = await res.json();
// data: Signal[] — latest 20 signals from PostgreSQL`}
          />
        </div>
      );

    case 'creating-account':
      return (
        <div>
          <SectionTitle icon={Book} tag="Onboard_02">
            Creating an Account
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            Registration is instant and does not require email verification
            during the beta period. All accounts are provisioned with a{' '}
            <span className="font-mono text-[#00FF9D]">MEMBER</span> role by
            default. Authentication is handled via JWT tokens stored in
            localStorage and verified against the Node.js backend on every
            protected request.
          </p>
          <SubHeading>Password Requirements</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>Minimum 8 characters</Bullet>
            <Bullet>At least one uppercase letter (A-Z)</Bullet>
            <Bullet>At least one lowercase letter (a-z)</Bullet>
            <Bullet>At least one digit (0-9)</Bullet>
            <Bullet>
              At least one special character{' '}
              <span className="font-mono text-[#00FF9D]">
                (!@#$%^&*)
              </span>
            </Bullet>
          </ul>
          <SubHeading>Session Management</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Sessions are persisted in{' '}
            <span className="font-mono text-[#00FF9D]">localStorage</span> as
            a JWT access token. On every page load the frontend calls{' '}
            <span className="font-mono text-[#00FF9D]">GET /api/auth/me</span>{' '}
            to verify the token and hydrate the user profile. Sessions
            auto-lock after 10 minutes of inactivity — re-enter your password
            to resume.
          </p>
          <SubHeading>Role Hierarchy</SubHeading>
          <CodeBlock
            language="json"
            code={`{
  "roles": {
    "member": {
      "signals": "read",
      "portfolio": "read/write",
      "api_keys": 1
    },
    "admin": {
      "signals": "read/write",
      "portfolio": "read/write",
      "api_keys": 10,
      "user_management": true
    }
  }
}`}
          />
        </div>
      );

    case 'understanding-signals':
      return (
        <div>
          <SectionTitle icon={Zap} tag="Onboard_03">
            Understanding Signals
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            BitPulse signals are generated by a Python algorithmic engine that
            runs a continuous scan loop every 300 seconds against the Binance
            public API. The engine evaluates 500+ USDT pairs using a
            multi-factor confluence model: Higher-Timeframe (4H) EMA 50/200
            trend alignment, 1H pullback zone proximity (EMA 20), volume
            surge confirmation (1.4× average), RSI momentum gating, and a
            mandatory BTC regime filter that suppresses all signals during
            sideways / choppy markets.
          </p>
          <SubHeading>Signal Anatomy</SubHeading>
          <CodeBlock
            language="json"
            code={`{
  "id": "clx9k2m7b00...",
  "asset": "BTC/USDT",
  "type": "Perpetual",
  "signal": "Strong Buy",
  "entry": 67250.00,
  "target": 72000.00,
  "stopLoss": 64500.00,
  "confidence": 91,
  "timeframe": "1H",
  "timestamp": "2026-03-06T14:32:00.000Z"
}`}
          />
          <SubHeading>Confidence Tiers</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                90–100
              </span>{' '}
              — EXTREME. Full confluence across all sub-filters. Elite setup.
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                80–89
              </span>{' '}
              — STRONG. Confirmed whale activity with momentum alignment.
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#FF3366] font-bold">
                &lt;80
              </span>{' '}
              — Filtered out. The engine requires a minimum score of 80 to fire.
            </Bullet>
          </ul>
          <SubHeading>Risk / Reward Structure</SubHeading>
          <p className="text-gray-400 leading-loose">
            Every signal's TP and SL are calculated using the 14-period
            Average True Range (ATR). For BUY signals:{' '}
            <span className="font-mono text-[#FF3366]">SL = entry − ATR × 1.2</span>,{' '}
            <span className="font-mono text-[#00FF9D]">TP = entry + ATR × 2.5</span>.
            This yields a minimum 2:1 risk/reward ratio on every published signal.
            SELL signals mirror the logic inversely.
          </p>
        </div>
      );

    case 'portfolio-setup':
      return (
        <div>
          <SectionTitle icon={BarChart3} tag="Onboard_04">
            Portfolio Setup
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The Portfolio module provides a real-time position management
            terminal. All P&L figures update via a simulated WebSocket feed
            every 3 seconds.
          </p>
          <SubHeading>Taking a Trade</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            From any signal detail page, click{' '}
            <span className="font-mono text-[#00FF9D]">"Take Trade"</span>.
            You'll be prompted to configure:
          </p>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-gray-200">Amount</span> —
              Capital to allocate (USD equivalent)
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">Type</span> — Spot or
              Futures (simulated leverage)
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">
                Custom TP/SL
              </span>{' '}
              — Override the ATR-calculated levels
            </Bullet>
          </ul>
          <SubHeading>Live P&L Engine</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Active positions are tracked with a 3-second tick rate. The P&L
            engine applies randomised price fluctuations to simulate realistic
            market volatility. Green values indicate unrealised profit; red
            values indicate unrealised loss.
          </p>
          <SubHeading>Closing Positions</SubHeading>
          <p className="text-gray-400 leading-loose">
            Click{' '}
            <span className="font-mono text-[#FF3366]">"Close_Pos"</span> on
            any active trade to lock in the current simulated P&L. The position
            moves to your Closed Trades ledger with a Win/Loss/Break-Even
            classification.
          </p>
        </div>
      );

    /* ─── API REFERENCE ────────────────────────────────────────────── */
    case 'authentication':
      return (
        <div>
          <SectionTitle icon={Key} tag="API_Auth">
            Authentication
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The BitPulse API uses two authentication mechanisms depending on
            the endpoint type.
          </p>
          <SubHeading>User Authentication (JWT Bearer Token)</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            User-facing endpoints (login, register, profile) use JWT tokens.
            After a successful{' '}
            <span className="font-mono text-[#00FF9D]">POST /api/auth/login</span>,
            the server returns an{' '}
            <span className="font-mono text-[#00FF9D]">accessToken</span>.
            Include it in subsequent requests:
          </p>
          <CodeBlock
            language="http"
            code={`GET /api/auth/me HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json`}
          />
          <SubHeading>Bot Ingestion Authentication (x-bot-api-key)</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            The{' '}
            <span className="font-mono text-cyan-400">POST /api/signals</span>{' '}
            endpoint is reserved for the Python signal engine. It requires a
            static API key sent via the{' '}
            <span className="font-mono text-[#00FF9D]">x-bot-api-key</span>{' '}
            header. This key is provisioned during onboarding.
          </p>
          <CodeBlock
            language="http"
            code={`POST /api/signals HTTP/1.1
Host: localhost:5000
Content-Type: application/json
x-bot-api-key: YOUR_API_KEY_HERE

{
  "asset": "BTC/USDT",
  "type": "Perpetual",
  "signal": "Strong Buy",
  "entry": 67250.00,
  "target": 72000.00,
  "stopLoss": 64500.00,
  "timeframe": "1H",
  "confidence": 91
}`}
          />
          <SubHeading>Error Responses</SubHeading>
          <CodeBlock
            language="json"
            code={`{
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "The provided token is invalid or has expired.",
    "status": 401
  }
}`}
          />
          <p className="text-gray-500 text-sm mt-4 leading-loose">
            Common auth errors:{' '}
            <span className="font-mono text-[#FF3366]">401</span>{' '}
            invalid/expired token or missing x-bot-api-key,{' '}
            <span className="font-mono text-[#FF3366]">403</span> insufficient
            permissions.
          </p>
        </div>
      );

    case 'rate-limits':
      return (
        <div>
          <SectionTitle icon={Clock} tag="API_Limits">
            Rate Limits
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            BitPulse enforces rate limits to ensure fair access and platform
            stability. The Python bot operates on a fixed 300-second scan loop,
            so bot-originated POST requests are naturally throttled. Client-side
            REST polling is also rate-limited.
          </p>
          <SubHeading>Current Limits</SubHeading>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Endpoint
                  </th>
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Method
                  </th>
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Limit
                  </th>
                  <th className="py-3 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">
                    /api/signals
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    GET
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    60 req/min
                  </td>
                  <td className="py-3 font-mono text-sm text-gray-500">
                    Per IP
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-cyan-400">
                    /api/signals
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    POST
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    20 req/min
                  </td>
                  <td className="py-3 font-mono text-sm text-gray-500">
                    Per API key
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-200">
                    /api/auth/*
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    POST
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    10 req/min
                  </td>
                  <td className="py-3 font-mono text-sm text-gray-500">
                    Per IP
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-200">
                    Socket.io
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    WSS
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">
                    5 connections
                  </td>
                  <td className="py-3 font-mono text-sm text-gray-500">
                    Per IP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <SubHeading>Handling 429 Responses</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            When rate-limited, the API returns a{' '}
            <span className="font-mono text-[#FF3366]">429 Too Many Requests</span>{' '}
            response. Implement exponential backoff with the{' '}
            <span className="font-mono text-[#00FF9D]">
              Retry-After
            </span>{' '}
            header value (in seconds).
          </p>
          <CodeBlock
            language="json"
            code={`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after 12 seconds.",
    "status": 429,
    "retry_after": 12
  }
}`}
          />
        </div>
      );

    case 'endpoints-overview':
      return (
        <div>
          <SectionTitle icon={Globe} tag="API_Endpoints">
            Endpoints Overview
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The BitPulse API is served at{' '}
            <span className="font-mono text-[#00FF9D]">
              http://localhost:5000/api
            </span>
            . All responses are JSON-encoded. Timestamps use ISO 8601 format.
            The primary data entity is the{' '}
            <span className="font-mono text-[#00FF9D]">Signal</span> object
            persisted in PostgreSQL.
          </p>

          <SubHeading>GET /api/signals — Retrieve Latest Signals</SubHeading>
          <Endpoint method="GET" path="/api/signals" />
          <p className="text-gray-400 leading-loose mb-4">
            Returns the most recent 20 signals from the PostgreSQL database,
            sorted by timestamp descending. No authentication is required for
            this public read endpoint.
          </p>
          <CodeBlock
            language="javascript"
            code={`const res = await fetch('http://localhost:5000/api/signals');
const signals = await res.json();

// Response shape:
[
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
  // ... up to 20 signals
]`}
          />

          <SubHeading>POST /api/signals — Push a New Signal (Bot Only)</SubHeading>
          <Endpoint method="POST" path="/api/signals" />
          <p className="text-gray-400 leading-loose mb-4">
            This endpoint is reserved for the Python signal engine. It requires
            the{' '}
            <span className="font-mono text-[#00FF9D]">x-bot-api-key</span>{' '}
            header. On success the signal is persisted to PostgreSQL and
            broadcast to all connected Socket.io clients via the{' '}
            <span className="font-mono text-[#00FF9D]">new_signal</span>{' '}
            event.
          </p>
          <CodeBlock
            language="bash"
            code={`curl -X POST "http://localhost:5000/api/signals" \\
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
  }'

# 201 Created
{
  "id": "clx9k2m7b00...",
  "asset": "ETH/USDT",
  "type": "Perpetual",
  "signal": "Buy",
  "entry": 3450.50,
  "target": 3800.00,
  "stopLoss": 3200.00,
  "timeframe": "1H",
  "confidence": 80,
  "timestamp": "2026-03-06T15:01:00.000Z"
}`}
          />
          <SubHeading>Request Body Schema</SubHeading>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Field
                  </th>
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Type
                  </th>
                  <th className="py-3 pr-4 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Required
                  </th>
                  <th className="py-3 text-left font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">asset</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">String</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">e.g. "BTC/USDT"</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">type</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">String</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">Spot, Perpetual, Futures, Options</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">signal</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">String</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">Strong Buy, Buy, Hold, Sell, Strong Sell</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">entry</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">Float</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">Entry price</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">target</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">Float</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">Take-profit price (ATR × 2.5)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">stopLoss</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">Float</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">Stop-loss price (ATR × 1.2)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">timeframe</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">String</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">e.g. "1H", "4H", "1D"</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">confidence</td>
                  <td className="py-3 pr-4 font-mono text-sm text-gray-400">Integer</td>
                  <td className="py-3 pr-4 font-mono text-sm text-[#00FF9D]">Yes</td>
                  <td className="py-3 font-mono text-sm text-gray-500">0–100 score</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubHeading>Auth Endpoints</SubHeading>
          <Endpoint method="POST" path="/api/auth/register" />
          <p className="text-gray-400 leading-loose mb-4">
            Creates a new user. Body:{' '}
            <span className="font-mono text-[#00FF9D]">{'{ username, password }'}</span>.
          </p>
          <Endpoint method="POST" path="/api/auth/login" />
          <p className="text-gray-400 leading-loose mb-4">
            Returns a JWT accessToken. Body:{' '}
            <span className="font-mono text-[#00FF9D]">{'{ username, password }'}</span>.
          </p>
          <Endpoint method="GET" path="/api/auth/me" />
          <p className="text-gray-400 leading-loose">
            Verifies the current session. Requires{' '}
            <span className="font-mono text-[#00FF9D]">Authorization: Bearer &lt;token&gt;</span>.
          </p>
        </div>
      );

    case 'websocket-streams':
      return (
        <div>
          <SectionTitle icon={Wifi} tag="API_WSS">
            WebSocket Streams (Socket.io)
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            For real-time signal delivery, connect to the BitPulse server via
            Socket.io at{' '}
            <span className="font-mono text-[#00FF9D]">
              http://localhost:5000
            </span>
            . The server emits two primary events. No authentication is
            required for the socket connection.
          </p>
          <SubHeading>Connection</SubHeading>
          <CodeBlock
            language="javascript"
            code={`import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to BitPulse signal feed');
});

socket.on('disconnect', () => {
  console.log('Disconnected from signal feed');
});`}
          />
          <SubHeading>Event: signal_history</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Emitted immediately upon connection. Contains an object with a{' '}
            <span className="font-mono text-[#00FF9D]">signals</span> array
            holding the most recent signal history from the database. Use this
            to hydrate your UI on initial load.
          </p>
          <CodeBlock
            language="javascript"
            code={`socket.on('signal_history', (data) => {
  // data.signals: Signal[]
  // Array of the latest signals from PostgreSQL
  console.log('Received signal history:', data.signals.length);
  setSignals(data.signals);
});`}
          />
          <SubHeading>Event: new_signal</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Emitted every time the Python bot pushes a new signal via{' '}
            <span className="font-mono text-cyan-400">POST /api/signals</span>.
            The payload is a single signal object matching the exact schema:
          </p>
          <CodeBlock
            language="javascript"
            code={`socket.on('new_signal', (signal) => {
  // signal: {
  //   id, asset, type, signal, entry,
  //   target, stopLoss, timeframe,
  //   confidence, timestamp
  // }
  console.log('New signal:', signal.asset, signal.signal);
  setSignals(prev => [signal, ...prev]);
});`}
          />
          <SubHeading>Example Payload</SubHeading>
          <CodeBlock
            language="json"
            code={`{
  "id": "clx9k2m7b00...",
  "asset": "SOL/USDT",
  "type": "Perpetual",
  "signal": "Strong Buy",
  "entry": 145.20,
  "target": 165.00,
  "stopLoss": 130.00,
  "timeframe": "1H",
  "confidence": 90,
  "timestamp": "2026-03-06T16:05:00.000Z"
}`}
          />
          <SubHeading>Cleanup</SubHeading>
          <p className="text-gray-400 leading-loose">
            Always disconnect gracefully when your component unmounts to
            prevent memory leaks and orphaned connections:
          </p>
          <CodeBlock
            language="javascript"
            code={`// In a React useEffect cleanup:
return () => {
  socket.disconnect();
};`}
          />
        </div>
      );

    /* ─── TRADING SIGNALS ──────────────────────────────────────────── */
    case 'signal-types':
      return (
        <div>
          <SectionTitle icon={Zap} tag="Signals_01">
            Signal Types
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The Python signal engine classifies every fired signal into one of
            five directional categories based on the multi-factor confluence
            model output.
          </p>
          <ul className="space-y-4 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                Strong Buy
              </span>{' '}
              — Maximum bullish conviction. HTF EMA 50 {'>'} EMA 200, price in
              pullback zone, volume surge {'>'} 1.4×, RSI {'<'} 65, BTC trending.
              Score: 90–100 (EXTREME).
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                Buy
              </span>{' '}
              — Moderate bullish bias. All filters pass but with slightly lower
              volume confirmation. Score: 80–89 (STRONG).
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                Hold
              </span>{' '}
              — Neutral / consolidation phase. No directional edge detected by
              the scan. No signal is fired at this classification.
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#FF3366] font-bold">
                Sell
              </span>{' '}
              — Moderate bearish bias. HTF EMA 50 {'<'} EMA 200, bearish
              pullback zone. Score: 80–89.
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#FF3366] font-bold">
                Strong Sell
              </span>{' '}
              — Maximum bearish conviction. Full inverse confluence. Score:
              90–100 (EXTREME).
            </Bullet>
          </ul>
          <SubHeading>Engine Architecture</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            The signal classification pipeline runs in this order:
          </p>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-gray-200">BTC Regime Check</span> —
              EMA 50/200 on BTC/USDT 4H. If trend strength {'<'} 0.5%, scan
              is aborted entirely. This is non-negotiable.
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">HTF Trend (4H)</span> —
              EMA 50 vs EMA 200 determines BUY/SELL direction.
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">Pullback Zone (1H)</span> —
              Price must be within 0.2% of EMA 20 and above EMA 50 (for BUY).
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">Volume Confirmation</span> —
              Recent 3-candle average must exceed 30-candle average by 1.4×.
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">RSI Gate</span> —
              RSI 14 must be {'<'} 65 for BUY or {'>'} 35 for SELL (no overbought buys / oversold sells).
            </Bullet>
            <Bullet>
              <span className="font-mono text-gray-200">Cooldown</span> —
              4-hour per-symbol cooldown prevents signal spam.
            </Bullet>
          </ul>
        </div>
      );

    case 'confidence-scores':
      return (
        <div>
          <SectionTitle icon={Target} tag="Signals_02">
            Confidence Scores
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The confidence score is an integer from 0–100 that represents the
            strength of the multi-factor confluence at the moment the signal
            was fired. The engine uses a threshold-based scoring system — only
            signals scoring 80 or above are published.
          </p>
          <SubHeading>Scoring Breakdown</SubHeading>
          <CodeBlock
            language="python"
            code={`# From signal_engine.py — only ELITE setups reach publication
# All filters must pass sequentially:
#   1. BTC regime trending  (mandatory gate)
#   2. HTF EMA alignment    (mandatory gate)
#   3. Pullback zone hit    (mandatory gate)
#   4. Volume surge > 1.4x  (mandatory gate)
#   5. RSI within bounds    (mandatory gate)
#   6. Cooldown clear       (mandatory gate)

# If ALL gates pass → score = 100 (ELITE)
# The server maps:
#   score >= 90 → "EXTREME" strength
#   score >= 80 → "STRONG" strength`}
          />
          <SubHeading>Interpreting Scores</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                90–100
              </span>{' '}
              — EXTREME. Very strong institutional participation detected.
              Full model confluence.
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                80–89
              </span>{' '}
              — STRONG. Confirmed whale activity with momentum alignment.
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#FF3366] font-bold">
                &lt;80
              </span>{' '}
              — Automatically suppressed. These setups do not pass the minimum
              quality threshold and are never published.
            </Bullet>
          </ul>
          <p className="text-gray-500 text-sm leading-loose">
            Note: All scores are deterministic based on the scan filters. There
            is no probabilistic machine learning component — the score reflects
            whether all technical conditions were simultaneously satisfied.
          </p>
        </div>
      );

    case 'timeframes':
      return (
        <div>
          <SectionTitle icon={Clock} tag="Signals_03">
            Timeframes
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            The Python engine's scan loop runs on a configurable timeframe.
            The default production configuration uses{' '}
            <span className="font-mono text-[#00FF9D]">1H</span> candles for
            entry-level analysis, with{' '}
            <span className="font-mono text-[#00FF9D]">4H</span> candles for
            higher-timeframe trend confirmation.
          </p>
          <SubHeading>Timeframe Architecture</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                1H (Entry)
              </span>{' '}
              — Primary scan timeframe. EMA 20/50 pullback detection, RSI-14,
              volume analysis, and ATR-14 for TP/SL calculation.
            </Bullet>
            <Bullet>
              <span className="font-mono text-[#00FF9D] font-bold">
                4H (Confirmation)
              </span>{' '}
              — Higher-timeframe trend filter. EMA 50/200 must confirm the
              directional bias. Also used for the BTC regime check.
            </Bullet>
          </ul>
          <SubHeading>Scan Interval</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            The main loop in{' '}
            <span className="font-mono text-[#00FF9D]">main.py</span> runs
            every{' '}
            <span className="font-mono text-[#00FF9D]">300 seconds</span>{' '}
            (5 minutes). This interval balances signal freshness against
            Binance API rate limits when scanning 500+ pairs per cycle.
          </p>
          <CodeBlock
            language="python"
            code={`# main.py configuration
TIMEFRAME = "1h"
SCAN_INTERVAL_SECONDS = 300  # 5-minute scan loop`}
          />
          <SubHeading>Data Lookback</SubHeading>
          <p className="text-gray-400 leading-loose">
            The engine fetches 200 candles per pair on the entry timeframe and
            300 candles on the 4H confirmation timeframe. This provides
            sufficient history for the EMA-200 calculation on the higher
            timeframe while keeping API requests within Binance rate limits.
          </p>
        </div>
      );

    case 'risk-management':
      return (
        <div>
          <SectionTitle icon={AlertTriangle} tag="Signals_04">
            Risk Management
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            Every BitPulse signal includes ATR-calculated risk parameters.
            The stop loss and take profit are derived algorithmically from the
            14-period Average True Range at the moment of signal generation.
          </p>
          <SubHeading>ATR-Based TP / SL Placement</SubHeading>
          <CodeBlock
            language="python"
            code={`# From signal_engine.py
atr = ta.volatility.AverageTrueRange(
    df["high"], df["low"], df["close"], 14
).average_true_range().iloc[-1]

if trend == "BUY":
    sl = smart_round(close - atr * 1.2)   # Tight SL
    tp = smart_round(close + atr * 2.5)   # Wide TP
else:  # SELL
    sl = smart_round(close + atr * 1.2)
    tp = smart_round(close - atr * 2.5)

# Minimum Risk/Reward Ratio: 2.08:1`}
          />
          <SubHeading>Position Sizing Recommendation</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            We recommend the{' '}
            <span className="font-mono text-[#00FF9D]">1% Rule</span>: never
            risk more than 1% of your total portfolio on a single trade:
          </p>
          <CodeBlock
            language="text"
            code={`Position Size = (Portfolio × 0.01) / |Entry - StopLoss|

Example:
  Portfolio = $100,000
  Entry     = $67,250
  StopLoss  = $64,500
  Risk/Unit = $2,750

  Position Size = $1,000 / $2,750 = 0.364 BTC ≈ $24,463`}
          />
          <SubHeading>Built-In Safety Mechanisms</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                BTC Regime Filter
              </span>{' '}
              — All scanning halts when BTC EMA 50/200 trend strength drops
              below 0.5%. This prevents trading in choppy, whipsaw markets.
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                4-Hour Cooldown
              </span>{' '}
              — Each symbol has a per-asset 4-hour cooldown after a signal
              fires, preventing duplicate or contradictory signals.
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                RSI Gating
              </span>{' '}
              — BUY signals are suppressed when RSI {'>'} 65 (overbought).
              SELL signals are suppressed when RSI {'<'} 35 (oversold).
            </Bullet>
            <Bullet>
              <span className="font-mono text-yellow-400 font-bold">
                Dead-Letter Queue
              </span>{' '}
              — If the API connection fails when the bot tries to POST a
              signal, the payload is queued in memory and retried on the next
              scan cycle, ensuring zero data loss.
            </Bullet>
          </ul>
          <SubHeading>Correlation Risk</SubHeading>
          <p className="text-gray-400 leading-loose">
            Crypto assets are highly correlated during liquidation cascades.
            Avoid holding more than 3 concurrent signals in the same direction
            on correlated assets (e.g., BTC + ETH + SOL all long). Diversify
            across uncorrelated timeframes and signal types.
          </p>
        </div>
      );

    /* ─── SECURITY ──────────────────────────────��──────────────────── */
    case 'account-security':
      return (
        <div>
          <SectionTitle icon={Shield} tag="Security_01">
            Account Security
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            BitPulse employs defence-in-depth security architecture. Your
            credentials are hashed with{' '}
            <span className="font-mono text-[#00FF9D]">bcrypt</span> (cost
            factor 12) on the Node.js backend and never stored or transmitted
            in plaintext. JWT tokens are signed with a server-side secret.
          </p>
          <SubHeading>Security Measures</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              Passwords hashed with{' '}
              <span className="font-mono text-[#00FF9D]">
                bcrypt (cost=12)
              </span>
            </Bullet>
            <Bullet>JWT access tokens with configurable expiry</Bullet>
            <Bullet>Automatic session lock after 10 minutes of inactivity</Bullet>
            <Bullet>
              Session recovery via{' '}
              <span className="font-mono text-[#00FF9D]">GET /api/auth/me</span>{' '}
              on page load
            </Bullet>
            <Bullet>Rate-limited login attempts (10 per minute per IP)</Bullet>
          </ul>
          <SubHeading>Session Architecture</SubHeading>
          <CodeBlock
            language="json"
            code={`{
  "session": {
    "token_type": "Bearer",
    "storage": "localStorage (bitpulse_token)",
    "recovery": "GET /api/auth/me on mount",
    "lock_after_idle": "10 minutes",
    "lock_mechanism": "Client-side password re-entry"
  }
}`}
          />
        </div>
      );

    case 'two-factor-auth':
      return (
        <div>
          <SectionTitle icon={Lock} tag="Security_02">
            Two-Factor Authentication
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            Two-factor authentication (2FA) adds a second verification layer
            using time-based one-time passwords (TOTP) compatible with Google
            Authenticator, Authy, and similar apps.
          </p>
          <SubHeading>Setup Flow</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>Navigate to Profile → Security Settings</Bullet>
            <Bullet>
              Click{' '}
              <span className="font-mono text-[#00FF9D]">
                "Enable 2FA"
              </span>
            </Bullet>
            <Bullet>Scan the QR code with your authenticator app</Bullet>
            <Bullet>Enter the 6-digit verification code to confirm</Bullet>
            <Bullet>
              Save your recovery codes in a secure location (displayed once)
            </Bullet>
          </ul>
          <SubHeading>Recovery Codes</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            Upon enabling 2FA, you receive 10 single-use recovery codes. Each
            code can be used exactly once to bypass 2FA if you lose access to
            your authenticator device.
          </p>
          <CodeBlock
            language="text"
            code={`Recovery Codes (save securely — shown once):
──────────────────────────────────────────
  1. a8k2-m4pq-n9x3    6. q3r7-t8w2-y5z1
  2. b7j1-l3np-k8v2    7. r2s6-u7v1-x4y0
  3. c6h0-k2mq-j7u1    8. s1t5-v6w0-w3x9
  4. d5g9-j1lr-h6t0    9. t0u4-w5x9-v2w8
  5. e4f8-h0kq-g5s9   10. u9v3-x4y8-u1v7`}
          />
          <p className="text-gray-500 text-sm mt-4 leading-loose italic">
            Note: 2FA is planned for a future release. This documentation
            describes the intended implementation.
          </p>
        </div>
      );

    case 'api-key-management':
      return (
        <div>
          <SectionTitle icon={Settings} tag="Security_03">
            API Key Management
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            API keys provide machine-to-machine access to BitPulse. The primary
            use case is the{' '}
            <span className="font-mono text-[#00FF9D]">x-bot-api-key</span>{' '}
            header required by the{' '}
            <span className="font-mono text-cyan-400">POST /api/signals</span>{' '}
            endpoint for bot ingestion.
          </p>
          <SubHeading>Requesting a Key</SubHeading>
          <p className="text-gray-400 leading-loose mb-4">
            API keys are provisioned manually during onboarding. Contact the
            BitPulse team via the{' '}
            <Link
              to="/contact"
              className="text-[#00FF9D] hover:underline"
            >
              Contact
            </Link>{' '}
            page to request your key. You will receive:
          </p>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>A unique API key string for the x-bot-api-key header</Bullet>
            <Bullet>
              Documentation on the POST /api/signals schema
            </Bullet>
            <Bullet>
              Access to the Socket.io real-time stream for testing
            </Bullet>
          </ul>
          <SubHeading>Usage</SubHeading>
          <CodeBlock
            language="bash"
            code={`# Include in every bot POST request:
curl -X POST "http://localhost:5000/api/signals" \\
  -H "Content-Type: application/json" \\
  -H "x-bot-api-key: YOUR_API_KEY_HERE" \\
  -d '{ ... }'`}
          />
          <SubHeading>Key Rotation</SubHeading>
          <p className="text-gray-400 leading-loose">
            If you suspect your key has been compromised, contact support
            immediately. We will revoke the old key and issue a replacement
            within 24 hours. We recommend storing the key in an environment
            variable (e.g.{' '}
            <span className="font-mono text-[#00FF9D]">
              BOT_API_KEY
            </span>
            ) and never committing it to source control.
          </p>
        </div>
      );

    case 'best-practices':
      return (
        <div>
          <SectionTitle icon={Shield} tag="Security_04">
            Best Practices
          </SectionTitle>
          <p className="text-gray-400 leading-loose mb-6">
            Follow these security best practices to protect your BitPulse
            account and API integrations.
          </p>
          <SubHeading>Account Hygiene</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              Use a unique password not shared with any other service
            </Bullet>
            <Bullet>Enable 2FA when available</Bullet>
            <Bullet>
              Review active sessions periodically
            </Bullet>
            <Bullet>Log out explicitly when using shared devices</Bullet>
            <Bullet>
              Never share screenshots containing session tokens or API keys
            </Bullet>
          </ul>
          <SubHeading>API Integration Security</SubHeading>
          <ul className="space-y-2.5 mb-6 text-gray-400">
            <Bullet>
              Store API keys in environment variables — never hardcode in source
            </Bullet>
            <Bullet>
              Use{' '}
              <span className="font-mono text-[#00FF9D]">
                .env
              </span>{' '}
              files excluded via{' '}
              <span className="font-mono text-[#00FF9D]">
                .gitignore
              </span>
            </Bullet>
            <Bullet>Apply IP whitelisting in production environments</Bullet>
            <Bullet>Rotate keys after any team member departure</Bullet>
            <Bullet>
              Monitor your signal log for anomalous POST requests
            </Bullet>
          </ul>
          <SubHeading>Incident Response</SubHeading>
          <p className="text-gray-400 leading-loose">
            If you suspect your account or API key has been compromised:
            (1) immediately contact support to revoke the key, (2) change
            your password, (3) review the signal history for any
            unauthorized entries, and (4) submit a detailed report via the{' '}
            <Link
              to="/contact"
              className="text-[#00FF9D] hover:underline drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]"
            >
              Contact
            </Link>{' '}
            page.
          </p>
        </div>
      );

    /* ─── FALLBACK ─────────────────────────────────────────────────── */
    default:
      return (
        <div>
          <SectionTitle icon={Book} tag="Onboard_01">
            Quick Start Guide
          </SectionTitle>
          <p className="text-gray-400 leading-loose">
            Select a topic from the sidebar to begin exploring the BitPulse
            documentation.
          </p>
        </div>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Documentation() {
  const [activeDoc, setActiveDoc] = useState('quick-start');
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'getting-started',
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleDocClick = (sectionId: string, docId: string) => {
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections((prev) => [...prev, sectionId]);
    }
    setActiveDoc(docId);
  };

  // Find current doc title for breadcrumb
  const currentSection = docSections.find((s) =>
    s.items.some((i) => i.id === activeDoc)
  );
  const currentItem = currentSection?.items.find((i) => i.id === activeDoc);

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16 relative">
      {/* Ambient orbs */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-[#00FF9D]/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[50%] right-[15%] w-[400px] h-[400px] bg-[#00CC7D]/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Technical Reference
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              Documentation
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
            Complete technical reference for the BitPulse signal engine — REST
            API, Socket.io streams, Python bot architecture, and security
            protocols.
          </p>
        </div>

        {/* ── System Status Bar ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-[#00FF9D]/70" />
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.12em]">
              Engine:{' '}
              <span className="text-[#00FF9D] font-bold">v6.0</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[9px] text-[#00FF9D] font-bold">
              ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-cyan-400/70 animate-pulse" />
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.12em]">
              Socket.io:{' '}
              <span className="text-cyan-400 font-bold">CONNECTED</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.12em]">
              Scan Rate:{' '}
              <span className="text-gray-300 font-bold">300s</span>
            </span>
          </div>
        </div>

        {/* ── Main Layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-4 sticky top-28 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 px-2 mb-4 pb-3 border-b border-white/[0.05]">
                <Layers className="w-4 h-4 text-[#00FF9D]/60" />
                <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Directory
                </span>
              </div>
              <nav className="space-y-0.5">
                {docSections.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 transition-all font-mono text-[11px] font-bold uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <section.icon
                            className={`w-3.5 h-3.5 transition-colors ${
                              isExpanded
                                ? 'text-[#00FF9D]'
                                : 'text-gray-600'
                            }`}
                          />
                          <span>{section.title}</span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded
                              ? 'rotate-90 text-[#00FF9D]/60'
                              : 'text-gray-700'
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isExpanded
                            ? 'max-h-[500px] opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-white/[0.04]">
                          {section.items.map((item) => {
                            const isActive = activeDoc === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() =>
                                  handleDocClick(section.id, item.id)
                                }
                                className={`w-full text-left block pl-4 pr-3 py-2 rounded-r-lg font-mono text-[11px] transition-all duration-150 ${
                                  isActive
                                    ? 'text-[#00FF9D] bg-[#00FF9D]/[0.06] border-l-2 border-[#00FF9D] -ml-[1px] shadow-[0_0_10px_rgba(0,255,157,0.04)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                                }`}
                              >
                                {item.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            {currentSection && currentItem && (
              <div className="flex items-center gap-2 mb-6">
                <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                  {currentSection.title}
                </span>
                <ChevronRight className="w-3 h-3 text-gray-700" />
                <span className="font-mono text-[9px] text-[#00FF9D]/70 uppercase tracking-[0.15em]">
                  {currentItem.title}
                </span>
              </div>
            )}

            <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <DocContent activeDoc={activeDoc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}