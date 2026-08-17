import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  const followerSpringConfig = { damping: 20, stiffness: 100, mass: 0.8 };
  const followerX = useSpring(-100, followerSpringConfig);
  const followerY = useSpring(-100, followerSpringConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      followerX.set(e.clientX);
      followerY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const isInteractive =
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('.interactive');

      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorX, cursorY, followerX, followerY]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: '#000000',
          border: '1px solid #FFFFFF',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '30px',
          height: '30px',
          border: '2px solid #000000',
          boxShadow: '0 0 0 1px #FFFFFF, inset 0 0 0 1px #FFFFFF, 0 0 6px rgba(255, 255, 255, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
