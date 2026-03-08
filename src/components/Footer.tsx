import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  MessageSquare,
  Copy,
  Check,
  Bitcoin,
  Shield,
  AlertTriangle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface Toast {
  id: string;
  message: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════════════��� */

const tipWallets = [
  {
    coin: 'BTC',
    network: 'Native Segwit',
    address: 'bc1q05z4jzp0h32fdt466dstju8vhhxg8th8etn434',
  },
  {
    coin: 'ETH',
    network: 'Optimism',
    address: '0xc8abd404e9f13d22682e5bbba732faf91371ed3e',
  },
  {
    coin: 'SOL',
    network: 'Solana',
    address: '5MuoiuZ2AeP2d1jiaLnvPTd2gywf372czzTm6Wa7qLcW',
  },
  {
    coin: 'USDT',
    network: 'Polygon',
    address: '0xc8abd404e9f13d22682e5bbba732faf91371ed3e',
  },
  {
    coin: 'USDC',
    network: 'Polygon',
    address: '0xc8abd404e9f13d22682e5bbba732faf91371ed3e',
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   TERMINAL LINK COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

function TerminalLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center text-gray-500 hover:text-[#00FF9D] transition-colors font-mono text-[12px] tracking-wide"
    >
      <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-200 text-[#00FF9D]/60 flex-shrink-0">
        {'> '}
      </span>
      <span>{children}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF9D]/40">
        _
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Footer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const copyToClipboard = async (asset: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAsset(asset);

      const toast: Toast = {
        id: Date.now().toString(),
        message: `${asset} address copied!`,
      };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        setCopiedAsset(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <footer className="relative bg-[#0B0E14] border-t border-white/[0.05]">
      {/* ── Toast Notifications ────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="px-4 py-3 rounded-lg flex items-center space-x-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,255,157,0.15)]"
          >
            <Check className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
            <span className="text-[#00FF9D] font-mono text-xs font-bold">
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      {/* ── Ambient top glow ───────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#00FF9D]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ── Brand ──────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00FF9D] to-[#00CC7D] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)] group-hover:shadow-[0_0_25px_rgba(0,255,157,0.35)] transition-shadow">
                <Activity className="w-6 h-6 text-[#0B0E14]" />
              </div>
              <span className="text-2xl font-bold text-gray-100 tracking-tight">
                Bit<span className="text-[#00FF9D]">Pulse</span>
              </span>
            </Link>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Institutional-grade crypto intelligence platform providing
              AI-powered trading signals, portfolio management, and
              comprehensive market analysis.
            </p>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_30px_rgba(0,255,157,0.4)]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Leave a Message</span>
            </a>
          </div>

          {/* ── Products ───────────────────────────────────────────── */}
          <div>
            <h3 className="text-gray-100 font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Products
              </span>
            </h3>
            <ul className="space-y-3.5">
              <li>
                <TerminalLink to="/signals">Trading_Signals</TerminalLink>
              </li>
              <li>
                <TerminalLink to="/market-analysis">
                  Market_Analysis
                </TerminalLink>
              </li>
              <li>
                <TerminalLink to="/api-access">API_Access</TerminalLink>
              </li>
            </ul>
          </div>

          {/* ── Resources ──────────────────────────────────────────── */}
          <div>
            <h3 className="text-gray-100 font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Resources
              </span>
            </h3>
            <ul className="space-y-3.5">
              <li>
                <TerminalLink to="/documentation">Documentation</TerminalLink>
              </li>
              <li>
                <TerminalLink to="/help-center">Help_Center</TerminalLink>
              </li>
            </ul>
          </div>

          {/* ── Company ────────────────────────────────────────────── */}
          <div>
            <h3 className="text-gray-100 font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Company
              </span>
            </h3>
            <ul className="space-y-3.5">
              <li>
                <TerminalLink to="/about">About_Us</TerminalLink>
              </li>
              <li>
                <TerminalLink to="/privacy-policy">
                  Privacy_Policy
                </TerminalLink>
              </li>
              <li>
                <TerminalLink to="/terms-of-service">
                  Terms_of_Service
                </TerminalLink>
              </li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
           TIP JAR
           ══════════════════════════════════════════════════════════════ */}
        <div className="mt-14 pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h4 className="text-gray-100 font-bold mb-2 flex items-center space-x-2.5">
                <Bitcoin className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                <span className="font-mono text-xs uppercase tracking-[0.15em]">
                  Support Our Work
                </span>
              </h4>
              <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.12em]">
                Click to copy address — Cryptographic verification enabled
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tipWallets.map((wallet) => {
                const isCopied = copiedAsset === wallet.coin;
                return (
                  <button
                    key={wallet.coin}
                    onClick={() => copyToClipboard(wallet.coin, wallet.address)}
                    title={`Copy ${wallet.coin} Address`}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border font-mono transition-all duration-300 group ${
                      isCopied
                        ? 'bg-[#00FF9D]/10 border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                        : 'bg-[#151A22]/90 border-white/[0.06] hover:border-[#00FF9D]/40 hover:shadow-[0_0_20px_rgba(0,255,157,0.12)] hover:bg-[#151A22]'
                    }`}
                  >
                    {/* Coin badge */}
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isCopied ? 'text-[#00FF9D]' : 'text-gray-200'
                      }`}
                    >
                      {wallet.coin}
                    </span>
                    {/* Network */}
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                      {wallet.network}
                    </span>
                    {/* Icon */}
                    <span className="w-px h-3 bg-white/[0.06]" />
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00FF9D] transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
           BOTTOM BAR
           ══════════════════════════════════════════════════════════════ */}
        <div className="mt-12 pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <p className="text-gray-600 font-mono text-[11px] tracking-wide">
              &copy; {currentYear} BitPulse. All rights reserved.
            </p>

            {/* System Status */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D]/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
              </span>
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
                All Systems{' '}
                <span className="text-[#00FF9D] font-bold">Operational</span>
              </span>
              <span className="w-px h-3 bg-white/[0.06]" />
              <span className="font-mono text-[9px] text-gray-700 uppercase tracking-[0.12em]">
                Uptime: 99.97%
              </span>
            </div>
          </div>

          {/* ── Compliance / Risk Disclaimer ────────────────────────── */}
          <div className="mt-5 relative overflow-hidden bg-[#FF3366]/[0.04] border border-[#FF3366]/20 rounded-lg p-5 shadow-[0_0_15px_rgba(255,51,102,0.03)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3366]/[0.03] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="relative flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-[#FF3366] flex-shrink-0 mt-0.5 drop-shadow-[0_0_4px_rgba(255,51,102,0.6)]" />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-3 h-3 text-[#FF3366]/60" />
                  <span className="font-mono text-[8px] font-bold text-[#FF3366]/70 uppercase tracking-[0.2em]">
                    Regulatory Compliance Notice
                  </span>
                </div>
                <p className="font-mono text-[11px] text-gray-500 leading-relaxed">
                  <span className="text-[#FF3366] font-bold">
                    RISK_DISCLAIMER:
                  </span>{' '}
                  Cryptocurrency trading carries significant risk. Past
                  performance is not indicative of future results. BitPulse
                  provides signals for informational purposes only and does not
                  constitute financial advice. Always conduct your own research
                  and never invest more than you can afford to lose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}