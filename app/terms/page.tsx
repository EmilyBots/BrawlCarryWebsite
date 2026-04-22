'use client';

export default function TermsOfService() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cyan: #00d4ff;
          --purple: #b44fff;
          --blue: #4488ff;
          --dark: #050810;
          --dark2: #0a0f1e;
          --dark3: #0f1628;
          --border: rgba(0, 212, 255, 0.2);
          --border-hover: rgba(0, 212, 255, 0.5);
          --text: #e8f0ff;
          --text-muted: #7a8ab0;
          --glow-cyan: 0 0 20px rgba(0,212,255,0.4);
        }

        body {
          font-family: 'Exo 2', sans-serif;
          background: var(--dark);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .bg {
          position: fixed;
          inset: 0;
          background:
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
        }
        .bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(68,136,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 100% 100%, rgba(180,79,255,0.1) 0%, transparent 50%);
        }

        .container {
          position: relative;
          z-index: 10;
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--cyan);
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          opacity: 0.8;
          transition: opacity 0.2s;
          margin-bottom: 40px;
          cursor: pointer;
          background: none;
          border: none;
        }
        .back-link:hover { opacity: 1; }

        .header {
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, var(--cyan), transparent);
        }

        .badge {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--cyan);
          border: 1px solid rgba(0,212,255,0.3);
          border-radius: 4px;
          padding: 4px 12px;
          margin-bottom: 16px;
          background: rgba(0,212,255,0.05);
        }

        .page-title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 42px;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(90deg, var(--text), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .meta {
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
        .meta span {
          color: var(--cyan);
          opacity: 0.8;
        }

        .section {
          margin-bottom: 36px;
        }

        .section-title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-title::before {
          content: '';
          display: block;
          width: 4px;
          height: 18px;
          background: linear-gradient(180deg, var(--cyan), var(--purple));
          border-radius: 2px;
          flex-shrink: 0;
        }

        .section p {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .section p:last-child { margin-bottom: 0; }

        .section ul {
          list-style: none;
          padding: 0;
          margin-top: 8px;
        }
        .section ul li {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-muted);
          padding: 6px 0 6px 20px;
          position: relative;
          border-bottom: 1px solid rgba(0,212,255,0.05);
        }
        .section ul li:last-child { border-bottom: none; }
        .section ul li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--cyan);
          opacity: 0.7;
          font-size: 12px;
          top: 8px;
        }

        .highlight {
          color: var(--text);
          font-weight: 500;
        }

        .card {
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
        }

        .footer-note {
          margin-top: 48px;
          padding: 20px 24px;
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.7;
          text-align: center;
        }
        .footer-note a {
          color: var(--cyan);
          text-decoration: none;
          opacity: 0.9;
        }
        .footer-note a:hover { opacity: 1; }
      `}</style>

      <div className="bg" />

      <div className="container">
        <a className="back-link" href="/auth">← Back to Sign In</a>

        <div className="header">
          <div className="badge">Legal Document</div>
          <div className="page-title">Terms of Service</div>
          <div className="meta">
            Effective date: <span>January 1, 2026</span> &nbsp;·&nbsp; Last updated: <span>January 1, 2026</span>
          </div>
        </div>

        <div className="section">
          <div className="section-title">1. Acceptance of Terms</div>
          <div className="card">
            <p>By accessing or using BrawlCarry (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time — continued use of the Service constitutes acceptance of any changes.</p>
          </div>
        </div>

        <div className="section">
          <div className="section-title">2. Description of Service</div>
          <p>BrawlCarry provides rank boosting, coaching, and account-related services for Brawl Stars and other supported mobile games. Our services include:</p>
          <ul>
            <li><span className="highlight">Rank Boosting</span> — Professional players improve your in-game rank on your behalf</li>
            <li><span className="highlight">Coaching Sessions</span> — One-on-one sessions to improve your personal skills</li>
            <li><span className="highlight">Account Services</span> — Trophy pushing and other account improvement services</li>
            <li><span className="highlight">Custom Orders</span> — Tailored services based on your specific requirements</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">3. Account Registration</div>
          <p>To use our services, you must create an account with accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <ul>
            <li>You must be at least <span className="highlight">13 years of age</span> to use this Service</li>
            <li>You may not create multiple accounts for the purpose of circumventing bans or restrictions</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to terminate accounts that violate these terms</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">4. Payment & Refunds</div>
          <p>All prices are displayed in USD unless otherwise stated. Payments are processed securely through our payment providers.</p>
          <ul>
            <li>Payments are <span className="highlight">non-refundable</span> once a service has been initiated</li>
            <li>If a service cannot be completed due to our error, a full refund will be issued</li>
            <li>Chargebacks initiated without contacting us first will result in permanent account suspension</li>
            <li>We reserve the right to modify pricing at any time with reasonable notice</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">5. User Responsibilities</div>
          <p>When using BrawlCarry services, you agree to the following:</p>
          <ul>
            <li>Provide accurate game account credentials when required</li>
            <li>Do not log into your account during active boosting sessions</li>
            <li>Do not use our services in violation of any game&apos;s Terms of Service</li>
            <li>Do not attempt to manipulate or defraud BrawlCarry or its operators</li>
            <li>Do not share, resell, or redistribute our services without authorization</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">6. Disclaimer of Warranties</div>
          <div className="card">
            <p>BrawlCarry provides the Service on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. We do not guarantee specific results, completion times, or outcomes. Game publishers may update their systems at any time, which may affect our ability to deliver services.</p>
          </div>
        </div>

        <div className="section">
          <div className="section-title">7. Limitation of Liability</div>
          <p>To the fullest extent permitted by law, BrawlCarry shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to account bans imposed by game publishers.</p>
        </div>

        <div className="section">
          <div className="section-title">8. Governing Law</div>
          <p>These Terms of Service shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration rather than court proceedings, except where prohibited by law.</p>
        </div>

        <div className="section">
          <div className="section-title">9. Contact Us</div>
          <p>If you have any questions about these Terms of Service, please contact our support team through the official BrawlCarry platform or via our official communication channels.</p>
        </div>

        <div className="footer-note">
          © 2026 BrawlCarry. All rights reserved. &nbsp;·&nbsp;
          <a href="/privacy">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="/auth">Back to Sign In</a>
        </div>
      </div>
    </>
  );
}
