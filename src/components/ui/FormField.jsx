import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  isValid,
  hint,
  required,
  disabled,
  isTextarea = false,
  rows = 4,
  min,
  step,
  inputClassName = '',
}) => {
  const hasError = !!error;
  const showValid = isValid && value.trim() !== '';

  const inputBaseClasses = `
    w-full px-4 py-3 border rounded-lg 
    transition-all duration-300
    focus:outline-none focus:ring-2 
    ${inputClassName}
    ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${hasError 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : showValid
      ? 'border-accent-300 focus:ring-accent-500 focus:border-accent-500'
      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {/* Label */}
      <div className="flex items-center gap-1">
        <label className="block text-sm font-semibold text-neutral-700">
          {label}
        </label>
        {required && <span className="text-red-500">*</span>}
      </div>

      {/* Input/Textarea Wrapper */}
      <div className="relative">
        {isTextarea ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${inputBaseClasses} resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            step={step}
            className={inputBaseClasses}
          />
        )}

        {/* Right Icons */}
        <AnimatePresence>
          {showValid && !hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-3 text-accent-600"
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.div>
          )}
          {hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-3 text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error or Hint Message */}
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-neutral-500 text-sm"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default FormField;