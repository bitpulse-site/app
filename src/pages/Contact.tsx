import { useState } from 'react';
import {
  Send,
  Mail,
  CheckCircle,
  Loader2,
  Shield,
  Clock,
  Radio,
  Terminal,
  AlertTriangle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const API_BASE_URL = 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

type Topic = 'General Inquiry' | 'Technical Support' | 'Bug Report' | 'Feature Request' | 'Partnership' | 'API Access' | 'Billing' | 'Security' | 'Other';

interface FormData {
  name: string;
  email: string;
  topic: Topic;
  message: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: formData.topic,
          message: formData.message.trim(),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        const errMsg =
          json?.error?.message ||
          json?.message ||
          `Server returned status ${response.status}. Please try again.`;
        setSubmitError(errMsg);
        setIsSubmitting(false);
        return;
      }

      // Extract ticket/reference ID from server response if available
      const refId =
        json?.data?.id ||
        json?.data?.ticketId ||
        json?.data?.referenceId ||
        json?.ticketId ||
        '';
      setTicketId(refId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof TypeError && err.message === 'Failed to fetch'
          ? 'Unable to reach the server. Please check your connection and try again.'
          : err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  /* ═════════════════════════════════════════════════════════════════════
     SUCCESS SCREEN
     ═════════════════════════════════════════════════════════════════════ */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16 relative">
        {/* Ambient orbs */}
        <div className="absolute top-[20%] left-1/3 w-[400px] h-[400px] bg-[#00FF9D]/[0.05] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-1/3 w-[300px] h-[300px] bg-[#00FF9D]/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#151A22]/90 border border-[#00FF9D]/20 backdrop-blur-xl rounded-2xl p-12 text-center shadow-[0_0_60px_rgba(0,255,157,0.08)]">
            {/* Glowing checkmark */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-[#00FF9D]/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 bg-[#00FF9D]/5 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-[#00FF9D]/10 border border-[#00FF9D]/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,157,0.2)]">
                <CheckCircle className="w-12 h-12 text-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 mb-4">
              <Shield className="w-4 h-4 text-[#00FF9D]/70" />
              <span className="font-mono text-[10px] font-bold text-[#00FF9D] uppercase tracking-[0.2em]">
                [Transmission_Secured]
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-100 mb-4 tracking-tight">
              Message Delivered
            </h2>

            {/* Ticket reference ID */}
            {ticketId && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B0E14] border border-white/[0.06] rounded-lg mb-6">
                <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                  Reference:
                </span>
                <span className="font-mono text-sm font-bold text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]">
                  {ticketId}
                </span>
              </div>
            )}

            <p className="text-gray-500 font-mono text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Your transmission has been received and routed to our support
              node. Our team will review your request and respond within the
              SLA window.
            </p>

            {/* SLA reminder */}
            <div className="bg-[#0B0E14] border border-white/[0.04] rounded-lg p-4 mb-8 max-w-sm mx-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                    Expected Response
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#00FF9D]">
                    24-48 hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                    Channel
                  </span>
                  <span className="font-mono text-[11px] font-bold text-gray-400">
                    {formData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                    Category
                  </span>
                  <span className="font-mono text-[11px] font-bold text-gray-400 capitalize">
                    {formData.topic}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setTicketId('');
                setFormData({
                  name: '',
                  email: '',
                  topic: 'General Inquiry',
                  message: '',
                });
              }}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all shadow-[0_0_25px_rgba(0,255,157,0.3)] hover:shadow-[0_0_45px_rgba(0,255,157,0.5)]"
            >
              <span>&gt; Open_New_Channel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════════════
     MAIN FORM
     ═════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0B0E14] pt-28 pb-16 relative">
      {/* ── Ambient Glow Orbs ──────────────────────────────────────── */}
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-[#00FF9D]/[0.04] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-[#00CC7D]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[35%] w-[350px] h-[350px] bg-[#00FF9D]/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center space-x-3 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
            <span className="font-mono text-[10px] text-[#00FF9D]/70 uppercase tracking-[0.2em]">
              Secure Communications Relay
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 tracking-tight">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00CC7D]">
              Touch
            </span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-mono text-sm leading-relaxed">
            Have a question, need an API key, or want to discuss a partnership?
            Route your transmission below and we'll respond within 24-48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Contact Form ────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Decorative corner orb */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FF9D]/[0.02] rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />

              {/* Form header */}
              <div className="flex items-center space-x-2.5 mb-8 pb-5 border-b border-white/[0.05]">
                <Terminal className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
                <span className="font-mono text-[9px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
                  [Node: Relay_Interface]
                </span>
                <span className="font-mono text-[9px] text-gray-700">
                  &middot;
                </span>
                <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.15em]">
                  Encrypted Channel
                </span>
              </div>

              <div className="relative space-y-6">
                {/* Server Error Banner */}
                {submitError && (
                  <div className="flex items-start gap-3 p-4 bg-[#FF3366]/[0.06] border border-[#FF3366]/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-[#FF3366] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[10px] font-bold text-[#FF3366] uppercase tracking-[0.15em] mb-1">
                        [Transmission_Failed]
                      </p>
                      <p className="font-mono text-[12px] text-[#FF3366]/80 leading-relaxed">
                        {submitError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2.5"
                  >
                    Identifier (Name)
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 bg-[#0B0E14] rounded-lg font-mono text-sm text-gray-100 placeholder-gray-700 focus:outline-none transition-all ${
                      errors.name
                        ? 'border border-[#FF3366]/50 shadow-[0_0_10px_rgba(255,51,102,0.1)]'
                        : 'border border-white/10 focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.15)]'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-2 font-mono text-[11px] font-bold text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]">
                      [ERR] {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2.5"
                  >
                    Relay Address (Email)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 bg-[#0B0E14] rounded-lg font-mono text-sm text-gray-100 placeholder-gray-700 focus:outline-none transition-all ${
                      errors.email
                        ? 'border border-[#FF3366]/50 shadow-[0_0_10px_rgba(255,51,102,0.1)]'
                        : 'border border-white/10 focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.15)]'
                    }`}
                    placeholder="analyst@fund.com"
                  />
                  {errors.email && (
                    <p className="mt-2 font-mono text-[11px] font-bold text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]">
                      [ERR] {errors.email}
                    </p>
                  )}
                </div>

                {/* Topic */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2.5"
                  >
                    Routing Category
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-[#0B0E14] border border-white/10 rounded-lg font-mono text-sm text-gray-100 focus:outline-none focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.15)] transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300FF9D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                    }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Partnership">Partnership</option>
                    <option value="API Access">API Access</option>
                    <option value="Billing">Billing</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2.5"
                  >
                    Transmission Payload
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3.5 bg-[#0B0E14] rounded-lg font-mono text-sm text-gray-100 placeholder-gray-700 focus:outline-none transition-all resize-none ${
                      errors.message
                        ? 'border border-[#FF3366]/50 shadow-[0_0_10px_rgba(255,51,102,0.1)]'
                        : 'border border-white/10 focus:border-[#00FF9D]/50 focus:shadow-[0_0_15px_rgba(0,255,157,0.15)]'
                    }`}
                    placeholder="Describe your query in detail..."
                  />
                  {errors.message && (
                    <p className="mt-2 font-mono text-[11px] font-bold text-[#FF3366] drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]">
                      [ERR] {errors.message}
                    </p>
                  )}
                  <p className="mt-1.5 font-mono text-[9px] text-gray-700 tracking-wide">
                    Min 10 characters &middot;{' '}
                    <span
                      className={
                        formData.message.length >= 10
                          ? 'text-[#00FF9D]/60'
                          : 'text-gray-600'
                      }
                    >
                      {formData.message.length}
                    </span>{' '}
                    chars
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2.5 px-6 py-4 bg-[#00FF9D] text-[#0B0E14] rounded-lg font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#00CC7D] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(0,255,157,0.25)] hover:shadow-[0_0_45px_rgba(0,255,157,0.5)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>&gt; Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>&gt; Initiate_Transmission</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Routing Sidebar ─────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Email Node */}
            <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300">
              <span className="absolute top-4 left-4 font-mono text-[7px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                [Node: Support_Desk]
              </span>
              <div className="mt-4">
                <div className="w-11 h-11 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-[#00FF9D]" />
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-1.5 tracking-tight">
                  Email Us
                </h3>
                <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.12em] mb-3">
                  General Inquiries &amp; Support
                </p>
                <a
                  href="mailto:support@bitpulse.io"
                  className="text-[#00FF9D] font-mono text-sm hover:underline drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]"
                >
                  contact@bitpulse.site
                </a>
              </div>
            </div>

            {/* Response Times */}
            <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300">
              <span className="absolute top-4 left-4 font-mono text-[7px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                [Node: Routing_SLA]
              </span>
              <div className="mt-4">
                <div className="w-11 h-11 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-[#00FF9D]" />
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-4 tracking-tight">
                  Response Time
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'API Access', time: '24 hours' },
                    { label: 'Billing', time: '24 hours' },
                    { label: 'Security', time: '24-48 hours' },
                    { label: 'Bug Report', time: '24-48 hours' },
                    { label: 'Technical Support', time: '24-48 hours' },
                    { label: 'Partnership', time: '2-3 days' },
                    { label: 'Feature Request', time: '1 week' },
                    { label: 'General Inquiry', time: '1 week' },
                    { label: 'Other', time: '1 week' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.1em]">
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#00FF9D]">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="relative overflow-hidden bg-[#151A22]/90 border border-white/5 backdrop-blur-md rounded-xl p-6 hover:border-[#00FF9D]/20 hover:shadow-[0_0_15px_rgba(0,255,157,0.06)] transition-all duration-300">
              <span className="absolute top-4 left-4 font-mono text-[7px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                [Node: System_Status]
              </span>
              <div className="mt-4">
                <div className="w-11 h-11 bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded-xl flex items-center justify-center mb-4">
                  <Radio className="w-5 h-5 text-[#00FF9D] animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-4 tracking-tight">
                  Relay Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.1em]">
                      Contact API
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.8)]" />
                      <span className="font-mono text-[10px] font-bold text-[#00FF9D]">
                        Online
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.1em]">
                      Encryption
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] shadow-[0_0_4px_rgba(0,255,157,0.8)]" />
                      <span className="font-mono text-[10px] font-bold text-[#00FF9D]">
                        Active
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.1em]">
                      Uptime
                    </span>
                    <span className="font-mono text-[10px] font-bold text-gray-300">
                      99.97%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}