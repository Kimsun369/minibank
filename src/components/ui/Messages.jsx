import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ErrorMessage = ({
  message,
  onDismiss,
  autoClose = false,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-red-700 flex-1 text-sm">{message}</p>
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export const SuccessMessage = ({
  message,
  onDismiss,
  autoClose = true,
  duration = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="p-4 bg-accent-50 border border-accent-200 rounded-lg flex items-start gap-3"
    >
      <CheckCircle2 className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
      <p className="text-accent-700 flex-1 text-sm">{message}</p>
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="text-accent-600 hover:text-accent-800 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export const MessageContainer = ({ children }) => {
  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </div>
  );
};