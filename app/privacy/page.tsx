'use client';

export default function PrivacyPolicy() {
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
            radial-gradient(ellipse at 0% 100%, rgba(180,79,255,0.1) 0%, transparent 50%);
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
          background: linear-gradient(90deg, var(--purple), transparent);
        }

        .badge {
          display: inline-block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--purple);
          border: 1px solid rgba(180,79,255,0.3);
          border-radius: 4px;
          padding: 4px 12px;
          margin-bottom: 16px;
          background: rgba(180,79,255,0.05);
        }

        .page-title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 42px;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(90deg, var(--text), var(--purple));
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
          color: var(--purple);
          opacity: 0.9;
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
          color: var(--purple);
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
          background: linear-gradient(180deg, var(--purple), var(--cyan));
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
          border-bottom: 1px solid rgba(180,79,255,0.05);
        }
        .section ul li:last-child { border-bottom: none; }
        .section ul li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--purple);
          opacity: 0.7;
          font-size: 12px;
          top: 8px;
        }

        .highlight { color: var(--text); font-weight: 500; }

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
          background: linear-gradient(90deg, transparent, var(--purple), transparent);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }
        @media (max-width: 540px) { .grid { grid-template-columns: 1fr; } }

        .grid-item {
          background: var(--dark3);
          border: 1px solid rgba(180,79,255,0.15);
          border-radius: 10px;
          padding: 16px;
        }
        .grid-item-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--purple);
          margin-bottom: 6px;
        }
        .grid-item p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
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
          <div className="page-title">Privacy Policy</div>
          <div className="meta">
            Effective date: <span>January 1, 2026</span> &nbsp;·&nbsp; Last updated: <span>January 1, 2026</span>
          </div>
        </div>

        <div className="section">
          <div className="section-title">1. Introduction</div>
          <div className="card">
            <p>BrawlCarry (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform. By using BrawlCarry, you consent to the practices described in this policy.</p>
          </div>
        </div>

        <div className="section">
          <div className="section-title">2. Information We Collect</div>
          <p>We collect the following types of information to provide and improve our services:</p>
          <div className="grid">
            <div className="grid-item">
              <div className="grid-item-title">Account Data</div>
              <p>Username, email address, and encrypted password when you register</p>
            </div>
            <div className="grid-item">
              <div className="grid-item-title">Game Data</div>
              <p>In-game usernames, account IDs, and rank information needed to complete orders</p>
            </div>
            <div className="grid-item">
              <div className="grid-item-title">Payment Data</div>
              <p>Transaction records processed securely — we do not store full card details</p>
            </div>
            <div className="grid-item">
              <div className="grid-item-title">Usage Data</div>
              <p>Pages visited, features used, and interaction logs to improve the platform</p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">3. How We Use Your Information</div>
          <ul>
            <li>To <span className="highlight">create and manage your account</span> on our platform</li>
            <li>To <span className="highlight">fulfill your orders</span> and deliver the services you purchased</li>
            <li>To <span className="highlight">process payments</span> and prevent fraudulent transactions</li>
            <li>To <span className="highlight">communicate with you</span> about your orders, updates, and support</li>
            <li>To <span className="highlight">improve our platform</span> through usage analytics and feedback</li>
            <li>To <span className="highlight">comply with legal obligations</span> where required by law</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">4. Data Sharing</div>
          <p>We do not sell your personal data to third parties. We may share information only in the following limited circumstances:</p>
          <ul>
            <li><span className="highlight">Service Providers</span> — Trusted partners who assist us in operating our platform (e.g. payment processors, hosting)</li>
            <li><span className="highlight">Legal Requirements</span> — When required by law, court order, or governmental authority</li>
            <li><span className="highlight">Business Transfers</span> — In the event of a merger, acquisition, or sale of assets</li>
            <li><span className="highlight">Safety</span> — To protect the rights, property, or safety of BrawlCarry, our users, or others</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">5. Data Security</div>
          <div className="card">
            <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to keep your credentials confidential.</p>
          </div>
        </div>

        <div className="section">
          <div className="section-title">6. Cookies</div>
          <p>We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze platform usage. You may disable cookies through your browser settings, though some features of the platform may not function correctly without them.</p>
        </div>

        <div className="section">
          <div className="section-title">7. Your Rights</div>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><span className="highlight">Access</span> — Request a copy of the personal data we hold about you</li>
            <li><span className="highlight">Correction</span> — Request correction of inaccurate or incomplete data</li>
            <li><span className="highlight">Deletion</span> — Request deletion of your personal data, subject to legal obligations</li>
            <li><span className="highlight">Portability</span> — Request your data in a portable, machine-readable format</li>
            <li><span className="highlight">Objection</span> — Object to certain processing of your data</li>
          </ul>
        </div>

        <div className="section">
          <div className="section-title">8. Data Retention</div>
          <p>We retain your personal data for as long as your account is active or as needed to provide services. You may request account deletion at any time. Some data may be retained for longer periods where required by law or for legitimate business purposes such as fraud prevention.</p>
        </div>

        <div className="section">
          <div className="section-title">9. Children&apos;s Privacy</div>
          <p>BrawlCarry is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us and we will promptly delete it.</p>
        </div>

        <div className="section">
          <div className="section-title">10. Changes to This Policy</div>
          <p>We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email or a prominent notice on our platform. Your continued use of BrawlCarry after changes are posted constitutes your acceptance of the updated policy.</p>
        </div>

        <div className="section">
          <div className="section-title">11. Contact Us</div>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out through our official support channels on the BrawlCarry platform.</p>
        </div>

        <div className="footer-note">
          © 2026 BrawlCarry. All rights reserved. &nbsp;·&nbsp;
          <a href="/terms">Terms of Service</a> &nbsp;·&nbsp;
          <a href="/auth">Back to Sign In</a>
        </div>
      </div>
    </>
  );
}
