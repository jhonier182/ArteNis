"use client";
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('usuario@ejemplo.com');
  const [password, setPassword] = useState('MiContraseñaSegura123!');
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = /.+@.+\..+/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid && !isLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = '/';
    } catch {}
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/fondo.jpg)" }}>
      <div className="min-h-screen flex items-center justify-center p-6">
        {/* Glass card */}
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl">
          <div className="px-8 pt-8 pb-4 text-center text-white">
            <h1 className="text-3xl font-semibold tracking-wide">Login</h1>
          </div>

          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
            {error && (
              <div className="text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded px-3 py-2">{error}</div>
            )}

            {/* Email row with icon and underline */}
            <div className="text-white/90">
              <div className="flex items-center gap-3 border-b border-white/50 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90"><path d="M4 4h16v16H4z" strokeWidth="0" fill="none"></path><path d="M4 8l8 5 8-5" strokeWidth="1.5"/></svg>
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-white/70"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              {!emailValid && (<p className="text-xs text-red-200 mt-1">Ingresa un email válido</p>)}
            </div>

            {/* Password row with icon and toggle */}
            <div className="text-white/90">
              <div className="flex items-center gap-3 border-b border-white/50 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90"><path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeWidth="1.5"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeWidth="1.5"/></svg>
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-white/70"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={()=>setShowPassword(s=>!s)}
                  className="text-white/80 text-xs hover:text-white"
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              {!passwordValid && (<p className="text-xs text-red-200 mt-1">La contraseña debe tener al menos 6 caracteres</p>)}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-white/80 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-white/90" />
                Remember me
              </label>
              <Link href="#" className="hover:underline">Forgot Password?</Link>
            </div>

            {/* Action */}
            <button
              disabled={!canSubmit}
              className="w-full rounded-md bg-white text-black py-2.5 font-medium hover:bg-white/90 transition disabled:opacity-60"
            >
              {isLoading ? 'Ingresando…' : 'Login'}
            </button>

            <div className="text-center text-sm text-white/80">
              Don’t have an account?{' '}
              <Link href="/auth/register" className="underline">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


