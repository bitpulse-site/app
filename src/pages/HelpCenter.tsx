import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Mail,
  FileQuestion,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Wallet,
  Terminal,
  Database,
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  tag: string;
  icon: React.ElementType;
  questions: FAQItem[];
}

const faqs: FAQCategory[] = [
  {
    category: 'Getting Started',
    tag: 'MODULE_ONBOARD',
    icon: Zap,
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the profile icon in the top navigation and select "Register". Enter a username and password (must be 8+ characters with uppercase, lowercase, number, and symbol).',
      },
      {
        q: 'Is BitPulse free to use?',
        a: 'Yes! Our basic trading signals are free. We also offer premium API access for developers and power users.',
      },
      {
        q: 'What cryptocurrencies do you support?',
        a: 'We currently support major pairs including BTC/USDT, ETH/USDT, SOL/USDT, XRP/USDT, BNB/USDT, and many more.',
      },
    ],
  },
  {
    category: 'Trading Signals',
    tag: 'MODULE_SIGNALS',
    icon: TrendingUp,
    questions: [
      {
        q: 'How accurate are your signals?',
        a: 'Our AI algorithms have maintained an average accuracy of 74% over the past 12 months. However, past performance does not guarantee future results.',
      },
      {
        q: 'What does the confidence score mean?',
        a: 'The confidence score (0-100%) indicates how strongly our AI believes in the signal. Higher scores generally indicate higher probability trades.',
      },
      {
        q: 'How often are signals updated?',
        a: 'Signals are generated in real-time as market conditions change. Most signals are valid for their specified timeframe (4H, 1D, 1W).',
      },
      {
        q: 'Can I customize stop loss and take profit?',
        a: 'Yes! When taking a trade, you can choose to use AI-recommended targets or set your own custom levels.',
      },
    ],
  },
  {
    category: 'Portfolio & Trades',
    tag: 'MODULE_PORTFOLIO',
    icon: Wallet,
    questions: [
      {
        q: 'How do I track my trades?',
        a: 'Use the Portfolio page to view all your active and closed trades, monitor P&L in real-time, and see your trading statistics.',
      },
      {
        q: 'What is the Live P&L feature?',
        a: 'Live P&L shows your unrealized profit/loss updating every 3 seconds based on current market prices.',
      },
      {
        q: 'Can I close a trade early?',
        a: 'Yes, you can close any active trade at any time from your Portfolio page.',
      },
    ],
  },
  {
    category: 'Security',
    tag: 'MODULE_SECURITY',
    icon: Shield,
    questions: [
      {
        q: 'Is my account secure?',
        a: 'We use industry-standard encryption and security practices. Your password is never stored in plain text.',
      },
      {
        q: 'What is the session lock feature?',
        a: "For your security, your session will automatically lock after 10 minutes of inactivity. You'll need to re-enter your password to continue.",
      },
      {
        q: 'How do I change my password?',
        a: "Go to your Profile settings and select \"Change Password\". You'll need to enter your current password first.",
      },
    ],
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    'Getting Started'
  );
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const displayFaqs = searchQuery ? filteredFaqs : faqs;

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center space-x-3 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Knowledge Base &middot; System Documentation
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 tracking-tight">
            Help{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              Center
            </span>
          </h1>
          <p className="text-lg text-gray-500 font-mono text-sm">
            Query the knowledge base for answers
          </p>
        </div>

        {/* ── Terminal Query Input ──────────────────────────────────── */}
        <div className="relative mb-14">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00FF9D]/50" />
            <span className="font-mono text-[10px] text-[#00FF9D]/40 uppercase tracking-wider">
              Query &gt;
            </span>
          </div>
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-28 pr-4 py-4 bg-[#151A22]/90 border border-white/[0.06] rounded-xl font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#00FF9D]/40 focus:shadow-[0_0_20px_rgba(0,255,157,0.1)] transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
        </div>

        {/* ── Contact Options ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          <Link
            to="/contact"
            className="flex items-center space-x-4 p-5 bg-[#151A22]/90 border border-white/5 rounded-xl hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300 group"
          >
            <div className="w-11 h-11 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(0,255,157,0.15)] transition-shadow">
              <Mail className="w-5 h-5 text-[#00FF9D]" />
            </div>
            <div>
              <p className="text-gray-100 font-bold text-sm tracking-tight">
                Email Support
              </p>
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.12em]">
                Response: 24-48h
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-700 ml-auto group-hover:text-[#00FF9D] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/documentation"
            className="flex items-center space-x-4 p-5 bg-[#151A22]/90 border border-white/5 rounded-xl hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300 group"
          >
            <div className="w-11 h-11 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(0,255,157,0.15)] transition-shadow">
              <FileQuestion className="w-5 h-5 text-[#00FF9D]" />
            </div>
            <div>
              <p className="text-gray-100 font-bold text-sm tracking-tight">
                Documentation
              </p>
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.12em]">
                Detailed System Guides
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-700 ml-auto group-hover:text-[#00FF9D] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* ── FAQs — Expandable Data Modules ───────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-6">
            <Database className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
            <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
              Frequently Asked Questions
            </span>
            <span className="font-mono text-[9px] text-gray-700 ml-auto">
              {faqs.reduce((s, c) => s + c.questions.length, 0)} entries
            </span>
          </div>

          {displayFaqs.map((category) => {
            const isOpen = expandedCategory === category.category;
            return (
              <div
                key={category.category}
                className={`bg-[#151A22]/90 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 border ${
                  isOpen
                    ? 'border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.06)]'
                    : 'border-white/[0.04] hover:border-white/10'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedCategory(isOpen ? null : category.category)
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isOpen
                          ? 'bg-[#00FF9D]/15 border border-[#00FF9D]/30 shadow-[0_0_8px_rgba(0,255,157,0.15)]'
                          : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}
                    >
                      <category.icon
                        className={`w-4 h-4 transition-colors ${
                          isOpen ? 'text-[#00FF9D]' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-gray-100 font-bold text-sm">
                        {category.category}
                      </span>
                      <span className="block font-mono text-[8px] text-gray-600 uppercase tracking-[0.15em]">
                        {category.tag} &middot; {category.questions.length}{' '}
                        entries
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#00FF9D]' : ''
                    }`}
                  />
                </button>

                {/* Questions */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-white/[0.04]">
                    {category.questions.map((item, index) => {
                      const qKey = `${category.category}-${index}`;
                      const qOpen = expandedQuestion === qKey;
                      return (
                        <div
                          key={index}
                          className={`border-b border-white/[0.03] last:border-b-0 transition-colors ${
                            qOpen ? 'bg-white/[0.01]' : ''
                          }`}
                        >
                          <button
                            onClick={() =>
                              setExpandedQuestion(qOpen ? null : qKey)
                            }
                            className="w-full flex items-center justify-between p-4 pl-6 hover:bg-white/[0.02] transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-1 h-1 rounded-full flex-shrink-0 transition-all ${
                                  qOpen
                                    ? 'bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.6)]'
                                    : 'bg-gray-700'
                                }`}
                              />
                              <span
                                className={`text-sm transition-colors ${
                                  qOpen ? 'text-gray-100' : 'text-gray-400'
                                }`}
                              >
                                {item.q}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-600 flex-shrink-0 ml-4 transition-transform duration-200 ${
                                qOpen ? 'rotate-180 text-[#00FF9D]/60' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-200 ${
                              qOpen
                                ? 'max-h-[500px] opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-6 pb-4 pl-10">
                              <p className="text-gray-500 text-sm leading-loose">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty search */}
          {searchQuery && filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <Terminal className="w-10 h-10 text-gray-800 mx-auto mb-4" />
              <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.15em] mb-1">
                [ No Results ]
              </p>
              <p className="font-mono text-[10px] text-gray-700">
                No entries found for "{searchQuery}" —{' '}
                <Link
                  to="/contact"
                  className="text-[#00FF9D]/60 hover:text-[#00FF9D] transition-colors"
                >
                  Contact support
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* ── Still Need Help ──────────────────────────────────────── */}
        <div className="mt-14 relative overflow-hidden bg-gradient-to-r from-[#00FF9D]/[0.06] to-[#00FF9D]/[0.02] border border-[#00FF9D]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,157,0.05)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-2 tracking-tight">
                Still need help?
              </h3>
              <p className="text-gray-400 text-sm">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)] whitespace-nowrap"
            >
              <span>&gt; Execute: Contact_Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}