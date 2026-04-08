import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GlobalProvider, useGlobal } from './GlobalContext';
import TopNavigation from './components/TopNavigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignalDetail from './pages/SignalDetail';
import Portfolio from './pages/Portfolio';
import SignalHistory from './pages/SignalHistory';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Download from './pages/Download';
import Contact from './pages/Contact';
import About from './pages/About';
import Documentation from './pages/Documentation';
import HelpCenter from './pages/HelpCenter';
import ApiAccess from './pages/ApiAccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MarketAnalysis from './pages/MarketAnalysis';
import { Lock, Search } from 'lucide-react';
// import LiveActivityToast from './components/LiveActivityToast';
import SignalScreener from './pages/SignalScreener';
import ProfileSettings from './pages/ProfileSettings';
import ScrollToTop from './components/ScrollToTop';

// Command Palette Component
function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const routes = [
    { path: '/', label: 'Home', keywords: 'home dashboard main' },
    { path: '/signals', label: 'Trading Signals', keywords: 'signals trades buy sell' },
    { path: '/portfolio', label: 'Portfolio', keywords: 'portfolio trades positions' },
    { path: '/signal-history', label: 'Signal History', keywords: 'history performance past' },
    { path: '/articles', label: 'Articles', keywords: 'articles research blog news' },
    { path: '/download', label: 'Download App', keywords: 'download app mobile ios android' },
    { path: '/market-analysis', label: 'Market Analysis', keywords: 'market analysis charts data' },
    { path: '/contact', label: 'Contact Us', keywords: 'contact support help message' },
    { path: '/about', label: 'About Us', keywords: 'about company team' },
    { path: '/documentation', label: 'Documentation', keywords: 'docs documentation api guide' },
    { path: '/api-access', label: 'API Access', keywords: 'api developer integration' },
    { path: '/privacy-policy', label: 'Privacy Policy', keywords: 'privacy legal terms' },
    { path: '/terms-of-service', label: 'Terms of Service', keywords: 'terms legal conditions' },
  ];
  
  const filteredRoutes = routes.filter(route => 
    route.label.toLowerCase().includes(search.toLowerCase()) ||
    route.keywords.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setSearch('');
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-[#151A22] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none"
            autoFocus
          />
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <kbd className="px-2 py-1 bg-[#0B0E14] rounded">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <button
                key={route.path}
                onClick={() => handleSelect(route.path)}
                className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-100 group-hover:text-[#00FF9D] transition-colors">{route.label}</span>
                <span className="text-gray-500 text-sm">{route.path}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No routes found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Session Lock Overlay
function SessionLockOverlay() {
  const { unlock, logout } = useGlobal();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleUnlock = () => {
    if (unlock(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0E14]/95 backdrop-blur-xl">
      <div className="bg-[#151A22]/80 border border-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#00FF9D]/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-[#00FF9D]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Session Locked</h2>
          <p className="text-gray-400 mb-6">
            Your session has been locked due to inactivity. Enter your password to continue.
          </p>
          
          <div className="w-full space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00FF9D]/30"
            />
            {error && (
              <p className="text-[#FF3366] text-sm">{error}</p>
            )}
            <button
              onClick={handleUnlock}
              className="w-full px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-semibold hover:bg-[#00CC7D] transition-colors"
            >
              Unlock
            </button>
            <button
              onClick={logout}
              className="w-full px-6 py-3 bg-transparent text-gray-400 border border-white/10 rounded-lg font-medium hover:text-gray-100 hover:border-white/20 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassmorphicSkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse w-3/4"></div>
          <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse w-1/2"></div>
          <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse w-48 mt-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#151A22]/80 border border-white/5 rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-800/50 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-[#151A22]/80 border border-white/5 rounded-xl overflow-hidden mt-12">
          <div className="p-4 border-b border-white/5">
            <div className="h-6 bg-gray-800/50 rounded animate-pulse w-48"></div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-white/5 flex gap-4">
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-20"></div>
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-28"></div>
              <div className="h-4 bg-gray-800/50 rounded animate-pulse w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RouteChangeHandler({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location.pathname);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Command Palette hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (location.pathname !== prevLocation) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevLocation(location.pathname);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevLocation]);

  if (isLoading) {
    return <GlassmorphicSkeletonLoader />;
  }

  return (
    <>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      {children}
    </>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0B0E14] flex flex-col">
        <ScrollToTop />
        <TopNavigation />
        <LiveActivityToast />
        <main className="flex-grow">
          <RouteChangeHandler>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signal/:id" element={<SignalDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/signal-history" element={<SignalHistory />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/download" element={<Download />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/api-access" element={<ApiAccess />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/signals" element={<SignalScreener />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Routes>
          </RouteChangeHandler>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;
