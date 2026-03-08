import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  Twitter,
  Linkedin,
  Share2,
  ArrowRight,
  ChevronUp,
  FileText,
  BrainCircuit,
} from 'lucide-react';
import articlesData from '../data/articles';

/* ═══════════════════════════════════════════════════════════════════════
   SENTIMENT AD NODE — "NLP Processing Node" Camouflage
   When empty, scrolls fake NLP sentiment analysis data so it blends
   seamlessly into the Quant Terminal aesthetic.
   ═══════════════════════════════════════════════════════════════════════ */

const SENTIMENT_TEMPLATES = [
  () => `> PARSING PARAGRAPH_${Math.floor(Math.random() * 24) + 1}...`,
  () => `> KEYWORD "${['BULLISH', 'BEARISH', 'ACCUMULATION', 'BREAKOUT', 'REVERSAL', 'DIVERGENCE', 'MOMENTUM', 'LIQUIDITY', 'VOLATILITY', 'CONSOLIDATION', 'CATALYST', 'DISTRIBUTION', 'CAPITULATION', 'ROTATION', 'HEDGE'][Math.floor(Math.random() * 15)]}" DETECTED`,
  () => `> SENTIMENT: ${Math.floor(Math.random() * 40 + 55)}% POSITIVE`,
  () => `> SENTIMENT: ${Math.floor(Math.random() * 35 + 10)}% NEGATIVE`,
  () => `> TONE_VECTOR: [${(Math.random() * 2 - 1).toFixed(3)}, ${(Math.random() * 2 - 1).toFixed(3)}]`,
  () => `> ENTITY_EXTRACT: ${['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'AVAX', 'LINK', 'DOT', 'ADA', 'MATIC'][Math.floor(Math.random() * 10)]}/USDT`,
  () => `> NLP_CONFIDENCE: ${(Math.random() * 0.4 + 0.6).toFixed(4)}`,
  () => `> TOKEN_COUNT: ${Math.floor(Math.random() * 800 + 200)}`,
  () => `> LEXICAL_DENSITY: ${(Math.random() * 0.3 + 0.4).toFixed(3)}`,
  () => `> EMBEDDING_DIM: 768 → PROJ_128`,
  () => `> CROSS_REF: ARTICLE_${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
  () => `> TOPIC_CLUSTER: ${['DEFI_YIELD', 'L2_SCALING', 'MACRO_POLICY', 'ON_CHAIN_FLOW', 'DERIVATIVES', 'SMART_MONEY', 'MEV_ANALYSIS', 'TOKENOMICS', 'REGULATORY'][Math.floor(Math.random() * 9)]}`,
  () => `> NAMED_ENTITY: ${['BLACKROCK', 'SEC', 'BINANCE', 'COINBASE', 'FEDERAL_RESERVE', 'GRAYSCALE', 'MICROSTRATEGY', 'TETHER', 'CIRCLE'][Math.floor(Math.random() * 9)]}`,
  () => `> BIAS_CHECK: ${Math.random() > 0.7 ? 'FLAGGED' : 'PASS'} (σ=${(Math.random() * 2).toFixed(3)})`,
  () => `> READABILITY: FLESCH_${Math.floor(Math.random() * 30 + 40)}`,
  () => `> TEMPORAL_REF: ${['1H', '4H', '1D', '1W', '1M', 'Q1_2026', 'YTD'][Math.floor(Math.random() * 7)]}`,
  () => `> HASH: ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  () => `> CONTEXT_WINDOW: ${Math.floor(Math.random() * 4096 + 2048)} tokens`,
  () => `> ATTENTION_HEAD_${Math.floor(Math.random() * 12)}: ${(Math.random()).toFixed(4)}`,
  () => `> COSINE_SIM: ${(Math.random() * 0.5 + 0.5).toFixed(4)}`,
  () => `────────────────────`,
];

interface SentimentAdNodeProps {
  className?: string;
  id?: string;
}

