import React from 'react';
import { motion } from 'framer-motion';

const CircuitBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit paths with enhanced animations */}
        <motion.path
          d="M0 400 L200 400 L200 200 L400 200 L400 600 L600 600 L600 300 L800 300 L800 500 L1000 500 L1000 100 L1200 100"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0 100 L150 100 L150 300 L350 300 L350 500 L550 500 L550 200 L750 200 L750 400 L950 400 L950 600 L1200 600"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        />
        <motion.path
          d="M0 700 L100 700 L100 500 L300 500 L300 700 L500 700 L500 400 L700 400 L700 600 L900 600 L900 300 L1200 300"
          stroke="url(#gradient3)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
        />

        {/* Additional circuit traces */}
        <motion.path
          d="M200 50 L200 150 L400 150 L400 250 L600 250 L600 350 L800 350"
          stroke="url(#gradient4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Circuit nodes with enhanced animations */}
        {[
          { x: 200, y: 200 },
          { x: 400, y: 400 },
          { x: 600, y: 300 },
          { x: 800, y: 500 },
          { x: 150, y: 300 },
          { x: 350, y: 500 },
          { x: 550, y: 200 },
          { x: 750, y: 400 },
          { x: 300, y: 500 },
          { x: 500, y: 700 },
          { x: 700, y: 400 },
          { x: 900, y: 600 },
        ].map((node, index) => (
          <motion.circle
            key={index}
            cx={node.x}
            cy={node.y}
            r="4"
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1, 1.2, 1],
              opacity: [0, 1, 1, 1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Electronic component symbols */}
        {/* Resistor symbols */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <rect x="180" y="195" width="40" height="10" fill="none" stroke="url(#gradient1)" strokeWidth="1"/>
          <path d="M180 200 L190 195 L200 205 L210 195 L220 205" stroke="url(#gradient1)" strokeWidth="1" fill="none"/>
        </motion.g>

        {/* Capacitor symbols */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        >
          <line x1="395" y1="390" x2="395" y2="410" stroke="url(#gradient2)" strokeWidth="2"/>
          <line x1="405" y1="390" x2="405" y2="410" stroke="url(#gradient2)" strokeWidth="2"/>
        </motion.g>

        {/* LED symbols */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <polygon points="595,295 605,305 595,315 585,305" fill="url(#ledGradient)" stroke="url(#gradient3)" strokeWidth="1"/>
          <path d="M600 290 L605 285 M605 285 L600 285 M605 285 L605 290" stroke="url(#gradient3)" strokeWidth="1"/>
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
            <stop offset="50%" stopColor="rgba(34, 197, 94, 0.4)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.1)" />
            <stop offset="50%" stopColor="rgba(245, 158, 11, 0.4)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.1)" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.9)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
          </radialGradient>
          <radialGradient id="ledGradient">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.2)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{
            x: Math.random() * 1200,
            y: Math.random() * 800,
            opacity: 0,
          }}
          animate={{
            y: [null, -20, null],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default CircuitBackground;