export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const zoomOut = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export const rotateIn = {
  hidden: { opacity: 0, rotate: -15, scale: 0.9 },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" },
  hover: { 
    scale: 1.03, 
    y: -8, 
    boxShadow: "0 25px 50px -12px rgba(11, 61, 145, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
  hover: { 
    scale: 1.03, 
    y: -8, 
    boxShadow: "0 25px 50px -12px rgba(11, 61, 145, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.95 }
};

export const floatingAnimation = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const parallaxEffect = (yOffset = 50) => ({
  hidden: { y: yOffset, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: "easeOut" }
  }
});

export const pageTransition = {
  pageInitial: { opacity: 0, y: 20 },
  pageAnimate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: "easeOut" }
  },
  pageExit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

export const textReveal = {
  hidden: { opacity: 0, y: "100%" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
