import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Permit Declaration', path: '/permit-declaration' },
    { label: 'Services', path: '/services' },
    // { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const isHome = location.pathname === '/';
  const textColor = (isHome && !isScrolled) ? '#FFFFFF' : 'var(--dark-navy)';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: isScrolled ? '1rem' : 0,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: isScrolled ? '95%' : '100%',
          maxWidth: isScrolled ? '1200px' : '100%',
          zIndex: 100,
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
          boxShadow: isScrolled ? '0 10px 40px rgba(11, 18, 32, 0.08)' : '0 10px 40px rgba(11, 18, 32, 0)',
          border: '1px solid',
          borderColor: isScrolled ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          borderRadius: isScrolled ? '24px' : '0px',
          padding: isScrolled ? '0.4rem 0' : '1.35rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link to="/" className="interactive" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src="/src/assets/logo 2.png" 
                alt="AULA Permits" 
                style={{
                  width: isScrolled ? '56px' : '84px',
                  height: isScrolled ? '56px' : '84px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="interactive nav-link"
                  style={{
                    position: 'relative',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--brand-blue)' : textColor,
                    padding: '0.4rem 0',
                    transition: 'color 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s ease'
                  }}
                >
                  {item.label}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--brand-blue)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            {/* Desktop Right CTA */}
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
              >
                Get a Consultation <ArrowRight size={16} />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle navigation"
              style={{
                padding: '0.5rem',
                color: textColor,
                borderRadius: '8px',
                transition: 'color 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Sheet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 99,
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--brand-blue)' : 'var(--dark-navy)',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalOpen(true);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              >
                Get a Consultation <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation Request Lead-Gen Popup Modal */}
      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Responsive media query styling injection */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
