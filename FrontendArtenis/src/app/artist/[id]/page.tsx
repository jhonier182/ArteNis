"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="mb-4 px-3 py-1.5 rounded bg-white/10">Volver</button>
        <h1 className="text-xl font-semibold">Perfil del artista</h1>
        <p className="text-white/70 text-sm mt-1">ID: {artistId}</p>

        {/* Placeholder básico. Aquí luego conectamos datos reales del artista */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-white/5">
              <img src={`/descarga (${(i % 7) + 1}).jpg`} alt="tattoo" className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-white/70">
          <Link href="/profile" className="underline">Ir a mi perfil</Link>
        </div>
      </div>
    </div>
  );
}


