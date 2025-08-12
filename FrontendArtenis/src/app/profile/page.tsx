"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) checkAuth();
  }, [isAuthenticated, checkAuth]);

  if (isLoading) return <div className="p-6">Cargando…</div>;
  if (!isAuthenticated) return <div className="p-6">Inicia sesión para ver tu perfil</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8 text-white">
        <div className="flex items-center gap-4">
          <img src={user?.avatar || '/favicon.ico'} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-white/70">@{user?.username}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Información</h3>
            <p className="text-white/80">Email: {user?.email}</p>
            <p className="text-white/80">Rol: {user?.role}</p>
          </div>

          {user?.isArtist && (
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Perfil de Tatuador</h3>
              <p className="text-white/80">Tu cuenta está configurada como artista. Próximamente podrás editar tu estudio, estilos y tarifas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


