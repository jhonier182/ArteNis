"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Grid, Bookmark, Image } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [tab, setTab] = useState<'posts'|'saved'|'artist'>('saved');
  const [postsCount, setPostsCount] = useState<number>(0);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) checkAuth();
  }, [isAuthenticated, checkAuth]);

  useEffect(() => {
    const loadCounts = async () => {
      if (!user) return;
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
      try {
        // Posts count (para cualquier rol)
        const resP = await fetch(`${base}/posts/user/${user.id}?page=1&limit=1`);
        const dataP = await resP.json();
        const wrappedP = dataP?.data ?? dataP;
        if (wrappedP?.total !== undefined) setPostsCount(wrappedP.total);
      } catch {}
      try {
        // Citas del usuario (requiere auth)
        const token = typeof window !== 'undefined' ? localStorage.getItem('artenis_token') : null;
        if (token) {
          const resA = await fetch(`${base}/bookings/appointments?page=1&limit=1`, { headers: { Authorization: `Bearer ${token}` } });
          const dataA = await resA.json();
          const wrappedA = dataA?.data ?? dataA;
          if (wrappedA?.total !== undefined) setAppointmentsCount(wrappedA.total);
        }
      } catch {}
    };
    loadCounts();
  }, [user]);

  if (isLoading) return <div className="p-6">Cargando…</div>;
  if (!isAuthenticated) return <div className="p-6">Inicia sesión para ver tu perfil</div>;

  // Menú eliminado

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black">
      <div className="max-w-md mx-auto px-4 py-6 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10"><ArrowLeft size={18} /></button>
          <button onClick={() => router.push('/settings')} className="p-2 rounded-full bg-white/10"><Settings size={18} /></button>
        </div>

        {/* Avatar + name (estilo artista) */}
        <div className="flex flex-col items-center">
          <img src={user?.avatar || '/favicon.ico'} alt="avatar" className="w-28 h-28 rounded-full object-cover ring-4 ring-white/10" />
          <div className="mt-3 flex items-center gap-2">
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            {user?.role === 'artist' && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-[10px]">✓</span>
            )}
          </div>
          <p className="text-white/70 text-sm">@{user?.username}</p>
        </div>

        {/* Stats fila */}
        {user?.role === 'artist' ? (
          <div className="mt-5 grid grid-cols-3 text-center">
            <div>
              <div className="text-lg font-semibold">{postsCount}</div>
              <div className="text-xs text-white/70">Posts</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.followersCount ?? 0}</div>
              <div className="text-xs text-white/70">Followers</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.followingCount ?? 0}</div>
              <div className="text-xs text-white/70">Following</div>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 text-center">
            <div>
              <div className="text-lg font-semibold">{user?.followersCount ?? 0}</div>
              <div className="text-xs text-white/70">Followers</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.followingCount ?? 0}</div>
              <div className="text-xs text-white/70">Following</div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="px-4 py-2 rounded-full border border-emerald-400 text-emerald-400 bg-emerald-500/10">Following</button>
          <button className="px-4 py-2 rounded-full bg-white/10">Message</button>
        </div>

        {/* Tabs */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {user?.role === 'artist' && (
            <button onClick={()=>setTab('posts')} className={`flex items-center justify-center gap-2 rounded-lg py-2 ${tab==='posts'?'bg-white/15':'bg-white/5'}`}><Grid size={16}/> Posts</button>
          )}
          <button onClick={()=>setTab('saved')} className={`flex items-center justify-center gap-2 rounded-lg py-2 ${tab==='saved'?'bg-white/15':'bg-white/5'}`}><Bookmark size={16}/> Guardados</button>
          {user?.role === 'artist' && (
            <button onClick={()=>setTab('artist')} className={`flex items-center justify-center gap-2 rounded-lg py-2 ${tab==='artist'?'bg-white/15':'bg-white/5'}`}><Image size={16}/> Artista</button>
          )}
        </div>

        {/* Grid content */}
        <div className="mt-4">
          {user?.role === 'artist' && tab === 'posts' && (
            <div className="columns-3 gap-2 [column-fill:_balance]">
              {Array.from({length:12}).map((_,i)=>(
                <div key={i} className="mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white/5">
                  <img src="/descarga.jpg" alt="post" className="w-full h-auto object-cover"/>
                </div>
              ))}
            </div>
          )}
          {tab === 'saved' && (
            <div className="columns-3 gap-2 [column-fill:_balance]">
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white/5">
                  <img src="/descarga (2).jpg" alt="saved" className="w-full h-auto object-cover"/>
                </div>
              ))}
            </div>
          )}
          {tab === 'artist' && (
            <div className="columns-3 gap-2 [column-fill:_balance]">
              {Array.from({length:10}).map((_,i)=>(
                <div key={i} className="mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white/5">
                  <img src="/descarga (3).jpg" alt="artist" className="w-full h-auto object-cover"/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sin menú inferior de opciones */}
      </div>
    </div>
  );
}


