import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, PhoneCall, ChevronDown, ChevronRight, Plane, FlaskConical, Coffee, ShoppingCart, Utensils, Truck, Dna, Settings, Factory, Wind, Cpu } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';

const INDUSTRIES = [
  { name: 'Aerospace', icon: Plane, path: '/industries/aerospace' },
  { name: 'Chemicals Customs', icon: FlaskConical, path: '/industries/chemicals' },
  { name: 'Drinks', icon: Coffee, path: '/industries/drinks' },
  { name: 'FMCG', icon: ShoppingCart, path: '/industries/fmcg' },
  { name: 'Food', icon: Utensils, path: '/industries/food' },
  { name: 'Freight Forwarding & Logistics', icon: Truck, path: '/industries/logistics' },
  { name: 'Life Sciences', icon: Dna, path: '/industries/life-sciences' },
  { name: 'Manufacturing', icon: Settings, path: '/industries/manufacturing' },
  { name: 'Oil & Gas', icon: Factory, path: '/industries/oil-and-gas' },
  { name: 'Renewables', icon: Wind, path: '/industries/renewables' },
  { name: 'Semiconductor', icon: Cpu, path: '/industries/semiconductor' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Industries Served', path: '#', hasDropdown: true, isIndustries: true },
    { label: 'Join AULA', path: '/join-aula', isJoinAula: true },
    { label: 'Contact Us', path: '/contact' }
  ];

  const isDarkHeroPage = location.pathname === '/' || location.pathname === '/join-aula' || location.pathname === '/services';
  const isSolid = isScrolled || mobileMenuOpen;
  const textColor = (isDarkHeroPage && !isSolid) ? '#FFFFFF' : 'var(--dark-navy)';

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
          backgroundColor: isSolid ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          backdropFilter: isSolid ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: isSolid ? 'blur(20px)' : 'blur(0px)',
          boxShadow: isSolid ? '0 10px 40px rgba(11, 18, 32, 0.08)' : '0 10px 40px rgba(11, 18, 32, 0)',
          border: '1px solid',
          borderColor: isSolid ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          borderRadius: isScrolled ? '24px' : '0px',
          padding: isSolid ? '0.4rem 0' : '1.35rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link to="/" className="interactive" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src="/assets/logo 2.png"
                alt="AULA Permits"
                style={{
                  width: isSolid ? '56px' : '84px',
                  height: isSolid ? '56px' : '84px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '2rem', height: '100%' }} className="desktop-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.label}
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className="interactive nav-link"
                    style={{
                      position: 'relative',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? 'var(--brand-blue)' : textColor,
                      padding: '0.4rem 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={14} style={{ marginTop: '2px' }} />}
                    
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
                  
                  {/* Dropdown Menu for Industries Served */}
                  {item.isIndustries && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '-10%', /* Align roughly with the text */
                            width: '320px',
                            background: '#FFFFFF',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                            border: '1px solid #E2E8F0',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 200,
                            marginTop: '1.2rem'
                          }}
                        >
                          {/* Invisible hover bridge to prevent menu from closing when mouse moves between navbar and menu */}
                          <div style={{ position: 'absolute', top: '-1.5rem', left: 0, right: 0, height: '1.5rem' }} />
                          
                          {/* Active Top Border accent */}
                          <div style={{ position: 'absolute', top: -1, left: '20%', width: '40px', height: '3px', background: 'var(--brand-blue)', borderRadius: '3px 3px 0 0' }} />

                          {INDUSTRIES.map((industry, index) => (
                            <Link 
                              key={index} 
                              to={industry.path}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.85rem 1rem',
                                color: 'var(--dark-navy)',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                borderBottom: index < INDUSTRIES.length - 1 ? '1px solid #F1F5F9' : 'none'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = 'var(--brand-blue)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--dark-navy)'; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <industry.icon size={18} style={{ color: 'var(--brand-blue)' }} />
                                {industry.name}
                              </div>
                              <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Section */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Desktop Right CTA */}
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700 }}
              >
                APPLY PERMIT
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle navigation"
              style={{
                padding: '0.5rem',
                color: isSolid ? 'var(--dark-navy)' : textColor,
                background: isSolid ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: isSolid ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.25)',
                borderRadius: '10px',
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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
            data-lenis-prevent="true"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 105,
              padding: '1.25rem 1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <img
                src="/assets/logo 2.png"
                alt="AULA Permits"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  color: 'var(--dark-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={28} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                if (item.hasDropdown) {
                  return (
                    <div key={item.label} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <button
                        onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.5rem',
                          fontWeight: 500,
                          color: 'var(--dark-navy)',
                          padding: '1rem 0',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {item.label}
                        <ChevronDown size={20} style={{ transform: mobileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }} />
                      </button>
                      
                      <AnimatePresence>
                        {mobileDropdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1rem' }}
                          >
                            {INDUSTRIES.map((industry, index) => (
                              <Link
                                key={index}
                                to={industry.path}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  color: 'var(--text-secondary)',
                                  fontSize: '1.1rem',
                                  fontWeight: 500,
                                  padding: '0.5rem 0'
                                }}
                              >
                                <industry.icon size={16} style={{ color: 'var(--brand-blue)' }} />
                                {industry.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--brand-blue)' : 'var(--dark-navy)',
                      padding: '1rem 0',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div style={{ paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    setModalOpen(true);
                  }, 80);
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}
              >
                APPLY PERMIT <ArrowRight size={18} />
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
        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
