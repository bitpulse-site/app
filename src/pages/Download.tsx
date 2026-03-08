import { useState } from 'react';
import {
  Apple,
  Smartphone,
  Monitor,
  Check,
  Download as DownloadIcon,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════ */

const features = [
  'Real-time trading signals and alerts',
  'Portfolio tracking across multiple exchanges',
  'Advanced charting with 100+ indicators',
  'Price alerts and push notifications',
  'News aggregation and sentiment analysis',
  'Secure biometric authentication',
  'Dark mode and customizable themes',
  'Offline mode for saved articles',
];

const testimonials = [
  {
    name: 'Michael Chen',
    callsign: 'MC_ALPHA',
    role: 'Professional Trader',
    content:
      'BitPulse has completely transformed how I trade. The real-time signals are incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Sarah Williams',
    callsign: 'SW_QUANT',
    role: 'Crypto Investor',
    content:
      'The best crypto app I have ever used. Clean interface and powerful features.',
    rating: 5,
  },
  {
    name: 'David Park',
    callsign: 'DP_INST',
    role: 'Portfolio Manager',
    content:
      'Essential tool for anyone serious about crypto. The research section is gold.',
    rating: 5,
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Download() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0E14] pt-28 pb-16 overflow-hidden">
      {/* ── Ambient Orbs ───────────────────────────────────────────── */}
      <div className="absolute top-[8%] left-[20%] w-[600px] h-[600px] bg-[#00FF9D]/[0.04] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[45%] right-[10%] w-[500px] h-[500px] bg-[#00CC7D]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[30%] w-[400px] h-[400px] bg-[#FF3366]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF9D]/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
            </span>
            <span className="text-[#00FF9D] font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
              Now Available
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 tracking-tight">
            Trade Smarter with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              BitPulse
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Download our mobile app to access real-time trading signals,
            portfolio tracking, and institutional-grade market analysis on the
            go.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="flex items-center space-x-3 px-8 py-4 bg-gray-100 text-[#0B0E14] rounded-xl font-semibold hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] w-full sm:w-auto justify-center group">
              <Apple className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                  Download on the
                </p>
                <p className="text-lg leading-none font-bold">App Store</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 px-8 py-4 bg-[#151A22] border border-white/10 text-gray-100 rounded-xl font-semibold hover:bg-[#1A1F2A] hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all w-full sm:w-auto justify-center group">
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                  Get it on
                </p>
                <p className="text-lg leading-none font-bold">Google Play</p>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                500K+
              </p>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                Downloads
              </p>
            </div>
            <div className="w-px h-12 bg-white/[0.06] hidden sm:block" />
            <div>
              <p className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                4.9
              </p>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                App Store Rating
              </p>
            </div>
            <div className="w-px h-12 bg-white/[0.06] hidden sm:block" />
            <div>
              <p className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                50+
              </p>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.15em] mt-1">
                Countries
              </p>
            </div>
          </div>
        </div>

        {/* ── Feature Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            {
              icon: Zap,
              tag: 'MODULE_01',
              title: 'Real-Time Signals',
              desc: 'AI-powered trading signals delivered instantly to your device',
            },
            {
              icon: Shield,
              tag: 'MODULE_02',
              title: 'Bank-Grade Security',
              desc: 'Biometric auth and encrypted data storage',
            },
            {
              icon: Monitor,
              tag: 'MODULE_03',
              title: 'Advanced Charts',
              desc: 'Professional charting with 100+ technical indicators',
            },
            {
              icon: Smartphone,
              tag: 'MODULE_04',
              title: 'Cross-Platform',
              desc: 'Sync your data across all your devices seamlessly',
            },
          ].map((card) => (
            <div
              key={card.tag}
              className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/30 hover:shadow-[0_0_20px_rgba(0,255,157,0.08)] transition-all duration-300 group"
            >
              <span className="absolute top-3 right-3 font-mono text-[7px] text-gray-700 uppercase tracking-[0.2em]">
                {card.tag}
              </span>
              <div className="w-12 h-12 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,255,157,0.15)] transition-all">
                <card.icon className="w-6 h-6 text-[#00FF9D]" />
              </div>
              <h3 className="text-base font-bold text-gray-100 mb-2 tracking-tight">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Features + Phone Mockup ──────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl p-8 mb-16 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#00FF9D]/[0.02] rounded-full blur-[100px] -translate-y-16 translate-x-16 pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Features list */}
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-6">
                <Activity className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                  Feature Set
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight">
                Everything You Need
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-[#00FF9D]/60 flex-shrink-0 shadow-[0_0_4px_rgba(0,255,157,0.5)]" />
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Futuristic phone mockup */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Phone shell glow */}
                <div className="absolute inset-0 bg-[#00FF9D]/[0.03] rounded-[3rem] blur-2xl pointer-events-none" />

                <div className="relative w-64 h-[500px] bg-gradient-to-b from-[#0F1318] to-[#0B0E14] border-2 border-white/[0.08] rounded-[3rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_2px_rgba(0,255,157,0.1)]">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#0B0E14] rounded-b-2xl border-x border-b border-white/[0.04]">
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-800 border border-gray-700" />
                  </div>

                  <div className="p-5 pt-10 h-full flex flex-col gap-3">
                    {/* Status bar */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#00FF9D]/20 to-[#00CC7D]/10 border border-[#00FF9D]/20 rounded-lg flex items-center justify-center">
                          <Activity className="w-3.5 h-3.5 text-[#00FF9D]" />
                        </div>
                        <span className="font-mono text-[9px] text-gray-500 font-bold">
                          BitPulse
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#00FF9D] shadow-[0_0_3px_rgba(0,255,157,0.6)]" />
                        <span className="font-mono text-[7px] text-gray-600">
                          LIVE
                        </span>
                      </div>
                    </div>

                    {/* Signal card */}
                    <div className="bg-[#00FF9D]/[0.06] border border-[#00FF9D]/20 rounded-xl p-3.5 shadow-[0_0_10px_rgba(0,255,157,0.05)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3 text-[#00FF9D]" />
                          <span className="font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-wider">
                            BTC/USDT
                          </span>
                        </div>
                        <span className="font-mono text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/20 shadow-[0_0_4px_rgba(0,255,157,0.2)]">
                          Strong Buy
                        </span>
                      </div>
                      <p className="text-gray-100 font-mono text-sm font-bold">
                        $67,250.00
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono text-[8px] text-[#00FF9D]">
                          TP $72,500
                        </span>
                        <span className="font-mono text-[8px] text-gray-600">
                          |
                        </span>
                        <span className="font-mono text-[8px] text-[#FF3366]">
                          SL $64,800
                        </span>
                      </div>
                    </div>

                    {/* Portfolio card */}
                    <div className="bg-[#151A22]/90 border border-white/[0.06] rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                          Portfolio
                        </span>
                        <span className="font-mono text-[9px] font-bold text-[#00FF9D] drop-shadow-[0_0_3px_rgba(0,255,157,0.5)]">
                          +12.5%
                        </span>
                      </div>
                      <p className="text-gray-100 font-mono text-lg font-bold">
                        $124,532
                      </p>
                      {/* Mini bar chart */}
                      <div className="flex items-end gap-[2px] mt-2 h-6">
                        {[40, 55, 35, 60, 50, 70, 65, 80, 75, 90, 85, 95].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-[#00FF9D]/30 rounded-t-[1px]"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* Ticker rows */}
                    <div className="bg-[#151A22]/90 border border-white/[0.06] rounded-xl p-3 space-y-2">
                      {[
                        { pair: 'ETH/USDT', price: '$3,450.50', change: '+1.82%', up: true },
                        { pair: 'SOL/USDT', price: '$145.20', change: '-0.95%', up: false },
                      ].map((t) => (
                        <div
                          key={t.pair}
                          className="flex items-center justify-between"
                        >
                          <span className="font-mono text-[9px] text-gray-400 font-bold">
                            {t.pair}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-gray-200 font-bold">
                              {t.price}
                            </span>
                            <span
                              className={`font-mono text-[8px] font-bold ${
                                t.up
                                  ? 'text-[#00FF9D] drop-shadow-[0_0_3px_rgba(0,255,157,0.5)]'
                                  : 'text-[#FF3366] drop-shadow-[0_0_3px_rgba(255,51,102,0.5)]'
                              }`}
                            >
                              {t.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom nav dots */}
                    <div className="mt-auto flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Testimonials — Client Intel Logs ─────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="font-mono text-[10px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
              Client Intelligence Logs
            </span>
            <h2 className="text-3xl font-bold text-gray-100 mt-2 tracking-tight">
              Loved by Traders Worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300"
              >
                <span className="absolute top-4 right-4 font-mono text-[7px] text-gray-700 uppercase tracking-[0.2em]">
                  [{testimonial.callsign}]
                </span>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#00FF9D] fill-[#00FF9D] drop-shadow-[0_0_3px_rgba(0,255,157,0.4)]"
                    />
                  ))}
                </div>
                <p className="text-gray-400 mb-5 text-sm leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-mono text-sm font-bold text-gray-100">
                    {testimonial.name}
                  </p>
                  <p className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.15em]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Newsletter ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#00FF9D]/[0.06] to-[#00FF9D]/[0.02] border border-[#00FF9D]/20 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(0,255,157,0.05)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">
              Get Notified of Updates
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-mono text-sm">
              Subscribe to receive notifications about new features, trading
              signals, and market insights.
            </p>

            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2.5">
                <Check className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                <span className="text-[#00FF9D] font-mono text-sm font-bold">
                  [SUBSCRIBED] Thanks for joining!
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 px-5 py-3.5 bg-[#0B0E14] border border-white/10 rounded-lg font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.15)] transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>&gt; Notify_Me</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

          {/* ═══════════════════════════════════════════════════════════════════
    OVERLAY 2: APP DOWNLOAD — MOBILE PAYLOAD COMPILATION
    ═══════════════════════════════════════════════════════════════════ */}
<div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-xl">
  {/* Ambient orbs */}
  <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-[#00FF9D]/[0.03] rounded-full blur-[150px] pointer-events-none" />
  <div className="absolute bottom-[15%] left-[20%] w-[350px] h-[350px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

  {/* Main card */}
  <div className="relative bg-[#0F1318]/95 border border-[#00FF9D]/20 rounded-2xl p-8 sm:p-10 text-center max-w-lg mx-4 shadow-[0_0_60px_rgba(0,255,157,0.1),0_0_120px_rgba(0,255,157,0.05)] backdrop-blur-md">
    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00FF9D]/40 rounded-tl-2xl" />
    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00FF9D]/40 rounded-tr-2xl" />
    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00FF9D]/40 rounded-bl-2xl" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00FF9D]/40 rounded-br-2xl" />

    {/* Classification badge */}
    <div className="flex items-center justify-center gap-2 mb-7">
      <span className="w-1 h-1 rounded-full bg-[#FF3366] shadow-[0_0_4px_rgba(255,51,102,0.8)] animate-pulse" />
      <span className="font-mono text-[9px] font-bold text-[#FF3366]/80 uppercase tracking-[0.25em]">
        [Classified]
      </span>
      <span className="font-mono text-[9px] text-gray-700">&middot;</span>
      <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
        Build: Mobile_Terminal
      </span>
    </div>

    {/* Radar icon — Smartphone / Fingerprint */}
    <div className="relative w-20 h-20 mx-auto mb-7">
      <span className="absolute inset-0 rounded-full bg-[#00FF9D]/10 animate-ping" style={{ animationDuration: '2.5s' }} />
      <span className="absolute inset-2 rounded-full bg-[#00FF9D]/[0.06] animate-pulse" />
      <span className="absolute inset-4 rounded-full border border-[#00FF9D]/15 animate-pulse" style={{ animationDuration: '1.5s' }} />
      <div className="relative w-20 h-20 bg-[#00FF9D]/[0.08] border border-[#00FF9D]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,157,0.15)]">
        <svg
          className="w-8 h-8 text-[#00FF9D] drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
      </div>
    </div>

    {/* Title */}
    <h3 className="font-mono text-lg sm:text-xl font-bold uppercase tracking-[0.12em] mb-1.5">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
        Mobile Payload Compiling
      </span>
    </h3>
    <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-6">
      Quantum Terminal Build Pipeline Active
    </p>

    {/* Terminal boot sequence — Mobile themed */}
    <div className="bg-[#050508] border border-white/[0.04] rounded-lg p-4 mb-6 text-left shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-white/[0.04]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366]/70" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]/50" />
        <span className="font-mono text-[8px] text-gray-700 ml-2 uppercase tracking-wider">
          sys.mobile.compiler v3.1.0
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-[10px] leading-relaxed">
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Initiating biometric encryption</span>{' '}
          <span className="text-[#00FF9D] font-bold">[OK]</span>
        </p>
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Packing native iOS binary (arm64)</span>{' '}
          <span className="text-[#00FF9D] font-bold">[OK]</span>
        </p>
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Compiling Android APK (v14+)</span>{' '}
          <span className="text-[#00FF9D] font-bold">[OK]</span>
        </p>
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Signing certificates (SHA-512)</span>{' '}
          <span className="text-[#00FF9D] font-bold">[OK]</span>
        </p>
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Establishing App Store bridge</span>{' '}
          <span className="text-cyan-400 font-bold">[99%]</span>
        </p>
        <p>
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-400">Play Store review pipeline</span>{' '}
          <span className="text-yellow-400 font-bold animate-pulse">
            [IN REVIEW]
          </span>
        </p>
        <p className="pt-1">
          <span className="text-[#00FF9D]">&gt;</span>{' '}
          <span className="text-gray-600">
            Awaiting cryptographic signing ceremony...
          </span>
          <span className="inline-block w-1.5 h-3.5 bg-[#00FF9D]/70 ml-1 animate-pulse" />
        </p>
      </div>
    </div>

    {/* Progress bar — 98% */}
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.15em]">
          Build Compilation
        </span>
        <span className="font-mono text-[11px] font-bold text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]">
          98%
        </span>
      </div>
      <div className="relative h-2 bg-[#050508] rounded-full overflow-hidden border border-white/[0.04]">
        <div
          className="absolute inset-y-0 left-0 rounded-full shadow-[0_0_10px_rgba(0,255,157,0.4)]"
          style={{
            width: '98%',
            background:
              'repeating-linear-gradient(110deg, #00FF9D 0px, #00FF9D 4px, #00CC7D 4px, #00CC7D 8px)',
            backgroundSize: '16px 100%',
            animation: 'mobile-stripe-scroll 1s linear infinite',
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-4 rounded-full blur-sm"
          style={{
            left: 'calc(98% - 8px)',
            background:
              'linear-gradient(90deg, transparent, rgba(0,255,157,0.6))',
          }}
        />
      </div>
      <style>{`
        @keyframes mobile-stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 16px 0; }
        }
      `}</style>
    </div>

    {/* Subtext */}
    <p className="text-gray-500 text-sm leading-relaxed mb-4">
      The mobile quantum terminal is in the final stages of app store review
      and cryptographic signing. Standby for launch.
    </p>

    {/* Bottom meta */}
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/[0.04]">
      <span className="flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-gray-400 shadow-[0_0_4px_rgba(156,163,175,0.6)] animate-pulse" />
        <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
          iOS: In Review
        </span>
      </span>
      <span className="font-mono text-[8px] text-gray-700">&middot;</span>
      <span className="flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-gray-400 shadow-[0_0_4px_rgba(156,163,175,0.6)] animate-pulse" />
        <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
          Android: In Review
        </span>
      </span>
      <span className="font-mono text-[8px] text-gray-700">&middot;</span>
      <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
        ETA: Q2 2026
      </span>
    </div>
  </div>
</div>

    </div>
  );
}