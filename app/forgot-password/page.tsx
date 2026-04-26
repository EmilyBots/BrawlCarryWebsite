'use client';

import { useState } from 'react';

type Step = 'email' | 'code' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  function getStrength(val: string) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  function getSegClass(index: number) {
    const score = getStrength(newPassword);
    if (index >= score || !newPassword) return 'strength-seg';
    if (score <= 1) return 'strength-seg weak';
    if (score <= 2) return 'strength-seg medium';
    return 'strength-seg strong';
  }

  async function handleSendCode() {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else { setStep('code'); setResendCooldown(60); startCooldown(); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  function startCooldown() {
    let t = 60;
    const interval = setInterval(() => {
      t--;
      setResendCooldown(t);
      if (t <= 0) clearInterval(interval);
    }, 1000);
  }

  async function handleVerifyCode() {
    setError(''); setLoading(true);
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); setLoading(false); return; }
    try {
      const res = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else { setStep('reset'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  async function handleReset() {
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (getStrength(newPassword) < 2) { setError('Password is too weak.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp.join(''), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else { setStep('done'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(newOtp);
      const el = document.getElementById(`otp-${Math.min(pasted.length, 5)}`) as HTMLInputElement;
      el?.focus();
    }
  }

  const STEPS = ['email', 'code', 'reset', 'done'];
  const stepIndex = STEPS.indexOf(step);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cyan: #00d4ff; --purple: #b44fff; --blue: #4488ff;
          --dark: #050810; --dark2: #0a0f1e; --dark3: #0f1628;
          --border: rgba(0,212,255,0.2); --border-hover: rgba(0,212,255,0.5);
          --text: #e8f0ff; --text-muted: #7a8ab0;
          --glow-cyan: 0 0 20px rgba(0,212,255,0.4);
          --error: #ff4466; --success: #00ffaa;
        }
        body {
          font-family: 'Exo 2', sans-serif; background: var(--dark); color: var(--text);
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; overflow-x: hidden;
        }
        .bg { position: fixed; inset: 0;
          background: linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
          background-size: 40px 40px; z-index: 0; }
        .bg::after { content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%,rgba(68,136,255,0.15) 0%,transparent 60%),
                      radial-gradient(ellipse at 100% 100%,rgba(180,79,255,0.1) 0%,transparent 50%); }

        /* Progress bar */
        .progress-wrap { position: relative; z-index: 10; width: 100%; max-width: 440px; margin: 40px auto 0; padding: 0 16px; }
        .progress-steps { display: flex; align-items: center; gap: 0; }
        .progress-step { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .progress-dot {
          width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px;
          color: var(--text-muted); background: var(--dark2); transition: all 0.4s; position: relative; z-index: 2;
        }
        .progress-dot.active { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 16px rgba(0,212,255,0.4); }
        .progress-dot.done { border-color: var(--cyan); background: var(--cyan); color: var(--dark); }
        .progress-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); margin-top: 6px; font-weight: 600; }
        .progress-label.active { color: var(--cyan); }
        .progress-line { flex: 1; height: 1px; background: var(--border); margin: 0; position: relative; top: -14px; transition: background 0.4s; }
        .progress-line.done { background: var(--cyan); }

        /* Card */
        .card-wrap { position: relative; z-index: 10; width: 100%; max-width: 440px; margin: 24px auto 40px; padding: 0 16px; }
        .card {
          background: var(--dark2); border: 1px solid var(--border);
          border-radius: 20px; padding: 40px 36px; position: relative; overflow: hidden;
        }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent); }
        .corner { position: absolute; width: 16px; height: 16px; border-color: var(--cyan); border-style: solid; opacity: 0.35; }
        .corner-tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

        .logo-wrap { display: flex; flex-direction: column; align-items: center; margin-bottom: 32px; }
        .logo-circle { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#050810,#1a0a2e);
          border: 2px solid rgba(0,212,255,0.3); box-shadow: 0 0 30px rgba(0,212,255,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 14px; }
        .logo-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: 3px; text-transform: uppercase;
          background: linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .form-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: 2px; margin-bottom: 6px; }
        .form-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 28px; line-height: 1.6; }
        .form-email-highlight { color: var(--cyan); font-weight: 600; }

        .input-group { margin-bottom: 18px; }
        .input-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 16px; pointer-events: none; transition: color 0.3s; }
        .input-wrap:focus-within .input-icon { color: var(--cyan); }
        input[type="text"], input[type="email"], input[type="password"] {
          width: 100%; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px;
          padding: 13px 14px 13px 42px; font-family: 'Exo 2', sans-serif; font-size: 14px;
          color: var(--text); outline: none; transition: all 0.3s; letter-spacing: 0.5px;
        }
        input::placeholder { color: var(--text-muted); }
        input:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,212,255,0.1), var(--glow-cyan); background: rgba(0,212,255,0.03); }

        .strength-bar { display: flex; gap: 4px; margin-top: 8px; }
        .strength-seg { flex: 1; height: 3px; background: var(--dark3); border-radius: 2px; transition: background 0.3s; }
        .strength-seg.weak { background: #ff4466; }
        .strength-seg.medium { background: #ffaa00; }
        .strength-seg.strong { background: var(--cyan); }

        .alert { border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; line-height: 1.5; display: flex; align-items: flex-start; gap: 10px; }
        .alert-error { background: rgba(255,68,102,0.1); border: 1px solid rgba(255,68,102,0.3); color: #ff7799; }
        .alert-success { background: rgba(0,255,170,0.08); border: 1px solid rgba(0,255,170,0.25); color: #00ffaa; }

        .btn-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg,var(--cyan),var(--blue),var(--purple));
          background-size: 200% 200%; animation: gradShift 4s ease infinite;
          border: none; border-radius: 10px; font-family: 'Rajdhani', sans-serif; font-weight: 700;
          font-size: 16px; letter-spacing: 3px; text-transform: uppercase; color: var(--dark);
          cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,212,255,0.4); }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .otp-wrap { display: flex; gap: 10px; justify-content: center; margin: 24px 0; }
        .otp-input {
          width: 52px; height: 60px; text-align: center;
          font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700;
          background: var(--dark3); border: 1px solid var(--border); border-radius: 10px;
          color: var(--cyan); outline: none; transition: all 0.3s; caret-color: var(--cyan); padding: 0;
        }
        .otp-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,212,255,0.1),var(--glow-cyan); background: rgba(0,212,255,0.03); }
        .otp-input.filled { border-color: rgba(0,212,255,0.5); }

        .resend-row { text-align: center; margin-top: 16px; }
        .resend-btn { background: none; border: none; font-family: 'Exo 2', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; color: var(--cyan); opacity: 0.8; }
        .resend-btn:hover:not(:disabled) { opacity: 1; }
        .resend-btn:disabled { color: var(--text-muted); opacity: 0.5; cursor: not-allowed; }

        .back-link { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); cursor: pointer; margin-top: 18px; justify-content: center; transition: color 0.2s; background: none; border: none; font-family: inherit; width: 100%; }
        .back-link:hover { color: var(--cyan); }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(5,8,16,0.3); border-top-color: #050810; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Done state */
        .done-icon { font-size: 64px; text-align: center; margin-bottom: 20px; animation: popIn 0.5s ease; }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        .done-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 28px; letter-spacing: 2px; text-align: center; margin-bottom: 10px;
          background: linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .done-sub { font-size: 13px; color: var(--text-muted); text-align: center; margin-bottom: 28px; line-height: 1.7; }
      `}</style>

      <div className="bg" />

      {/* Progress Steps */}
      {step !== 'done' && (
        <div className="progress-wrap">
          <div className="progress-steps">
            {['Email', 'Code', 'Reset'].map((label, i) => (
              <>
                <div className="progress-step" key={label}>
                  <div className={`progress-dot ${stepIndex > i ? 'done' : stepIndex === i ? 'active' : ''}`}>
                    {stepIndex > i ? '✓' : i + 1}
                  </div>
                  <div className={`progress-label ${stepIndex === i ? 'active' : ''}`}>{label}</div>
                </div>
                {i < 2 && <div className={`progress-line ${stepIndex > i ? 'done' : ''}`} key={`line-${i}`} />}
              </>
            ))}
          </div>
        </div>
      )}

      <div className="card-wrap">
        <div className="card">
          <div className="corner corner-tl" /><div className="corner corner-tr" />
          <div className="corner corner-bl" /><div className="corner corner-br" />

          <div className="logo-wrap">
            <div className="logo-circle">🔐</div>
            <div className="logo-title">BrawlCarry</div>
          </div>

          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}

          {/* STEP 1 — Email */}
          {step === 'email' && (
            <>
              <div className="form-title">Forgot Password</div>
              <div className="form-sub">Enter your account email and we'll send you a recovery code.</div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrap">
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()} />
                  <span className="input-icon">✉</span>
                </div>
              </div>
              <button className="btn-submit" onClick={handleSendCode} disabled={loading || !email}>
                {loading ? <><div className="spinner" /> Sending...</> : 'Send Recovery Code →'}
              </button>
              <a href="/auth" style={{ textDecoration: 'none' }}>
                <button className="back-link">← Back to Sign In</button>
              </a>
            </>
          )}

          {/* STEP 2 — Code */}
          {step === 'code' && (
            <>
              <div className="form-title">Enter Code</div>
              <div className="form-sub">
                We sent a 6-digit code to <span className="form-email-highlight">{email}</span>.
                Check your inbox and enter it below.
              </div>
              <div className="otp-wrap" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className={`otp-input${digit ? ' filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button className="btn-submit" onClick={handleVerifyCode} disabled={loading}>
                {loading ? <><div className="spinner" /> Verifying...</> : 'Verify Code →'}
              </button>
              <div className="resend-row">
                <button className="resend-btn" onClick={async () => {
                  if (resendCooldown > 0) return;
                  setError(''); setSuccess('');
                  const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                  const data = await res.json();
                  if (!res.ok) setError(data.error);
                  else { setSuccess('New code sent!'); setResendCooldown(60); startCooldown(); setOtp(['','','','','','']); }
                }} disabled={resendCooldown > 0}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't get it? Resend"}
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — New Password */}
          {step === 'reset' && (
            <>
              <div className="form-title">New Password</div>
              <div className="form-sub">Choose a strong password for your account.</div>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <div className="input-wrap">
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  <span className="input-icon">🔒</span>
                </div>
                <div className="strength-bar">
                  <div className={getSegClass(0)} /><div className={getSegClass(1)} />
                  <div className={getSegClass(2)} /><div className={getSegClass(3)} />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 24 }}>
                <label className="input-label">Confirm Password</label>
                <div className="input-wrap">
                  <input type="password" placeholder="••••••••" value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReset()} />
                  <span className="input-icon">🔒</span>
                </div>
              </div>
              <button className="btn-submit" onClick={handleReset} disabled={loading || !newPassword || !confirmPassword}>
                {loading ? <><div className="spinner" /> Resetting...</> : 'Reset Password →'}
              </button>
            </>
          )}

          {/* DONE */}
          {step === 'done' && (
            <>
              <div className="done-icon">✅</div>
              <div className="done-title">Password Reset!</div>
              <div className="done-sub">Your password has been successfully updated. You can now sign in with your new password.</div>
              <button className="btn-submit" onClick={() => { window.location.href = '/auth'; }}>
                Go to Sign In →
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
