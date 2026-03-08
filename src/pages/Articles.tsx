import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Filter,
  TrendingUp,
  Mail,
  Hash,
  Clock,
  Sparkles,
  FileText,
  ChevronRight,
} from 'lucide-react';
import articlesData from '../data/articles';

const categories = [
  'All',
  'Institutional',
  'AI Trading',
  'Regulation',
  'Layer 2',
  'Layer 1',
  'Technology',
  'Tokenomics',
  'DeFi',
  'NFTs',
  'Bitcoin',
];

const trendingTopics = [
  '#LiquidStaking',
  '#MEV',
  '#AccountAbstraction',
  '#ZKProofs',
  '#RestakingMeta',
  '#BTCETFFlows',
  '#OnChainAlpha',
  '#DePIN',
  '#RWA',
  '#ParallelEVM',
];

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bitpulse_bookmarks');
    if (saved) {
      try {
        setBookmarkedArticles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bitpulse_bookmarks', JSON.stringify(bookmarkedArticles));
  }, [bookmarkedArticles]);

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles((prev) => {
      if (prev.includes(articleId)) {
        return prev.filter((id) => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  const filteredArticles = articlesData.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSaved =
      !showSavedOnly || bookmarkedArticles.includes(article.id);
    return matchesCategory && matchesSaved;
  });

  const heroArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];
  const isHeroBookmarked = heroArticle
    ? bookmarkedArticles.includes(heroArticle.id)
    : false;

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Research Desk Online &middot; Crypto Intelligence
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-3 tracking-tight">
            Research &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              Analysis
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl font-mono text-sm leading-relaxed">
            Deep dives into cryptocurrency markets, blockchain technology, and
            the future of digital finance. Bookmark articles to save for later
            reading.
          </p>
        </div>

        {/* ── Category Filter ──────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em]">
              Filter by category
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowSavedOnly(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200 ${
                  selectedCategory === category && !showSavedOnly
                    ? 'bg-[#00FF9D] text-[#0B0E14] shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                    : 'bg-[#151A22]/80 text-gray-500 border border-white/5 hover:border-[#00FF9D]/30 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(0,255,157,0.05)]'
                }`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-200 flex items-center space-x-2 ${
                showSavedOnly
                  ? 'bg-[#00FF9D] text-[#0B0E14] shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                  : 'bg-[#151A22]/80 text-gray-500 border border-white/5 hover:border-[#00FF9D]/30 hover:text-gray-200'
              }`}
            >
              {showSavedOnly ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span>Saved ({bookmarkedArticles.length})</span>
            </button>
          </div>
        </div>

        {/* ── Results Count ────────────────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <p className="font-mono text-xs text-gray-600 uppercase tracking-[0.15em]">
            Showing{' '}
            <span className="text-gray-400">{filteredArticles.length}</span> of{' '}
            <span className="text-gray-400">{articlesData.length}</span>{' '}
            articles
          </p>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[9px] text-[#00FF9D]/50 uppercase tracking-[0.15em]">
              [RESEARCH_DESK_ONLINE]
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
           FEATURED HERO ARTICLE
           ════════════════════════════════════════════════════════════ */}
        {heroArticle && (
          <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-2xl mb-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] group hover:border-[#00FF9D]/30 hover:shadow-[0_0_40px_rgba(0,255,157,0.08)] transition-all duration-500">
            {/* Ambient glow orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00FF9D]/[0.02] rounded-full blur-3xl translate-y-16 -translate-x-16 pointer-events-none" />

            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Left: Content */}
                <div className="flex-1 max-w-3xl">
                  <div className="flex items-center space-x-3 mb-5">
                    <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/30">
                      <Sparkles className="w-3 h-3 text-[#00FF9D]" />
                      <span className="font-mono text-[9px] font-bold text-[#00FF9D] uppercase tracking-[0.15em]">
                        Featured Research
                      </span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#00FF9D]/80 uppercase tracking-[0.15em] bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-md px-2 py-0.5">
                      {heroArticle.category}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight tracking-tight group-hover:text-white transition-colors">
                    {heroArticle.title}
                  </h2>

                  <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
                    {heroArticle.excerpt}
                  </p>

                  <div className="flex items-center space-x-4 mb-8">
                    <span className="flex items-center space-x-1.5 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">{heroArticle.readTime}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="font-mono text-[11px] text-gray-600">
                      {heroArticle.date}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/article/${heroArticle.id}`}
                      className="inline-flex items-center space-x-2 px-7 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-sm uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_25px_rgba(0,255,157,0.25)] hover:shadow-[0_0_40px_rgba(0,255,157,0.45)]"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Read Research</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(heroArticle.id);
                      }}
                      data-testid={`bookmark-btn-${heroArticle.id}`}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-lg font-bold font-mono text-sm uppercase tracking-wider border transition-all duration-300 ${
                        isHeroBookmarked
                          ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.1)]'
                          : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-[#00FF9D]/30 hover:text-gray-200'
                      }`}
                    >
                      {isHeroBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      <span>{isHeroBookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                {/* Right: Large decorative element */}
                <div className="hidden lg:flex flex-shrink-0 w-48 h-48 items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/10 to-transparent rounded-2xl border border-[#00FF9D]/10" />
                  <div className="absolute inset-3 bg-gradient-to-br from-[#00FF9D]/5 to-transparent rounded-xl border border-[#00FF9D]/5" />
                  <FileText className="w-16 h-16 text-[#00FF9D]/20 relative z-10" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
           MAIN 2-COLUMN: GRID (3 cols) + SIDEBAR (1 col)
           ════════════════════════════════════════════════════════════ */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ── Article Grid (3 cols) ────────────────────────────── */}
            <div className="lg:col-span-3">
              {gridArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {gridArticles.map((article) => {
                    const isBookmarked = bookmarkedArticles.includes(
                      article.id
                    );
                    return (
                      <div
                        key={article.id}
                        data-testid={`article-card-${article.id}`}
                        className="group bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,157,0.1)] hover:border-[#00FF9D]/40 transition-all duration-300 flex flex-col"
                      >
                        <Link
                          to={`/article/${article.id}`}
                          className="block p-5 flex-1"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-md px-2 py-0.5">
                              {article.category}
                            </span>
                            <span className="flex items-center space-x-1 text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span className="font-mono text-[10px]">
                                {article.readTime}
                              </span>
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-gray-100 mb-2.5 group-hover:text-[#00FF9D] transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-mono text-[10px] text-gray-600">
                              {article.date}
                            </span>
                            <span className="flex items-center space-x-1 text-[#00FF9D] text-xs font-bold font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span>Read</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                        <div className="px-5 pb-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(article.id);
                            }}
                            data-testid={`bookmark-btn-${article.id}`}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 w-full justify-center border ${
                              isBookmarked
                                ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_10px_rgba(0,255,157,0.1)]'
                                : 'bg-[#0B0E14]/80 text-gray-500 border-white/5 hover:border-[#00FF9D]/30 hover:text-gray-300 hover:shadow-[0_0_10px_rgba(0,255,157,0.05)]'
                            }`}
                          >
                            {isBookmarked ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5" />
                                <span>Save for later</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Only the hero article matched — no additional grid */
                <div className="text-center py-10">
                  <p className="font-mono text-xs text-gray-600">
                    No additional articles in this filter.
                  </p>
                </div>
              )}
            </div>

            {/* ── Intelligence Sidebar (1 col) ─────────────────────── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* ── Trending Topics ──────────────────────────────── */}
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:border-[#00FF9D]/20 transition-all duration-300">
                  <div className="flex items-center space-x-2.5 mb-5">
                    <TrendingUp className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    <span className="font-bold text-sm text-gray-100">
                      Trending Topics
                    </span>
                    <span className="flex items-center space-x-1 ml-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                      <span className="font-mono text-[8px] text-[#00FF9D]/50 uppercase tracking-[0.15em]">
                        [HOT]
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-gray-400 hover:text-[#00FF9D] hover:border-[#00FF9D]/30 hover:bg-[#00FF9D]/[0.04] transition-all duration-200 cursor-pointer group/tag"
                      >
                        <Hash className="w-3 h-3 text-gray-600 group-hover/tag:text-[#00FF9D]/60 transition-colors" />
                        <span className="font-mono text-[11px] font-medium">
                          {topic.replace('#', '')}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Weekly Alpha Report ──────────────────────────── */}
                <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] hover:border-[#00FF9D]/20 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF9D]/[0.03] rounded-full blur-3xl -translate-y-8 translate-x-8 pointer-events-none" />

                  <div className="relative">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <Mail className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                      <span className="font-bold text-sm text-gray-100">
                        Weekly Alpha Report
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs font-mono leading-relaxed mb-5">
                      Institutional-grade research delivered every Monday.
                      On-chain analytics, macro outlook, and quant signals.
                    </p>

                    {!emailSubmitted ? (
                      <div className="space-y-2.5">
                        <input
                          type="email"
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                          placeholder="analyst@fund.com"
                          className="w-full px-4 py-2.5 bg-[#0B0E14]/80 border border-white/10 rounded-lg text-sm font-mono text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-[#00FF9D]/40 focus:shadow-[0_0_10px_rgba(0,255,157,0.1)] transition-all"
                        />
                        <button
                          onClick={() => {
                            if (emailValue.trim()) setEmailSubmitted(true);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.4)]"
                        >
                          <span>Subscribe</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-4 py-3 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-lg">
                        <Sparkles className="w-4 h-4 text-[#00FF9D]" />
                        <span className="font-mono text-xs font-bold text-[#00FF9D]">
                          Subscribed — check your inbox
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Quick Stats ──────────────────────────────────── */}
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center space-x-2.5 mb-5">
                    <BarChart className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    <span className="font-bold text-sm text-gray-100">
                      Library Stats
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
                        Total Research
                      </span>
                      <span className="font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
                        {articlesData.length}
                      </span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
                        Bookmarked
                      </span>
                      <span className="font-mono text-sm font-bold text-gray-300">
                        {bookmarkedArticles.length}
                      </span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
                        Categories
                      </span>
                      <span className="font-mono text-sm font-bold text-gray-300">
                        {categories.length - 1}
                      </span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
                        Filtered
                      </span>
                      <span className="font-mono text-sm font-bold text-gray-300">
                        {filteredArticles.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty State ─────────────────────────────────────────── */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2 font-mono">
              {showSavedOnly ? 'No saved articles yet' : 'No articles found'}
            </h3>
            <p className="text-gray-500 font-mono text-sm max-w-md mx-auto">
              {showSavedOnly
                ? 'Start bookmarking articles to build your personal research library.'
                : 'Try selecting a different category to explore our research.'}
            </p>
            {showSavedOnly && (
              <button
                onClick={() => setShowSavedOnly(false)}
                className="mt-6 px-8 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-sm uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:shadow-[0_0_35px_rgba(0,255,157,0.45)]"
              >
                Browse All Articles
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Inline BarChart icon (avoids adding another lucide import variant)
   ═══════════════════════════════════════════════════════════════════════ */
function BarChart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}