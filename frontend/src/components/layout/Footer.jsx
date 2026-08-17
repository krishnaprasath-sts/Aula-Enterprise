import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contactInfo] = useState({
    phone1: '+65 8322 5509',
    phone2: '+65 8370 1443',
    whatsapp: '+65 8919 7865',
    email: 'contact@aulapermits.sg',
    address: '26 Upper Dickson Road, Singapore 207478',
    companyName: 'AULA Permits Pte. Ltd.',
    uenNumber: '202028266G'
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Permit Declaration', path: '/permit-declaration' },
    { label: 'Services', path: '/services' },
    { label: 'Trade Insights (Blog)', path: '/blog' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const serviceLinks = [
    { label: 'Import Permits', path: '/services' },
    { label: 'Export Permits', path: '/services' },
    { label: 'GST & Transhipment Permits', path: '/services' },
    { label: 'Trade Compliance Support', path: '/services' },
    { label: 'Certificate of Origin', path: '/services' },
    { label: 'Customs Clearance & Documentation', path: '/services' }
  ];

  return (
    <>
      <footer style={{
        backgroundColor: 'var(--dark-navy)',
        color: '#FFFFFF',
        paddingTop: '5rem',
        borderTop: '4px solid transparent',
        borderImage: 'linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-pink) 50%, var(--brand-blue) 100%) 1'
      }}>
        <div className="container">

          {/* Main 4-Column Footer Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Brand Column */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <img
                  src="/src/assets/logo 2.png"
                  alt="AULA Permits"
                  style={{
                    width: '100px',
                    height: '80px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    backgroundColor: '#FFFFFF',
                    padding: '4px'
                  }}
                />

              </Link>
              <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Singapore's trusted declaring agent for import & export permits, trade compliance, and seamless cargo customs clearance.
              </p>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                <strong>UEN:</strong> {contactInfo.uenNumber} | Registered in Singapore
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Navigation
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {navLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className="footer-link"
                      style={{ color: '#CBD5E1', fontSize: '0.92rem', transition: 'color 0.2s' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Trade Services
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {serviceLinks.map((service, idx) => (
                  <li key={idx}>
                    <Link
                      to={service.path}
                      className="footer-link"
                      style={{ color: '#CBD5E1', fontSize: '0.92rem', transition: 'color 0.2s' }}
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info Column */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Singapore HQ
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#CBD5E1' }}>
                <a href={`tel:${contactInfo.phone1.replace(/[^0-9+]/g, '')}`} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1', transition: 'color 0.2s' }}>
                  <Phone size={16} color="#38BDF8" /> {contactInfo.phone1}
                </a>
                <a href={`tel:${contactInfo.phone2.replace(/[^0-9+]/g, '')}`} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1', transition: 'color 0.2s' }}>
                  <Phone size={16} color="#38BDF8" /> {contactInfo.phone2}
                </a>
                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1', transition: 'color 0.2s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#25D366" viewBox="0 0 24 24" style={{ flexShrink: 0, minWidth: '16px' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg> WhatsApp Us
                </a>
                <a href={`mailto:${contactInfo.email}`} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#CBD5E1', transition: 'color 0.2s' }}>
                  <Mail size={16} color="#38BDF8" /> {contactInfo.email}
                </a>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', lineHeight: 1.5 }}>
                  <MapPin size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div style={{
            padding: '2rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748B'
          }}>
            <p style={{ margin: 0, color: '#CBD5E1' }}>
              © {new Date().getFullYear()} {contactInfo.companyName}. All rights reserved.
            </p>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: '#CBD5E1' }}>
                Developed by: <a href="https://saitechnosolutions.com/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: '#CBD5E1', textDecoration: 'underline' }}>Sai Techno Solutions</a>
              </span>
              <button
                onClick={scrollToTop}
                className="scroll-top-btn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginLeft: '0.5rem'
                }}
                aria-label="Scroll to top"
              >
                <ArrowUp size={18} />
              </button>
            </div> */}
          </div>

        </div>

        <style>{`
          .footer-link:hover {
            color: var(--brand-blue) !important;
          }
          .scroll-top-btn:hover {
            background: linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-pink) 50%, var(--brand-blue) 100%) !important;
            color: #FFFFFF !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 156, 252, 0.3);
          }
        `}</style>
      </footer>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Footer;
