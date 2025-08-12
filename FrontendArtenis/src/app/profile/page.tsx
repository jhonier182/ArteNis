"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, User, ClipboardList, Heart, CreditCard, Star, MapPin, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) checkAuth();
  }, [isAuthenticated, checkAuth]);

  if (isLoading) return <div className="p-6">Cargando…</div>;
  if (!isAuthenticated) return <div className="p-6">Inicia sesión para ver tu perfil</div>;

  const menu = [
    { icon: User, label: 'Información personal', onClick: () => {} },
    { icon: ClipboardList, label: 'Tus pedidos', onClick: () => {} },
    { icon: Heart, label: 'Favoritos', onClick: () => {} },
    { icon: CreditCard, label: 'Pagos', onClick: () => {} },
    { icon: Star, label: 'Recomendados', onClick: () => {} },
    { icon: MapPin, label: 'Tiendas cercanas', onClick: () => {} },
    { icon: LogOut, label: 'Cerrar sesión', onClick: () => { logout(); router.push('/auth/login'); } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black">
      <div className="max-w-md mx-auto px-4 py-6 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10"><ArrowLeft size={18} /></button>
          <button onClick={() => router.push('/settings')} className="p-2 rounded-full bg-white/10"><Settings size={18} /></button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center">
          <img src={user?.avatar || '/favicon.ico'} alt="avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-white/10" />
          <h2 className="text-2xl font-semibold mt-3">{user?.firstName} {user?.lastName}</h2>
          <p className="text-white/70 text-sm">{user?.language === 'en' ? 'United States' : 'Ciudad, País'}</p>
        </div>

        {/* Stats card */}
        <div className="mt-6 rounded-xl bg-emerald-600/90 text-white shadow-lg grid grid-cols-3 overflow-hidden">
          <div className="p-4 text-center">
            <div className="text-sm opacity-90">Balance</div>
            <div className="font-semibold">00.0</div>
          </div>
          <div className="p-4 text-center border-l border-white/20">
            <div className="text-sm opacity-90">Órdenes</div>
            <div className="font-semibold">10</div>
          </div>
          <div className="p-4 text-center border-l border-white/20">
            <div className="text-sm opacity-90">Gasto total</div>
            <div className="font-semibold">00.0</div>
          </div>
        </div>

        {/* Menu list */}
        <div className="mt-6 space-y-3">
          {menu.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 transition rounded-lg px-4 py-3 text-left"
            >
              <item.icon size={18} className="text-emerald-400" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


