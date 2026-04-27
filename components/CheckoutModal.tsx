'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  id: string;
  type: 'ranked' | 'prestige';
  label: string;
  price: number;
}

interface CheckoutModalProps {
  cart: CartItem[];
  subtotal: number;
  fee: number;
  total: number;
  onClose: () => void;
}

// ── Stripe Payment Form ─────────────────────────────────────────────────────
function StripeForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    if (!stripe || !elements) return;
    setLoading(true); setError('');
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/order-success' },
      redirect: 'if_required',
    });
    if (stripeError) { setError(stripeError.message || 'Payment failed.'); setLoading(false); }
    else { onSuccess(); }
  }

  return (
    <div>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.3)', borderRadius: 8, color: '#ff7799', fontSize: 13 }}>⚠ {error}</div>}
      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        style={{
          marginTop: 20, width: '100%', padding: '15px',
          background: 'linear-gradient(135deg,#00d4ff,#4488ff,#b44fff)',
          backgroundSize: '200%', border: 'none', borderRadius: 10,
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
          letterSpacing: '3px', textTransform: 'uppercase', color: '#050810',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

// ── PayPal Button ───────────────────────────────────────────────────────────
function PayPalSection({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId || document.getElementById('paypal-sdk')) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const win = window as unknown as Record<string, unknown>;
    const paypal = win['paypal'] as { Buttons: (opts: unknown) => { render: (id: string) => void } } | undefined;
    if (!paypal) return;
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
    paypal.Buttons({
      style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', height: 48 },
      createOrder: (_data: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
        actions.order.create({ purchase_units: [{ amount: { value: amount.toFixed(2), currency_code: 'EUR' } }] }),
      onApprove: (_data: unknown, actions: { order: { capture: () => Promise<unknown> } }) =>
        actions.order.capture().then(() => onSuccess()),
      onError: (err: unknown) => console.error('PayPal error', err),
    }).render('#paypal-button-container');
  }, [loaded, amount, onSuccess]);

  return (
    <div>
      {!loaded && <div style={{ textAlign: 'center', color: '#7a8ab0', fontSize: 13, padding: '20px 0' }}>Loading PayPal...</div>}
      <div id="paypal-button-container" style={{ minHeight: 48 }} />
    </div>
  );
}

// ── Main Checkout Modal ─────────────────────────────────────────────────────
export default function CheckoutModal({ cart, subtotal, fee, total, onClose }: CheckoutModalProps) {
  const [method, setMethod] = useState<'card' | 'paypal' | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [done, setDone] = useState(false);

  async function selectCard() {
    setMethod('card'); setLoadingSecret(true);
    try {
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch { console.error('Failed to create payment intent'); }
    finally { setLoadingSecret(false); }
  }

  function handleSuccess() { setDone(true); }

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#00d4ff',
      colorBackground: '#0f1628',
      colorText: '#e8f0ff',
      colorDanger: '#ff4466',
      fontFamily: 'Exo 2, sans-serif',
      borderRadius: '10px',
    },
  };

  return (
    <>
      <style>{`
        .co-overlay { position:fixed; inset:0; z-index:400; background:rgba(5,8,16,0.85); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:16px; }
        .co-modal { background:#0a0f1e; border:1px solid rgba(0,212,255,0.2); border-radius:20px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; position:relative; }
        .co-modal::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#00d4ff,#b44fff,transparent); }
        .co-head { padding:24px 28px; border-bottom:1px solid rgba(0,212,255,0.1); display:flex; align-items:center; justify-content:space-between; }
        .co-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:20px; letter-spacing:3px; text-transform:uppercase; color:#00d4ff; }
        .co-close { background:none; border:1px solid rgba(0,212,255,0.2); color:#7a8ab0; width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .co-close:hover { border-color:rgba(0,212,255,0.4); color:#e8f0ff; }
        .co-body { padding:24px 28px; }
        .co-summary { background:#0f1628; border:1px solid rgba(0,212,255,0.12); border-radius:12px; padding:18px; margin-bottom:24px; }
        .co-summary-title { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#7a8ab0; margin-bottom:14px; }
        .co-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); font-size:13px; color:#7a8ab0; }
        .co-item:last-child { border-bottom:none; }
        .co-item-label { flex:1; padding-right:12px; line-height:1.5; }
        .co-item-price { font-family:'Rajdhani',sans-serif; font-weight:600; font-size:14px; color:#e8f0ff; white-space:nowrap; }
        .co-divider { height:1px; background:rgba(0,212,255,0.1); margin:14px 0; }
        .co-fee-row { display:flex; justify-content:space-between; font-size:12px; padding:4px 0; }
        .co-total-row { display:flex; justify-content:space-between; align-items:center; margin-top:6px; }
        .co-total-label { font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#7a8ab0; }
        .co-total-price { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:26px; background:linear-gradient(90deg,#00d4ff,#b44fff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .co-methods-label { font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#7a8ab0; margin-bottom:14px; }
        .co-methods { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px; }
        .co-method { background:#0f1628; border:1px solid rgba(0,212,255,0.15); border-radius:12px; padding:16px 12px;
          cursor:pointer; transition:all 0.25s; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .co-method:hover { border-color:rgba(0,212,255,0.4); background:rgba(0,212,255,0.04); transform:translateY(-2px); }
        .co-method.active { border-color:#00d4ff; background:rgba(0,212,255,0.08); box-shadow:0 0 20px rgba(0,212,255,0.2); }
        .co-method-icon { font-size:28px; }
        .co-method-label { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px; letter-spacing:1.5px; text-transform:uppercase; color:#e8f0ff; }
        .co-method-sub { font-size:11px; color:#7a8ab0; }
        .co-form-wrap { background:#0f1628; border:1px solid rgba(0,212,255,0.12); border-radius:12px; padding:20px; }
        .co-back { background:none; border:none; color:#7a8ab0; font-family:'Exo 2',sans-serif; font-size:12px; cursor:pointer; margin-bottom:16px; display:flex; align-items:center; gap:6px; transition:color 0.2s; padding:0; }
        .co-back:hover { color:#00d4ff; }
        .co-secure { display:flex; align-items:center; justify-content:center; gap:6px; font-size:11px; color:#7a8ab0; margin-top:16px; }
        .co-done { text-align:center; padding:40px 20px; }
        .co-done-icon { font-size:64px; margin-bottom:20px; }
        .co-done-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:28px; letter-spacing:3px; text-transform:uppercase; color:#00ffaa; margin-bottom:12px; }
        .co-done-sub { font-size:14px; color:#7a8ab0; line-height:1.7; margin-bottom:24px; }
        .co-done-btn { padding:14px 32px; background:linear-gradient(135deg,#00d4ff,#b44fff); border:none; border-radius:10px; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:15px; letter-spacing:2px; text-transform:uppercase; color:#050810; cursor:pointer; }
      `}</style>

      <div className="co-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="co-modal">
          <div className="co-head">
            <div className="co-title">Checkout</div>
            <button className="co-close" onClick={onClose}>✕</button>
          </div>

          <div className="co-body">
            {done ? (
              <div className="co-done">
                <div className="co-done-icon">✅</div>
                <div className="co-done-title">Order Confirmed!</div>
                <div className="co-done-sub">
                  Your payment was successful. Our team will begin working on your order shortly.<br /><br />
                  Join our Discord for updates: <a href="https://discord.gg/R8qYVyFqCT" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff' }}>discord.gg/R8qYVyFqCT</a>
                </div>
                <button className="co-done-btn" onClick={onClose}>Back to Home</button>
              </div>
            ) : (
              <>
                {/* Order Summary */}
                <div className="co-summary">
                  <div className="co-summary-title">Order Summary</div>
                  {cart.map(item => (
                    <div className="co-item" key={item.id}>
                      <div className="co-item-label">{item.label}</div>
                      <div className="co-item-price">€ {item.price.toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="co-divider" />
                  <div className="co-fee-row">
                    <span style={{ color: '#7a8ab0', fontSize: 12 }}>Subtotal</span>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, color: '#e8f0ff' }}>€ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="co-fee-row">
                    <span style={{ color: '#b44fff', fontSize: 12 }}>Service Fee (5%)</span>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, color: '#b44fff' }}>€ {fee.toFixed(2)}</span>
                  </div>
                  <div className="co-divider" />
                  <div className="co-total-row">
                    <div className="co-total-label">Total</div>
                    <div className="co-total-price">€ {total.toFixed(2)}</div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                {!method && (
                  <>
                    <div className="co-methods-label">Select Payment Method</div>
                    <div className="co-methods">
                      <div className="co-method" onClick={selectCard}>
                        <div className="co-method-icon">💳</div>
                        <div className="co-method-label">Card</div>
                        <div className="co-method-sub">Visa · Mastercard</div>
                      </div>
                      <div className="co-method" onClick={selectCard}>
                        <div className="co-method-icon"></div>
                        <div className="co-method-label">Apple Pay</div>
                        <div className="co-method-sub">Touch ID</div>
                      </div>
                      <div className="co-method" onClick={selectCard}>
                        <div className="co-method-icon">G</div>
                        <div className="co-method-label">Google Pay</div>
                        <div className="co-method-sub">One tap pay</div>
                      </div>
                      <div className="co-method" onClick={() => setMethod('paypal')}>
                        <div className="co-method-icon">🅿</div>
                        <div className="co-method-label">PayPal</div>
                        <div className="co-method-sub">Pay with balance</div>
                      </div>
                    </div>
                    <div className="co-secure">🔒 Payments are secure and encrypted</div>
                  </>
                )}

                {/* Stripe Payment Form (Card / Apple Pay / Google Pay) */}
                {method === 'card' && (
                  <div>
                    <button className="co-back" onClick={() => { setMethod(null); setClientSecret(''); }}>← Change payment method</button>
                    <div className="co-form-wrap">
                      {loadingSecret && <div style={{ textAlign: 'center', color: '#7a8ab0', padding: '20px 0', fontSize: 13 }}>Loading payment form...</div>}
                      {clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                          <StripeForm onSuccess={handleSuccess} />
                        </Elements>
                      )}
                    </div>
                    <div className="co-secure" style={{ marginTop: 12 }}>🔒 Powered by Stripe · Apple Pay & Google Pay available</div>
                  </div>
                )}

                {/* PayPal */}
                {method === 'paypal' && (
                  <div>
                    <button className="co-back" onClick={() => setMethod(null)}>← Change payment method</button>
                    <div className="co-form-wrap">
                      <PayPalSection amount={total} onSuccess={handleSuccess} />
                    </div>
                    <div className="co-secure" style={{ marginTop: 12 }}>🔒 Powered by PayPal · Buyer protection included</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
