'use client';

import { useState } from 'react';

type PaymentMethod = 'apple' | 'google' | 'paypal' | null;

interface CartItem {
  id: string;
  type: 'ranked' | 'prestige';
  label: string;
  price: number;
}

// In real app, pass via props/context/URL params
// For now we use mock data that would be replaced with real cart
const MOCK_CART: CartItem[] = [
  { id: '1', type: 'ranked', label: 'Silver I → Gold I (Boost)', price: 2.80 },
];

export default function CheckoutPage() {
  const [cart] = useState<CartItem[]>(MOCK_CART);
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Discord username for order delivery
  const [discord, setDiscord] = useState('');
  const [gameId, setGameId] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const fee = subtotal * 0.05;
  const total = subtotal + fee;

  async function handleCheckout() {
    setError('');
    if (!method) { setError('Please select a payment method.'); return; }
    if (!discord.trim()) { setError('Please enter your Discord username for order delivery.'); return; }
    if (!gameId.trim()) { setError('Please enter your Brawl Stars Player Tag.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, method, discord, gameId, notes, total }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else {
        if (data.redirectUrl) { window.location.href = data.redirectUrl; }
        else { setSuccess(true); }
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <>
        <style>{BASE_STYLES}</style>
        <div className="bg" />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 24, animation: 'popIn 0.5s ease' }}>🎉</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 36, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12,
            background: 'linear-gradient(90deg,var(--cyan),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Order Confirmed!
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.7, maxWidth: 400 }}>
            Your order is confirmed and our team has been notified.<br />
            We'll reach out on Discord at <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{discord}</span> shortly.
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
            Expected start: <span style={{ color: 'var(--success)' }}>within 1 hour</span>
          </div>
          <button
            onClick={() => { window.location.href = '/'; }}
            style={{ padding: '14px 40px', background: 'linear-gradient(135deg,var(--cyan),var(--blue),var(--purple))', border: 'none', borderRadius: 10,
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', color: '#050810', cursor: 'pointer' }}>
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{BASE_STYLES + EXTRA_STYLES}</style>
      <div className="bg" />

      {/* NAV */}
      <nav className="nav">
        <a className="nav-logo" href="/">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">BrawlCarry</span>
        </a>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          🔒 Secure Checkout
        </div>
      </nav>

      <div className="page-wrap">
        {/* LEFT — Order Summary + Delivery Info */}
        <div className="left-col">

          {/* Order Summary */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="corner corner-tl" /><div className="corner corner-tr" />
            <div className="corner corner-bl" /><div className="corner corner-br" />
            <div className="card-title">Order Summary</div>

            {cart.map(item => (
              <div key={item.id} className="order-item">
                <span className={`item-badge ${item.type}`}>
                  {item.type === 'ranked' ? '🏆 Ranked' : '🏅 Prestige'}
                </span>
                <div className="order-item-label">{item.label}</div>
                <div className="order-item-price">€ {item.price.toFixed(2)}</div>
              </div>
            ))}

            <div className="summary-divider" />
            <div className="summary-row"><span className="summary-label">Subtotal</span><span className="summary-val">€ {subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span className="summary-label" style={{ color: 'var(--purple)', opacity: 0.9 }}>Service Fee (5%)</span><span className="summary-val" style={{ color: 'var(--purple)' }}>€ {fee.toFixed(2)}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-price">€ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card">
            <div className="corner corner-tl" /><div className="corner corner-tr" />
            <div className="corner corner-bl" /><div className="corner corner-br" />
            <div className="card-title">Delivery Info</div>
            <div className="card-sub">We'll contact you on Discord once the booster is assigned.</div>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <div className="input-group">
              <label className="input-label">Discord Username</label>
              <div className="input-wrap">
                <input type="text" placeholder="yourname or yourname#0000"
                  value={discord} onChange={e => setDiscord(e.target.value)} />
                <span className="input-icon">💬</span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Brawl Stars Player Tag</label>
              <div className="input-wrap">
                <input type="text" placeholder="#XXXXXXXX"
                  value={gameId} onChange={e => setGameId(e.target.value)} />
                <span className="input-icon">🎮</span>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Notes (Optional)</label>
              <textarea
                placeholder="Any special requests or info for the booster..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%', background: 'var(--dark3)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '13px 14px', fontFamily: 'Exo 2, sans-serif',
                  fontSize: 14, color: 'var(--text)', outline: 'none', resize: 'none',
                  transition: 'border-color 0.3s', letterSpacing: 0.5,
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.2)'; }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Payment */}
        <div className="right-col">
          <div className="card payment-card">
            <div className="corner corner-tl" /><div className="corner corner-tr" />
            <div className="corner corner-bl" /><div className="corner corner-br" />
            <div className="card-title">Payment Method</div>
            <div className="card-sub">All payments are secure and encrypted.</div>

            {/* Apple Pay */}
            <div
              className={`pay-method ${method === 'apple' ? 'selected' : ''}`}
              onClick={() => setMethod('apple')}
              style={method === 'apple' ? { borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)' } : {}}
            >
              <div className="pay-radio" style={method === 'apple' ? { borderColor: '#fff', background: '#fff' } : {}}>
                {method === 'apple' && <div className="pay-radio-dot" style={{ background: 'var(--dark)' }} />}
              </div>
              <div className="pay-icon" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.15)' }}>
                <svg width="32" height="16" viewBox="0 0 32 16" fill="white">
                  <text x="1" y="13" fontSize="12" fontFamily="system-ui, -apple-system" fontWeight="600"></text>
                  <text x="1" y="13" fontSize="11" fontFamily="system-ui, -apple-system" fontWeight="700" fill="white"> Pay</text>
                </svg>
                🍎
              </div>
              <div>
                <div className="pay-name">Apple Pay</div>
                <div className="pay-detail">Touch ID / Face ID</div>
              </div>
              {method === 'apple' && <span className="pay-check" style={{ color: '#fff' }}>✓</span>}
            </div>

            {/* Google Pay */}
            <div
              className={`pay-method ${method === 'google' ? 'selected' : ''}`}
              onClick={() => setMethod('google')}
              style={method === 'google' ? { borderColor: 'rgba(66,133,244,0.6)', background: 'rgba(66,133,244,0.06)' } : {}}
            >
              <div className="pay-radio" style={method === 'google' ? { borderColor: '#4285F4', background: '#4285F4' } : {}}>
                {method === 'google' && <div className="pay-radio-dot" style={{ background: '#fff' }} />}
              </div>
              <div className="pay-icon" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
                <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                  <text x="0" y="13" fontSize="11" fontFamily="system-ui" fontWeight="700">
                    <tspan fill="#4285F4">G</tspan>
                    <tspan fill="#EA4335">o</tspan>
                    <tspan fill="#FBBC05">o</tspan>
                    <tspan fill="#4285F4">g</tspan>
                    <tspan fill="#34A853">l</tspan>
                    <tspan fill="#EA4335">e</tspan>
                  </text>
                </svg>
              </div>
              <div>
                <div className="pay-name">Google Pay</div>
                <div className="pay-detail">Fast & secure</div>
              </div>
              {method === 'google' && <span className="pay-check" style={{ color: '#4285F4' }}>✓</span>}
            </div>

            {/* PayPal */}
            <div
              className={`pay-method ${method === 'paypal' ? 'selected' : ''}`}
              onClick={() => setMethod('paypal')}
              style={method === 'paypal' ? { borderColor: 'rgba(0,112,209,0.6)', background: 'rgba(0,112,209,0.06)' } : {}}
            >
              <div className="pay-radio" style={method === 'paypal' ? { borderColor: '#0070D1', background: '#0070D1' } : {}}>
                {method === 'paypal' && <div className="pay-radio-dot" style={{ background: '#fff' }} />}
              </div>
              <div className="pay-icon" style={{ background: '#003087', border: '1px solid rgba(0,48,135,0.3)' }}>
                <svg viewBox="0 0 60 24" width="44" height="18">
                  <text x="2" y="18" fontSize="14" fontFamily="system-ui" fontWeight="800" fill="#009cde">Pay</text>
                  <text x="28" y="18" fontSize="14" fontFamily="system-ui" fontWeight="800" fill="#012169">Pal</text>
                </svg>
              </div>
              <div>
                <div className="pay-name">PayPal</div>
                <div className="pay-detail">Pay with PayPal balance or card</div>
              </div>
              {method === 'paypal' && <span className="pay-check" style={{ color: '#0070D1' }}>✓</span>}
            </div>

            <div className="pay-divider" />

            {/* Total recap */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>You Pay</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 34,
                background: 'linear-gradient(90deg,var(--cyan),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                € {total.toFixed(2)}
              </div>
            </div>

            <button className="btn-submit" onClick={handleCheckout} disabled={loading || !method}>
              {loading
                ? <><div className="spinner" /> Processing...</>
                : method === 'apple' ? '🍎 Pay with Apple Pay'
                : method === 'google' ? '  Pay with Google Pay'
                : method === 'paypal' ? '🅿 Pay with PayPal'
                : 'Select a Payment Method'}
            </button>

            {/* Trust badges */}
            <div className="trust-row">
              <div className="trust-badge">🔒 SSL Secure</div>
              <div className="trust-badge">⚡ Instant Start</div>
              <div className="trust-badge">✅ Guaranteed</div>
            </div>

            <div className="discord-note">
              Questions? <a href="https://discord.gg/R8qYVyFqCT" target="_blank" rel="noopener noreferrer">Join our Discord</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 60 }} />
    </>
  );
}

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cyan: #00d4ff; --purple: #b44fff; --blue: #4488ff;
    --dark: #050810; --dark2: #0a0f1e; --dark3: #0f1628;
    --border: rgba(0,212,255,0.2); --border-hover: rgba(0,212,255,0.5);
    --text: #e8f0ff; --text-muted: #7a8ab0;
    --glow-cyan: 0 0 20px rgba(0,212,255,0.4);
    --success: #00ffaa;
  }
  html, body { font-family: 'Exo 2', sans-serif; background: var(--dark); color: var(--text); min-height: 100vh; overflow-x: hidden; }
  .bg { position: fixed; inset: 0; z-index: 0;
    background: linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),
                linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);
    background-size: 40px 40px; }
  .bg::after { content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse at 30% 0%,rgba(68,136,255,0.12) 0%,transparent 55%),
                radial-gradient(ellipse at 80% 0%,rgba(180,79,255,0.10) 0%,transparent 55%); }
  @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width:16px; height:16px; border:2px solid rgba(5,8,16,0.3); border-top-color:#050810; border-radius:50%; animation:spin 0.7s linear infinite; }
  .btn-submit {
    width:100%; padding:15px; background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple));
    background-size:200% 200%; animation:gradShift 4s ease infinite; border:none; border-radius:10px;
    font-family:'Rajdhani',sans-serif; font-weight:700; font-size:16px; letter-spacing:2px;
    text-transform:uppercase; color:#050810; cursor:pointer; transition:all 0.3s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .btn-submit:disabled { opacity:0.45; cursor:not-allowed; }
  .btn-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,212,255,0.4); }
  .alert { border-radius:10px; padding:12px 16px; font-size:13px; margin-bottom:18px; line-height:1.5; }
  .alert-error { background:rgba(255,68,102,0.1); border:1px solid rgba(255,68,102,0.3); color:#ff7799; }
  .input-group { margin-bottom:18px; }
  .input-label { display:block; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; }
  .input-wrap { position:relative; }
  .input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:16px; pointer-events:none; transition:color 0.3s; }
  .input-wrap:focus-within .input-icon { color:var(--cyan); }
  input[type="text"], input[type="email"], input[type="password"] {
    width:100%; background:var(--dark3); border:1px solid var(--border); border-radius:10px;
    padding:13px 14px 13px 42px; font-family:'Exo 2',sans-serif; font-size:14px;
    color:var(--text); outline:none; transition:all 0.3s; letter-spacing:0.5px;
  }
  input::placeholder { color:var(--text-muted); }
  input:focus { border-color:var(--cyan); box-shadow:0 0 0 3px rgba(0,212,255,0.1),var(--glow-cyan); background:rgba(0,212,255,0.03); }
