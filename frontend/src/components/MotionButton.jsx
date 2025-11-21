// components/MotionButton.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import React from 'react';

export default function MotionButton({
  children,
  className = "",
  whileHover = { scale: 1.01 },
  whileTap = { scale: 1 },
  transition = { duration: 0.25, ease: "easeInOut" },
  ...rest
}) {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      className={`btn ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}



