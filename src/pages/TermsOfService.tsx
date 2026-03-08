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

export default function TermsOfService() {
  return (
    <StandardPageLayout
      title="Terms of Service"
      subtitle="Terms and conditions governing your use of BitPulse services"
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
            [Binding: Legal Agreement]
          </span>
        </div>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using BitPulse's website, mobile application, and
            services (collectively, the "Services"), you agree to be bound by
            these Terms of Service ("Terms"). If you do not agree to these Terms,
            you may not access or use the Services.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you and
            BitPulse regarding your use of the Services. Please read them
            carefully.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            2. Description of Services
          </h2>
          <p className="mb-4">
            BitPulse provides cryptocurrency market analysis, trading signals,
            research articles, and related educational content. Our Services
            include:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Real-time and historical cryptocurrency market data
            </TerminalBullet>
            <TerminalBullet>
              Trading signals and technical analysis
            </TerminalBullet>
            <TerminalBullet>
              Research reports and educational content
            </TerminalBullet>
            <TerminalBullet>
              Portfolio tracking and analytics tools
            </TerminalBullet>
            <TerminalBullet>
              API access for developers (where available)
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            3. Eligibility
          </h2>
          <p className="mb-4">
            You must be at least 18 years old to use our Services. By using the
            Services, you represent and warrant that:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              You are at least 18 years of age
            </TerminalBullet>
            <TerminalBullet>
              You have the legal capacity to enter into these Terms
            </TerminalBullet>
            <TerminalBullet>
              You are not located in a country subject to U.S. sanctions
            </TerminalBullet>
            <TerminalBullet>
              You are not on any list of prohibited or restricted parties
            </TerminalBullet>
            <TerminalBullet>
              Your use of the Services complies with all applicable laws and
              regulations
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            4. Account Registration
          </h2>
          <p className="mb-4">
            To access certain features of the Services, you may need to create an
            account. You agree to:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Provide accurate, current, and complete information
            </TerminalBullet>
            <TerminalBullet>
              Maintain and promptly update your account information
            </TerminalBullet>
            <TerminalBullet>
              Maintain the security of your account credentials
            </TerminalBullet>
            <TerminalBullet>
              Notify us immediately of any unauthorized access
            </TerminalBullet>
            <TerminalBullet>
              Accept responsibility for all activities under your account
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            5. Not Financial Advice
          </h2>
          <p className="mb-4">
            <strong className="text-[#FF3366] font-mono font-bold drop-shadow-[0_0_4px_rgba(255,51,102,0.5)]">
              IMPORTANT DISCLAIMER:
            </strong>{' '}
            The information provided through our Services is for informational
            and educational purposes only. It does not constitute financial
            advice, investment advice, trading advice, or any other sort of
            advice.
          </p>
          <p className="mb-4">
            You should not treat any content on our Services as such. BitPulse
            does not recommend that any cryptocurrency should be bought, sold, or
            held by you. Conduct your own due diligence and consult your
            financial advisor before making any investment decisions.
          </p>
          <p>
            Cryptocurrency investments carry significant risks, including the
            possible loss of capital. Past performance is not indicative of
            future results.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            6. Prohibited Activities
          </h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Use the Services for any illegal purpose
            </TerminalBullet>
            <TerminalBullet>
              Attempt to gain unauthorized access to our systems
            </TerminalBullet>
            <TerminalBullet>
              Interfere with or disrupt the Services
            </TerminalBullet>
            <TerminalBullet>
              Scrape, crawl, or otherwise collect data without authorization
            </TerminalBullet>
            <TerminalBullet>
              Impersonate another person or entity
            </TerminalBullet>
            <TerminalBullet>
              Transmit any viruses, malware, or harmful code
            </TerminalBullet>
            <TerminalBullet>
              Use the Services to manipulate markets or engage in fraudulent
              activities
            </TerminalBullet>
            <TerminalBullet>
              Reproduce, duplicate, copy, sell, or resell any portion of the
              Services
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            7. Intellectual Property
          </h2>
          <p className="mb-4">
            The Services and their original content, features, and functionality
            are owned by BitPulse and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property
            laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works
            of, publicly display, publicly perform, republish, download, store,
            or transmit any of the material on our Services without our prior
            written consent.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            8. Limitation of Liability
          </h2>
          <p className="mb-4">
            To the maximum extent permitted by law, BitPulse and its affiliates,
            officers, employees, agents, and licensors shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to:
          </p>
          <ul className="space-y-2.5 ml-1">
            <TerminalBullet>
              Loss of profits, revenue, or data
            </TerminalBullet>
            <TerminalBullet>
              Investment losses or trading losses
            </TerminalBullet>
            <TerminalBullet>
              Loss of business opportunities
            </TerminalBullet>
            <TerminalBullet>
              Personal injury or property damage
            </TerminalBullet>
            <TerminalBullet>
              Any other damages arising from your use of the Services
            </TerminalBullet>
          </ul>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            9. Indemnification
          </h2>
          <p>
            You agree to indemnify, defend, and hold harmless BitPulse and its
            affiliates from and against any claims, liabilities, damages, losses,
            and expenses, including reasonable attorneys' fees, arising out of or
            in any way connected with your access to or use of the Services or
            your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            10. Termination
          </h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to the Services
            immediately, without prior notice or liability, for any reason,
            including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Services will immediately
            cease. All provisions of these Terms which by their nature should
            survive termination shall survive.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            11. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of the State of Delaware, United States, without regard to its
            conflict of law provisions. Any legal action arising out of these
            Terms shall be filed only in the state or federal courts located in
            Delaware.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            12. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We
            will provide notice of any material changes by posting the new Terms
            on this page. Your continued use of the Services after any changes
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-lg font-bold text-[#00FF9D] uppercase tracking-[0.15em] mb-4">
            13. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a
              href="mailto:legal@bitpulse.io"
              className="text-[#00FF9D] hover:underline drop-shadow-[0_0_4px_rgba(0,255,157,0.5)]"
            >
              legal@bitpulse.io
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