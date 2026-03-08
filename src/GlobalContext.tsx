import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { User, Signal, Trade, IgnoredSignal, MissedSignal } from './types';

/* ═══════════════════════════════════════════════════════════════════════
   API CLIENT
   ═══════════════════════════════════════════════════════════════════════ */

const API_BASE_URL = 'https://bitpulse-api.onrender.com/api';
const SOCKET_URL = 'https://bitpulse-api.onrender.com';

/**
 * Lightweight fetch wrapper that:
 *  1. Prepends the base URL
 *  2. Sets JSON content-type
 *  3. Attaches the Bearer token from localStorage when present
 *  4. Parses the JSON response (or returns a structured error)
 */
async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: { code: string; message: string; details?: string[] } }> {
  const token = localStorage.getItem('bitpulse_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: json?.error?.message || json?.message || `Request failed with status ${response.status}`,
        error: json?.error || undefined,
      };
    }

    return {
      success: true,
      data: json?.data as T,
      message: json?.message || 'Success',
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof TypeError && err.message === 'Failed to fetch'
        ? 'Unable to reach the server. Please check your connection and try again.'
        : err instanceof Error
        ? err.message
        : 'An unexpected network error occurred.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   CONTEXT TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface GlobalContextType {
  // Auth State
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  userProfile: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;

  // Session Lock
  isLocked: boolean;
  unlock: (password: string) => boolean;
  lastActivity: number;
  updateActivity: () => void;

  // Portfolio State
  takenTrades: Trade[];
  ignoredTrades: IgnoredSignal[];
  missedTrades: MissedSignal[];
  addTakenTrade: (trade: Omit<Trade, 'id' | 'simulatedPnL'>) => void;
  addIgnoredTrade: (ignored: Omit<IgnoredSignal, 'id' | 'ignoredAt' | 'wouldHavePnL'>) => void;
  closeTrade: (tradeId: string, finalPnL: number) => void;
  updateTradePnL: (tradeId: string, pnl: number) => void;

  // Signals (Live via Socket.io)
  signals: Signal[];
  getSignalById: (id: string) => Signal | undefined;
  isSocketConnected: boolean;
  socketError: string | null;

  // Admin
  injectMockData: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

// Admin credentials — client-side dev bypass (still works alongside real API)
const ADMIN_USERNAME = 'MrBrocklly';
const ADMIN_PASSWORD = 'sp3cial';

// Lock timeout: 10 minutes of inactivity
const LOCK_TIMEOUT = 10 * 60 * 1000;

// localStorage keys
const TOKEN_KEY = 'bitpulse_token';
const STORED_USERNAME_KEY = 'bitpulse_username';

// Maximum signals to keep in state (prevents unbounded memory growth)
const MAX_SIGNALS_IN_STATE = 500;

/* ═════════════════════════════════════���═════════════════════════════════
   API RESPONSE SHAPES (for typed apiClient calls)
   ═══════════════════════════════════════════════════════════════════════ */

interface AuthRegisterResponse {
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
}

interface AuthLoginResponse {
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
  token: {
    accessToken: string;
    tokenType: string;
    expiresIn: string;
  };
}

interface AuthMeResponse {
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
}

interface SignalHistoryPayload {
  signals: Signal[];
  count: number;
  timestamp: string;
}

interface SignalsApiResponse {
  signals: Signal[];
  count: number;
  maxStored: number;
}

/* ═══════════════════════════════════════════════════════════════════════
   PROVIDER
   ═══════════════════════════════════════════════════════════════════════ */

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  /* ── Auth State ──────────────────────────────────────────────────── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  /* ── Session Lock State ──────────────────────────────────────────── */
  const [isLocked, setIsLocked] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const storedPasswordRef = useRef<string>('');

  /* ── Portfolio State ─────────────────────────────────────────────── */
  const [takenTrades, setTakenTrades] = useState<Trade[]>([]);
  const [ignoredTrades, setIgnoredTrades] = useState<IgnoredSignal[]>([]);
  const [missedTrades, setMissedTrades] = useState<MissedSignal[]>([]);

  /* ── Signals (Live — starts empty, populated by Socket.io) ───────── */
  const [signals, setSignals] = useState<Signal[]>([]);

  /* ── Socket.io State ─────────────────────────────────────────────── */
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  /* ═════════════════════════════════════════════════════════════════
     SOCKET.IO — Connect, listen, and manage lifecycle
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    console.log('[SOCKET] Initializing connection to', SOCKET_URL);

    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    socketRef.current = socket;

    /* ── Connection established ─────────────────────────────────── */
    socket.on('connect', () => {
      console.log('[SOCKET] ✅ Connected:', socket.id);
      setIsSocketConnected(true);
      setSocketError(null);
    });

    /* ── Server info (logged for diagnostics) ──────────────────── */
    socket.on('server_info', (data: { serverId: string; version: string; connectedAt: string; activeClients: number }) => {
      console.log(
        `[SOCKET] Server: ${data.serverId} v${data.version} | ` +
        `Active clients: ${data.activeClients}`
      );
    });

    /* ── Signal history — full array on initial connect ─────────── */
    socket.on('signal_history', (data: SignalHistoryPayload) => {
      if (data && Array.isArray(data.signals)) {
        console.log(`[SOCKET] 📜 Received signal history: ${data.signals.length} signal(s)`);
        setSignals(data.signals);
      }
    });

    /* ── New signal — single signal pushed by the bot ──────────── */
    socket.on('new_signal', (newSignal: Signal) => {
      if (!newSignal || !newSignal.id) {
        console.warn('[SOCKET] Received invalid new_signal payload:', newSignal);
        return;
      }

      console.log(
        `[SOCKET] 🚀 New signal: ${newSignal.asset} ${newSignal.signal} ` +
        `(conf: ${newSignal.confidence}%)`
      );

      setSignals((prev) => {
        /* Deduplicate — check if this signal ID already exists */
        const exists = prev.some((s) => s.id === newSignal.id);
        if (exists) {
          console.log(`[SOCKET] Duplicate signal ${newSignal.id} — skipped`);
          return prev;
        }

        /* Prepend the new signal to the top */
        const updated = [newSignal, ...prev];

        /* Enforce maximum size to prevent memory leaks */
        if (updated.length > MAX_SIGNALS_IN_STATE) {
          return updated.slice(0, MAX_SIGNALS_IN_STATE);
        }

        return updated;
      });
    });

    /* ── Disconnection ─────────────────────────────────────────── */
    socket.on('disconnect', (reason: string) => {
      console.log(`[SOCKET] ❌ Disconnected: ${reason}`);
      setIsSocketConnected(false);

      if (reason === 'io server disconnect') {
        setSocketError('Server closed the connection.');
      }
    });

    /* ── Connection error ──────────────────────────────────────── */
    socket.on('connect_error', (err: Error) => {
      console.error('[SOCKET] Connection error:', err.message);
      setIsSocketConnected(false);
      setSocketError(
        err.message.includes('xhr poll error')
          ? 'Unable to reach the signal server. Retrying...'
          : `Connection error: ${err.message}`
      );
    });

    /* ── Reconnection events ───────────────────────────────────── */
    socket.io.on('reconnect', (attemptNumber: number) => {
      console.log(`[SOCKET] 🔄 Reconnected after ${attemptNumber} attempt(s)`);
      setIsSocketConnected(true);
      setSocketError(null);
    });

    socket.io.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`[SOCKET] Reconnection attempt #${attemptNumber}`);
    });

    socket.io.on('reconnect_failed', () => {
      console.error('[SOCKET] Reconnection failed after all attempts');
      setSocketError('Unable to reconnect to the signal server.');
    });

    /* ── Cleanup on unmount ────────────────────────────────────── */
    return () => {
      console.log('[SOCKET] Cleaning up — disconnecting');
      socket.off('connect');
      socket.off('server_info');
      socket.off('signal_history');
      socket.off('new_signal');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);


  /* ═════════════════════════════════════════════════════════════════
     TAB VISIBILITY AUTO-PAUSE
     Pauses the WebSocket when the user switches tabs to save bandwidth
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!socketRef.current) return;
      
      if (document.visibilityState === 'hidden') {
        console.log('[SOCKET] ⏸️ Tab hidden: Pausing WebSocket to save server bandwidth.');
        socketRef.current.disconnect();
      } else {
        console.log('[SOCKET] ▶️ Tab active: Reconnecting WebSocket for live market data.');
        socketRef.current.connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     FALLBACK: Fetch signals via HTTP GET on mount
     If the socket history event is delayed or missed, this ensures
     the signals table is never empty for more than a few seconds.
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    const fetchSignalsFallback = async () => {
      /* Wait 3 seconds — give the socket time to deliver history first */
      await new Promise((resolve) => setTimeout(resolve, 3000));

      /* Only fetch if signals are still empty (socket didn't deliver yet) */
      if (cancelled) return;

      setSignals((currentSignals) => {
        if (currentSignals.length > 0) {
          /* Socket already populated the signals — skip HTTP fetch */
          return currentSignals;
        }

        /* Trigger the async fetch but return current state for now */
        (async () => {
          try {
            const result = await apiClient<SignalsApiResponse>('/signals', {
              method: 'GET',
            });

            if (!cancelled && result.success && result.data?.signals) {
              console.log(`[FALLBACK] Fetched ${result.data.signals.length} signal(s) via HTTP`);
              setSignals((prev) => {
                /* Only set if still empty — socket might have populated in the meantime */
                if (prev.length === 0) {
                  return result.data!.signals;
                }
                return prev;
              });
            }
          } catch (err) {
            console.warn('[FALLBACK] HTTP signal fetch failed (non-critical):', err);
          }
        })();

        return currentSignals;
      });
    };

    fetchSignalsFallback();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Tab Visibility Auto-Pause ── */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!socketRef.current) return;
      if (document.visibilityState === 'hidden') {
        console.log('[SOCKET] ⏸️ Tab hidden: Pausing WebSocket.');
        socketRef.current.disconnect();
      } else {
        console.log('[SOCKET] ▶️ Tab active: Reconnecting WebSocket.');
        socketRef.current.connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     SESSION RECOVERY — runs once on mount
     If a token exists in localStorage, verify it against the API.
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    const recoverSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      const result = await apiClient<AuthMeResponse>('/auth/me', {
        method: 'GET',
      });

      if (cancelled) return;

      if (result.success && result.data?.user) {
        const serverUser = result.data.user;
        setIsLoggedIn(true);
        setUserProfile({
          username: serverUser.username,
          role: serverUser.username.toLowerCase() === ADMIN_USERNAME.toLowerCase() ? 'admin' : 'user',
        });
        setLastActivity(Date.now());

        // Recover the stored username for lock-screen context
        const storedPw = localStorage.getItem(STORED_USERNAME_KEY);
        if (storedPw) {
          storedPasswordRef.current = storedPw;
        }
      } else {
        // Token is invalid or expired — clean up
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORED_USERNAME_KEY);
        setIsLoggedIn(false);
        setUserProfile(null);
      }

      setIsAuthLoading(false);
    };

    recoverSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     ACTIVITY TRACKING
     ═════════════════════════════════════════════════════════════════ */
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     AUTO-LOCK LOGIC
     ════════���════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isLoggedIn || isLocked) return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > LOCK_TIMEOUT) {
        setIsLocked(true);
      }
    };

    lockTimerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
      }
    };
  }, [isLoggedIn, isLocked, lastActivity]);

  /* ═════════════════════════════════════════════════════════════════
     ACTIVITY EVENT LISTENERS
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, updateActivity]);

  /* ═════════════════════════════════════════════════════════════════
     ADMIN HOTKEY: Ctrl+Shift+D
     ═════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        injectMockData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     REGISTER — POST /auth/register
     ═════════════════════════════════════════════════════════════════ */
  const register = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
      /* ── Client-side quick checks (UX — don't wait for round-trip) ── */
      if (!username || username.trim().length < 3) {
        return { success: false, message: 'Username must be at least 3 characters.' };
      }
      if (!password || password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters.' };
      }

      /* ── Call the API ────────────────────────────────────────────── */
      const result = await apiClient<AuthRegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password,
          confirmPassword: password,
        }),
      });

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Registration successful! Please log in.',
        };
      }

      /* ── Surface the server's error message ──────────────────────── */
      return {
        success: false,
        message: result.message || 'Registration failed. Please try again.',
      };
    },
    []
  );

  /* ═════════════════════════════════════════════════════════════════
     LOGIN — POST /auth/login
     ═════════════════════════════════════════════════════════════════ */
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
      /* ── Admin dev bypass ─────────────────────────────────────────
         If the admin credentials match, we still attempt a real API
         call first. If the server isn't running or the admin account
         doesn't exist on the backend yet, we fall back to a local
         admin session so the dev environment is never blocked.
         ──────────────────────────────────────────────────────────── */
      const isAdminAttempt =
        username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

      /* ── Client-side quick validation ────────────────────────────── */
      if (!username || username.trim().length === 0) {
        return { success: false, message: 'Username is required.' };
      }
      if (!password || password.length === 0) {
        return { success: false, message: 'Password is required.' };
      }

      /* ── Call the API ────────────────────────────────────────────── */
      const result = await apiClient<AuthLoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (result.success && result.data) {
        const { user, token } = result.data;

        /* Persist token */
        localStorage.setItem(TOKEN_KEY, token.accessToken);

        /* Persist password reference for session-lock unlock */
        storedPasswordRef.current = password;
        localStorage.setItem(STORED_USERNAME_KEY, password);

        /* Update state */
        setIsLoggedIn(true);
        setUserProfile({
          username: user.username,
          role: user.username.toLowerCase() === ADMIN_USERNAME.toLowerCase() ? 'admin' : 'user',
        });
        setIsLocked(false);
        updateActivity();

        return {
          success: true,
          message:
            user.username.toLowerCase() === ADMIN_USERNAME.toLowerCase()
              ? 'Welcome, Admin!'
              : 'Login successful!',
        };
      }

      /* ── Admin fallback — server unreachable or account not in DB ── */
      if (isAdminAttempt) {
        storedPasswordRef.current = password;
        localStorage.setItem(STORED_USERNAME_KEY, password);
        setIsLoggedIn(true);
        setUserProfile({ username, role: 'admin' });
        setIsLocked(false);
        updateActivity();
        return { success: true, message: 'Welcome, Admin! (offline mode)' };
      }

      /* ── Surface the server's error message ──────────────────────── */
      return {
        success: false,
        message: result.message || 'Login failed. Please check your credentials.',
      };
    },
    [updateActivity]
  );

  /* ═════════════════════════════════════════════════════════════════
     LOGOUT
     ══════════════════════════════════════���══════════════════════════ */
  const logout = useCallback(() => {
    /* Clear persisted auth data */
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORED_USERNAME_KEY);

    /* Reset all auth state */
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsLocked(false);
    storedPasswordRef.current = '';
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     UNLOCK (Session Lock)
     ═════════════════════════════════════════════════════════════════ */
  const unlock = useCallback(
    (password: string): boolean => {
      if (password === storedPasswordRef.current) {
        setIsLocked(false);
        updateActivity();
        return true;
      }
      return false;
    },
    [updateActivity]
  );

  /* ═════════════════════════════════════════════════════════════════
     PORTFOLIO — Add Taken Trade
     ═════════════════════════════════════════════════════════════════ */
  const addTakenTrade = useCallback((trade: Omit<Trade, 'id' | 'simulatedPnL'>) => {
    const newTrade: Trade = {
      ...trade,
      id: `trade-${Date.now()}`,
      simulatedPnL: 0,
    };
    setTakenTrades(prev => [newTrade, ...prev]);
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     PORTFOLIO — Add Ignored Trade
     ═════════════════════════════════════════════════════════════════ */
  const addIgnoredTrade = useCallback((ignored: Omit<IgnoredSignal, 'id' | 'ignoredAt' | 'wouldHavePnL'>) => {
    const newIgnored: IgnoredSignal = {
      ...ignored,
      id: `ignored-${Date.now()}`,
      ignoredAt: new Date().toISOString(),
      wouldHavePnL: (Math.random() - 0.3) * 1000,
    };
    setIgnoredTrades(prev => [newIgnored, ...prev]);
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     PORTFOLIO — Close Trade
     ═════════════════════════════════════════════════════════════════ */
  const closeTrade = useCallback((tradeId: string, finalPnL: number) => {
    setTakenTrades(prev =>
      prev.map(trade =>
        trade.id === tradeId
          ? { ...trade, status: 'closed', simulatedPnL: finalPnL }
          : trade
      )
    );
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     PORTFOLIO — Update Trade PnL
     ═════════════════════════════════════════════════════════════════ */
  const updateTradePnL = useCallback((tradeId: string, pnl: number) => {
    setTakenTrades(prev =>
      prev.map(trade =>
        trade.id === tradeId
          ? { ...trade, simulatedPnL: pnl }
          : trade
      )
    );
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     SIGNALS — Get by ID
     ═════════════════════════════════════════════════════════════════ */
  const getSignalById = useCallback(
    (id: string): Signal | undefined => {
      return signals.find(s => s.id === id);
    },
    [signals]
  );

  /* ═════════════════════════════════════════════════════════════════
     ADMIN — Inject Mock Data (Ctrl+Shift+D)
     ═════════════════════════════════════════════════════════════════ */
  const injectMockData = useCallback(() => {
    const mockTakenTrades: Trade[] = Array.from({ length: 20 }, (_, i) => ({
      id: `mock-trade-${i}`,
      signalId: `sig-${String(i).padStart(3, '0')}`,
      amount: 1000 + Math.random() * 9000,
      type: Math.random() > 0.5 ? 'Spot' : 'Futures',
      entryPrice: 100 + Math.random() * 50000,
      targetPrice: 150 + Math.random() * 60000,
      stopLoss: 80 + Math.random() * 40000,
      status: Math.random() > 0.3 ? 'active' : 'closed',
      simulatedPnL: (Math.random() - 0.4) * 2000,
    }));

    const mockIgnoredTrades: IgnoredSignal[] = Array.from({ length: 15 }, (_, i) => ({
      id: `mock-ignored-${i}`,
      signalId: `sig-${String(i + 20).padStart(3, '0')}`,
      asset: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'][Math.floor(Math.random() * 4)],
      signal: ['Buy', 'Sell', 'Strong Buy'][Math.floor(Math.random() * 3)],
      ignoredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      wouldHavePnL: (Math.random() - 0.3) * 1500,
    }));

    const mockMissedTrades: MissedSignal[] = Array.from({ length: 15 }, (_, i) => ({
      id: `mock-missed-${i}`,
      signalId: `sig-${String(i + 35).padStart(3, '0')}`,
      asset: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT'][Math.floor(Math.random() * 4)],
      signal: ['Buy', 'Sell'][Math.floor(Math.random() * 2)],
      missedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      wouldHavePnL: (Math.random() - 0.3) * 1200,
    }));

    setTakenTrades(prev => [...mockTakenTrades, ...prev]);
    setIgnoredTrades(prev => [...mockIgnoredTrades, ...prev]);
    setMissedTrades(prev => [...mockMissedTrades, ...prev]);
  }, []);

  /* ═════════════════════════════════════════════════════════════════
     CONTEXT VALUE
     ═════════════════════════════════════════════════════════════════ */
  const value: GlobalContextType = {
    isLoggedIn,
    isAuthLoading,
    userProfile,
    login,
    logout,
    register,
    isLocked,
    unlock,
    lastActivity,
    updateActivity,
    takenTrades,
    ignoredTrades,
    missedTrades,
    addTakenTrade,
    addIgnoredTrade,
    closeTrade,
    updateTradePnL,
    signals,
    getSignalById,
    isSocketConnected,
    socketError,
    injectMockData,
  };

  /* ═════════════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════════════ */
  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOOK
   ═══════════════════════════════════════════════════════════════════════ */

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}