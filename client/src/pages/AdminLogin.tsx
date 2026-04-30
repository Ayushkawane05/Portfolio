import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Access Denied');
      }

      setStatus('success');
      // Backend sets httpOnly cookie, so we just redirect
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-pixel-bg text-pixel-text font-pixel flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border-4 border-pixel-primary animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-2 border-pixel-secondary animate-bounce" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="pixel-border p-8 bg-pixel-bg/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,212,255,0.1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-3 h-3 bg-pixel-primary animate-ping" />
            <h1 className="text-sm tracking-[0.3em] uppercase text-pixel-primary">
              ADMIN_ACCESS_V1.0
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[8px] text-pixel-muted uppercase tracking-widest">
                IDENTITY_TOKEN (EMAIL)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-pixel-bg/50 border-2 border-pixel-muted/20 p-3 text-xs focus:border-pixel-primary outline-none transition-colors"
                placeholder="USER@SYSTEM.COM"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[8px] text-pixel-muted uppercase tracking-widest">
                ACCESS_KEY (PASSWORD)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-pixel-bg/50 border-2 border-pixel-muted/20 p-3 text-xs focus:border-pixel-primary outline-none transition-colors"
                placeholder="********"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 text-[8px] text-red-500 uppercase tracking-tighter">
                [ERROR]: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full p-4 border-2 font-pixel text-xs transition-all flex items-center justify-center gap-3 ${
                status === 'success'
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : 'bg-pixel-primary/10 border-pixel-primary text-pixel-primary hover:bg-pixel-primary hover:text-pixel-bg active:scale-[0.98]'
              }`}
            >
              {status === 'loading' ? (
                <>
                  <span className="w-3 h-3 border-2 border-current border-t-transparent animate-spin" />
                  AUTHENTICATING...
                </>
              ) : status === 'success' ? (
                'ACCESS_GRANTED'
              ) : (
                'INITIATE_SESSION'
              )}
            </button>
          </form>

          <div className="mt-12 flex justify-between items-center opacity-30">
            <span className="text-[8px] uppercase tracking-widest cursor-pointer hover:text-pixel-primary transition-colors">Recover_Access</span>
            <span className="text-[8px] uppercase tracking-widest">v1.0.4-LTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
