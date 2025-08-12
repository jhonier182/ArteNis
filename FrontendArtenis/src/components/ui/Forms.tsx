'use client';

import { 
  Label, 
  TextInput, 
  Textarea, 
  Select, 
  Checkbox, 
  Radio,
  FileInput,
  Button
} from 'flowbite-react';
import { ReactNode, forwardRef } from 'react';

// Input Field con Label y Error
export interface InputFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function InputField({
  label,
  error,
  helperText,
  required = false,
  children,
  className
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="" className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Text Input mejorado
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, icon, rightIcon, required, className, ...props }, ref) => {
    return (
      <InputField 
        label={label} 
        error={error} 
        helperText={helperText} 
        required={required}
        className={className}
      >
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="text-gray-500 dark:text-gray-400">
                {icon}
              </div>
            </div>
          )}
          <TextInput
            ref={ref}
            color={error ? "failure" : "gray"}
            className={`${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="text-gray-500 dark:text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
      </InputField>
    );
  }
);

TextField.displayName = 'TextField';

// TextArea mejorado
export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    return (
      <InputField 
        label={label} 
        error={error} 
        helperText={helperText} 
        required={required}
        className={className}
      >
        <Textarea
          ref={ref}
          color={error ? "failure" : "gray"}
          {...props}
        />
      </InputField>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

// Select mejorado
export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, options, placeholder, required, className, ...props }, ref) => {
    return (
      <InputField 
        label={label} 
        error={error} 
        helperText={helperText} 
        required={required}
        className={className}
      >
        <Select
          ref={ref}
          color={error ? "failure" : "gray"}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </Select>
      </InputField>
    );
  }
);

SelectField.displayName = 'SelectField';

// Checkbox con Label
export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-start gap-3">
          <Checkbox
            ref={ref}
            color={error ? "failure" : "purple"}
            {...props}
          />
          <div className="flex-1">
            <Label className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </Label>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 ml-7">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

// Radio Group
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  label?: string;
  error?: string;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  error,
  className
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </Label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <Radio
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              color="purple"
            />
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// File Upload mejorado
export interface FileUploadFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number; // en MB
  preview?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(
  ({ 
    label, 
    error, 
    helperText, 
    accept,
    maxSize,
    preview = false,
    onFileSelect,
    required, 
    className, 
    ...props 
  }, ref) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      
      // Validar tamaño si se especifica
      if (file && maxSize && file.size > maxSize * 1024 * 1024) {
        onFileSelect?.(null);
        return;
      }
      
      onFileSelect?.(file);
    };

    return (
      <InputField 
        label={label} 
        error={error} 
        helperText={helperText || (maxSize ? `Tamaño máximo: ${maxSize}MB` : undefined)} 
        required={required}
        className={className}
      >
        <FileInput
          ref={ref}
          accept={accept}
          color={error ? "failure" : "gray"}
          onChange={handleFileChange}
          {...props}
        />
      </InputField>
    );
  }
);

FileUploadField.displayName = 'FileUploadField';

// Form Container
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export function Form({ children, title, description, footer, className, ...props }: FormProps) {
  return (
    <form className={`space-y-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      {footer && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          {footer}
        </div>
      )}
    </form>
  );
}
