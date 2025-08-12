'use client';

import { 
  Dropdown as FlowbiteDropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Avatar,
  Button
} from 'flowbite-react';
import { ReactNode } from 'react';
import { HiChevronDown, HiUser, HiCog, HiLogout } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export interface DropdownProps {
  children: ReactNode;
  trigger: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Dropdown({ children, trigger, placement = 'bottom', className }: DropdownProps) {
  return (
    <FlowbiteDropdown
      label=""
      dismissOnClick={false}
      renderTrigger={() => <div>{trigger}</div>}
      placement={placement}
      className={className}
    >
      {children}
    </FlowbiteDropdown>
  );
}

// Componente para items del dropdown
export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  icon, 
  disabled = false,
  className 
}: DropdownItemProps) {
  return (
    <DropdownItem 
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        {children}
      </div>
    </DropdownItem>
  );
}

// Separador para el dropdown
export function DropdownSeparator() {
  return <DropdownDivider />;
}

// Header para el dropdown
export interface DropdownHeaderProps {
  children: ReactNode;
}

export function DropdownMenuHeader({ children }: DropdownHeaderProps) {
  return (
    <DropdownHeader>
      {children}
    </DropdownHeader>
  );
}

// Dropdown específico para usuario/perfil
export interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function UserDropdown({ user, onProfile, onSettings, onLogout }: UserDropdownProps) {
  const router = useRouter();
  
  const handleSettingsClick = () => {
    router.push('/settings');
  };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Avatar
            img={user.avatar}
            alt={user.name}
            size="sm"
            rounded
          />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <HiChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      }
      placement="bottom"
    >
      <DropdownMenuHeader>
        <div className="flex items-center gap-3">
          <Avatar
            img={user.avatar}
            alt={user.name}
            size="md"
            rounded
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      </DropdownMenuHeader>
      
      <DropdownSeparator />
      
      <DropdownMenuItem onClick={onProfile} icon={<HiUser className="h-4 w-4" />}>
        Mi Perfil
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={handleSettingsClick} icon={<HiCog className="h-4 w-4" />}>
        Configuración
      </DropdownMenuItem>
      
      <DropdownSeparator />
      
      <DropdownMenuItem 
        onClick={onLogout} 
        icon={<HiLogout className="h-4 w-4" />}
        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        Cerrar Sesión
      </DropdownMenuItem>
    </Dropdown>
  );
}
