export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface Signal {
  id: string;
  asset: string;
  type: 'Perpetual' | 'Spot';
  signal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  entry: number;
  target: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  timestamp: string;
}

export interface Trade {
  id: string;
  signalId: string;
  amount: number;
  type: 'Spot' | 'Futures';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: 'active' | 'closed';
  simulatedPnL: number;
}

export interface IgnoredSignal {
  id: string;
  signalId: string;
  asset: string;
  signal: string;
  ignoredAt: string;
  wouldHavePnL: number;
}

export interface MissedSignal {
  id: string;
  signalId: string;
  asset: string;
  signal: string;
  missedAt: string;
  wouldHavePnL: number;
}

export interface HistoricalSignal {
  id: string;
  month: string;
  year: number;
  totalSignals: number;
  successfulSignals: number;
  failedSignals: number;
  accuracy: number;
  avgReturn: number;
}
