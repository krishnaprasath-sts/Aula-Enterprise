import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, Award, ChevronRight, Shield, Timer, Package, Headset, Handshake } from 'lucide-react';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const shipImage = '/assets/ship.png';

const CompanyProfile = () => {
  const highlights = [
    {
      title: 'Accuracy',
      desc: 'Precision declaration to prevent costly delays, audit penalties, or shipment holds.',
      icon: CheckCircle2
    },
    {
      title: 'Compliance',
      desc: '100% adherence to Singapore Customs & TradeNet regulatory frameworks.',
      icon: ShieldCheck
    },
    {
      title: 'Responsive Support',
      desc: 'Dedicated customs specialists available 24/7 for urgent permits & advice.',
      icon: Clock
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-white)', position: 'relative' }}>

      {/* Decorative background blob */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 156, 252, 0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '5rem',
          alignItems: 'stretch'
        }} className="company-profile-grid">

          {/* Visual Side (Human-Centric Professional Imagery) */}
          {/* Visual Side (Exact Replica) */}
          <FadeUp delay={0.1} style={{ height: 'calc(100% - 2.5rem)', marginTop: '2.5rem' }}>
            <div
              className="exact-visual-card"
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '100%',
                minHeight: '650px',
                boxShadow: '0 25px 50px -12px rgba(0, 156, 252, 0.4), 0 0 0 1px rgba(0, 156, 252, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src={shipImage}
                alt="Seamless Customs Support"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transform: 'scale(1.02)' }}
              />

              {/* Complex overlay for perfect lighting */}
              {/* <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0, 5, 25, 0.85) 0%, rgba(0, 10, 30, 0.3) 25%, transparent 45%, rgba(0, 5, 20, 0.8) 65%, rgba(0, 2, 15, 0.95) 100%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '80%',
                height: '50%',
                background: 'radial-gradient(ellipse at top left, rgba(0, 10, 40, 0.9) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} /> */}

              {/* Content Container */}
              <div className="exact-visual-content" style={{ position: 'relative', padding: '2.5rem', zIndex: 2, display: 'flex', flexDirection: 'column' }}>

                {/* Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1.2rem',
                  background: 'linear-gradient(90deg, rgba(0, 20, 60, 0.8) 0%, rgba(0, 10, 30, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  borderRadius: '99px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid #00C6FF',
                  boxShadow: '0 0 15px rgba(0, 198, 255, 0.3), inset 0 0 10px rgba(0, 198, 255, 0.1)',
                  alignSelf: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <ShieldCheck size={16} color="#00C6FF" /> Premium Declaring Agent
                </div>

                {/* Headlines */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 className="exact-visual-title" style={{ fontSize: '3.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    Seamless <br />
                    <span style={{ color: '#00C6FF', textShadow: '0 0 20px rgba(0, 198, 255, 0.4)' }}>Customs Support</span><br />
                    for Your Business
                  </h3>
                  <p style={{ fontSize: '1.25rem', color: '#E2E8F0', fontWeight: 500, letterSpacing: '0.01em' }}>
                    Fast. Compliant. Hassle-Free.
                  </p>
                </div>

                {/* Neon Divider */}
                <div className="exact-neon-divider" />

                {/* Grid of Features */}
                <div className="exact-feature-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {[
                    { icon: Timer, title: 'Instant', subtitle: 'Processing', desc: 'Within 30 Mins' },
                    { icon: ShieldCheck, title: '100% Compliant', subtitle: '& Secure', desc: 'Your Data is Safe' },
                    { icon: Package, title: 'All Permit Types', subtitle: 'Supported', desc: 'Import • Export • GST' },
                    { icon: Headset, title: 'Dedicated', subtitle: 'Expert Support', desc: 'Always Here to Help' },
                  ].map((feature, idx) => (
                    <div key={idx} className="exact-feature-card">
                      <div style={{ marginBottom: '0.75rem', color: '#00C6FF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <feature.icon size={32} strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 8px rgba(0, 198, 255, 0.6))' }} />
                      </div>
                      <div style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.3rem' }}>
                        {feature.title} <br /> {feature.subtitle}
                      </div>
                      <div style={{ color: '#A0B0C0', fontSize: '0.75rem', fontWeight: 500 }}>
                        {feature.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Banner */}
                <div className="exact-bottom-banner">
                  <div className="exact-banner-accent" />
                  <div className="exact-banner-accent-right" />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 1, width: '100%' }}>
                    <Handshake size={36} color="#00C6FF" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 198, 255, 0.5))', marginLeft: '0.5rem' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                      <div className="exact-banner-line" style={{ width: '1px', height: '36px', background: 'rgba(0, 198, 255, 0.3)' }} />
                      <div>
                        <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                          Trusted Customs Permit Partner
                        </div>
                        <div style={{ color: '#A0B0C0', fontSize: '0.85rem', fontWeight: 500 }}>
                          Reliable • Accurate • On-Time
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </FadeUp>

          {/* Text Side */}
          <div>
            <FadeUp delay={0.1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '2px', background: 'var(--brand-blue)' }} />
                <span style={{ color: 'var(--brand-blue)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  About AULA Permits
                </span>
              </div>
              <TextReveal
                text="Trade complexity should never slow your business."
                mode="words"
                style={{ marginBottom: '1.5rem', color: 'var(--dark-navy)', fontSize: 'clamp(2rem, 3vw, 2.75rem)', lineHeight: 1.2, fontWeight: 800 }}
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.15rem', marginBottom: '3rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Navigating Singapore Customs regulations, Strategic Goods Control, and GST permit declarations requires specialized knowledge. AULA Permits eliminates operational friction so your shipments move seamlessly through Singapore ports.
              </p>
            </FadeUp>

            {/* 3 Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {highlights.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <FadeUp key={idx} delay={0.3 + (idx * 0.1)}>
                    <div
                      className="highlight-card"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 4px 15px rgba(23, 43, 77, 0.03)',
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                    >
                      <div className="highlight-icon" style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-blue) 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.3s ease'
                      }}>
                        <IconComp size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-navy)', marginBottom: '0.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {item.title} <ChevronRight size={16} color="var(--brand-blue)" className="highlight-arrow" style={{ opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease' }} />
                        </h4>
                        <p style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .company-profile-grid {
            grid-template-columns: 1fr 1.15fr !important;
          }
        }

        @media (max-width: 768px) {
          .company-profile-grid {
            gap: 2.5rem !important;
          }
          .exact-visual-card {
            min-height: auto !important;
            padding-top: 3rem !important;
          }
          .exact-visual-content {
            padding: 1.25rem !important;
          }
          .exact-visual-title {
            font-size: 2rem !important;
          }
          .exact-feature-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .exact-feature-card {
            padding: 1rem 0.25rem !important;
          }
          .exact-feature-card svg {
            width: 24px !important;
            height: 24px !important;
          }
          .exact-banner-line {
            display: none !important;
          }
          .exact-bottom-banner {
            padding: 1rem !important;
          }
          .exact-bottom-banner > div {
            flex-wrap: wrap !important;
            gap: 0.75rem !important;
          }
        }
        
        .highlight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 156, 252, 0.1);
          border-color: rgba(0, 156, 252, 0.2) !important;
        }
        
        .highlight-card:hover .highlight-icon {
          transform: scale(1.05);
        }
        
        .highlight-card:hover .highlight-arrow {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        /* Exact Match Styling */
        .exact-feature-card {
          background: linear-gradient(180deg, rgba(10, 35, 75, 0.4) 0%, rgba(2, 10, 30, 0.6) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 198, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .exact-feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.8), transparent);
        }
        
        .exact-feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 198, 255, 0.5);
          box-shadow: 0 15px 40px rgba(0, 198, 255, 0.2);
        }

        .exact-bottom-banner {
          background: linear-gradient(90deg, rgba(5, 15, 45, 0.8) 0%, rgba(2, 10, 30, 0.9) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 198, 255, 0.3);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .exact-banner-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, rgba(0, 198, 255, 0.15) 0%, transparent 100%);
          border-right: 2px solid #00C6FF;
          transform: skewX(-20deg);
          transform-origin: bottom;
          margin-left: -20px;
          box-shadow: 5px 0 20px rgba(0, 198, 255, 0.3);
        }
        
        .exact-banner-accent-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(-90deg, rgba(0, 198, 255, 0.1) 0%, transparent 100%);
          border-left: 2px solid #00C6FF;
          transform: skewX(-20deg);
          transform-origin: bottom;
          margin-right: -20px;
        }

        .exact-neon-divider {
          height: 4px;
          width: 80px;
          background: linear-gradient(90deg, #00C6FF, rgba(0, 198, 255, 0.1));
          box-shadow: 0 0 12px #00C6FF, 0 0 24px #00C6FF;
          border-radius: 4px;
          margin-bottom: 2.5rem;
        }
      `}</style>
    </section>
  );
};

export default CompanyProfile;
