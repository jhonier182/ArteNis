'use client';

import { useState } from 'react';
import { HiArrowLeft, HiCamera, HiPencil } from 'react-icons/hi';
import { useAuthStore } from '@/store/auth';
import { userService } from '@/services/user';
import { toast } from '@/components/ui/Toast';

interface AccountSettingsProps {
  onBack: () => void;
}

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const { user, updateUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [language, setLanguage] = useState(user?.language || 'es');
  const [role, setRole] = useState<'user' | 'artist' | 'admin'>((user?.role as any) || 'user');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Debug: verificar token
    const token = localStorage.getItem('artenis_token');
    if (!token) {
      toast.error('No hay token de autenticación. Inicia sesión de nuevo.', 'Error');
      setSaving(false);
      return;
    }
    
    try {
      const updated = await userService.updateProfile({ 
        firstName, 
        lastName, 
        bio, 
        phone, 
        language, 
        role 
      });
      updateUser(updated);
      toast.success('Perfil actualizado correctamente', 'Éxito');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Inicia sesión de nuevo.', 'Error');
        // Limpiar tokens
        localStorage.removeItem('artenis_token');
        localStorage.removeItem('artenis_refresh');
      } else {
        toast.error(error.response?.data?.message || 'Error al actualizar el perfil', 'Error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const form = new FormData();
    form.append('file', e.target.files[0]);
    setUploading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/users/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('artenis_token') || ''}`,
        },
        body: form,
      });
      const data = await res.json();
      const wrapped = data?.data ?? data;
      updateUser(wrapped);
      toast.success('Avatar actualizado correctamente', 'Éxito');
    } catch (error) {
      toast.error('Error al subir el avatar', 'Error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700">
        <button
          onClick={onBack}
          className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <HiArrowLeft className="w-4 h-4 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-white">Account Settings</h2>
      </div>

      {/* Avatar Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar || '/perfil.jpg'}
              alt={user?.firstName || 'Avatar'}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/50"
            />
            <label className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer transition-colors">
              <HiCamera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          <div>
            <h3 className="text-white font-medium">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            {uploading && (
              <p className="text-purple-400 text-xs mt-1">Subiendo avatar...</p>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nombre <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Apellido <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 123 456 789"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Biografía</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Tipo de cuenta</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value as 'user')}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-sm text-white">Usuario</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={role === 'artist'}
                  onChange={(e) => setRole(e.target.value as 'artist')}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-sm text-white">Tatuador</span>
              </label>
            </div>
            {role === 'artist' && (
              <p className="text-xs text-slate-400">
                Al cambiar a Tatuador se creará tu perfil de artista automáticamente.
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {saving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
