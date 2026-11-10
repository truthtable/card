import React, { useState, useCallback } from 'react';
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react';

// SHA-256 hash of the dashboard password (never store raw password)
const PASSWORD_HASH = '2e48b4de13c5be5bffecd3107a32a8e7ebca0fa7651a1836c62e5466e5f1e995';
const SESSION_KEY = 'dashboard_auth';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useDashboardAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  const login = useCallback(async (password: string): Promise<boolean> => {
    const hash = await sha256(password);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout };
}

interface Props {
  onLogin: (password: string) => Promise<boolean>;
}

export const DashboardLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await onLogin(password);
    if (!ok) {
      setError('Incorrect password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-[#f7ebe4]"
      style={{
        backgroundImage: "url('/media/perr-tile-83d714.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '128px auto',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-[#dfc39a]/70 overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#6b1d2e] px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="font-script text-xl text-[#d4a853]">Taha & Zainab</p>
            <h1 className="font-cinzel text-sm font-semibold tracking-[0.2em] text-white/90 uppercase mt-0.5">
              RSVP Dashboard
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-7 space-y-4">
            <p className="font-cormorant italic text-[#8b5a2b] text-sm text-center">
              Enter the dashboard password to continue.
            </p>

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                autoFocus
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full border border-[#d6b08a] rounded-xl px-4 py-3 pr-11 text-sm font-sans text-[#3a1a1a] placeholder-[#c4a882] focus:outline-none focus:border-[#6b1d2e] focus:ring-1 focus:ring-[#6b1d2e]/30 transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4a882] hover:text-[#6b1d2e] transition cursor-pointer"
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-600 text-xs font-sans text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-[#6b1d2e] hover:bg-[#531522] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-cinzel font-semibold text-sm tracking-widest uppercase transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Verifying…' : 'Enter Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center font-cinzel text-[10px] tracking-widest text-[#b08060]/60 uppercase mt-4">
          Authorized Access Only
        </p>
      </div>
    </div>
  );
};

