import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

const FadeUp = ({ children, delay = 0, className = '', style = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ ...fadeUp.visible.transition, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
