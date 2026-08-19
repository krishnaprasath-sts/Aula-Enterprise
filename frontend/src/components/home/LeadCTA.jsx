import React, { useState } from 'react';
import { ArrowRight, Phone, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConsultationModal from '../common/ConsultationModal';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const LeadCTA = ({
  title = "Ready to move your cargo?",
  description = "Experience seamless customs clearance and trade compliance. Our expert team ensures your permits are approved rapidly without costly delays.",
  buttonText = "Request Consultation"
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section style={{ padding: '8rem 0', backgroundColor: 'var(--bg-white)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="lead-cta-card" style={{
            backgroundColor: 'var(--dark-navy)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>

            {/* Ambient Background Gradient */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `radial-gradient(circle at top right, rgba(0, 156, 252, 0.15) 0%, transparent 60%)`,
              pointerEvents: 'none'
            }} />

            {/* Left Content */}
            <div className="lead-cta-content" style={{ padding: '5rem 4rem', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FadeUp delay={0.1}>
                <TextReveal
                  text={title}
                  mode="lines"
                  style={{ fontSize: 'clamp(2.5rem, 4vw, 3.25rem)', color: '#FFFFFF', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.15 }}
                />
                <p style={{ fontSize: '1.1rem', color: '#ffffffff', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                  {description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-primary"
                    style={{ padding: '1rem 2rem' }}
                  >
                    {buttonText} <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="btn-secondary"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}
                  >
                    <Phone size={18} color="var(--brand-blue)" /> Contact Us
                  </button>
                </div>
              </FadeUp>
            </div>

            {/* Right Visual Element (Glass Card) */}


          </div>
        </div>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default LeadCTA;
