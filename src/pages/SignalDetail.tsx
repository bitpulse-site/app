import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Check, X, Calculator, Zap, Target, Shield, AlertTriangle, BarChart3, Clock } from 'lucide-react';
import { useGlobal } from '../GlobalContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, getSignalById, addTakenTrade, addIgnoredTrade } = useGlobal();
  
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState<'Spot' | 'Futures'>('Spot');
  const [customSL, setCustomSL] = useState('');
  const [customTP, setCustomTP] = useState('');
  const [useAITargets, setUseAITargets] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const signal = id ? getSignalById(id) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (signal && useAITargets) {
      setCustomSL(signal.stopLoss.toString());
      setCustomTP(signal.target.toString());
    }
  }, [signal, useAITargets]);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    const toast: Toast = { id: Date.now().toString(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3000);
  };
  
  const handleTakeTrade = () => {
    if (!signal || !tradeAmount) return;
    
    addTakenTrade({
      signalId: signal.id,
      amount: parseFloat(tradeAmount),
      type: tradeType,
      entryPrice: signal.entry,
      targetPrice: parseFloat(customTP),
      stopLoss: parseFloat(customSL),
      status: 'active',
    });
    
    showToast('Trade added to your portfolio!', 'success');
    setShowTradeModal(false);
    setTradeAmount('');
  };
  
  const handleIgnore = () => {
    if (!signal) return;
    
    addIgnoredTrade({
      signalId: signal.id,
      asset: signal.asset,
      signal: signal.signal,
    });
    
    showToast('Signal ignored and saved to history', 'success');
  };
  
  const calculateProjectedProfit = () => {
    if (!signal || !tradeAmount) return 0;
    const amount = parseFloat(tradeAmount);
    const entry = signal.entry;
    const target = parseFloat(customTP) || signal.target;
    const priceDiff = target - entry;
    const percentChange = priceDiff / entry;
    return amount * percentChange;
  };
  
  const projectedProfit = calculateProjectedProfit();
  const isProfitable = projectedProfit > 0;
  
  if (!signal) {
    return (
      <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Signal Not Found</h1>
          <p className="text-gray-400 mb-8">The trading signal you're looking for doesn't exist or has expired.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-medium hover:bg-[#00CC7D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Signals</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case 'Strong Buy':
      case 'Buy':
        return 'text-[#00FF9D] bg-[#00FF9D]/10';
      case 'Strong Sell':
      case 'Sell':
        return 'text-[#FF3366] bg-[#FF3366]/10';
      case 'Hold':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };
  
  const getSignalIcon = (signalType: string) => {
    switch (signalType) {
      case 'Strong Buy':
      case 'Buy':
        return <TrendingUp className="w-5 h-5" />;
      case 'Strong Sell':
      case 'Sell':
        return <TrendingDown className="w-5 h-5" />;
      case 'Hold':
        return <Minus className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
      {/* Toast Notifications */}
      <div className="fixed top-24 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
              toast.type === 'success' ? 'bg-[#00FF9D]/20 border border-[#00FF9D]/30' : 'bg-[#FF3366]/20 border border-[#FF3366]/30'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-[#00FF9D]" />
            ) : (
              <X className="w-5 h-5 text-[#FF3366]" />
            )}
            <span className={toast.type === 'success' ? 'text-[#00FF9D]' : 'text-[#FF3366]'}>
              {toast.message}
            </span>
          </div>
        ))}
      </div>
      
      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#151A22] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Take Trade</h2>
              <button
                onClick={() => setShowTradeModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Signal Summary */}
              <div className="bg-[#0B0E14] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Asset</span>
                  <span className="text-gray-100 font-medium">{signal.asset}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Signal</span>
                  <span className={`px-2 py-1 rounded text-sm ${getSignalColor(signal.signal)}`}>
                    {signal.signal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Entry Price</span>
                  <span className="text-gray-100">${signal.entry.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Trade Type Toggle */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trade Type</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTradeType('Spot')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      tradeType === 'Spot'
                        ? 'bg-[#00FF9D] text-[#0B0E14]'
                        : 'bg-[#0B0E14] text-gray-400 border border-white/10'
                    }`}
                  >
                    Spot
                  </button>
                  <button
                    onClick={() => setTradeType('Futures')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      tradeType === 'Futures'
                        ? 'bg-[#00FF9D] text-[#0B0E14]'
                        : 'bg-[#0B0E14] text-gray-400 border border-white/10'
                    }`}
                  >
                    Futures
                  </button>
                </div>
              </div>
              
              {/* Investment Amount */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Investment Amount (USD)</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00FF9D]/30"
                />
              </div>
              
              {/* AI Targets Toggle */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setUseAITargets(!useAITargets)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    useAITargets ? 'bg-[#00FF9D] border-[#00FF9D]' : 'border-white/30'
                  }`}
                >
                  {useAITargets && <Check className="w-3 h-3 text-[#0B0E14]" />}
                </button>
                <span className="text-gray-300 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#00FF9D]" />
                  <span>Apply AI Targets</span>
                </span>
              </div>
              
              {/* Stop Loss & Take Profit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center space-x-1">
                    <Target className="w-4 h-4 text-[#FF3366]" />
                    <span>Stop Loss</span>
                  </label>
                  <input
                    type="number"
                    value={customSL}
                    onChange={(e) => {
                      setCustomSL(e.target.value);
                      setUseAITargets(false);
                    }}
                    className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:border-[#00FF9D]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2 flex items-center space-x-1">
                    <Target className="w-4 h-4 text-[#00FF9D]" />
                    <span>Take Profit</span>
                  </label>
                  <input
                    type="number"
                    value={customTP}
                    onChange={(e) => {
                      setCustomTP(e.target.value);
                      setUseAITargets(false);
                    }}
                    className="w-full px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:border-[#00FF9D]/30"
                  />
                </div>
              </div>
              
              {/* Smart ROI Calculator */}
              {tradeAmount && (
                <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-4 h-4 text-[#00FF9D]" />
                    <span className="text-[#00FF9D] text-sm font-medium">Smart ROI Calculator</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Projected Profit/Loss:</span>
                    <span className={`text-xl font-bold ${isProfitable ? 'text-[#00FF9D]' : 'text-[#FF3366]'}`}>
                      {isProfitable ? '+' : ''}${projectedProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500 text-sm">ROI:</span>
                    <span className={`text-sm ${isProfitable ? 'text-[#00FF9D]' : 'text-[#FF3366]'}`}>
                      {isProfitable ? '+' : ''}{((projectedProfit / parseFloat(tradeAmount)) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                onClick={handleTakeTrade}
                disabled={!tradeAmount}
                className="w-full px-6 py-4 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-semibold hover:bg-[#00CC7D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-gray-100 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        {/* Signal Header */}
        <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium ${getSignalColor(signal.signal)}`}>
                  {getSignalIcon(signal.signal)}
                  <span>{signal.signal}</span>
                </span>
                <span className="px-3 py-1 bg-[#0B0E14] rounded-full text-gray-400 text-sm">
                  {signal.type}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2">{signal.asset}</h1>
              <p className="text-gray-400">AI-Generated Trading Signal</p>
            </div>
            
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTradeModal(true)}
                  className="px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-semibold hover:bg-[#00CC7D] transition-colors flex items-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Take Trade</span>
                </button>
                <button
                  onClick={handleIgnore}
                  className="px-6 py-3 bg-[#0B0E14] text-gray-100 border border-white/10 rounded-lg font-semibold hover:border-[#FF3366]/30 hover:text-[#FF3366] transition-colors flex items-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Ignore</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Signal Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Entry Price</span>
            </div>
            <p className="text-2xl font-bold text-gray-100">${signal.entry.toLocaleString()}</p>
          </div>
          
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Target className="w-4 h-4 text-[#00FF9D]" />
              <span className="text-sm">Target Price</span>
            </div>
            <p className="text-2xl font-bold text-[#00FF9D]">${signal.target.toLocaleString()}</p>
          </div>
          
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Shield className="w-4 h-4 text-[#FF3366]" />
              <span className="text-sm">Stop Loss</span>
            </div>
            <p className="text-2xl font-bold text-[#FF3366]">${signal.stopLoss.toLocaleString()}</p>
          </div>
          
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center space-x-2 text-gray-400 mb-2">
              <Zap className="w-4 h-4 text-[#00FF9D]" />
              <span className="text-sm">Confidence</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00FF9D] to-[#00CC7D] rounded-full"
                  style={{ width: `${signal.confidence}%` }}
                ></div>
              </div>
              <span className="text-xl font-bold text-gray-100">{signal.confidence}%</span>
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#00FF9D]" />
              <span>Signal Analysis</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">Timeframe</span>
                <span className="text-gray-100 font-medium">{signal.timeframe}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">Risk/Reward Ratio</span>
                <span className="text-gray-100 font-medium">
                  {((signal.target - signal.entry) / (signal.entry - signal.stopLoss)).toFixed(2)}:1
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-gray-400">Potential Upside</span>
                <span className="text-[#00FF9D] font-medium">
                  +{(((signal.target - signal.entry) / signal.entry) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400">Generated</span>
                <span className="text-gray-100 font-medium flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(signal.timestamp).toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#151A22]/80 border border-white/5 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">AI Reasoning</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#00FF9D] mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Strong bullish momentum detected on {signal.timeframe} timeframe</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#00FF9D] mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Volume profile supports continuation pattern</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#00FF9D] mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">RSI and MACD indicators aligned</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-[#00FF9D] mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Support level holding at entry zone</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Warning */}
        <div className="bg-[#FF3366]/10 border border-[#FF3366]/30 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[#FF3366] font-medium mb-1">Risk Warning</h4>
            <p className="text-gray-400 text-sm">
              This signal is generated by AI algorithms and should not be considered financial advice. 
              Cryptocurrency trading carries significant risk. Always use proper risk management and 
              never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
