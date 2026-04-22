'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [rememberMe, setRememberMe] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [password, setPassword] = useState('');

  function getStrength(val: string) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  function getSegClass(index: number) {
    const score = getStrength(password);
    if (index >= score || !password) return 'strength-seg';
    if (score <= 1) return 'strength-seg weak';
    if (score <= 2) return 'strength-seg medium';
    return 'strength-seg strong';
  }

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
          --glow-purple: 0 0 20px rgba(180,79,255,0.4);
        }

        body {
          font-family: 'Exo 2', sans-serif;
          background: var(--dark);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
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
          background: radial-gradient(ellipse at 50% 0%, rgba(68,136,255,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 100% 100%, rgba(180,79,255,0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at 0% 100%, rgba(0,212,255,0.08) 0%, transparent 50%);
        }

        .tab-bar {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 0;
          margin: 40px auto 0;
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 4px;
          width: 320px;
        }
        .tab {
          flex: 1;
          padding: 10px;
          text-align: center;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 8px;
          color: var(--text-muted);
          transition: all 0.3s;
          user-select: none;
        }
        .tab.active {
          background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(180,79,255,0.15));
          color: var(--cyan);
          box-shadow: var(--glow-cyan);
          border: 1px solid var(--border-hover);
        }

        .card-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          margin: 24px auto 40px;
          padding: 0 16px;
        }

        .card {
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), var(--purple), transparent);
        }
        .card::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(180,79,255,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }
        .logo-img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid rgba(0,212,255,0.3);
          box-shadow: 0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(180,79,255,0.15);
          margin-bottom: 14px;
          background: linear-gradient(135deg,#050810,#1a0a2e);
        }
        .logo-title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(90deg, var(--cyan), var(--purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-sub {
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .form-title {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: 2px;
          margin-bottom: 6px;
          color: var(--text);
        }
        .form-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        .input-group {
          margin-bottom: 18px;
          position: relative;
        }
        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 16px;
          pointer-events: none;
          transition: color 0.3s;
        }
        .input-wrap:focus-within .input-icon {
          color: var(--cyan);
        }
        input[type="text"],
        input[type="email"],
        input[type="password"] {
          width: 100%;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 13px 14px 13px 42px;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: all 0.3s;
          letter-spacing: 0.5px;
        }
        input::placeholder { color: var(--text-muted); }
        input:focus {
          border-color: var(--cyan);
          box-shadow: 0 0 0 3px rgba(0,212,255,0.1), var(--glow-cyan);
          background: rgba(0,212,255,0.03);
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          color: var(--text-muted);
          user-select: none;
        }
        .custom-checkbox {
          width: 18px;
          height: 18px;
          border: 1.5px solid var(--border-hover);
          border-radius: 5px;
          background: var(--dark3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .custom-checkbox.checked {
          background: linear-gradient(135deg, var(--cyan), var(--blue));
          border-color: var(--cyan);
          box-shadow: var(--glow-cyan);
        }
        .checkmark {
          color: var(--dark);
          font-size: 11px;
          font-weight: 700;
        }
        .forgot {
          font-size: 12px;
          color: var(--cyan);
          text-decoration: none;
          letter-spacing: 0.5px;
          opacity: 0.8;
          transition: opacity 0.2s;
          cursor: pointer;
          background: none;
          border: none;
        }
        .forgot:hover { opacity: 1; }

        .btn-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--cyan), var(--blue), var(--purple));
          background-size: 200% 200%;
          border: none;
          border-radius: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dark);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          animation: gradShift 4s ease infinite;
        }
        @keyframes gradShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,212,255,0.4), 0 4px 15px rgba(180,79,255,0.3);
        }
        .btn-submit:active { transform: translateY(0); }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 22px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .divider-text {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .btn-social {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-bottom: 10px;
        }
        .btn-social:hover {
          border-color: var(--border-hover);
          background: rgba(0,212,255,0.05);
          transform: translateY(-1px);
        }

        .terms {
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 20px;
          line-height: 1.6;
        }
        .terms a { color: var(--cyan); text-decoration: none; opacity: 0.8; }
        .terms a:hover { opacity: 1; }

        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: var(--cyan);
          border-style: solid;
          opacity: 0.4;
        }
        .corner-tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

        .strength-bar {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }
        .strength-seg {
          flex: 1;
          height: 3px;
          background: var(--dark3);
          border-radius: 2px;
          transition: background 0.3s;
        }
        .strength-seg.weak { background: #ff4466; }
        .strength-seg.medium { background: #ffaa00; }
        .strength-seg.strong { background: var(--cyan); }
      `}</style>

      <div className="bg" />

      <div className="tab-bar">
        <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Sign In</div>
        <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</div>
      </div>

      <div className="card-wrap">
        <div className="card">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div className="logo-wrap">
            <div className="logo-img" />
            <div className="logo-title">BrawlCarry</div>
            <div className="logo-sub">Elite Boosting Service</div>
          </div>

          {activeTab === 'login' && (
            <div>
              <div className="form-title">Welcome Back</div>
              <div className="form-sub">Sign in to your account to continue</div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrap">
                  <input type="email" placeholder="your@email.com" />
                  <span className="input-icon">✉</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrap">
                  <input type="password" placeholder="••••••••" />
                  <span className="input-icon">🔒</span>
                </div>
              </div>

              <div className="checkbox-row">
                <label className="checkbox-label" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`custom-checkbox ${rememberMe ? 'checked' : ''}`}>
                    {rememberMe && <span className="checkmark">✓</span>}
                  </div>
                  Remember me for 30 days
                </label>
                <button className="forgot">Forgot password?</button>
              </div>

              <button className="btn-submit">Sign In</button>

              <div className="divider">
                <div className="divider-line" />
                <div className="divider-text">or</div>
                <div className="divider-line" />
              </div>

              <button className="btn-social">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {activeTab === 'signup' && (
            <div>
              <div className="form-title">Create Account</div>
              <div className="form-sub">Join the BrawlCarry arena today</div>

              <div className="input-group">
                <label className="input-label">Username</label>
                <div className="input-wrap">
                  <input type="text" placeholder="YourGamertag" />
                  <span className="input-icon">⚡</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrap">
                  <input type="email" placeholder="your@email.com" />
                  <span className="input-icon">✉</span>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrap">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="input-icon">🔒</span>
                </div>
                <div className="strength-bar">
                  <div className={getSegClass(0)} />
                  <div className={getSegClass(1)} />
                  <div className={getSegClass(2)} />
                  <div className={getSegClass(3)} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label className="input-label">Confirm Password</label>
                <div className="input-wrap">
                  <input type="password" placeholder="••••••••" />
                  <span className="input-icon">🔒</span>
                </div>
              </div>

              <div className="checkbox-row" style={{ marginBottom: '20px' }}>
                <label className="checkbox-label" onClick={() => setKeepSignedIn(!keepSignedIn)}>
                  <div className={`custom-checkbox ${keepSignedIn ? 'checked' : ''}`}>
                    {keepSignedIn && <span className="checkmark">✓</span>}
                  </div>
                  Keep me signed in on this device
                </label>
              </div>

              <button className="btn-submit">Create Account</button>

              <div className="terms">
                By creating an account you agree to our{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
