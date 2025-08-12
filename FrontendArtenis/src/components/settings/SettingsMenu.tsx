'use client';

import { useState } from 'react';
import { 
  HiUser,
  HiCog,
  HiShieldCheck,
  HiBell,
  HiQuestionMarkCircle,
  HiSupport,
  HiLockClosed,
  HiLogout,
  HiChevronRight
} from 'react-icons/hi';
import { useAuthStore } from '@/store/auth';
import { AccountSettings } from './sections/AccountSettings';
import { PrivacySettings } from './sections/PrivacySettings';
import { NotificationsSettings } from './sections/NotificationsSettings';

interface SettingsMenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  isDanger?: boolean;
  hasToggle?: boolean;
  isToggled?: boolean;
  onToggle?: () => void;
}

type SettingsView = 'main' | 'account' | 'privacy' | 'notifications';

export function SettingsMenu() {
  const { logout } = useAuthStore();
  const [limitedAccess, setLimitedAccess] = useState(false);
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const settingsItems: SettingsMenuItem[] = [
    {
      id: 'account',
      icon: <HiUser className="w-5 h-5" />,
      title: 'Account',
      description: 'Manage your profile and personal information',
      onClick: () => setCurrentView('account')
    },
    {
      id: 'settings',
      icon: <HiCog className="w-5 h-5" />,
      title: 'Settings',
      description: 'App preferences and customization',
      onClick: () => console.log('Navigate to Settings')
    },
    {
      id: 'privacy',
      icon: <HiShieldCheck className="w-5 h-5" />,
      title: 'Privacy',
      description: 'Control your privacy and data settings',
      onClick: () => setCurrentView('privacy')
    },
    {
      id: 'notifications',
      icon: <HiBell className="w-5 h-5" />,
      title: 'Notifications',
      description: 'Manage notification preferences',
      onClick: () => setCurrentView('notifications')
    },
    {
      id: 'help-guide',
      icon: <HiQuestionMarkCircle className="w-5 h-5" />,
      title: 'Help Guide',
      description: 'Learn how to use Artenis',
      onClick: () => console.log('Navigate to Help Guide')
    },
    {
      id: 'help-center',
      icon: <HiSupport className="w-5 h-5" />,
      title: 'Help Center',
      description: 'Get support and contact us',
      onClick: () => console.log('Navigate to Help Center')
    },
    {
      id: 'limited-access',
      icon: <HiLockClosed className="w-5 h-5" />,
      title: 'Limited Access',
      description: 'Restrict certain features',
      onClick: () => {},
      hasToggle: true,
      isToggled: limitedAccess,
      onToggle: () => setLimitedAccess(!limitedAccess)
    }
  ];

  const handleSignOut = () => {
    logout();
    console.log('User signed out');
  };

  // Renderizar las diferentes vistas
  if (currentView === 'account') {
    return <AccountSettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'privacy') {
    return <PrivacySettings onBack={() => setCurrentView('main')} />;
  }
  
  if (currentView === 'notifications') {
    return <NotificationsSettings onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="w-80 bg-slate-800 rounded-xl shadow-2xl p-0 overflow-hidden">
      {/* Menú de opciones */}
      <div className="space-y-0">
        {settingsItems.map((item, index) => (
          <div key={item.id}>
            <button
              onClick={item.hasToggle ? item.onToggle : item.onClick}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Icono */}
                <div className="text-slate-400 group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </div>
                
                {/* Contenido */}
                <div className="flex-1 text-left">
                  <div className="text-white font-medium text-sm">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-slate-400 text-xs mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle switch o flecha */}
              <div className="flex items-center">
                {item.hasToggle ? (
                  <div className="relative">
                    <div 
                      className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                        item.isToggled 
                          ? 'bg-blue-600' 
                          : 'bg-slate-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          item.isToggled 
                            ? 'translate-x-5' 
                            : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                ) : (
                  <HiChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors duration-200" />
                )}
              </div>
            </button>

            {/* Separador después de Notifications */}
            {item.id === 'notifications' && (
              <div className="border-t border-slate-700 my-1" />
            )}

            {/* Separador después de Help Center */}
            {item.id === 'help-center' && (
              <div className="border-t border-slate-700 my-1" />
            )}
          </div>
        ))}

        {/* Separador antes de Sign Out */}
        <div className="border-t border-slate-700" />

        {/* Botón de Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 hover:bg-red-900/20 transition-all duration-200 group"
        >
          <div className="text-red-400 group-hover:text-red-300 transition-colors duration-200">
            <HiLogout className="w-5 h-5" />
          </div>
          <span className="text-red-400 group-hover:text-red-300 font-medium text-sm transition-colors duration-200">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}

// Componente para usar en el UserDropdown
export function SettingsDropdownMenu() {
  const { logout } = useAuthStore();
  const [showFullSettings, setShowFullSettings] = useState(false);

  if (showFullSettings) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowFullSettings(false)}
          className="absolute top-2 right-2 text-slate-400 hover:text-white z-10"
        >
          ×
        </button>
        <SettingsMenu />
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      {/* Versión compacta para dropdown */}
      <div className="space-y-0">
        <button
          onClick={() => setShowFullSettings(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 transition-colors"
        >
          <HiUser className="w-4 h-4 text-slate-400" />
          <span className="text-white text-sm">Account</span>
        </button>
        
        <button
          onClick={() => setShowFullSettings(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 transition-colors"
        >
          <HiCog className="w-4 h-4 text-slate-400" />
          <span className="text-white text-sm">Settings</span>
        </button>
        
        <button
          onClick={() => setShowFullSettings(true)}
          className="w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 transition-colors"
        >
          <HiShieldCheck className="w-4 h-4 text-slate-400" />
          <span className="text-white text-sm">Privacy</span>
        </button>

        <div className="border-t border-slate-700" />
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 hover:bg-red-900/20 transition-colors"
        >
          <HiLogout className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
