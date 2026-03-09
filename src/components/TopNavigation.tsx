import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Activity,
  User,
  LogOut,
  History,
  Briefcase,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Fuel,
  Radio,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface TickerData {
  bitcoin: { usd: number; usd_24h_change: number };
  ethereum: { usd: number; usd_24h_change: number };
  solana: { usd: number; usd_24h_change: number };
  ripple: { usd: number; usd_24h_change: number };
  binancecoin: { usd: number; usd_24h_change: number };
}

const fallbackPrices: TickerData = {
  bitcoin: { usd: 67250.0, usd_24h_change: 2.45 },
  ethereum: { usd: 3450.5, usd_24h_change: 1.82 },
  solana: { usd: 145.2, usd_24h_change: -0.95 },
  ripple: { usd: 0.542, usd_24h_change: -2.15 },
  binancecoin: { usd: 585.0, usd_24h_change: 0.75 },
};

/* ═══════════════════════════════════════════════════════════════════════
   TICKER ITEM
   ═══════════════════════════════════════════════════════════════════════ */

interface TickerItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const TickerItem = ({ symbol, name, price, change }: TickerItemProps) => {
  const isPositive = change >= 0;

  return (
    <div
      id={`ticker-${symbol.toLowerCase()}`}
      data-testid={`ticker-${symbol.toLowerCase()}`}
      className="flex items-center gap-2.5 px-4 py-2 border-r border-white/[0.06] min-w-fit"
    >
      <span className="text-gray-400 font-bold font-mono text-[11px] uppercase tracking-wider">
        {name}
      </span>
      <span
        id={`ticker-${symbol.toLowerCase()}-price`}
        data-testid={`ticker-price-${symbol.toLowerCase()}`}
        className="text-white font-mono text-[12px] font-bold"
      >
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: price < 1 ? 4 : 2,
        }).format(price)}
      </span>
      <span
        id={`ticker-${symbol.toLowerCase()}-change`}
        data-change-direction={isPositive ? 'positive' : 'negative'}
        className={`flex items-center gap-0.5 font-mono text-[11px] font-bold ${
          isPositive
            ? 'text-[#00FF9D] drop-shadow-[0_0_5px_rgba(0,255,157,0.8)]'
            : 'text-[#FF3366] drop-shadow-[0_0_5px_rgba(255,51,102,0.8)]'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {isPositive ? '+' : ''}
        {change.toFixed(2)}%
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function TopNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [isApiHealthy, setIsApiHealthy] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, userProfile, logout, isSocketConnected, socketError } = useGlobal();

  // ── Scroll glassmorphism trigger ────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── NetPub smooth scroll ────────────────────────────────────────────
  useEffect(() => {
    if (tickerRef.current) {
      const ticker = tickerRef.current;
      let scrollAmount = 0;
      const scrollSpeed = 0.5;

      const scroll = () => {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= ticker.scrollWidth / 2) {
          scrollAmount = 0;
        }
        ticker.scrollLeft = scrollAmount;
      };

      const animationId = setInterval(scroll, 30);
      return () => clearInterval(animationId);
    }
  }, [tickerData]);

// ── Updated Market Data Fetch (via Backend Proxy) ───────────────────
  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        // Use your relative backend route to avoid CORS
        const response = await fetch('/api/prices'); 
        if (response.ok) {
          const data = await response.json();
          setTickerData(data);
          setIsApiHealthy(true);
        } else {
          setTickerData(fallbackPrices);
          setIsApiHealthy(false);
        }
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
        setTickerData(fallbackPrices);
        setIsApiHealthy(false);
      }
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, []);

  // ── Pulse Indicator Logic ──────────────────────────────────────────
  const getMarketPulse = () => {
    if (!tickerData) return { label: 'Syncing', color: 'text-gray-500' };
    const changes = [
      tickerData.bitcoin?.usd_24h_change || 0,
      tickerData.ethereum?.usd_24h_change || 0,
      tickerData.solana?.usd_24h_change || 0
    ];
    const average = changes.reduce((a, b) => a + b, 0) / changes.length;
    
    if (average > 1) return { label: 'Bullish Pulse', color: 'text-[#00FF9D]', glow: 'shadow-[0_0_10px_rgba(0,255,157,0.5)]' };
    if (average < -1) return { label: 'Bearish Pulse', color: 'text-[#FF3366]', glow: 'shadow-[0_0_10px_rgba(255,51,102,0.5)]' };
    return { label: 'Neutral Pulse', color: 'text-gray-400', glow: '' };
  };
  const pulse = getMarketPulse();

  // ── Close profile on outside click ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────
  const tickerItems = [
    { id: 'bitcoin', name: 'BTC', key: 'bitcoin' as const },
    { id: 'ethereum', name: 'ETH', key: 'ethereum' as const },
    { id: 'solana', name: 'SOL', key: 'solana' as const },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/signals';
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const displayData = tickerData || fallbackPrices;

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <header
      id="top-navigation"
      data-testid="top-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          to="/"
          id="nav-home"
          className="flex items-center space-x-3 flex-shrink-0 group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#00FF9D] to-[#00CC7D] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)] group-hover:shadow-[0_0_25px_rgba(0,255,157,0.35)] transition-shadow">
            <Activity className="w-5 h-5 text-[#0B0E14]" />
          </div>
          <span className="text-xl font-bold text-gray-100 tracking-tight">
            Bit<span className="text-[#00FF9D]">Pulse</span>
          </span>
        </Link>

        {/* ── Cyberpunk Live Ticker ─────────────────────────────────── */}
        <div
          id="live-ticker-container"
          data-testid="live-ticker-container"
          className="hidden lg:flex items-center overflow-hidden bg-[#151A22]/90 backdrop-blur-xl border border-white/[0.06] rounded-lg ml-6 flex-1 max-w-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        >
          {/* LIVE badge */}
          <div className="px-3 py-2 bg-[#00FF9D]/10 border-r border-white/[0.06] flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D]/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
            </span>
            <span className="text-[#00FF9D] font-mono text-[9px] font-bold uppercase tracking-[0.15em]">
              Live
            </span>
          </div>

          {/* Scrolling ticker */}
          <div ref={tickerRef} className="flex overflow-hidden">
            {tickerItems.map((item) => (
              <TickerItem
                key={item.key}
                symbol={item.id}
                name={item.name}
                price={displayData[item.key].usd}
                change={displayData[item.key].usd_24h_change}
              />
            ))}
            {tickerItems.map((item) => (
              <TickerItem
                key={`${item.key}-dup`}
                symbol={item.id}
                name={item.name}
                price={displayData[item.key].usd}
                change={displayData[item.key].usd_24h_change}
              />
            ))}
          </div>
        </div>

        {/* ── Right Side ───────────────────────────────────────────── */}
        <div className="flex items-center gap-4 ml-6">

          {/* Live Socket Status Widget */}
          <div
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md"
            title={socketError || 'Bot Feed Connected'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSocketConnected
                  ? 'bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]'
                  : 'bg-[#FF3366] shadow-[0_0_6px_rgba(255,51,102,0.8)]'
              }`}
            />
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
              Feed:{' '}
              <span
                className={
                  isSocketConnected
                    ? 'text-[#00FF9D] font-bold'
                    : 'text-[#FF3366] font-bold'
                }
              >
                {isSocketConnected ? 'Live' : 'Offline'}
              </span>
            </span>
          </div>

          {/* Scan Rate / Engine Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#151A22]/80 border border-white/[0.06] rounded-lg backdrop-blur-md">
            <Fuel className="w-3 h-3 text-cyan-400/70" />
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
              Scan Rate:{' '}
              <span className="text-cyan-400 font-bold">300s</span>
            </span>
            <span className="w-px h-3 bg-white/[0.06]" />
            <Radio className="w-3 h-3 text-[#00FF9D]/60 animate-pulse" />
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.12em]">
              Engine:{' '}
              <span className="text-[#00FF9D] font-bold">Active</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav
            id="nav-links"
            data-testid="nav-links"
            className="hidden md:flex items-center gap-1"
          >
            {[
              { to: '/', label: 'Home', activePath: '/Home' },
              { to: '/signals', label: 'Signals', activePath: '/signals' },
              { to: '/articles', label: 'Articles', activePath: '/articles', id: 'nav-articles' },
              { to: '/market-analysis', label: 'Analysis', activePath: '/market-analysis' },
              {/*{ to: '/signal-history', label: 'History', activePath: '/signal-history' },*/}
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                id={link.id}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                  isActive(link.activePath)
                    ? 'text-[#00FF9D] bg-[#00FF9D]/[0.08]'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-100 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Dropdown
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all duration-200 ${
                isLoggedIn
                  ? 'border-[#00FF9D]/20 hover:border-[#00FF9D]/40 hover:shadow-[0_0_10px_rgba(0,255,157,0.08)]'
                  : 'border-white/[0.06] hover:border-[#00FF9D]/30 hover:shadow-[0_0_10px_rgba(0,255,157,0.06)]'
              } bg-[#151A22]/60 backdrop-blur-md`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  isLoggedIn
                    ? 'bg-[#00FF9D]/15 border border-[#00FF9D]/30'
                    : 'bg-white/[0.04] border border-white/10'
                }`}
              >
                <User
                  className={`w-3.5 h-3.5 ${
                    isLoggedIn ? 'text-[#00FF9D]' : 'text-gray-500'
                  }`}
                />
              </div>
              {isLoggedIn && userProfile && (
                <span className="hidden sm:block font-mono text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  {userProfile.username}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
            </button>

            {/* Dropdown 
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#151A22]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                {!isLoggedIn ? (
                  <div className="py-2">
                    <Link
                      to="/?login=true"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-[#00FF9D]/[0.04] transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-md bg-[#00FF9D]/10 border border-[#00FF9D]/20 flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(0,255,157,0.15)] transition-shadow">
                          <User className="w-4 h-4 text-[#00FF9D]" />
                        </div>
                        <div>
                          <span className="block font-bold text-gray-100 text-sm">
                            Log In
                          </span>
                          <span className="block font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
                            Secure Auth
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/?register=true"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-[#00FF9D]/[0.04] transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-[#00FF9D]/30 transition-colors">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="block font-bold text-gray-100 text-sm">
                            Register
                          </span>
                          <span className="block font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
                            Create Account
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="py-2">
                    {/* User header
                    <div className="px-4 py-3 border-b border-white/[0.05]">
                      <p className="text-gray-100 font-bold text-sm">
                        {userProfile?.username}
                      </p>
                      <p className="font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.15em]">
                        {userProfile?.role === 'admin'
                          ? 'Administrator'
                          : 'Member'}
                      </p>
                    </div>
                    <Link
                      to="/portfolio"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-4 h-4 text-gray-500 group-hover:text-[#00FF9D] transition-colors" />
                        <span className="font-medium text-gray-300 text-sm group-hover:text-gray-100 transition-colors">
                          Portfolio
                        </span>
                      </div>
                    </Link>
                    <Link
                      to="/signal-history"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <History className="w-4 h-4 text-gray-500 group-hover:text-[#00FF9D] transition-colors" />
                        <span className="font-medium text-gray-300 text-sm group-hover:text-gray-100 transition-colors">
                          Signal History
                        </span>
                      </div>
                    </Link>

                    <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#00FF9D] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                        <span className="font-medium text-gray-300 text-sm group-hover:text-gray-100 transition-colors">
                          Terminal Settings
                        </span>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#FF3366]/[0.04] transition-colors border-t border-white/[0.05] group"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="w-4 h-4 text-[#FF3366]" />
                        <span className="font-medium text-[#FF3366] text-sm">
                          Log Out
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>*/}

      {/* ── Mobile Menu ────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B0E14]/95 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile ticker */}
            <div className="flex items-center space-x-4 pb-4 mb-2 border-b border-white/[0.05] overflow-x-auto">
              {tickerItems.map((item) => {
                const d = displayData[item.key];
                const pos = d.usd_24h_change >= 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-1.5 flex-shrink-0"
                  >
                    <span className="text-gray-500 font-mono text-[10px] font-bold">
                      {item.name}
                    </span>
                    <span className="text-gray-200 font-mono text-[10px] font-bold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: d.usd < 1 ? 4 : 2,
                      }).format(d.usd)}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        pos
                          ? 'text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]'
                          : 'text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.6)]'
                      }`}
                    >
                      {pos ? '+' : ''}
                      {d.usd_24h_change.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {[
              { to: '/', label: 'Home', path: '/' },
              { to: '/signals', label: 'Signals', path: '/signals' },
              {/*{ to: '/signal-history', label: 'Signal History', path: '/signal-history' },*/}
              { to: '/articles', label: 'Articles', path: '/articles' },
              { to: '/market-analysis', label: 'Analysis', path: '/market-analysis' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider ${
                  isActive(link.path)
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D]'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/*{isLoggedIn ? (
              <>
                <Link
                  to="/portfolio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-100 hover:bg-white/[0.03]"
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-[#FF3366] hover:bg-[#FF3366]/[0.04]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/?login=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#00FF9D] hover:bg-[#00FF9D]/[0.04]"
                >
                  Log In
                </Link>
                <Link
                  to="/?register=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-100 hover:bg-white/[0.03]"
                >
                  Register
                </Link>
              </>
            )}*/}

            {/* Mobile Feed Status */}
            <div className="flex items-center space-x-2 px-3 py-3 pt-3 border-t border-white/[0.05] mt-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isSocketConnected
                    ? 'bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]'
                    : 'bg-[#FF3366] shadow-[0_0_6px_rgba(255,51,102,0.8)]'
                }`}
              />
              <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.15em]">
                Feed: {isSocketConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}