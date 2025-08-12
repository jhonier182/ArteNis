'use client';

import { 
  Modal as FlowbiteModal, 
  ModalBody, 
  ModalFooter, 
  ModalHeader,
  Button
} from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  dismissible?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  dismissible = true,
  showCloseButton = true,
  className
}: ModalProps) {
  return (
    <FlowbiteModal
      show={isOpen}
      onClose={dismissible ? onClose : undefined}
      size={size}
      className={className}
      popup={!title} // Modo popup si no hay título
    >
      {title && (
        <ModalHeader className="border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                color="gray"
                size="sm"
                onClick={onClose}
                className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <HiX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </ModalHeader>
      )}
      
      <ModalBody className="p-6">
        {children}
      </ModalBody>
      
      {footer && (
        <ModalFooter className="border-t border-gray-200 dark:border-gray-600">
          {footer}
        </ModalFooter>
      )}
    </FlowbiteModal>
  );
}

// Componente Modal específico para confirmación
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'failure' | 'warning' | 'success' | 'purple';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'failure',
  isLoading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            color={confirmColor}
            onClick={onConfirm}
            disabled={isLoading}
            isProcessing={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
        {message}
      </p>
    </Modal>
  );
}
