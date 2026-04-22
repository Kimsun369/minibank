import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariant } from '../../lib/animations';
import { Spinner } from './Spinner';

const variantClasses = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
  success:
    'bg-accent-600 text-white hover:bg-accent-700',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      variants={buttonVariant}
      initial="initial"
      whileHover={!disabled && !isLoading ? 'hover' : undefined}
      whileTap={!disabled && !isLoading ? 'tap' : undefined}
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {isLoading && <Spinner size="sm" color="text-current" />}
      {children}
      {icon && !isLoading && icon}
    </motion.button>
  );
};

export default AnimatedButton;