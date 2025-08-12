'use client';

import { useState } from 'react';
import { HiArrowLeft, HiBell, HiHeart, HiChat, HiUser, HiCamera } from 'react-icons/hi';
import { toast } from '@/components/ui/Toast';

interface NotificationsSettingsProps {
  onBack: () => void;
}

export function NotificationsSettings({ onBack }: NotificationsSettingsProps) {
  const [settings, setSettings] = useState({
    // Push notifications
    pushEnabled: true,
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    posts: true,
    appointments: true,
    
    // Email notifications
    emailEnabled: true,
    emailLikes: false,
    emailComments: true,
    emailFollows: true,
    emailMessages: true,
    emailPosts: false,
    emailAppointments: true,
    emailMarketing: false,
    
    // Frequency
    frequency: 'instant' // instant, hourly, daily, weekly
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuración de notificaciones guardada', 'Éxito');
    } catch (error) {
      toast.error('Error al guardar la configuración', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const pushOptions = [
    {
      key: 'likes' as keyof typeof settings,
      title: 'Me gusta',
      description: 'Cuando alguien da like a tus publicaciones',
      icon: <HiHeart className="w-5 h-5" />
    },
    {
      key: 'comments' as keyof typeof settings,
      title: 'Comentarios',
      description: 'Cuando alguien comenta en tus publicaciones',
      icon: <HiChat className="w-5 h-5" />
    },
    {
      key: 'follows' as keyof typeof settings,
      title: 'Nuevos seguidores',
      description: 'Cuando alguien empieza a seguirte',
      icon: <HiUser className="w-5 h-5" />
    },
    {
      key: 'messages' as keyof typeof settings,
      title: 'Mensajes directos',
      description: 'Cuando recibes un mensaje privado',
      icon: <HiChat className="w-5 h-5" />
    },
    {
      key: 'posts' as keyof typeof settings,
      title: 'Nuevas publicaciones',
      description: 'Cuando los artistas que sigues publican',
      icon: <HiCamera className="w-5 h-5" />
    },
    {
      key: 'appointments' as keyof typeof settings,
      title: 'Citas',
      description: 'Recordatorios y actualizaciones de citas',
      icon: <HiBell className="w-5 h-5" />
    }
  ];

  const emailOptions = [
    {
      key: 'emailLikes' as keyof typeof settings,
      title: 'Me gusta',
      description: 'Resumen semanal de likes recibidos',
      icon: <HiHeart className="w-5 h-5" />
    },
    {
      key: 'emailComments' as keyof typeof settings,
      title: 'Comentarios',
      description: 'Notificaciones inmediatas de comentarios',
      icon: <HiChat className="w-5 h-5" />
    },
    {
      key: 'emailFollows' as keyof typeof settings,
      title: 'Nuevos seguidores',
      description: 'Cuando alguien empieza a seguirte',
      icon: <HiUser className="w-5 h-5" />
    },
    {
      key: 'emailMessages' as keyof typeof settings,
      title: 'Mensajes directos',
      description: 'Cuando recibes un mensaje privado',
      icon: <HiChat className="w-5 h-5" />
    },
    {
      key: 'emailPosts' as keyof typeof settings,
      title: 'Nuevas publicaciones',
      description: 'Resumen diario de nuevas publicaciones',
      icon: <HiCamera className="w-5 h-5" />
    },
    {
      key: 'emailAppointments' as keyof typeof settings,
      title: 'Citas',
      description: 'Recordatorios y confirmaciones',
      icon: <HiBell className="w-5 h-5" />
    },
    {
      key: 'emailMarketing' as keyof typeof settings,
      title: 'Promociones',
      description: 'Ofertas especiales y novedades',
      icon: <HiBell className="w-5 h-5" />
    }
  ];

  const frequencyOptions = [
    { value: 'instant', label: 'Inmediata' },
    { value: 'hourly', label: 'Cada hora' },
    { value: 'daily', label: 'Diaria' },
    { value: 'weekly', label: 'Semanal' }
  ];

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
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Push Notifications */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <HiBell className="w-4 h-4 text-purple-400" />
              Notificaciones push
            </h3>
            <div className="relative">
              <div 
                className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                  settings.pushEnabled 
                    ? 'bg-purple-600' 
                    : 'bg-slate-600'
                }`}
                onClick={() => handleToggle('pushEnabled')}
              >
                <div 
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    settings.pushEnabled 
                      ? 'translate-x-5' 
                      : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {settings.pushEnabled && (
            <div className="space-y-3 ml-6">
              {pushOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-slate-400 mt-0.5">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {option.title}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div 
                      className={`w-8 h-4 rounded-full cursor-pointer transition-colors duration-200 ${
                        settings[option.key] 
                          ? 'bg-purple-600' 
                          : 'bg-slate-600'
                      }`}
                      onClick={() => handleToggle(option.key)}
                    >
                      <div 
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                          settings[option.key] 
                            ? 'translate-x-4' 
                            : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Notifications */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              📧 Email notifications
            </h3>
            <div className="relative">
              <div 
                className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                  settings.emailEnabled 
                    ? 'bg-purple-600' 
                    : 'bg-slate-600'
                }`}
                onClick={() => handleToggle('emailEnabled')}
              >
                <div 
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    settings.emailEnabled 
                      ? 'translate-x-5' 
                      : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {settings.emailEnabled && (
            <div className="space-y-3 ml-6">
              {emailOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-slate-400 mt-0.5">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {option.title}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div 
                      className={`w-8 h-4 rounded-full cursor-pointer transition-colors duration-200 ${
                        settings[option.key] 
                          ? 'bg-purple-600' 
                          : 'bg-slate-600'
                      }`}
                      onClick={() => handleToggle(option.key)}
                    >
                      <div 
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                          settings[option.key] 
                            ? 'translate-x-4' 
                            : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frequency */}
        <div className="p-4">
          <h3 className="text-white font-medium mb-3">Frecuencia de notificaciones</h3>
          <div className="space-y-2">
            {frequencyOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={settings.frequency === option.value}
                  onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="text-purple-600 focus:ring-purple-500 bg-slate-700 border-slate-600"
                />
                <span className="text-white text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </div>
          ) : (
            'Guardar configuración'
          )}
        </button>
      </div>
    </div>
  );
}
