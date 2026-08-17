import React, { useState } from 'react';
import { ShieldCheck, Zap, Anchor, MessageSquare, Headphones, Layers, ArrowRight } from 'lucide-react';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const advantages = [
    {
      num: '01',
      title: 'Compliance First',
      shortDesc: 'Zero tolerance for trade infractions. Rigorous classification and documentation audits.',
      fullDesc: 'Customs penalties and held shipments stem from misclassification or inaccurate filings. Our certified specialists review every HS Code, valuation, and COO prior to TradeNet submission.',
      icon: ShieldCheck
    },
    {
      num: '02',
      title: 'Fast Turnaround',
      shortDesc: 'Rapid permit processing for urgent air cargo, sea freight, and cross-border road transport.',
      fullDesc: 'We understand that supply chain delays cost money. With direct TradeNet connectivity, standard permits are declared and approved in record time.',
      icon: Zap
    },
    {
      num: '03',
      title: 'Singapore-Focused Expertise',
      shortDesc: 'Deep operational mastery of Singapore Customs, IRAS GST, and Singapore Free Trade Zones.',
      fullDesc: 'From Major Exporter Scheme (MES) setups to Strategic Goods Control Act declarations, our team understands Singapore’s exact regulatory landscape inside out.',
      icon: Anchor
    },
    {
      num: '04',
      title: 'Transparent Communication',
      shortDesc: 'Real-time status updates and upfront guidance on permit requirements and duties.',
      fullDesc: 'No hidden fees or unexpected delays. We keep your trade compliance and logistics teams informed at every stage of the declaration workflow.',
      icon: MessageSquare
    },
    {
      num: '05',
      title: 'Dedicated Support',
      shortDesc: 'A single point of contact for your company’s ongoing trade and permit operations.',
      fullDesc: 'Instead of dealing with anonymous call centers, you get a dedicated customs declaring specialist who understands your specific business and cargo profile.',
      icon: Headphones
    },
    {
      num: '06',
      title: 'End-to-End Assistance',
      shortDesc: 'From initial document review to post-permit audits, GST relief, and COO applications.',
      fullDesc: 'We handle your entire trade lifecycle including Strategic Goods permits, Temporary Import Carnets, Transhipment declarations, and Customs clearance.',
      icon: Layers
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--brand-blue-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlignment: 'center', textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
          <FadeUp delay={0.1}>
            <TextReveal
              text="Why Singapore's Leading Shippers Choose AULA Permits"
              mode="words"
              style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 700, justifyContent: 'center' }}
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
              Precision where every declaration matters. Experience seamless trade operations backed by enterprise rigor.
            </p>
          </FadeUp>
        </div>

        {/* Interactive Editorial Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem',
          alignItems: 'stretch'
        }} className="why-us-grid">

          {/* Left Column: Interactive List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {advantages.map((item, idx) => {
              const isActive = activeIndex === idx;
              const IconComp = item.icon;
              return (
                <FadeUp key={idx} delay={0.1 + (idx * 0.05)}>
                  <div
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      position: 'relative',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      border: isActive ? '1px solid var(--brand-blue)' : '1px solid transparent',
                      boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: isActive ? 'var(--brand-blue)' : 'var(--text-muted)',
                        width: '32px'
                      }}>
                        {item.num}
                      </span>

                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? 'var(--brand-blue-light)' : '#FFFFFF',
                        color: isActive ? 'var(--brand-blue)' : 'var(--dark-navy)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s'
                      }}>
                        <IconComp size={20} />
                      </div>

                      <h4 style={{
                        fontSize: '1.15rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? 'var(--dark-navy)' : 'var(--text-secondary)',
                        margin: 0,
                        transition: 'color 0.2s'
                      }}>
                        {item.title}
                      </h4>
                    </div>

                    <div
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0px)' : 'translateX(-8px)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ArrowRight size={18} color="var(--brand-blue)" />
                    </div>
                  </div>

                  {/* Mobile Inline Detail (Accordion) */}
                  {isActive && (
                    <div className="mobile-detail-panel" style={{
                      backgroundColor: 'var(--dark-navy)',
                      color: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '2rem 1.5rem',
                      marginTop: '0.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute', top: '-1rem', right: '1rem',
                        fontFamily: 'var(--font-heading)', fontSize: '8rem', fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.04)', userSelect: 'none', lineHeight: 1
                      }}>
                        {item.num}
                      </div>
                      <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1rem' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '1rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {item.shortDesc}
                      </p>
                      <div style={{ width: '40px', height: '2px', backgroundColor: '#38BDF8', marginBottom: '1rem' }} />
                      <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                        {item.fullDesc}
                      </p>
                    </div>
                  )}
                </FadeUp>
              );
            })}
          </div>

          {/* Right Column: Active Editorial Showcase Panel (Desktop) */}
          <div className="desktop-detail-panel" style={{ position: 'relative' }}>
            <FadeUp delay={0.3} style={{ height: '100%' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--dark-navy)',
                  color: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '3rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Massive Animated Background Number */}
                <div style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '1rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '12rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.04)',
                  userSelect: 'none',
                  lineHeight: 1
                }}>
                  {advantages[activeIndex].num}
                </div>

                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 1rem',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '2rem'
                  }}>
                    Key Advantage {advantages[activeIndex].num}
                  </div>

                  <h3 style={{ fontSize: '2.25rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1.25rem' }}>
                    {advantages[activeIndex].title}
                  </h3>

                  <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    {advantages[activeIndex].shortDesc}
                  </p>

                  <div style={{
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#38BDF8',
                    borderRadius: '2px',
                    marginBottom: '1.75rem'
                  }} />

                  <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: 1.7 }}>
                    {advantages[activeIndex].fullDesc}
                  </p>
                </div>

                <div style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  color: '#CBD5E1'
                }}>
                  <span>Singapore Trade Standard</span>
                  <span style={{ color: '#38BDF8', fontWeight: 600 }}>100% Compliant</span>
                </div>

              </div>
            </FadeUp>
          </div>

        </div>

      </div>

      <style>{`
        .mobile-detail-panel {
          display: none;
        }
        @media (max-width: 991px) {
          .desktop-detail-panel {
            display: none !important;
          }
          .mobile-detail-panel {
            display: block;
            animation: slideDown 0.3s ease-out forwards;
          }
        }
        @media (min-width: 992px) {
          .why-us-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
