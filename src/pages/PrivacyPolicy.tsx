import { Shield } from 'lucide-react';
import StandardPageLayout from '../components/StandardPageLayout';

/* ═══════════════════════════════════════════════════════════════════════
   TERMINAL BULLET COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

function TerminalBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 w-1.5 h-1.5 rounded-[1px] bg-[#00FF9D]/60 flex-shrink-0 shadow-[0_0_4px_rgba(0,255,157,0.5)] animate-pulse" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicy() {
  return (
    <StandardPageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information"
    >
      <div className="space-y-10 text-gray-400 leading-loose">
        {/* System Header */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-white/[0.05]">
          <Shield className="w-4 h-4 text-[#00FF9D] drop-shadow-[0_0_4px_rgba(0,255,157,0.6)]" />
          <span className="font-mono text-[9px] font-bold text-[#00FF9D]/60 uppercase tracking-[0.2em]">
            [File_Classification: Public]
          </span>
          <span className="font-mono text-[9px] text-gray-700">&middot;</span>
          <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            [Encryption: None]
          </span>
          <span className="font-mono text-[9px] text-gray-700">&middot;</span>
          <span className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            [Revision: 3.1]
          </span>
        </div>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            1. Introduction
          </h2>
          <p className="mb-4">
            BitPulse ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website, mobile
            application, and services (collectively, the "Services").
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our
            Services, you acknowledge that you have read, understood, and agree
            to be bound by this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            2. Information We Collect
          </h2>
          <h3 className="font-mono text-sm font-bold text-gray-200 uppercase tracking-[0.12em] mb-3">
            2.1 Personal Information
          </h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul className="space-y-2.5 mb-5 ml-1">
            <TerminalBullet>Register for an account</TerminalBullet>
            <TerminalBullet>Subscribe to our newsletter</TerminalBullet>
            <TerminalBullet>Contact our support team</TerminalBullet>
            <TerminalBullet>
              Participate in surveys or promotions
            </TerminalBullet>
            <TerminalBullet>
              Use our trading signals and analysis tools
            </TerminalBullet>
          </ul>
          <p className="mb-5">
            This information may include your name, email address, phone number,
            and wallet addresses for cryptocurrency transactions.
          </p>

          <h3 className="font-mono text-sm font-bold text-gray-200 uppercase tracking-[0.12em] mb-3">
            2.2 Usage Information
          </h3>
          <p>
            We automatically collect certain information about your device and
            how you interact with our Services, including IP address, browser
            type, operating system, referring URLs, pages viewed, and the
            dates/times of your visits.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            3. How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Provide, maintain, and improve our Services
            </TerminalBullet>
            <TerminalBullet>
              Process transactions and send related information
            </TerminalBullet>
            <TerminalBullet>
              Send technical notices, updates, and support messages
            </TerminalBullet>
            <TerminalBullet>
              Respond to your comments and questions
            </TerminalBullet>
            <TerminalBullet>
              Personalize your experience and deliver relevant content
            </TerminalBullet>
            <TerminalBullet>
              Monitor and analyze trends, usage, and activities
            </TerminalBullet>
            <TerminalBullet>
              Detect, investigate, and prevent fraudulent transactions and abuse
            </TerminalBullet>
            <TerminalBullet>Comply with legal obligations</TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            4. Information Sharing
          </h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>With your consent</TerminalBullet>
            <TerminalBullet>
              With service providers who perform services on our behalf
            </TerminalBullet>
            <TerminalBullet>To comply with legal obligations</TerminalBullet>
            <TerminalBullet>
              To protect our rights, privacy, safety, or property
            </TerminalBullet>
            <TerminalBullet>
              In connection with a merger, acquisition, or sale of assets
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            5. Data Security
          </h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            6. Your Rights
          </h2>
          <p className="mb-4">
            Depending on your location, you may have the right to:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Access the personal information we hold about you
            </TerminalBullet>
            <TerminalBullet>
              Request correction of inaccurate information
            </TerminalBullet>
            <TerminalBullet>
              Request deletion of your personal information
            </TerminalBullet>
            <TerminalBullet>
              Object to or restrict certain processing activities
            </TerminalBullet>
            <TerminalBullet>
              Request portability of your information
            </TerminalBullet>
            <TerminalBullet>Withdraw consent at any time</TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            7. Cookies and Tracking
          </h2>
          <p>
            We use cookies and similar tracking technologies to track activity on
            our Services and hold certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent. However, some parts of our Services may not function properly
            without cookies.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page and
            updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            9. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{' '}
            <a
              href="mailto:privacy@bitpulse.io"
              className="text-[#00FF9D] hover:underline drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]"
            >
              privacy@bitpulse.io
            </a>
            .
          </p>
        </section>

        <p className="font-mono text-[11px] text-gray-600 pt-8 border-t border-white/[0.05] uppercase tracking-[0.12em]">
          Last Updated: December 1, 2024
        </p>
      </div>
    </StandardPageLayout>
  );
}