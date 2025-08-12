'use client';

import { Toast as FlowbiteToast } from 'flowbite-react';
import { 
  HiCheck, 
  HiExclamation, 
  HiInformationCircle, 
  HiX, 
  HiXCircle 
} from 'react-icons/hi';
import { ReactNode } from 'react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onDismiss?: () => void;
  dismissible?: boolean;
  className?: string;
}

export function Toast({
  type = 'info',
  title,
  message,
  onDismiss,
  dismissible = true,
  className
}: ToastProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <HiCheck className="h-5 w-5" />;
      case 'error':
        return <HiXCircle className="h-5 w-5" />;
      case 'warning':
        return <HiExclamation className="h-5 w-5" />;
      case 'info':
      default:
        return <HiInformationCircle className="h-5 w-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200';
      case 'info':
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className={`mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400 ${className}`}>
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getColorClasses()}`}>
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal">
        {title && (
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {message}
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={onDismiss}
        >
          <span className="sr-only">Close</span>
          <HiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Hook para sistema de toast
import { create } from 'zustand';

interface ToastState {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
  }>;
  addToast: (toast: Omit<ToastState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 5000);
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  }
}));

// Componente contenedor de toasts
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onDismiss={() => removeToast(toast.id)}
          className="animate-slide-in-right"
        />
      ))}
    </div>
  );
}

// Funciones helper simplificadas para usar el toast
export const toast = {
  success: (message: string, title?: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const toastEl = document.createElement('div');
      toastEl.className = 'mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400 animate-slide-in-right';
      toastEl.innerHTML = `
        <div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3 text-sm font-normal">
          ${title ? `<div class="text-sm font-semibold text-gray-900 dark:text-white">${title}</div>` : ''}
          <div class="text-sm text-gray-500 dark:text-gray-300">${message}</div>
        </div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
          <span class="sr-only">Close</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      `;
      
      const closeBtn = toastEl.querySelector('button');
      closeBtn?.addEventListener('click', () => toastEl.remove());
      
      container.appendChild(toastEl);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.remove();
        }
      }, 5000);
    }
  },
  
  error: (message: string, title?: string) => {
    const container = document.getElementById('toast-container');
    if (container) {
      const toastEl = document.createElement('div');
      toastEl.className = 'mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400 animate-slide-in-right';
      toastEl.innerHTML = `
        <div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3 text-sm font-normal">
          ${title ? `<div class="text-sm font-semibold text-gray-900 dark:text-white">${title}</div>` : ''}
          <div class="text-sm text-gray-500 dark:text-gray-300">${message}</div>
        </div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
          <span class="sr-only">Close</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      `;
      
      const closeBtn = toastEl.querySelector('button');
      closeBtn?.addEventListener('click', () => toastEl.remove());
      
      container.appendChild(toastEl);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.remove();
        }
      }, 5000);
    }
  },
  
  warning: (message: string, title?: string) => {
    console.warn(title || 'Warning:', message);
  },
  
  info: (message: string, title?: string) => {
    console.info(title || 'Info:', message);
  }
};
