import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({ text, mode = 'chars', delay = 0, style = {}, className = "" }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !text) return;

    // Initialize SplitType to break text into lines, words, and characters
    const split = new SplitType(textRef.current, { types: 'lines, words, chars' });

    let fromProps = {};
    let toProps = {};
    let targets = null;

    if (mode === 'chars') {
      targets = split.chars;
      fromProps = { x: 150, opacity: 0 };
      toProps = { x: 0, opacity: 1, duration: 0.5, ease: "power4.out", stagger: 0.04 };
    } else if (mode === 'words') {
      targets = split.words;
      fromProps = { y: -100, opacity: 0, rotation: "random(-80, 80)" };
      toProps = { y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)", stagger: 0.15 };
    } else if (mode === 'lines') {
      targets = split.lines;
      fromProps = { rotationX: -100, transformOrigin: "50% 50% -160px", opacity: 0 };
      toProps = { rotationX: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.25 };
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, 
        fromProps, 
        {
          ...toProps,
          delay: delay,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 90%", // Trigger when element comes into view
            toggleActions: "play none none reverse", // play forward on enter, reverse on leave back
          }
        }
      );
    }, textRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text, mode, delay]);

  return (
    <div ref={textRef} style={{ perspective: '500px', ...style }} className={className}>
      {text}
    </div>
  );
};

export default TextReveal;