`;

const EXTRA_STYLES = `
  .nav { position:sticky; top:0; z-index:200; backdrop-filter:blur(20px);
    background:rgba(5,8,16,0.85); border-bottom:1px solid var(--border);
    padding:0 24px; height:64px; display:flex; align-items:center; justify-content:space-between; }
  .nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
  .nav-logo-icon { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#0a0f1e,#1a0a2e);
    border:1.5px solid rgba(0,212,255,0.35); display:flex; align-items:center; justify-content:center; font-size:16px;
    box-shadow:0 0 16px rgba(0,212,255,0.25); }
  .nav-logo-text { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; letter-spacing:3px; text-transform:uppercase;
    background:linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .page-wrap { position:relative; z-index:10; max-width:960px; margin:40px auto; padding:0 20px;
    display:grid; grid-template-columns:1fr 400px; gap:24px; align-items:flex-start; }
  @media (max-width:768px) { .page-wrap { grid-template-columns:1fr; } }

  .left-col, .right-col {}
  .card { background:var(--dark2); border:1px solid var(--border); border-radius:20px; padding:32px; position:relative; overflow:hidden; }
  .card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent); }
  .corner { position:absolute; width:14px; height:14px; border-color:var(--cyan); border-style:solid; opacity:0.3; }
  .corner-tl { top:10px; left:10px; border-width:2px 0 0 2px; }
  .corner-tr { top:10px; right:10px; border-width:2px 2px 0 0; }
  .corner-bl { bottom:10px; left:10px; border-width:0 0 2px 2px; }
  .corner-br { bottom:10px; right:10px; border-width:0 2px 2px 0; }
  .card-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:20px; letter-spacing:3px; text-transform:uppercase; margin-bottom:6px; }
  .card-sub { font-size:12px; color:var(--text-muted); letter-spacing:0.5px; margin-bottom:24px; }

  .order-item { background:var(--dark3); border:1px solid var(--border); border-radius:12px; padding:14px; margin-bottom:10px; }
  .item-badge { display:inline-block; font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
    padding:2px 8px; border-radius:4px; margin-bottom:6px; font-weight:600; }
  .item-badge.ranked { background:rgba(0,212,255,0.1); color:var(--cyan); border:1px solid rgba(0,212,255,0.25); }
  .item-badge.prestige { background:rgba(180,79,255,0.1); color:var(--purple); border:1px solid rgba(180,79,255,0.25); }
  .order-item-label { font-size:13px; color:var(--text); margin-bottom:8px; line-height:1.5; }
  .order-item-price { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; color:var(--cyan); }
  .summary-divider { height:1px; background:var(--border); margin:14px 0; }
  .summary-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .summary-label { font-size:12px; color:var(--text-muted); letter-spacing:1px; }
  .summary-val { font-family:'Rajdhani',sans-serif; font-weight:600; font-size:16px; }
  .total-row { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; letter-spacing:2px; text-transform:uppercase; }
  .total-price { font-size:28px; background:linear-gradient(90deg,var(--cyan),var(--purple));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .payment-card {}
  .pay-method { display:flex; align-items:center; gap:14px; padding:16px; border:1px solid var(--border);
    border-radius:12px; cursor:pointer; margin-bottom:12px; transition:all 0.25s; background:transparent; user-select:none; }
  .pay-method:hover { border-color:var(--border-hover); background:rgba(0,212,255,0.03); }
  .pay-radio { width:18px; height:18px; border-radius:50%; border:2px solid var(--border); flex-shrink:0;
    display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .pay-radio-dot { width:8px; height:8px; border-radius:50%; }
  .pay-icon { width:52px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center;
    font-size:18px; flex-shrink:0; overflow:hidden; }
  .pay-name { font-family:'Rajdhani',sans-serif; font-weight:600; font-size:15px; letter-spacing:1px; }
  .pay-detail { font-size:11px; color:var(--text-muted); margin-top:2px; }
  .pay-check { margin-left:auto; font-size:16px; font-weight:700; }
  .pay-divider { height:1px; background:var(--border); margin:20px 0; }

  .trust-row { display:flex; gap:8px; justify-content:center; margin-top:16px; flex-wrap:wrap; }
  .trust-badge { font-size:11px; color:var(--text-muted); background:var(--dark3); border:1px solid var(--border);
    border-radius:6px; padding:4px 10px; letter-spacing:0.5px; }
  .discord-note { text-align:center; font-size:11px; color:var(--text-muted); margin-top:12px; }
  .discord-note a { color:var(--cyan); text-decoration:none; opacity:0.85; }
  .discord-note a:hover { opacity:1; }
`;
