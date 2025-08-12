"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user';
import { postsService } from '@/services/posts';
import { useState as useStateReact } from 'react';

interface ArtistData {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  bio?: string;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [isFollowing, setIsFollowing] = useStateReact(false);
  const [posts, setPosts] = useStateReact<{id:string;mediaUrls?:string[];title?:string}[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Si venimos de mocks (ids como "artist1", "artist2"), no llamar al backend
      if (artistId?.toString().startsWith('artist')) {
        if (!cancelled) {
          setArtist({ id: artistId as string, username: artistId as string });
          // Cargar posts simulados locales
          const imgs = [
            '/descarga.jpg',
            '/descarga (1).jpg',
            '/descarga (2).jpg',
            '/descarga (3).jpg',
            '/descarga (4).jpg',
            '/descarga (5).jpg',
            '/descarga (6).jpg',
            '/descarga (7).jpg',
          ];
          setPosts(imgs.map((src, i) => ({ id: `${artistId}-${i}`, mediaUrls: [src], title: '' })));
        }
        return;
      }

      try {
        const data = await userService.getById(artistId);
        if (!cancelled) {
          setArtist({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            avatar: data.avatar,
            bio: data.bio,
          });
          setIsFollowing(false);
          try {
            const postsResp = await postsService.getByUser(artistId, 1, 30);
            if (!cancelled) setPosts(postsResp.posts);
          } catch {}
        }
      } catch (e) {
        // fallback silencioso
        if (!cancelled) setArtist({ id: artistId, username: `artist_${artistId}` });
      }
    };
    load();
    return () => { cancelled = true; };
  }, [artistId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="mb-4 px-3 py-1.5 rounded bg-white/10">Volver</button>

        <div className="flex items-center gap-3">
          <img src={artist?.avatar || '/tatuadora.jpg'} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h1 className="text-lg font-semibold">{artist?.firstName} {artist?.lastName}</h1>
            <p className="text-white/70 text-sm">@{artist?.username}</p>
          </div>
        </div>

        {artist?.bio && <p className="mt-3 text-sm text-white/80">{artist.bio}</p>}

        {/* Acciones seguir / contactar */}
        <div className="mt-4 flex items-center gap-3">
          <button
            className={`px-4 py-2 rounded-full ${isFollowing ? 'border border-white/30' : 'bg-primary-600'}`}
            onClick={async () => {
              try {
                if (isFollowing) await userService.unfollow(artistId);
                else await userService.follow(artistId);
                setIsFollowing((s) => !s);
              } catch {}
            }}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
          <button className="px-4 py-2 rounded-full bg-white/10">Contactar</button>
        </div>

        <h2 className="mt-6 mb-2 font-medium">Publicaciones</h2>
        <div className="columns-3 gap-2 [column-fill:_balance]">
          {posts.length === 0 && (
            <div className="text-white/60 text-sm">Este artista aún no tiene publicaciones.</div>
          )}
          {posts.map((p, i) => (
            <div key={`${p.id}-${i}`} className="mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white/5">
              <img src={(p.mediaUrls && p.mediaUrls[0]) || '/descarga.jpg'} alt={p.title || 'tattoo'} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


