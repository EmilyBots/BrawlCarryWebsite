'use client';

import { useState, useEffect, useCallback } from 'react';

type Tab = 'dashboard' | 'users' | 'email';

interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  totalSessions: number;
  recentUsers: User[];
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userPages, setUserPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Email
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetch('/api/admin/check').then(r => {
      if (r.ok) setAuthed(true);
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (authed && tab === 'dashboard') {
      fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    }
  }, [authed, tab]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&page=${userPage}`);
    const data = await res.json();
    setUsers(data.users || []);
    setUserTotal(data.total || 0);
    setUserPages(data.pages || 1);
    setUsersLoading(false);
  }, [userSearch, userPage]);

  useEffect(() => {
    if (authed && tab === 'users') loadUsers();
  }, [authed, tab, loadUsers]);

  async function deleteUser(id: string) {
    await fetch('/api/admin/users', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    });
    setDeleteConfirm(null);
    loadUsers();
    if (stats) fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }

  async function sendEmail() {
    setEmailLoading(true); setEmailResult(''); setEmailError('');
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody, sendToAll }),
      });
      const data = await res.json();
      if (!res.ok) setEmailError(data.error);
      else setEmailResult(`✓ Sent to ${data.sent} recipient${data.sent !== 1 ? 's' : ''}.`);
    } catch { setEmailError('Network error.'); }
    finally { setEmailLoading(false); }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, letterSpacing: 3 }}>
      LOADING...
    </div>
  );

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Exo 2, sans-serif', color: '#e8f0ff' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 24, letterSpacing: 4, color: '#ff4466', marginBottom: 8 }}>ACCESS DENIED</div>
      <div style={{ color: '#7a8ab0', fontSize: 14 }}>You must be an admin to view this page.</div>
      <a href="/" style={{ marginTop: 24, color: '#00d4ff', fontSize: 13, textDecoration: 'none' }}>← Back to Home</a>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cyan: #00d4ff; --purple: #b44fff; --blue: #4488ff;
          --dark: #050810; --dark2: #0a0f1e; --dark3: #0f1628;
          --border: rgba(0,212,255,0.15); --text: #e8f0ff; --text-muted: #7a8ab0;
          --red: #ff4466; --green: #00ffaa;
        }
        body { font-family: 'Exo 2', sans-serif; background: var(--dark); color: var(--text); min-height: 100vh; }
        .bg { position: fixed; inset: 0; z-index: 0;
          background: linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
          background-size: 44px 44px; }

        /* Layout */
        .layout { display: flex; min-height: 100vh; position: relative; z-index: 10; }

        /* Sidebar */
        .sidebar { width: 240px; background: var(--dark2); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); }
        .sidebar-logo-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 18px; letter-spacing: 3px; text-transform: uppercase; background: linear-gradient(90deg, var(--cyan), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .sidebar-logo-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
        .sidebar-nav { flex: 1; padding: 16px 12px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; cursor: pointer; color: var(--text-muted); font-size: 14px; font-weight: 500; transition: all 0.2s; margin-bottom: 4px; border: 1px solid transparent; user-select: none; }
        .nav-item:hover { background: rgba(0,212,255,0.05); color: var(--text); border-color: var(--border); }
        .nav-item.active { background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(180,79,255,0.08)); color: var(--cyan); border-color: rgba(0,212,255,0.25); }
        .nav-icon { font-size: 18px; width: 22px; text-align: center; }
        .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
        .sidebar-foot a { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 13px; text-decoration: none; padding: 8px 10px; border-radius: 8px; transition: color 0.2s; }
        .sidebar-foot a:hover { color: var(--cyan); }

        /* Main */
        .main { flex: 1; overflow-y: auto; }
        .main-head { padding: 28px 32px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; }
        .main-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: 3px; text-transform: uppercase; }
        .main-body { padding: 28px 32px; }

        /* Stat cards */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: var(--dark2); border: 1px solid var(--border); border-radius: 16px; padding: 22px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--cyan), var(--purple)); }
        .stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; }
        .stat-value { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 40px; background: linear-gradient(90deg, var(--cyan), var(--blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
        .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }

        /* Section card */
        .section-card { background: var(--dark2); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 24px; }
        .section-card-head { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .section-card-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; color: var(--cyan); }
        .section-card-body { padding: 20px 24px; }

        /* Table */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
        td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: var(--text); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(0,212,255,0.03); }

        /* Badge */
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .badge-green { background: rgba(0,255,170,0.1); color: var(--green); border: 1px solid rgba(0,255,170,0.2); }
        .badge-red { background: rgba(255,68,102,0.1); color: var(--red); border: 1px solid rgba(255,68,102,0.2); }
        .badge-blue { background: rgba(0,212,255,0.1); color: var(--cyan); border: 1px solid rgba(0,212,255,0.2); }

        /* Buttons */
        .btn { padding: 8px 16px; border-radius: 8px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-danger { background: rgba(255,68,102,0.15); color: var(--red); border: 1px solid rgba(255,68,102,0.3); }
        .btn-danger:hover { background: rgba(255,68,102,0.25); border-color: rgba(255,68,102,0.5); }
        .btn-primary { background: linear-gradient(135deg, var(--cyan), var(--blue)); color: #050810; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,212,255,0.35); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
        .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }

        /* Search */
        .search-wrap { position: relative; }
        .search-input { background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; padding: 9px 14px 9px 36px; font-family: 'Exo 2', sans-serif; font-size: 13px; color: var(--text); outline: none; width: 240px; }
        .search-input:focus { border-color: var(--cyan); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; }

        /* Email form */
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; }
        .form-input { width: 100%; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; font-family: 'Exo 2', sans-serif; font-size: 14px; color: var(--text); outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: var(--cyan); }
        .form-textarea { resize: vertical; min-height: 160px; line-height: 1.7; }
        .form-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; color: var(--text-muted); user-select: none; }
        .custom-checkbox { width: 18px; height: 18px; border: 1.5px solid rgba(0,212,255,0.4); border-radius: 5px; background: var(--dark3); display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .custom-checkbox.checked { background: linear-gradient(135deg, var(--cyan), var(--blue)); border-color: var(--cyan); }
        .checkmark { color: #050810; font-size: 11px; font-weight: 700; }

        /* Alert */
        .alert { border-radius: 8px; padding: 11px 14px; font-size: 13px; margin-bottom: 16px; }
        .alert-success { background: rgba(0,255,170,0.08); border: 1px solid rgba(0,255,170,0.25); color: var(--green); }
        .alert-error { background: rgba(255,68,102,0.08); border: 1px solid rgba(255,68,102,0.25); color: var(--red); }

        /* Pagination */
        .pagination { display: flex; align-items: center; gap: 8px; margin-top: 16px; justify-content: flex-end; }
        .page-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-muted); transition: all 0.2s; }
        .page-btn:hover { border-color: var(--cyan); color: var(--cyan); }
        .page-btn.active { background: rgba(0,212,255,0.15); border-color: var(--cyan); color: var(--cyan); }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Confirm dialog */
        .confirm-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(5,8,16,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
        .confirm-box { background: var(--dark2); border: 1px solid rgba(255,68,102,0.3); border-radius: 16px; padding: 32px; max-width: 380px; width: 90%; text-align: center; }
        .confirm-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; color: var(--red); margin-bottom: 12px; }
        .confirm-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.6; }
        .confirm-actions { display: flex; gap: 12px; justify-content: center; }

        /* Spinner */
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(5,8,16,0.3); border-top-color: #050810; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .sidebar { width: 60px; }
          .nav-item span, .sidebar-logo-title, .sidebar-logo-sub, .sidebar-foot a span { display: none; }
          .main-head, .main-body { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <div className="bg" />

      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">BrawlCarry</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>
          <div className="sidebar-nav">
            {([
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'users', icon: '👥', label: 'Users' },
              { id: 'email', icon: '✉️', label: 'Send Email' },
            ] as { id: Tab; icon: string; label: string }[]).map(item => (
              <div key={item.id} className={`nav-item${tab === item.id ? ' active' : ''}`} onClick={() => setTab(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-foot">
            <a href="/"><span>🏠</span><span>Back to Site</span></a>
          </div>
        </div>

        {/* Main */}
        <div className="main">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <>
              <div className="main-head">
                <div className="main-title">📊 Dashboard</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div className="main-body">
                {stats ? (
                  <>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-sub">Registered accounts</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Verified Users</div>
                        <div className="stat-value" style={{ background: 'linear-gradient(90deg,#00ffaa,#00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.verifiedUsers}</div>
                        <div className="stat-sub">Email confirmed</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Active Sessions</div>
                        <div className="stat-value" style={{ background: 'linear-gradient(90deg,#b44fff,#4488ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.totalSessions}</div>
                        <div className="stat-sub">Currently logged in</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Unverified</div>
                        <div className="stat-value" style={{ background: 'linear-gradient(90deg,#ff4466,#ffaa00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stats.totalUsers - stats.verifiedUsers}</div>
                        <div className="stat-sub">Pending verification</div>
                      </div>
                    </div>

                    <div className="section-card">
                      <div className="section-card-head">
                        <div className="section-card-title">Recent Registrations</div>
                        <button className="btn btn-ghost" onClick={() => setTab('users')} style={{ fontSize: 11, padding: '6px 12px' }}>View All →</button>
                      </div>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recentUsers.map(u => (
                              <tr key={u.id}>
                                <td style={{ fontWeight: 600 }}>⚡ {u.username}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                <td>
                                  {u.emailVerified
                                    ? <span className="badge badge-green">✓ Verified</span>
                                    : <span className="badge badge-red">Unverified</span>}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading stats...</div>
                )}
              </div>
            </>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <>
              <div className="main-head">
                <div className="main-title">👥 Users</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{userTotal} total</span>
                  <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                      className="search-input"
                      placeholder="Search by email or username..."
                      value={userSearch}
                      onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                    />
                  </div>
                </div>
              </div>
              <div className="main-body">
                <div className="section-card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersLoading ? (
                          <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Loading...</td></tr>
                        ) : users.map(u => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: 600 }}>⚡ {u.username}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                            <td>
                              {u.emailVerified
                                ? <span className="badge badge-green">✓ Verified</span>
                                : <span className="badge badge-red">Unverified</span>}
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 10px' }}
                                  onClick={() => { setEmailTo(u.email); setTab('email'); setSendToAll(false); }}>
                                  ✉ Email
                                </button>
                                <button className="btn btn-danger" style={{ fontSize: 11, padding: '5px 10px' }}
                                  onClick={() => setDeleteConfirm(u.id)}>
                                  🗑 Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {userPages > 1 && (
                    <div style={{ padding: '12px 20px' }}>
                      <div className="pagination">
                        <button className="page-btn" onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1}>‹</button>
                        {Array.from({ length: Math.min(userPages, 7) }, (_, i) => i + 1).map(p => (
                          <button key={p} className={`page-btn${p === userPage ? ' active' : ''}`} onClick={() => setUserPage(p)}>{p}</button>
                        ))}
                        <button className="page-btn" onClick={() => setUserPage(p => Math.min(userPages, p + 1))} disabled={userPage === userPages}>›</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── EMAIL ── */}
          {tab === 'email' && (
            <>
              <div className="main-head">
                <div className="main-title">✉️ Send Email</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Resend</div>
              </div>
              <div className="main-body">
                <div className="section-card">
                  <div className="section-card-head">
                    <div className="section-card-title">Compose Email</div>
                  </div>
                  <div className="section-card-body">
                    {emailResult && <div className="alert alert-success">{emailResult}</div>}
                    {emailError && <div className="alert alert-error">⚠ {emailError}</div>}

                    <div className="form-group">
                      <label className="form-label">Send To</label>
                      <div className="form-checkbox" style={{ marginBottom: 12 }} onClick={() => setSendToAll(!sendToAll)}>
                        <div className={`custom-checkbox${sendToAll ? ' checked' : ''}`}>{sendToAll && <span className="checkmark">✓</span>}</div>
                        <span>Send to <strong style={{ color: 'var(--cyan)' }}>all verified users</strong> (broadcast)</span>
                      </div>
                      {!sendToAll && (
                        <input
                          className="form-input"
                          type="email"
                          placeholder="recipient@email.com"
                          value={emailTo}
                          onChange={e => setEmailTo(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Email subject line..."
                        value={emailSubject}
                        onChange={e => setEmailSubject(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message Body</label>
                      <textarea
                        className="form-input form-textarea"
                        placeholder="Write your message here... Plain text is fine, it will be beautifully formatted in the email."
                        value={emailBody}
                        onChange={e => setEmailBody(e.target.value)}
                      />
                    </div>

                    {sendToAll && (
                      <div style={{ background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: '#ffaa00' }}>
                        ⚠ This will send to <strong>all verified users</strong>. Double-check before sending.
                      </div>
                    )}

                    <button
                      className="btn btn-primary"
                      onClick={sendEmail}
                      disabled={emailLoading || !emailSubject || !emailBody || (!sendToAll && !emailTo)}
                      style={{ padding: '12px 28px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {emailLoading ? <><div className="spinner" />Sending...</> : '✉ Send Email'}
                    </button>
                  </div>
                </div>

                {/* Quick templates */}
                <div className="section-card">
                  <div className="section-card-head">
                    <div className="section-card-title">Quick Templates</div>
                  </div>
                  <div className="section-card-body">
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {[
                        { label: 'Order Complete', subject: 'Your BrawlCarry order is complete!', body: 'Hey!\n\nGreat news — your boosting order has been completed successfully.\n\nThank you for choosing BrawlCarry. We hope to see you again soon!\n\nJoin our Discord for updates and exclusive deals: discord.gg/R8qYVyFqCT\n\n— BrawlCarry Team' },
                        { label: 'Maintenance Notice', subject: 'Scheduled Maintenance — BrawlCarry', body: 'Hey!\n\nWe wanted to let you know that BrawlCarry will be undergoing scheduled maintenance.\n\nDuring this time, services may be temporarily unavailable. We apologize for any inconvenience.\n\nThank you for your patience!\n\n— BrawlCarry Team' },
                        { label: 'New Feature', subject: '🚀 New feature just dropped on BrawlCarry!', body: 'Hey!\n\nWe\'ve just launched something new on BrawlCarry that we think you\'re going to love.\n\nCheck it out at brawlcarry.store and let us know what you think!\n\nJoin our Discord community: discord.gg/R8qYVyFqCT\n\n— BrawlCarry Team' },
                        { label: 'Order Started', subject: 'Your BrawlCarry order has started!', body: 'Hey!\n\nJust a quick heads up — one of our boosters has started working on your order.\n\nPlease avoid logging into your account during the boosting process.\n\nFor real-time updates, join our Discord: discord.gg/R8qYVyFqCT\n\n— BrawlCarry Team' },
                      ].map(t => (
                        <button key={t.label} className="btn btn-ghost"
                          onClick={() => { setEmailSubject(t.subject); setEmailBody(t.body); setSendToAll(false); }}
                          style={{ fontSize: 12, padding: '8px 14px' }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className="confirm-title">⚠ Delete User</div>
            <div className="confirm-sub">This will permanently delete the user and all their data. This action cannot be undone.</div>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteUser(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
