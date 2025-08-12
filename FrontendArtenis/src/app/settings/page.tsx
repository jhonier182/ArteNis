'use client';

import { SettingsMenu } from '@/components/settings/SettingsMenu';
import { HiArrowLeft } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <HiArrowLeft className="w-4 h-4 text-white" />
              </button>
              <h1 className="text-xl font-semibold text-white">
                Configuración
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <SettingsMenu />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Artenis v1.0.0 • Hecho con ❤️ para tatuadores
          </p>
        </div>
      </div>
    </div>
  );
}


