import React from 'react';
import { motion } from 'framer-motion';
import { cardHoverVariant } from '../../lib/animations';

export const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  onClick,
  disableHover = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      variants={!disableHover ? cardHoverVariant : undefined}
      whileHover={!disableHover ? 'hover' : undefined}
      onClick={onClick}
      className={`rounded-xl bg-white p-6 shadow-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;