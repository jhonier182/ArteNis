'use client';

import { useState } from 'react';
import { HiArrowLeft, HiShieldCheck, HiEye, HiEyeOff } from 'react-icons/hi';
import { toast } from '@/components/ui/Toast';

interface PrivacySettingsProps {
  onBack: () => void;
}

export function PrivacySettings({ onBack }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowFollows: true,
    showActivity: true,
    dataCollection: true,
    marketingEmails: false,
    pushNotifications: true
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
      toast.success('Configuración de privacidad guardada', 'Éxito');
    } catch (error) {
      toast.error('Error al guardar la configuración', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const privacyOptions = [
    {
      key: 'profileVisible' as keyof typeof settings,
      title: 'Perfil público',
      description: 'Tu perfil será visible para otros usuarios',
      icon: <HiEye className="w-5 h-5" />
    },
    {
      key: 'showEmail' as keyof typeof settings,
      title: 'Mostrar email',
      description: 'Otros usuarios podrán ver tu email',
      icon: <HiEyeOff className="w-5 h-5" />
    },
    {
      key: 'showPhone' as keyof typeof settings,
      title: 'Mostrar teléfono',
      description: 'Otros usuarios podrán ver tu teléfono',
      icon: <HiEyeOff className="w-5 h-5" />
    },
    {
      key: 'allowMessages' as keyof typeof settings,
      title: 'Permitir mensajes',
      description: 'Otros usuarios podrán enviarte mensajes directos',
      icon: <HiShieldCheck className="w-5 h-5" />
    },
    {
      key: 'allowFollows' as keyof typeof settings,
      title: 'Permitir seguidores',
      description: 'Otros usuarios podrán seguir tu perfil',
      icon: <HiShieldCheck className="w-5 h-5" />
    },
    {
      key: 'showActivity' as keyof typeof settings,
      title: 'Mostrar actividad',
      description: 'Tu actividad reciente será visible',
      icon: <HiEye className="w-5 h-5" />
    }
  ];

  const dataOptions = [
    {
      key: 'dataCollection' as keyof typeof settings,
      title: 'Recopilación de datos',
      description: 'Permitir recopilación de datos para mejorar la experiencia',
      icon: <HiShieldCheck className="w-5 h-5" />
    },
    {
      key: 'marketingEmails' as keyof typeof settings,
      title: 'Emails de marketing',
      description: 'Recibir emails sobre promociones y novedades',
      icon: <HiShieldCheck className="w-5 h-5" />
    },
    {
      key: 'pushNotifications' as keyof typeof settings,
      title: 'Notificaciones push',
      description: 'Recibir notificaciones en el navegador',
      icon: <HiShieldCheck className="w-5 h-5" />
    }
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
        <h2 className="text-lg font-semibold text-white">Privacy Settings</h2>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Privacy Section */}
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <HiShieldCheck className="w-4 h-4 text-purple-400" />
            Privacidad del perfil
          </h3>
          <div className="space-y-3">
            {privacyOptions.map((option) => (
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
                    className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                      settings[option.key] 
                        ? 'bg-purple-600' 
                        : 'bg-slate-600'
                    }`}
                    onClick={() => handleToggle(option.key)}
                  >
                    <div 
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        settings[option.key] 
                          ? 'translate-x-5' 
                          : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Section */}
        <div className="p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <HiShieldCheck className="w-4 h-4 text-purple-400" />
            Datos y comunicaciones
          </h3>
          <div className="space-y-3">
            {dataOptions.map((option) => (
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
                    className={`w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                      settings[option.key] 
                        ? 'bg-purple-600' 
                        : 'bg-slate-600'
                    }`}
                    onClick={() => handleToggle(option.key)}
                  >
                    <div 
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        settings[option.key] 
                          ? 'translate-x-5' 
                          : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
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
