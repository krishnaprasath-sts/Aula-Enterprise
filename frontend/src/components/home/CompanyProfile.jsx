import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, Award, ChevronRight } from 'lucide-react';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

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
          <FadeUp delay={0.1} style={{ height: 'calc(100% - 2.5rem)', marginTop: '2.5rem' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '100%',
                minHeight: '480px',
                boxShadow: '0 25px 50px -12px rgba(0, 156, 252, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                alt="Professional Trade Team"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, transform: 'scale(1.02)' }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '3rem', zIndex: 2 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#FFFFFF',
                  borderRadius: '99px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <Award size={16} color="#00C6FF" /> Premium Declaring Agent
                </div>

                <h3 style={{ fontSize: '2.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.15 }}>
                  Streamlining Customs<br />For Enterprise
                </h3>

                <div className="responsive-grid-2" style={{
                  gap: '2rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div>
                    <div className="text-gradient-blue" style={{ fontSize: '1.75rem',color: '#FFFFFF', fontWeight: 800, fontFamily: 'var(--font-heading)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                      TradeNet
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ffffffff', fontWeight: 500, marginTop: '0.25rem' }}>Direct Integration</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                      Dedicated
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#ffffffff', fontWeight: 500, marginTop: '0.25rem' }}>Specialist Support</div>
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
      `}</style>
    </section>
  );
};

export default CompanyProfile;
