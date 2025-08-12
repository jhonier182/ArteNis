"use client";
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('usuario@ejemplo.com');
  const [username, setUsername] = useState('usuario123');
  const [password, setPassword] = useState('MiContraseñaSegura123!');
  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Pérez');
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = /.+@.+\..+/.test(email);
  const usernameValid = username.length >= 3;
  const passwordValid = password.length >= 8;
  const firstValid = firstName.length >= 2;
  const lastValid = lastName.length >= 2;
  const canSubmit = emailValid && usernameValid && passwordValid && firstValid && lastValid && !isLoading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, username, password, firstName, lastName });
      window.location.href = '/';
    } catch {}
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/fondo.jpg)' }}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl text-white">
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-3xl font-semibold tracking-wide">Register</h1>
          </div>

          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-5">
            {error && (
              <div className="text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded px-3 py-2">{error}</div>
            )}

            <div>
              <div className="flex items-center gap-3 border-b border-white/50 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90"><path d="M4 8l8 5 8-5" strokeWidth="1.5"/></svg>
                <input className="flex-1 bg-transparent outline-none placeholder:text-white/70" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" required />
              </div>
              {!emailValid && (<p className="text-xs text-red-200 mt-1">Ingresa un email válido</p>)}
            </div>

            <div>
              <div className="flex items-center gap-3 border-b border-white/50 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="1.5"/></svg>
                <input className="flex-1 bg-transparent outline-none placeholder:text-white/70" value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Username" required />
              </div>
              {!usernameValid && (<p className="text-xs text-red-200 mt-1">El usuario debe tener al menos 3 caracteres</p>)}
            </div>

            <div>
              <div className="flex items-center gap-3 border-b border-white/50 py-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90"><path d="M12 17a2 2 0 100-4 2 2 0 000 4z" strokeWidth="1.5"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeWidth="1.5"/></svg>
                <input className="flex-1 bg-transparent outline-none placeholder:text-white/70" value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" required />
                <button type="button" onClick={()=>setShowPassword(s=>!s)} className="text-white/80 text-xs hover:text-white" aria-label="Mostrar contraseña">{showPassword ? 'Ocultar' : 'Ver'}</button>
              </div>
              {!passwordValid && (<p className="text-xs text-red-200 mt-1">La contraseña debe tener al menos 8 caracteres</p>)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-b border-white/50 py-2">
                <input className="w-full bg-transparent outline-none placeholder:text-white/70" value={firstName} onChange={(e)=>setFirstName(e.target.value)} type="text" placeholder="Nombre" required />
              </div>
              <div className="border-b border-white/50 py-2">
                <input className="w-full bg-transparent outline-none placeholder:text-white/70" value={lastName} onChange={(e)=>setLastName(e.target.value)} type="text" placeholder="Apellido" required />
              </div>
            </div>
            {(!firstValid || !lastValid) && (<p className="text-xs text-red-200">Nombre y apellido deben tener al menos 2 caracteres</p>)}

            <button disabled={!canSubmit} className="w-full rounded-md bg-white text-black py-2.5 font-medium hover:bg-white/90 transition disabled:opacity-60">
              {isLoading ? 'Creando…' : 'Crear cuenta'}
            </button>

            <div className="text-center text-sm text-white/80">
              ¿Ya tienes cuenta? <Link href="/auth/login" className="underline">Inicia sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


