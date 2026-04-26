'use client';

import { useState, useEffect } from 'react';

// ─── Rank Data ────────────────────────────────────────────────────────────────
const RANKS = [
  { id: 0,  label: 'Bronze I',     tier: 'Bronze',    emoji: '🥉', color: '#cd7f32', glow: 'rgba(205,127,50,0.4)' },
  { id: 1,  label: 'Bronze II',    tier: 'Bronze',    emoji: '🥉', color: '#cd7f32', glow: 'rgba(205,127,50,0.4)' },
  { id: 2,  label: 'Bronze III',   tier: 'Bronze',    emoji: '🥉', color: '#cd7f32', glow: 'rgba(205,127,50,0.4)' },
  { id: 3,  label: 'Silver I',     tier: 'Silver',    emoji: '🥈', color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)' },
  { id: 4,  label: 'Silver II',    tier: 'Silver',    emoji: '🥈', color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)' },
  { id: 5,  label: 'Silver III',   tier: 'Silver',    emoji: '🥈', color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)' },
  { id: 6,  label: 'Gold I',       tier: 'Gold',      emoji: '👑', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
  { id: 7,  label: 'Gold II',      tier: 'Gold',      emoji: '👑', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
  { id: 8,  label: 'Gold III',     tier: 'Gold',      emoji: '👑', color: '#ffd700', glow: 'rgba(255,215,0,0.4)' },
  { id: 9,  label: 'Diamond I',    tier: 'Diamond',   emoji: '💎', color: '#00d4ff', glow: 'rgba(0,212,255,0.4)' },
  { id: 10, label: 'Diamond II',   tier: 'Diamond',   emoji: '💎', color: '#00d4ff', glow: 'rgba(0,212,255,0.4)' },
  { id: 11, label: 'Diamond III',  tier: 'Diamond',   emoji: '💎', color: '#00d4ff', glow: 'rgba(0,212,255,0.4)' },
  { id: 12, label: 'Mythic I',     tier: 'Mythic',    emoji: '⚜️', color: '#b44fff', glow: 'rgba(180,79,255,0.4)' },
  { id: 13, label: 'Mythic II',    tier: 'Mythic',    emoji: '⚜️', color: '#b44fff', glow: 'rgba(180,79,255,0.4)' },
  { id: 14, label: 'Mythic III',   tier: 'Mythic',    emoji: '⚜️', color: '#b44fff', glow: 'rgba(180,79,255,0.4)' },
  { id: 15, label: 'Legendary I',  tier: 'Legendary', emoji: '🔥', color: '#ff4466', glow: 'rgba(255,68,102,0.4)' },
  { id: 16, label: 'Legendary II', tier: 'Legendary', emoji: '🔥', color: '#ff4466', glow: 'rgba(255,68,102,0.4)' },
  { id: 17, label: 'Legendary III',tier: 'Legendary', emoji: '🔥', color: '#ff4466', glow: 'rgba(255,68,102,0.4)' },
  { id: 18, label: 'Masters I',    tier: 'Masters',   emoji: '🏆', color: '#ff8c00', glow: 'rgba(255,140,0,0.4)' },
  { id: 19, label: 'Masters II',   tier: 'Masters',   emoji: '🏆', color: '#ff8c00', glow: 'rgba(255,140,0,0.4)' },
  { id: 20, label: 'Masters III',  tier: 'Masters',   emoji: '🏆', color: '#ff8c00', glow: 'rgba(255,140,0,0.4)' },
  { id: 21, label: 'Pro',          tier: 'Pro',       emoji: '⚡', color: '#00ff88', glow: 'rgba(0,255,136,0.5)' },
];

// Price to go from rank[i] to rank[i+1]
const SEGMENT_PRICES = [
  0.40, // B1→B2
  0.40, // B2→B3
  0.60, // B3→S1
  0.80, // S1→S2
  0.80, // S2→S3
  1.00, // S3→G1
  1.00, // G1→G2
  1.00, // G2→G3
  2.00, // G3→D1
  2.00, // D1→D2
  2.00, // D2→D3
  3.00, // D3→My1
  4.00, // My1→My2
  5.00, // My2→My3
  6.00, // My3→L1
  10.00,// L1→L2
  10.00,// L2→L3
  15.00,// L3→Ms1
  35.00,// Ms1→Ms2
  80.00,// Ms2→Ms3
  95.00,// Ms3→Pro
];

const PRESTIGE_SEGMENTS = [8, 20, 65]; // P0→P1, P1→P2, P2→P3
const PRESTIGE_LABELS = ['Prestige 0', 'Prestige I', 'Prestige II', 'Prestige III'];
const PRESTIGE_COLORS = ['#b44fff', '#ff4466', '#ffd700'];

function calcRankedPrice(from: number, to: number): number {
  if (to <= from) return 0;
  let total = 0;
  for (let i = from; i < to; i++) total += SEGMENT_PRICES[i];
  return total;
}

function calcPrestigePrice(from: number, to: number): number {
  if (to <= from) return 0;
  let total = 0;
  for (let i = from; i < to; i++) total += PRESTIGE_SEGMENTS[i];
  return total;
}

interface CartItem {
  id: string;
  type: 'ranked' | 'prestige';
  label: string;
  mode?: 'boost' | 'carry';
  brawler?: string;
  price: number;
}

// ─── Rank Select Component ─────────────────────────────────────────────────
function RankSelect({ value, onChange, label, exclude }: {
  value: number; onChange: (v: number) => void; label: string; exclude?: number;
}) {
  const [open, setOpen] = useState(false);
  const rank = RANKS[value];

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--dark3)', border: `1px solid ${rank.color}44`,
          borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'all 0.2s', boxShadow: open ? `0 0 12px ${rank.glow}` : 'none',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 20 }}>{rank.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: rank.color, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>{rank.label}</div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
          background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12,
          maxHeight: 260, overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          {RANKS.map((r) => {
            const disabled = exclude !== undefined && r.id <= exclude;
            return (
              <div
                key={r.id}
                onClick={() => { if (!disabled) { onChange(r.id); setOpen(false); } }}
                style={{
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.3 : 1,
                  background: r.id === value ? `${r.color}15` : 'transparent',
                  transition: 'background 0.15s',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
                onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = `${r.color}20`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = r.id === value ? `${r.color}15` : 'transparent'; }}
              >
                <span style={{ fontSize: 18 }}>{r.emoji}</span>
                <span style={{ fontSize: 13, color: r.id === value ? r.color : 'var(--text)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1 }}>{r.label}</span>
                {r.id === value && <span style={{ marginLeft: 'auto', color: r.color, fontSize: 12 }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Prestige Select ────────────────────────────────────────────────────────
function PrestigeSelect({ value, onChange, label, min }: {
  value: number; onChange: (v: number) => void; label: string; min?: number;
}) {
  const [open, setOpen] = useState(false);
  const colors = ['#b44fff', '#ff4466', '#ffd700', '#00ff88'];

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--dark3)', border: `1px solid ${colors[value]}44`,
          borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'all 0.2s', userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 20 }}>🏅</span>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors[value], fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>{PRESTIGE_LABELS[value]}</div>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 100,
          background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          {PRESTIGE_LABELS.map((l, i) => {
            const disabled = min !== undefined && i <= min;
            return (
              <div
                key={i}
                onClick={() => { if (!disabled) { onChange(i); setOpen(false); } }}
                style={{
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.3 : 1,
                  background: i === value ? `${colors[i]}15` : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <span style={{ fontSize: 18 }}>🏅</span>
                <span style={{ fontSize: 13, color: i === value ? colors[i] : 'var(--text)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>{l}</span>
                {i === value && <span style={{ marginLeft: 'auto', color: colors[i], fontSize: 12 }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Ranked state
  const [fromRank, setFromRank] = useState(3);  // Silver I
  const [toRank, setToRank] = useState(6);       // Gold I
  const [boostMode, setBoostMode] = useState<'boost' | 'carry'>('boost');

  // Prestige state
  const [fromPrestige, setFromPrestige] = useState(0);
  const [toPrestige, setToPrestige] = useState(1);
  const [brawlerName, setBrawlerName] = useState('');

  const rankedBase = calcRankedPrice(fromRank, toRank);
  const isProDest = toRank === 21; // Pro rank — carry not available
  const effectiveMode = isProDest ? 'boost' : boostMode;
  const rankedPrice = effectiveMode === 'carry' ? rankedBase * 2 : rankedBase;
  const prestigePrice = calcPrestigePrice(fromPrestige, toPrestige);

  const cartSubtotal = cart.reduce((s, i) => s + i.price, 0);
  const serviceFee = cartSubtotal * 0.05;
  const cartTotal = cartSubtotal + serviceFee;

  function addRanked() {
    if (toRank <= fromRank) return;
    const item: CartItem = {
      id: Date.now().toString(),
      type: 'ranked',
      label: `${RANKS[fromRank].label} → ${RANKS[toRank].label} (${effectiveMode === 'carry' ? 'Carry' : 'Boost'})`,
      mode: boostMode,
      price: rankedPrice,
    };
    setCart(c => [...c, item]);
    setCartOpen(true);
  }

  function addPrestige() {
    if (toPrestige <= fromPrestige || !brawlerName.trim()) return;
    const item: CartItem = {
      id: Date.now().toString(),
      type: 'prestige',
      label: `${PRESTIGE_LABELS[fromPrestige]} → ${PRESTIGE_LABELS[toPrestige]} — ${brawlerName}`,
      brawler: brawlerName,
      price: prestigePrice,
    };
    setCart(c => [...c, item]);
    setCartOpen(true);
  }

  function removeItem(id: string) {
    setCart(c => c.filter(i => i.id !== id));
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {};
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cyan: #00d4ff; --purple: #b44fff; --blue: #4488ff;
          --dark: #050810; --dark2: #0a0f1e; --dark3: #0f1628;
          --border: rgba(0,212,255,0.15); --border-hover: rgba(0,212,255,0.4);
          --text: #e8f0ff; --text-muted: #7a8ab0;
          --glow-cyan: 0 0 20px rgba(0,212,255,0.4);
          --success: #00ffaa;
        }
        html, body { background: var(--dark); color: var(--text); font-family: 'Exo 2', sans-serif; min-height: 100vh; overflow-x: hidden; }

        /* BG */
        .bg { position: fixed; inset: 0; z-index: 0;
          background: linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px);
          background-size: 44px 44px; }
        .bg::after { content:''; position:absolute; inset:0;
          background: radial-gradient(ellipse at 20% 0%,rgba(68,136,255,0.12) 0%,transparent 55%),
                      radial-gradient(ellipse at 80% 0%,rgba(180,79,255,0.10) 0%,transparent 55%),
                      radial-gradient(ellipse at 50% 100%,rgba(0,212,255,0.06) 0%,transparent 50%); }

        /* NAV */
        .nav { position: sticky; top: 0; z-index: 200; backdrop-filter: blur(20px);
          background: rgba(5,8,16,0.85); border-bottom: 1px solid var(--border);
          padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
        .nav-logo-icon { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#0a0f1e,#1a0a2e);
          border:1.5px solid rgba(0,212,255,0.35); display:flex; align-items:center; justify-content:center; font-size:16px;
          box-shadow:0 0 16px rgba(0,212,255,0.25); }
        .nav-logo-text { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; letter-spacing:3px; text-transform:uppercase;
          background:linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .nav-btn { padding:8px 20px; border-radius:8px; font-family:'Rajdhani',sans-serif; font-weight:600;
          font-size:13px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; text-decoration:none; display:flex; align-items:center; gap:6px; }
        .nav-btn-ghost { background:transparent; border:1px solid var(--border); color:var(--text-muted); }
        .nav-btn-ghost:hover { border-color:var(--border-hover); color:var(--cyan); }
        .nav-btn-primary { background:linear-gradient(135deg,var(--cyan),var(--blue)); border:none; color:#050810; }
        .nav-btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(0,212,255,0.35); }
        .cart-badge { background:var(--purple); color:#fff; border-radius:50%; width:18px; height:18px;
          display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; }

        /* HERO */
        .hero { position:relative; z-index:10; text-align:center; padding:72px 24px 56px; }
        .hero-tag { display:inline-block; font-family:'Rajdhani',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:4px; text-transform:uppercase; color:var(--cyan); border:1px solid rgba(0,212,255,0.25);
          border-radius:4px; padding:5px 16px; margin-bottom:20px; background:rgba(0,212,255,0.05); }
        .hero-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:clamp(40px,6vw,72px);
          line-height:1.05; letter-spacing:4px; text-transform:uppercase; margin-bottom:18px; }
        .hero-title span { background:linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-sub { font-size:15px; color:var(--text-muted); max-width:500px; margin:0 auto; line-height:1.7; }

        /* SECTION */
        .section { position:relative; z-index:10; max-width:920px; margin:0 auto; padding:0 20px 60px; }
        .section-header { display:flex; align-items:center; gap:16px; margin-bottom:28px; }
        .section-line { flex:1; height:1px; background:linear-gradient(90deg,var(--border),transparent); }
        .section-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:20px;
          letter-spacing:3px; text-transform:uppercase; white-space:nowrap; }

        /* SERVICE CARD */
        .service-card { background:var(--dark2); border:1px solid var(--border); border-radius:20px;
          padding:32px; position:relative; overflow:hidden; margin-bottom:24px; }
        .service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent); }
        .service-card-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:22px;
          letter-spacing:3px; text-transform:uppercase; margin-bottom:6px; }
        .service-card-sub { font-size:12px; color:var(--text-muted); letter-spacing:1px; margin-bottom:28px; }

        /* RANK ROW */
        .rank-row { display:flex; gap:14px; align-items:flex-end; margin-bottom:20px; }
        .rank-arrow { font-size:20px; color:var(--text-muted); padding-bottom:8px; flex-shrink:0; }

        /* MODE TOGGLE */
        .mode-toggle { display:flex; background:var(--dark3); border:1px solid var(--border); border-radius:10px; padding:4px; gap:4px; margin-bottom:24px; }
        .mode-btn { flex:1; padding:10px; text-align:center; font-family:'Rajdhani',sans-serif; font-weight:600;
          font-size:14px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:7px;
          color:var(--text-muted); transition:all 0.2s; border:none; background:transparent; }
        .mode-btn.active { background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(180,79,255,0.15));
          color:var(--cyan); border:1px solid rgba(0,212,255,0.3); }
        .carry-note { font-size:11px; color:var(--text-muted); margin-top:-18px; margin-bottom:20px; letter-spacing:0.5px; }
        .carry-note span { color:var(--purple); }

        /* PRICE DISPLAY */
        .price-row { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .price-display { display:flex; align-items:baseline; gap:6px; }
        .price-amount { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:38px;
          background:linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .price-currency { font-size:18px; color:var(--text-muted); font-family:'Rajdhani',sans-serif; }
        .price-label { font-size:12px; color:var(--text-muted); letter-spacing:1px; }

        /* ADD BTN */
        .add-btn { padding:14px 32px; background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple));
          background-size:200% 200%; animation:gradShift 4s ease infinite;
          border:none; border-radius:10px; font-family:'Rajdhani',sans-serif; font-weight:700;
          font-size:15px; letter-spacing:2.5px; text-transform:uppercase; color:#050810;
          cursor:pointer; transition:all 0.25s; white-space:nowrap; }
        .add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,212,255,0.4); }
        .add-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none !important; }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        /* BRAWLER INPUT */
        .brawler-wrap { position:relative; margin-bottom:24px; }
        .brawler-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); font-weight:600; margin-bottom:8px; display:block; }
        .brawler-input { width:100%; background:var(--dark3); border:1px solid rgba(180,79,255,0.25);
          border-radius:10px; padding:13px 16px 13px 44px; font-family:'Exo 2',sans-serif; font-size:14px;
          color:var(--text); outline:none; transition:all 0.25s; letter-spacing:1px; }
        .brawler-input::placeholder { color:var(--text-muted); }
        .brawler-input:focus { border-color:var(--purple); box-shadow:0 0 0 3px rgba(180,79,255,0.12),0 0 20px rgba(180,79,255,0.25); background:rgba(180,79,255,0.03); }
        .brawler-icon { position:absolute; left:14px; bottom:13px; font-size:18px; }

        /* PRESTIGE BREAKDOWN */
        .breakdown { background:var(--dark3); border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:20px; }
        .breakdown-row { display:flex; justify-content:space-between; font-size:13px; padding:4px 0; }
        .breakdown-row:not(:last-child) { border-bottom:1px solid rgba(255,255,255,0.04); }
        .breakdown-label { color:var(--text-muted); }
        .breakdown-price { color:var(--text); font-weight:600; font-family:'Rajdhani',sans-serif; font-size:14px; }

        /* CART DRAWER */
        .cart-overlay { position:fixed; inset:0; z-index:300; background:rgba(5,8,16,0.7); backdrop-filter:blur(4px);
          opacity:0; pointer-events:none; transition:opacity 0.3s; }
        .cart-overlay.open { opacity:1; pointer-events:all; }
        .cart-drawer { position:fixed; right:0; top:0; bottom:0; z-index:301; width:min(400px,100vw);
          background:var(--dark2); border-left:1px solid var(--border); display:flex; flex-direction:column;
          transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .cart-drawer.open { transform:translateX(0); }
        .cart-drawer::before { content:''; position:absolute; top:0; left:0; bottom:0; width:1px;
          background:linear-gradient(180deg,var(--cyan),var(--purple),transparent); }
        .cart-head { padding:24px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
        .cart-head-title { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; letter-spacing:3px; text-transform:uppercase; color:var(--cyan); }
        .cart-close { background:none; border:1px solid var(--border); color:var(--text-muted); width:32px; height:32px;
          border-radius:8px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .cart-close:hover { border-color:var(--border-hover); color:var(--text); }
        .cart-body { flex:1; overflow-y:auto; padding:20px; }
        .cart-empty { text-align:center; padding:60px 20px; color:var(--text-muted); font-size:14px; }
        .cart-empty-icon { font-size:48px; margin-bottom:16px; opacity:0.4; }
        .cart-item { background:var(--dark3); border:1px solid var(--border); border-radius:12px; padding:16px; margin-bottom:12px; }
        .cart-item-label { font-size:13px; color:var(--text); margin-bottom:6px; line-height:1.5; }
        .cart-item-type { display:inline-block; font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
          padding:2px 8px; border-radius:4px; margin-bottom:8px; font-weight:600; }
        .cart-item-row { display:flex; align-items:center; justify-content:space-between; }
        .cart-item-price { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:18px; color:var(--cyan); }
        .cart-item-remove { background:none; border:1px solid rgba(255,68,102,0.25); color:#ff4466; border-radius:6px;
          width:28px; height:28px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; }
        .cart-item-remove:hover { background:rgba(255,68,102,0.1); border-color:rgba(255,68,102,0.5); }
        .cart-foot { padding:20px; border-top:1px solid var(--border); }
        .cart-total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .cart-total-label { font-size:12px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); font-family:'Rajdhani',sans-serif; font-weight:600; }
        .cart-total-price { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:32px;
          background:linear-gradient(90deg,var(--cyan),var(--purple)); -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text; }
        .checkout-btn { width:100%; padding:15px; background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple));
          background-size:200%; animation:gradShift 4s ease infinite; border:none; border-radius:10px;
          font-family:'Rajdhani',sans-serif; font-weight:700; font-size:16px; letter-spacing:3px; text-transform:uppercase;
          color:#050810; cursor:pointer; transition:all 0.25s; }
        .checkout-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,212,255,0.4); }
        .checkout-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
        .discord-note { text-align:center; font-size:11px; color:var(--text-muted); margin-top:12px; line-height:1.6; }
        .discord-note a { color:var(--cyan); text-decoration:none; opacity:0.85; }
        .discord-note a:hover { opacity:1; }

        /* CORNER DECO */
        .corner { position:absolute; width:16px; height:16px; border-color:var(--cyan); border-style:solid; opacity:0.3; }
        .corner-tl { top:12px; left:12px; border-width:2px 0 0 2px; }
        .corner-tr { top:12px; right:12px; border-width:2px 2px 0 0; }
        .corner-bl { bottom:12px; left:12px; border-width:0 0 2px 2px; }
        .corner-br { bottom:12px; right:12px; border-width:0 2px 2px 0; }

        /* NOTE */
        .info-note { font-size:11px; color:var(--text-muted); margin-top:10px; font-style:italic; }

        @media (max-width:600px) {
          .rank-row { flex-direction:column; }
          .rank-arrow { transform:rotate(90deg); align-self:center; padding:0; }
          .price-row { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <div className="bg" />

      {/* NAV */}
      <nav className="nav">
        <a className="nav-logo" href="/">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">BrawlCarry</span>
        </a>
        <div className="nav-right">
          <a href="/auth" className="nav-btn nav-btn-ghost">Sign In</a>
          <button className="nav-btn nav-btn-primary" onClick={() => setCartOpen(true)}>
            🛒 Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">⚡ Elite Boosting Service</div>
        <h1 className="hero-title">
          Reach Your<br /><span>True Rank</span>
        </h1>
        <p className="hero-sub">Professional Brawl Stars boosting & carry services. Fast, safe, and guaranteed results.</p>
      </div>

      {/* ── RANKED BOOST ─────────────────────────────────────── */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🏆 Ranked Boost</div>
          <div className="section-line" />
        </div>

        <div className="service-card">
          <div className="corner corner-tl" /><div className="corner corner-tr" />
          <div className="corner corner-bl" /><div className="corner corner-br" />

          <div className="service-card-title">Ranked Boost</div>
          <div className="service-card-sub">Select your current and desired rank · Price depends on number of P11 brawlers</div>

          {/* Mode toggle */}
          <div className="mode-toggle">
            <button className={`mode-btn${effectiveMode === 'boost' ? ' active' : ''}`} onClick={() => setBoostMode('boost')}>⬆ Boost</button>
            <button
              className={`mode-btn${effectiveMode === 'carry' ? ' active' : ''}`}
              onClick={() => { if (!isProDest) setBoostMode('carry'); }}
              disabled={isProDest}
              title={isProDest ? 'Carry is not available for Pro rank' : ''}
              style={isProDest ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
            >🎮 Carry</button>
          </div>
          {isProDest && <div className="carry-note">Carry is <span>not available</span> for Pro rank — Boost only</div>}
          {!isProDest && effectiveMode === 'carry' && <div className="carry-note">Carry = you play alongside our booster · <span>2× price</span></div>}

          {/* Rank selectors */}
          <div className="rank-row">
            <RankSelect label="Current Rank" value={fromRank} onChange={(v) => { setFromRank(v); if (toRank <= v) setToRank(v + 1); }} />
            <div className="rank-arrow">→</div>
            <RankSelect label="Desired Rank" value={toRank} onChange={setToRank} exclude={fromRank} />
          </div>

          {/* Breakdown for multi-tier */}
          {toRank > fromRank && (() => {
            const segments: { label: string; price: number }[] = [];
            for (let i = fromRank; i < toRank; i++) {
              segments.push({ label: `${RANKS[i].label} → ${RANKS[i + 1].label}`, price: SEGMENT_PRICES[i] });
            }
            if (segments.length > 1) return (
              <div className="breakdown">
                {segments.map((s, i) => (
                  <div className="breakdown-row" key={i}>
                    <span className="breakdown-label">{s.label}</span>
                    <span className="breakdown-price">{s.price.toFixed(2)} €</span>
                  </div>
                ))}
                {effectiveMode === 'carry' && (
                  <div className="breakdown-row" style={{ marginTop: 8 }}>
                    <span className="breakdown-label" style={{ color: 'var(--purple)' }}>Carry ×2</span>
                    <span className="breakdown-price" style={{ color: 'var(--purple)' }}>{rankedBase.toFixed(2)} € × 2</span>
                  </div>
                )}
              </div>
            );
            return null;
          })()}

          <div className="price-row">
            <div>
              <div className="price-label" style={{ marginBottom: 4 }}>Total Price</div>
              <div className="price-display">
                <span className="price-currency">€</span>
                <span className="price-amount">{rankedPrice.toFixed(2)}</span>
              </div>
              <div className="info-note">* Price may vary with P11 brawlers</div>
            </div>
            <button className="add-btn" onClick={addRanked} disabled={toRank <= fromRank || rankedPrice === 0}>
              Add to Cart →
            </button>
          </div>
        </div>
      </div>

      {/* ── PRESTIGE BOOST ───────────────────────────────────── */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🏅 Prestige Boost</div>
          <div className="section-line" />
        </div>

        <div className="service-card" style={{ borderColor: 'rgba(180,79,255,0.25)' }}>
          <div className="corner corner-tl" style={{ borderColor: 'var(--purple)' }} />
          <div className="corner corner-tr" style={{ borderColor: 'var(--purple)' }} />
          <div className="corner corner-bl" style={{ borderColor: 'var(--purple)' }} />
          <div className="corner corner-br" style={{ borderColor: 'var(--purple)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--purple),var(--cyan),transparent)' }} />

          <div className="service-card-title" style={{ background: 'linear-gradient(90deg,var(--purple),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Prestige Boost</div>
          <div className="service-card-sub">Select prestige levels · Price depends on starting trophies and chosen brawler</div>

          {/* Prestige selectors */}
          <div className="rank-row">
            <PrestigeSelect label="Current Prestige" value={fromPrestige} onChange={(v) => { setFromPrestige(v); if (toPrestige <= v) setToPrestige(v + 1); }} />
            <div className="rank-arrow">→</div>
            <PrestigeSelect label="Target Prestige" value={toPrestige} onChange={setToPrestige} min={fromPrestige} />
          </div>

          {/* Brawler name */}
          <div className="brawler-wrap">
            <label className="brawler-label">Brawler Name</label>
            <span className="brawler-icon">🎮</span>
            <input
              className="brawler-input"
              type="text"
              placeholder="e.g. Shelly, Colt, Leon..."
              value={brawlerName}
              onChange={e => setBrawlerName(e.target.value)}
              maxLength={32}
            />
          </div>

          {/* Prestige breakdown */}
          {toPrestige > fromPrestige && (
            <div className="breakdown">
              {Array.from({ length: toPrestige - fromPrestige }, (_, i) => ({
                from: fromPrestige + i,
                to: fromPrestige + i + 1,
                price: PRESTIGE_SEGMENTS[fromPrestige + i],
              })).map((s, i) => (
                <div className="breakdown-row" key={i}>
                  <span className="breakdown-label">{PRESTIGE_LABELS[s.from]} → {PRESTIGE_LABELS[s.to]}</span>
                  <span className="breakdown-price">{s.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}

          <div className="price-row">
            <div>
              <div className="price-label" style={{ marginBottom: 4 }}>Total Price</div>
              <div className="price-display">
                <span className="price-currency" style={{ color: 'var(--purple)', opacity: 0.8 }}>€</span>
                <span className="price-amount" style={{ background: 'linear-gradient(90deg,var(--purple),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {prestigePrice.toFixed(2)}
                </span>
              </div>
              <div className="info-note">* Depends on trophies and brawler</div>
            </div>
            <button
              className="add-btn"
              onClick={addPrestige}
              disabled={toPrestige <= fromPrestige || !brawlerName.trim()}
              style={{ background: 'linear-gradient(135deg,var(--purple),var(--cyan))' }}
            >
              Add to Cart →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SPACER */}
      <div style={{ height: 60 }} />

      {/* ── CART OVERLAY ─────────────────────────────────────── */}
      <div className={`cart-overlay${cartOpen ? ' open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer${cartOpen ? ' open' : ''}`}>
        <div className="cart-head">
          <div className="cart-head-title">Your Cart</div>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div>Your cart is empty.<br />Add a boost or prestige service to get started.</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div>
                  <span
                    className="cart-item-type"
                    style={item.type === 'ranked'
                      ? { background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,212,255,0.25)' }
                      : { background: 'rgba(180,79,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(180,79,255,0.25)' }}
                  >
                    {item.type === 'ranked' ? '🏆 Ranked' : '🏅 Prestige'}
                  </span>
                </div>
                <div className="cart-item-label">{item.label}</div>
                <div className="cart-item-row">
                  <div className="cart-item-price">€ {item.price.toFixed(2)}</div>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="cart-total-row" style={{ marginBottom: 6 }}>
            <div className="cart-total-label" style={{ fontSize: 11 }}>Subtotal</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>€ {cartSubtotal.toFixed(2)}</div>
          </div>
          <div className="cart-total-row" style={{ marginBottom: 14 }}>
            <div className="cart-total-label" style={{ fontSize: 11, color: 'var(--purple)', opacity: 0.9 }}>Service Fee (5%)</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--purple)' }}>€ {serviceFee.toFixed(2)}</div>
          </div>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
          <div className="cart-total-row" style={{ marginBottom: 16 }}>
            <div className="cart-total-label">Total</div>
            <div className="cart-total-price">€ {cartTotal.toFixed(2)}</div>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0}>
            Proceed to Checkout
          </button>
          <div className="discord-note">
            Questions? Join us on <a href="https://discord.gg/R8qYVyFqCT" target="_blank" rel="noopener noreferrer">discord.gg/R8qYVyFqCT</a>
          </div>
        </div>
      </div>
    </>
  );
}
