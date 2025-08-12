"use client";
import { useEffect, useState } from 'react';
import { FeedScreen } from '@/screens/Feed/FeedScreen';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setChecked(true));
  }, [checkAuth]);

  const hasOnboarded = typeof window !== 'undefined' && localStorage.getItem('artenis_onboarded') === '1';

  if (!checked || isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!hasOnboarded) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/fondo.jpg)" }}>
        <div className="min-h-screen backdrop-brightness-75 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
          <h1 className="text-3xl font-semibold">Bienvenido a Artenis</h1>
          <p className="max-w-md">Descubre tatuajes, sigue artistas y reserva citas.</p>
          <button
            className="px-5 py-2.5 bg-white text-black rounded-md hover:bg-white/90"
            onClick={() => {
              localStorage.setItem('artenis_onboarded', '1');
              window.location.reload();
            }}
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/fondo.jpg)" }}>
        <div className="min-h-screen backdrop-brightness-75 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
          <h2 className="text-2xl font-semibold">Inicia sesión o regístrate</h2>
          <div className="flex gap-3">
            <Link href="/auth/login" className="px-4 py-2 bg-white text-black rounded">Iniciar sesión</Link>
            <Link href="/auth/register" className="px-4 py-2 border border-white text-white rounded">Registrarme</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <FeedScreen />
    </div>
  );
}
