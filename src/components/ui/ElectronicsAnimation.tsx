import React from 'react';
import { motion } from 'framer-motion';

interface ElectronicsAnimationProps {
  type: 'pulse' | 'flow' | 'spark' | 'wave';
  className?: string;
}

const ElectronicsAnimation: React.FC<ElectronicsAnimationProps> = ({ type, className = '' }) => {
  const animations = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    },
    flow: {
      x: [-10, 10, -10],
      opacity: [0.3, 1, 0.3],
    },
    spark: {
      rotate: [0, 180, 360],
      scale: [0.8, 1.2, 0.8],
    },
    wave: {
      y: [-5, 5, -5],
      opacity: [0.4, 0.8, 0.4],
    },
  };

  return (
    <motion.div
      className={`absolute ${className}`}
      animate={animations[type]}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
    </motion.div>
  );
};

export default ElectronicsAnimation;