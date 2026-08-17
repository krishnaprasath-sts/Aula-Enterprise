import React, { useState } from 'react';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '+6561234567';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2.25rem',
        right: '2.25rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
    >
      {/* Hover Tooltip Pill */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#FFFFFF',
          color: 'var(--dark-navy)',
          padding: '0.6rem 1rem',
          borderRadius: '30px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
          fontSize: '0.88rem',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          pointerEvents: isHovered ? 'auto' : 'none',
          border: '1px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            display: 'inline-block'
          }}
        />
        Chat with Singapore Customs Specialist
      </a>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered
            ? '0 12px 32px rgba(37, 211, 102, 0.65)'
            : '0 8px 24px rgba(37, 211, 102, 0.4)',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          cursor: 'pointer',
          textDecoration: 'none'
        }}
      >
        {/* Pulsing Ripple Effect */}
        <span
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '2px solid rgba(37, 211, 102, 0.5)',
            animation: 'waPulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)'
          }}
        />

        {/* Official WhatsApp Vector */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.982-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1.07 14.545c-2.316-1.157-3.83-3.486-3.95-3.655-.12-.17-.96-1.278-.96-2.44 0-1.16.608-1.73.824-1.966.216-.237.472-.296.63-.296.157 0 .315.002.451.01.144.007.338-.055.529.403.197.473.67 1.633.729 1.752.059.119.098.257.02.414-.079.158-.118.256-.236.394-.118.138-.248.308-.354.414-.118.118-.242.246-.104.483.138.236.613 1.013 1.314 1.638.902.805 1.664 1.054 1.901 1.172.236.118.374.099.512-.059.138-.158.59-.689.747-.925.158-.236.315-.197.532-.118.217.079 1.378.65 1.614.768.236.118.393.177.452.276.059.098.059.57-.138 1.121-.197.551-1.16 1.083-1.613 1.122-.452.039-.889.141-2.989-.685z"
            fill="#FFFFFF"
          />
        </svg>
      </a>

      {/* Animation Styles Injection */}
      <style>{`
        @keyframes waPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;
