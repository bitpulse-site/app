import {
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Users,
  Award,
  BrainCircuit,
  Fingerprint,
} from 'lucide-react';

const values = [
  {
    icon: Zap,
    title: 'Innovation',
    tag: 'CORE_PRINCIPLE_01',
    description:
      'We constantly push the boundaries of AI and machine learning to deliver cutting-edge trading intelligence.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    tag: 'CORE_PRINCIPLE_02',
    description:
      'Transparency and honesty guide everything we do. We never manipulate data or mislead our users.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    tag: 'CORE_PRINCIPLE_03',
    description:
      'We believe institutional-grade tools should be accessible to traders of all experience levels.',
  },
  {
    icon: TrendingUp,
    title: 'Excellence',
    tag: 'CORE_PRINCIPLE_04',
    description:
      'We strive for the highest accuracy and reliability in every signal we generate.',
  },
];

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    clearance: 'LEVEL_5',
    bio: 'Former quantitative trader at Goldman Sachs with 10+ years in crypto markets.',
  },
  {
    name: 'Sarah Williams',
    role: 'CTO & Co-Founder',
    clearance: 'LEVEL_5',
    bio: 'PhD in Machine Learning from MIT. Previously led AI teams at Google.',
  },
  {
    name: 'Michael Park',
    role: 'Head of Research',
    clearance: 'LEVEL_4',
    bio: 'Crypto analyst with background in traditional finance and blockchain development.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Lead Data Scientist',
    clearance: 'LEVEL_4',
    bio: 'Expert in time-series analysis and predictive modeling for financial markets.',
  },
];

const stats = [
  { value: '500K+', label: 'Active Users', sub: 'Global Network' },
  { value: '74%', label: 'Signal Accuracy', sub: '12-Month Avg' },
  { value: '50+', label: 'Countries', sub: 'Coverage Area' },
  { value: '24/7', label: 'Market Coverage', sub: 'Always Online' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Entity Overview &middot; Corporate Dossier
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-100 mb-6 tracking-tight">
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              BitPulse
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're building the future of crypto intelligence. Our AI-powered
            platform delivers institutional-grade trading signals to traders
            worldwide.
          </p>
        </div>

        {/* ── Mission ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl p-8 sm:p-10 mb-20 shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:border-[#00FF9D]/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF9D]/[0.02] rounded-full blur-[100px] -translate-y-16 translate-x-16 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center space-x-2 mb-5">
                <BrainCircuit className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                  Mission Statement
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-5 tracking-tight">
                Our Mission
              </h2>
              <p className="text-gray-400 mb-5 leading-loose">
                BitPulse was founded with a simple but ambitious goal: democratize
                access to institutional-grade crypto trading intelligence. We
                believe that every trader, regardless of experience or capital,
                deserves access to the same powerful tools used by Wall Street
                professionals.
              </p>
              <p className="text-gray-400 leading-loose">
                Our AI algorithms analyze millions of data points across global
                markets 24/7, identifying high-probability trading opportunities
                before they become obvious to the broader market.
              </p>
            </div>

            {/* Stats — Live System Readout */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#0B0E14]/80 border border-white/[0.06] rounded-xl p-5 text-center hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.08)] transition-all duration-300 group"
                >
                  <p className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-300 text-sm font-bold mb-1">
                    {stat.label}
                  </p>
                  <p className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.2em]">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Values ───────────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="font-mono text-[10px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
              Operational Directives
            </span>
            <h2 className="text-3xl font-bold text-gray-100 mt-2 tracking-tight">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => (
              <div
                key={value.title}
                className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/30 hover:shadow-[0_0_20px_rgba(0,255,157,0.08)] transition-all duration-300 group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00FF9D]/[0.02] rounded-full blur-2xl -translate-y-4 translate-x-4 pointer-events-none" />
                <span className="font-mono text-[8px] text-gray-700 uppercase tracking-[0.2em]">
                  {value.tag}
                </span>
                <div className="relative w-12 h-12 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mt-3 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,255,157,0.15)] transition-all">
                  <value.icon className="w-6 h-6 text-[#00FF9D]" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team — Security Clearance Badges ─────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="font-mono text-[10px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
              Personnel Dossier
            </span>
            <h2 className="text-3xl font-bold text-gray-100 mt-2 tracking-tight">
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 text-center hover:border-[#00FF9D]/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300 group"
              >
                {/* Clearance Badge */}
                <div className="absolute top-4 right-4">
                  <span className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded border bg-[#00FF9D]/10 text-[#00FF9D]/70 border-[#00FF9D]/20 shadow-[0_0_4px_rgba(0,255,157,0.1)]">
                    Clearance: {member.clearance}
                  </span>
                </div>

                <div className="w-20 h-20 bg-gradient-to-br from-[#00FF9D]/15 to-[#00CC7D]/10 border border-[#00FF9D]/20 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:shadow-[0_0_20px_rgba(0,255,157,0.12)] transition-shadow">
                  <Fingerprint className="w-8 h-8 text-[#00FF9D]/60" />
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-1 tracking-tight">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recognition ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#00FF9D]/[0.06] to-[#00FF9D]/[0.02] border border-[#00FF9D]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,157,0.05)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center space-x-2.5 mb-3">
              <Award className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
              <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                Recognized Excellence
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2 tracking-tight">
              Trusted by Traders Worldwide
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              BitPulse has been featured in CoinDesk, CoinTelegraph, and Forbes
              as a leading crypto intelligence platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}