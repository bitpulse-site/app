import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Key,
  Bell,
  Shield,
  Settings,
  Copy,
  Check,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Activity,   
  Radio,
  Lock,
  Mail,
  Send,
  AlertTriangle,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useGlobal } from '../GlobalContext';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
}

type SettingsTab = 'identity' | 'api-keys' | 'alerts' | 'risk';

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function generateKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'pk_live_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/* ════════════════════════════════��══════════════════════════════════════
   TOGGLE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
        enabled
          ? 'bg-[#00FF9D]/20 border border-[#00FF9D]/40 shadow-[0_0_12px_rgba(0,255,157,0.25)]'
          : 'bg-[#0B0E14] border border-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
          enabled
            ? 'left-[calc(100%-22px)] bg-[#00FF9D] shadow-[0_0_8px_rgba(0,255,157,0.6)]'
            : 'left-0.5 bg-gray-600'
        }`}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SLIDER COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

function RangeSlider({
  value,
  onChange,
  min,
  max,
  step,
  unit,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.15em]">
          {label}
        </span>
        <span className="font-mono text-sm font-bold text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#0B0E14] border border-white/[0.04]"
          style={{
            background: `linear-gradient(to right, #00FF9D ${pct}%, #0B0E14 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono text-[8px] text-gray-700">{min}{unit}</span>
        <span className="font-mono text-[8px] text-gray-700">{max}{unit}</span>
      </div>
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00FF9D;
          border: 2px solid #0B0E14;
          box-shadow: 0 0 8px rgba(0, 255, 157, 0.5);
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00FF9D;
          border: 2px solid #0B0E14;
          box-shadow: 0 0 8px rgba(0, 255, 157, 0.5);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function ProfileSettings() {
  const { isLoggedIn, userProfile } = useGlobal();
  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key_default_1',
      name: 'Default Key',
      key: 'pk_live_a8f29m4kq7n3x2bj1p6r0w5y',
      created: '2024-11-15',
      lastUsed: '2024-12-14',
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Alerts
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [signalPushEnabled, setSignalPushEnabled] = useState(true);
  const [whaleAlertEnabled, setWhaleAlertEnabled] = useState(false);
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);

  // Risk
  const [defaultTradeSize, setDefaultTradeSize] = useState(2);
  const [maxSlippage, setMaxSlippage] = useState(0.5);
  const [maxDailyDrawdown, setMaxDailyDrawdown] = useState(5);
  const [maxConcurrentTrades, setMaxConcurrentTrades] = useState(5);
  const [autoStopLoss, setAutoStopLoss] = useState(true);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const key: ApiKey = {
      id: `key_${Date.now().toString(36)}`,
      name: newKeyName.trim(),
      key: generateKey(),
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
    };
    setApiKeys((prev) => [...prev, key]);
    setNewKeyName('');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCopyKey = async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-[#00FF9D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[#00FF9D]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-8 font-mono text-sm">
            Authentication required to access terminal configuration.
          </p>
          <Link
            to="/?login=true"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_20px_rgba(0,255,157,0.25)]"
          >
            <span>&gt; Authenticate</span>
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { id: SettingsTab; label: string; tag: string; icon: React.ElementType }[] = [
    { id: 'identity', label: 'Identity', tag: 'ID_01', icon: User },
    { id: 'api-keys', label: 'API Keys', tag: 'KEY_02', icon: Key },
    { id: 'alerts', label: 'Alert Routing', tag: 'ALERT_03', icon: Bell },
    { id: 'risk', label: 'Risk Parameters', tag: 'RISK_04', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16 relative">
      {/* Ambient orbs */}
      <div className="absolute top-[15%] left-[20%] w-[450px] h-[450px] bg-[#00FF9D]/[0.02] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-cyan-400/[0.015] rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="relative">
              <span className="absolute inset-0 w-2 h-2 rounded-full bg-[#00FF9D] animate-ping opacity-40" />
              <span className="relative block w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
            </div>
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Terminal Configuration
            </span>
            <span className="font-mono text-[10px] text-gray-700">&middot;</span>
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.15em]">
              {userProfile?.username || 'operator'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
            Profile{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              Settings
            </span>
          </h1>
        </div>

        {/* ── Layout ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-3 sticky top-28 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 px-3 mb-3 pb-3 border-b border-white/[0.05]">
                <Settings className="w-3.5 h-3.5 text-[#00FF9D]/50" />
                <span className="font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                  Modules
                </span>
              </div>
              <nav className="space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-150 group ${
                      activeTab === tab.id
                        ? 'bg-[#00FF9D]/[0.06] border-l-2 border-[#00FF9D] shadow-[0_0_10px_rgba(0,255,157,0.04)]'
                        : 'border-l-2 border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <tab.icon
                        className={`w-4 h-4 transition-colors ${
                          activeTab === tab.id ? 'text-[#00FF9D]' : 'text-gray-600 group-hover:text-gray-400'
                        }`}
                      />
                      <div className="text-left">
                        <span
                          className={`block font-mono text-[11px] font-bold tracking-wider ${
                            activeTab === tab.id ? 'text-[#00FF9D]' : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                        >
                          {tab.label}
                        </span>
                        <span className="font-mono text-[7px] text-gray-700 uppercase tracking-[0.15em]">
                          {tab.tag}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-colors ${
                        activeTab === tab.id ? 'text-[#00FF9D]/40' : 'text-gray-800'
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ═══════════ IDENTITY ═══════════ */}
            {activeTab === 'identity' && (
              <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.05]">
                  <User className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                  <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                    [Identity_Module]
                  </span>
                </div>

                {/* Avatar + Info */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00FF9D]/20 to-[#00CC7D]/10 border-2 border-[#00FF9D]/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.08)]">
                      <User className="w-8 h-8 text-[#00FF9D]" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF9D] rounded-full border-2 border-[#151A22] shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 tracking-tight mb-1">
                      {userProfile?.username || 'Operator'}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-[#00FF9D]/70 uppercase tracking-[0.2em]">
                      {userProfile?.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                    <p className="font-mono text-[10px] text-gray-600 mt-2">
                      Session active &middot; Last login: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0B0E14] border border-white/[0.04] rounded-lg p-4">
                    <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.2em] block mb-2">
                      Username
                    </span>
                    <span className="font-mono text-sm text-gray-200 font-bold">
                      {userProfile?.username || '—'}
                    </span>
                  </div>
                  <div className="bg-[#0B0E14] border border-white/[0.04] rounded-lg p-4">
                    <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.2em] block mb-2">
                      Role
                    </span>
                    <span className="font-mono text-sm text-[#00FF9D] font-bold uppercase">
                      {userProfile?.role || 'member'}
                    </span>
                  </div>
                  <div className="bg-[#0B0E14] border border-white/[0.04] rounded-lg p-4">
                    <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.2em] block mb-2">
                      Account Status
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.8)]" />
                      <span className="font-mono text-sm text-[#00FF9D] font-bold">Active</span>
                    </span>
                  </div>
                  <div className="bg-[#0B0E14] border border-white/[0.04] rounded-lg p-4">
                    <span className="font-mono text-[8px] text-gray-600 uppercase tracking-[0.2em] block mb-2">
                      2FA Status
                    </span>
                    <span className="font-mono text-sm text-yellow-400 font-bold">
                      Not Enabled
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════ API KEYS ═══════════ */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                {/* Generate new key */}
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.05]">
                    <Key className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                      [Key_Management]
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Generate webhook keys for programmatic access. Keys are scoped to your account
                    permissions and can be revoked individually.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Key name (e.g., Production Bot)"
                      className="flex-1 px-4 py-3 bg-[#0B0E14] border border-white/10 rounded-lg font-mono text-sm text-gray-100 placeholder-gray-700 focus:outline-none focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.1)] transition-all"
                    />
                    <button
                      onClick={handleGenerateKey}
                      disabled={!newKeyName.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-[10px] uppercase tracking-wider hover:bg-[#00CC7D] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.4)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Generate Key</span>
                    </button>
                  </div>
                </div>

                {/* Key list */}
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2 px-6 py-3 bg-[#0B0E14] border-b border-white/[0.06]">
                    <Radio className="w-3.5 h-3.5 text-[#00FF9D]/50" />
                    <span className="font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                      Active Keys ({apiKeys.length})
                    </span>
                  </div>

                  {apiKeys.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                      {apiKeys.map((key) => (
                        <div
                          key={key.id}
                          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/[0.015] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm font-bold text-gray-200 mb-1">
                              {key.name}
                            </p>
                            <p className="font-mono text-[11px] text-gray-500 truncate">
                              {key.key}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="font-mono text-[8px] text-gray-700 uppercase tracking-wider">
                                Created: {key.created}
                              </span>
                              <span className="font-mono text-[8px] text-gray-700">
                                &middot;
                              </span>
                              <span className="font-mono text-[8px] text-gray-700 uppercase tracking-wider">
                                Last used: {key.lastUsed || 'Never'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCopyKey(key.id, key.key)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-[#0B0E14] border border-white/[0.06] rounded-lg font-mono text-[9px] uppercase tracking-wider text-gray-500 hover:text-[#00FF9D] hover:border-[#00FF9D]/30 transition-all"
                            >
                              {copiedKeyId === key.id ? (
                                <>
                                  <Check className="w-3 h-3 text-[#00FF9D]" />
                                  <span className="text-[#00FF9D]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteKey(key.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-[#0B0E14] border border-white/[0.06] rounded-lg font-mono text-[9px] uppercase tracking-wider text-gray-500 hover:text-[#FF3366] hover:border-[#FF3366]/30 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <Key className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                      <p className="font-mono text-[10px] text-gray-600 uppercase tracking-wider">
                        [ No active keys — generate one above ]
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════ ALERT ROUTING ═══════════ */}
            {activeTab === 'alerts' && (
              <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.05]">
                  <Bell className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                  <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                    [Alert_Routing_Config]
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Configure how and where you receive trading signal alerts,
                  whale notifications, and system events.
                </p>

                <div className="space-y-1">
                  {/* Telegram */}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center">
                        <Send className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Telegram Bot Ping
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          Instant signal notifications via Telegram
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={telegramEnabled} onChange={setTelegramEnabled} />
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#00FF9D]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Email Execution Alerts
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          Detailed trade execution summaries via email
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={emailAlertsEnabled} onChange={setEmailAlertsEnabled} />
                  </div>

                  {/* Signal Push */}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-[#00FF9D]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Signal Push Notifications
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          Browser push for high-confidence signals (&gt;80%)
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={signalPushEnabled} onChange={setSignalPushEnabled} />
                  </div>

                  {/* Whale Alerts */}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Whale Movement Alerts
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          Institutional block orders &gt; $1M detected
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={whaleAlertEnabled} onChange={setWhaleAlertEnabled} />
                  </div>

                  {/* Daily Digest */}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-400/10 border border-purple-400/20 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Daily Performance Digest
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          EOD summary of all signals and P&L
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={dailyDigestEnabled} onChange={setDailyDigestEnabled} />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════ RISK PARAMETERS ═══════════ */}
            {activeTab === 'risk' && (
              <div className="space-y-6">
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.05]">
                    <Sliders className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                      [Risk_Parameter_Config]
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Configure default risk parameters for automated and manual trade execution.
                    These values are applied as defaults when opening new positions.
                  </p>

                  <div className="space-y-8">
                    <RangeSlider
                      label="Default Trade Size"
                      value={defaultTradeSize}
                      onChange={setDefaultTradeSize}
                      min={0.5}
                      max={10}
                      step={0.5}
                      unit="%"
                    />

                    <RangeSlider
                      label="Max Slippage Tolerance"
                      value={maxSlippage}
                      onChange={setMaxSlippage}
                      min={0.1}
                      max={3}
                      step={0.1}
                      unit="%"
                    />

                    <RangeSlider
                      label="Max Daily Drawdown"
                      value={maxDailyDrawdown}
                      onChange={setMaxDailyDrawdown}
                      min={1}
                      max={15}
                      step={0.5}
                      unit="%"
                    />

                    <RangeSlider
                      label="Max Concurrent Trades"
                      value={maxConcurrentTrades}
                      onChange={setMaxConcurrentTrades}
                      min={1}
                      max={20}
                      step={1}
                      unit=""
                    />
                  </div>
                </div>

                {/* Auto-Stop Loss Toggle */}
                <div className="bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.05]">
                    <Shield className="w-5 h-5 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                    <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                      [Safety_Protocols]
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4 rounded-lg hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FF3366]/10 border border-[#FF3366]/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#FF3366]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-200">
                          Auto Stop-Loss Enforcement
                        </p>
                        <p className="font-mono text-[9px] text-gray-600 uppercase tracking-wider mt-0.5">
                          Automatically apply AI-recommended stop-loss on every trade
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={autoStopLoss} onChange={setAutoStopLoss} />
                  </div>

                  {/* Warning */}
                  <div className="mt-4 bg-[#FF3366]/[0.05] border border-[#FF3366]/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-[#FF3366] flex-shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] text-gray-500 leading-relaxed">
                      <span className="text-[#FF3366] font-bold">[RISK_WARNING]</span>{' '}
                      Disabling auto stop-loss removes a critical safety layer. All open positions
                      will require manual risk management. Proceed with extreme caution.
                    </p>
                  </div>
                </div>

                {/* Current Config Summary */}
                <div className="bg-[#0B0E14] border border-white/[0.04] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-3.5 h-3.5 text-gray-600" />
                    <span className="font-mono text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                      Active Configuration Summary
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#151A22]/80 rounded-lg p-3 text-center">
                      <span className="font-mono text-lg font-bold text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]">
                        {defaultTradeSize}%
                      </span>
                      <span className="block font-mono text-[7px] text-gray-600 uppercase tracking-wider mt-1">
                        Trade Size
                      </span>
                    </div>
                    <div className="bg-[#151A22]/80 rounded-lg p-3 text-center">
                      <span className="font-mono text-lg font-bold text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.4)]">
                        {maxSlippage}%
                      </span>
                      <span className="block font-mono text-[7px] text-gray-600 uppercase tracking-wider mt-1">
                        Max Slip
                      </span>
                    </div>
                    <div className="bg-[#151A22]/80 rounded-lg p-3 text-center">
                      <span className="font-mono text-lg font-bold text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]">
                        -{maxDailyDrawdown}%
                      </span>
                      <span className="block font-mono text-[7px] text-gray-600 uppercase tracking-wider mt-1">
                        DD Limit
                      </span>
                    </div>
                    <div className="bg-[#151A22]/80 rounded-lg p-3 text-center">
                      <span className="font-mono text-lg font-bold text-gray-200">
                        {maxConcurrentTrades}
                      </span>
                      <span className="block font-mono text-[7px] text-gray-600 uppercase tracking-wider mt-1">
                        Max Trades
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}