import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sun, Moon, AlertCircle } from 'lucide-react';

/* Same custom S lettermark used in the sidebar */
function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 8.5C7 6.567 8.567 5 10.5 5H14C15.933 5 17.5 6.567 17.5 8.5C17.5 10.433 15.933 12 14 12H10C8.067 12 6.5 13.567 6.5 15.5C6.5 17.433 8.067 19 10 19H13.5C15.433 19 17 17.433 17 15.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginView({ onLogin, theme, toggleTheme }) {
  const [email, setEmail] = useState('admin@sapms.local');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Ambient Glows */}
      <div className="login-bg-glow-1" />
      <div className="login-bg-glow-2" />

      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="glass-card login-card">
        <div className="login-header">
          <div className="login-logo-box">
            <LogoMark size={28} />
          </div>
          <h1 className="login-title">Sign in to SAPMS</h1>
          <p className="login-subtitle">
            Manage students, attendance, and academic records
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-rose-bg)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#fb7185',
              fontSize: '0.875rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-input has-icon"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 4 }}>
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className="form-input has-icon"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="demo-account-pill">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo account:</strong>{' '}
            <span className="mono">admin@sapms.local</span> / <span className="mono">Admin@12345</span>
          </div>
        </div>
      </div>
    </div>
  );
}
