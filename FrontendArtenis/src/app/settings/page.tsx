"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { userService } from '@/services/user';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [language, setLanguage] = useState(user?.language || 'es');
  const [role, setRole] = useState<'user' | 'artist' | 'admin'>((user?.role as any) || 'user');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile({ firstName, lastName, bio, phone, language, role });
      updateUser(updated);
      router.push('/profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10 inline-flex items-center gap-2 mb-4">
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>

        <h2 className="text-2xl font-semibold mb-4">Configuración</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full rounded bg-white/10 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Apellido</label>
            <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="w-full rounded bg-white/10 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Biografía</label>
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full rounded bg-white/10 px-3 py-2 outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full rounded bg-white/10 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="block text-sm mb-1">Idioma</label>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="w-full rounded bg-white/10 px-3 py-2 outline-none">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Rol</label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" checked={role==='user'} onChange={()=>setRole('user')} /> Usuario
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" checked={role==='artist'} onChange={()=>setRole('artist')} /> Tatuador
              </label>
            </div>
            <p className="text-xs text-white/60 mt-1">Al cambiar a Tatuador se creará tu perfil de artista automáticamente.</p>
          </div>
        </div>

        <button disabled={saving} onClick={onSave} className="w-full mt-6 rounded bg-emerald-600 hover:bg-emerald-500 py-2.5 font-medium">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}