function SentimentAdNode({ className = '', id }: SentimentAdNodeProps) {
  const LINE_COUNT = 60;
  const [lines, setLines] = useState<string[]>(() =>
    Array.from({ length: LINE_COUNT }, () => {
      const tpl = SENTIMENT_TEMPLATES[Math.floor(Math.random() * SENTIMENT_TEMPLATES.length)];
      return tpl();
    })
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const tpl = SENTIMENT_TEMPLATES[Math.floor(Math.random() * SENTIMENT_TEMPLATES.length)];
        const next = [...prev, tpl()];
        if (next.length > LINE_COUNT) return next.slice(next.length - LINE_COUNT);
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      id={id}
      className={`w-[160px] h-[600px] bg-[#060810] border border-dashed border-white/[0.06] rounded-xl overflow-hidden relative flex flex-col group ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.015] border-b border-white/[0.04] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1 w-1">
            <span className="absolute inset-0 rounded-full bg-cyan-400/50 animate-ping" />
            <span className="relative inline-flex rounded-full h-1 w-1 bg-cyan-400" />
          </span>
          <span className="font-mono text-[6px] text-cyan-400/40 uppercase tracking-[0.2em]">
            nlp.sentiment
          </span>
        </div>
        <span className="font-mono text-[5px] text-cyan-400/25 uppercase tracking-[0.15em]">
          live
        </span>
      </div>

      {/* Scrolling data body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden px-2 py-1.5 space-y-px"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`font-mono text-[8px] leading-relaxed whitespace-nowrap truncate transition-colors duration-300 ${
              line.includes('NEGATIVE') || line.includes('FLAGGED') || line.includes('[SELL]')
                ? i >= lines.length - 3
                  ? 'text-[#FF3366]/50'
                  : 'text-[#FF3366]/25'
                : line.includes('POSITIVE') || line.includes('BULLISH') || line.includes('PASS')
                ? i >= lines.length - 3
                  ? 'text-[#00FF9D]/50'
                  : 'text-[#00FF9D]/25'
                : i === lines.length - 1
                ? 'text-cyan-400/60'
                : i >= lines.length - 3
                ? 'text-cyan-400/40'
                : 'text-cyan-400/20'
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,8,16,0.7)_100%)]" />

      {/* Bottom glow accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ARTICLE DETAIL COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const article = articlesData.find((a) => a.id === id);

  // Check if article is bookmarked
  useEffect(() => {
    const saved = localStorage.getItem('bitpulse_bookmarks');
    if (saved && id) {
      try {
        const bookmarks = JSON.parse(saved);
        setIsBookmarked(bookmarks.includes(id));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  }, [id]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleBookmark = () => {
    if (!id) return;

    const saved = localStorage.getItem('bitpulse_bookmarks');
    let bookmarks: string[] = [];

    if (saved) {
      try {
        bookmarks = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }

    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id);
      setIsBookmarked(false);
    } else {
      bookmarks.push(id);
      setIsBookmarked(true);
    }

    localStorage.setItem('bitpulse_bookmarks', JSON.stringify(bookmarks));
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    if (!article) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article.title);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-4 font-mono tracking-tight">
            Article Not Found
          </h1>
          <p className="text-gray-500 mb-8 font-mono text-sm">
            The article you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_25px_rgba(0,255,157,0.25)] hover:shadow-[0_0_40px_rgba(0,255,157,0.45)]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  // Parse markdown content — upgraded headings with neon left border
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    const listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="space-y-3 text-gray-300 text-lg leading-loose mb-8 ml-2"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#00FF9D]/60 flex-shrink-0 shadow-[0_0_4px_rgba(0,255,157,0.4)]" />
                <span>{item.replace(/^- /, '').replace(/^\* /, '')}</span>
              </li>
            ))}
          </ul>
        );
        listItems.length = 0;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1
            key={index}
            className="text-3xl sm:text-4xl font-bold text-gray-100 mt-14 mb-6 tracking-tight border-l-2 border-[#00FF9D] pl-5"
          >
            {trimmedLine.replace('# ', '')}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2
            key={index}
            className="text-2xl font-bold text-gray-100 mt-12 mb-5 tracking-tight border-l-2 border-[#00FF9D] pl-5"
          >
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3
            key={index}
            className="text-xl font-bold text-gray-100 mt-10 mb-4 tracking-tight border-l-2 border-[#00FF9D]/50 pl-5"
          >
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        listItems.push(trimmedLine);
      } else if (trimmedLine === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p
            key={index}
            className="text-gray-300 text-lg leading-loose mb-6"
          >
            {trimmedLine}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      {/* ── Reading Progress Bar (top of viewport) ─────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] shadow-[0_0_10px_rgba(0,255,157,0.5)] transition-[width] duration-150 ease-linear"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════
         HERO HEADER
         ════════════════════════════════════════════════════════════════ */}
      <div className="relative pt-28 pb-16 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#00FF9D]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#00FF9D]/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF9D]/[0.015] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#00FF9D] transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs uppercase tracking-[0.15em]">
              Back
            </span>
          </button>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center px-3 py-1.5 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-full shadow-[0_0_10px_rgba(0,255,157,0.1)]">
              <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.15em]">
                {article.category}
              </span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-md">
              <Calendar className="w-3 h-3 text-gray-600" />
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.12em]">
                {article.date}
              </span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-md">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.12em]">
                {article.readTime}
              </span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-8 leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
         CONTENT AREA — WIDE GRID WITH SKYSCRAPER AD NODES
         ════════════════════════════════════════════════════════════════ */}
      <div className="relative max-w-[1600px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-[160px_1fr_160px] gap-8 lg:gap-12">

          {/* ── LEFT SKYSCRAPER SENTIMENT AD NODE ──────────────────── */}
          <SentimentAdNode
            className="hidden xl:flex sticky top-28"
            id="ad-article-left"
          />

          {/* ── CENTER: FLOATING ACTION BAR + ARTICLE CONTENT ─────── */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-10">
              {/* ── Floating Action Bar (sticky left on lg) ────────── */}
              <div className="relative">
                {/* Mobile: horizontal bar */}
                <div className="flex lg:hidden items-center gap-2 mb-8 pb-6 border-b border-white/5">
                  <button
                    onClick={toggleBookmark}
                    data-testid={`bookmark-btn-${article.id}`}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                      isBookmarked
                        ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_10px_rgba(0,255,157,0.1)]'
                        : 'bg-[#151A22]/80 text-gray-500 border-white/5 hover:border-[#00FF9D]/30 hover:text-gray-300'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2.5 bg-[#151A22]/80 text-gray-500 border border-white/5 rounded-lg hover:border-[#00FF9D]/30 hover:text-gray-300 transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2.5 bg-[#151A22]/80 text-gray-500 border border-white/5 rounded-lg hover:border-[#00FF9D]/30 hover:text-gray-300 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>

                {/* Desktop: sticky vertical bar */}
                <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3 lg:sticky lg:top-28 lg:pt-4">
                  <button
                    onClick={toggleBookmark}
                    data-testid={`bookmark-btn-lg-${article.id}`}
                    className={`relative p-3 rounded-xl border transition-all duration-300 group/btn ${
                      isBookmarked
                        ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/30 shadow-[0_0_15px_rgba(0,255,157,0.15)]'
                        : 'bg-[#151A22]/90 text-gray-600 border-white/5 hover:border-[#00FF9D]/30 hover:text-[#00FF9D] hover:shadow-[0_0_15px_rgba(0,255,157,0.1)]'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                    {/* Tooltip */}
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#151A22] border border-white/10 rounded-md font-mono text-[9px] text-gray-400 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                      {isBookmarked ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  <div className="w-px h-4 bg-white/5" />

                  <button
                    onClick={() => handleShare('twitter')}
                    className="relative p-3 bg-[#151A22]/90 text-gray-600 border border-white/5 rounded-xl hover:border-[#00FF9D]/30 hover:text-[#00FF9D] hover:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all group/btn"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#151A22] border border-white/10 rounded-md font-mono text-[9px] text-gray-400 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                      Share
                    </span>
                  </button>

                  <button
                    onClick={() => handleShare('linkedin')}
                    className="relative p-3 bg-[#151A22]/90 text-gray-600 border border-white/5 rounded-xl hover:border-[#00FF9D]/30 hover:text-[#00FF9D] hover:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all group/btn"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#151A22] border border-white/10 rounded-md font-mono text-[9px] text-gray-400 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                      Share
                    </span>
                  </button>

                  <div className="w-px h-4 bg-white/5" />

                  <button
                    onClick={scrollToTop}
                    className="relative p-3 bg-[#151A22]/90 text-gray-600 border border-white/5 rounded-xl hover:border-[#00FF9D]/30 hover:text-[#00FF9D] hover:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all group/btn"
                  >
                    <ChevronUp className="w-5 h-5" />
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#151A22] border border-white/10 rounded-md font-mono text-[9px] text-gray-400 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                      Scroll
                    </span>
                  </button>

                  {/* Progress indicator */}
                  <div className="mt-2 flex flex-col items-center gap-1.5">
                    <div className="w-1 h-16 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="w-full bg-[#00FF9D] rounded-full shadow-[0_0_6px_rgba(0,255,157,0.5)] transition-[height] duration-150 ease-linear"
                        style={{ height: `${readProgress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-gray-700">
                      {Math.round(readProgress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Content Well ─────────────────────────────────────── */}
              <div className="min-w-0">
                <article className="relative">
                  <div className="bg-[#151A22]/70 border border-white/5 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    {/* Content header flourish */}
                    <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                      <span className="font-mono text-[9px] text-[#00FF9D]/50 uppercase tracking-[0.2em]">
                        Deep Dive Research &middot; Full Analysis
                      </span>
                      <div className="flex-1" />
                      <span className="font-mono text-[9px] text-gray-700 uppercase tracking-[0.15em]">
                        {article.readTime}
                      </span>
                    </div>

                    {/* Rendered markdown */}
                    <div className="prose-custom">
                      {renderContent(article.content)}
                    </div>
                  </div>

                  {/* ── Author Block ─────────────────────────────────── */}
                  <div className="mt-8 bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-[#00FF9D]/20 hover:shadow-[0_0_20px_rgba(0,255,157,0.05)] transition-all duration-300">
                    <div className="flex items-start gap-5">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00FF9D]/20 to-[#00FF9D]/5 border border-[#00FF9D]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                          <BrainCircuit className="w-7 h-7 text-[#00FF9D]/70" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h4 className="text-base font-bold text-gray-100">
                            BitPulse Quantitative Research Team
                          </h4>
                          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20">
                            Verified
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          Institutional-grade crypto research powered by machine
                          learning models and on-chain analytics. Our team combines
                          quantitative finance expertise with deep blockchain domain
                          knowledge.
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.12em]">
                            {articlesData.length} Publications
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.12em]">
                            Est. 2024
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* ── Footer ─────────────────────────────────────────── */}
                <footer className="mt-10 pt-8 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em] mb-1">
                        Published
                      </p>
                      <p className="font-mono text-xs text-gray-400">
                        {article.date} &middot; BitPulse Research
                      </p>
                    </div>
                    <Link
                      to="/articles"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-[#151A22]/80 border border-white/10 text-gray-200 rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:border-[#00FF9D]/30 hover:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all"
                    >
                      <span>More Research</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          {/* ── RIGHT SKYSCRAPER SENTIMENT AD NODE ─────────────────── */}
          <SentimentAdNode
            className="hidden xl:flex sticky top-28"
            id="ad-article-right"
          />

        </div>
      </div>
    </div>
  );
}