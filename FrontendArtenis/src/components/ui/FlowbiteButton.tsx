'use client';

import { forwardRef } from 'react';
import { Button as FlowbiteButton, ButtonProps as FlowbiteButtonProps } from 'flowbite-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// Mantener variantes personalizadas de Artenis
const artemisVariants = cva(
  'transition-all duration-300 font-medium focus:outline-none', 
  {
    variants: {
      variant: {
        neon: 'btn-neon shadow-lg hover:shadow-2xl transform hover:scale-105',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
        gradient: 'bg-gradient-to-r from-purple-600 via-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
      },
    },
  }
);

// Extender las props de Flowbite con nuestras variantes personalizadas
export interface ArtemisButtonProps extends Omit<FlowbiteButtonProps, 'color'> {
  variant?: 'neon' | 'glass' | 'gradient';
  color?: FlowbiteButtonProps['color'] | 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  loadingText?: string;
}

const ArtemisButton = forwardRef<HTMLButtonElement, ArtemisButtonProps>(
  ({ 
    variant, 
    color = 'primary', 
    className, 
    children, 
    isLoading = false, 
    loadingText = 'Cargando...', 
    disabled,
    ...props 
  }, ref) => {
    
    // Si es una variante personalizada, usar nuestro estilo
    if (variant && ['neon', 'glass', 'gradient'].includes(variant)) {
      return (
        <FlowbiteButton
          ref={ref}
          className={cn(artemisVariants({ variant }), className)}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {loadingText}
            </div>
          ) : (
            children
          )}
        </FlowbiteButton>
      );
    }

    // Mapear colores personalizados a colores de Flowbite
    const flowbiteColor = (() => {
      switch (color) {
        case 'primary': return 'purple';
        case 'secondary': return 'gray';
        case 'danger': return 'failure';
        default: return color as FlowbiteButtonProps['color'];
      }
    })();

    return (
      <FlowbiteButton
        ref={ref}
        color={flowbiteColor}
        className={cn(className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            {loadingText}
          </div>
        ) : (
          children
        )}
      </FlowbiteButton>
    );
  }
);

ArtemisButton.displayName = 'ArtemisButton';

export { ArtemisButton };
export type { ArtemisButtonProps };
