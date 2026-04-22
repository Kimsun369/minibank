import React from 'react';
import { motion } from 'framer-motion';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner = ({ size = 'md', color = 'text-primary-600' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeMap[size]} border-3 border-gray-200 border-t-primary-600 rounded-full ${color}`}
    />
  );
};

export default Spinner;