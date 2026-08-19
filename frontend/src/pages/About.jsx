import { Helmet } from 'react-helmet-async';
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Award, FileText, CheckCircle2, ArrowRight, Anchor, Globe, Users } from 'lucide-react';
import ConsultationModal from '../components/common/ConsultationModal';
import FadeUp from '../components/common/FadeUp';
import LeadCTA from '../components/home/LeadCTA';
import TextReveal from '../components/common/TextReveal';

const About = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const pillars = [
    {
      title: 'Regulatory Integrity',
      desc: '100% adherence to Singapore Customs, IRAS, and International Trade Controls. We maintain uncompromising compliance standards for every client.',
      icon: ShieldCheck
    },
    {
      title: 'Operational Precision',
      desc: 'Accurate classification, customs valuation, and duty assessment to ensure zero delays and zero unexpected port holds.',
      icon: Award
    },
    {
      title: 'Customer-Centric Speed',
      desc: 'Direct electronic TradeNet link and round-the-clock specialists for urgent air cargo, sea freight, and overland permits.',
      icon: Anchor
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | AULA Permits Singapore</title>
        <meta name="description" content="Learn about AULA Permits, the leading declaring agents in Singapore specializing in customs, trade compliance, and permit solutions." />
      </Helmet>
      <div ref={containerRef} style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>

        {/* Page Hero */}
        <section style={{ backgroundColor: 'var(--brand-blue-subtle)', padding: '5rem 0', borderBottom: '1px solid var(--border-blue)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Singapore’s Trusted Declaring Agent & Trade Partner"
                mode="words"
                style={{ color: 'var(--dark-navy)', marginBottom: '1.25rem', fontSize: '2.5rem', fontWeight: 800 }}
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                AULA Permits simplifies cross-border commerce for Singapore businesses by delivering high-precision permit declarations, customs clearance, and regulatory compliance.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Corporate Story & Mission */}
        <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '4rem',
              alignItems: 'center'
            }} className="about-grid">

              <div>
                <FadeUp delay={0.1}>
                  <TextReveal
                    text="Eliminating Friction in International Trade"
                    mode="chars"
                    style={{ color: 'var(--dark-navy)', marginBottom: '1.25rem', fontSize: '2rem', fontWeight: 700 }}
                  />
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                    International trade is the lifeblood of Singapore’s economy. However, complex customs regulations, controlled item permits, and shifting tariff codes can slow down supply chains and expose businesses to costly penalties.
                  </p>
                </FadeUp>
                <FadeUp delay={0.3}>
                  <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                    AULA Permits was established to bridge this gap. As a dedicated Singapore declaring agent, we manage the entire permit lifecycle—from initial classification and document audit to TradeNet submission and final customs clearance.
                  </p>
                </FadeUp>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                  <FadeUp delay={0.4}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                      <CheckCircle2 size={18} color="var(--brand-blue)" /> Certified Singapore Customs Declaring Agent
                    </div>
                  </FadeUp>
                  <FadeUp delay={0.5}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                      <CheckCircle2 size={18} color="var(--brand-blue)" /> Direct Electronic Connectivity with TradeNet
                    </div>
                  </FadeUp>
                  <FadeUp delay={0.6}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, color: 'var(--dark-navy)' }}>
                      <CheckCircle2 size={18} color="var(--brand-blue)" /> Strategic Goods & Controlled Items Specialists
                    </div>
                  </FadeUp>
                </div>

                <FadeUp delay={0.7}>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-primary"
                  >
                    Consult Our Team <ArrowRight size={18} />
                  </button>
                </FadeUp>
              </div>

              {/* Mission Card Graphic */}
              <FadeUp delay={0.3} style={{ height: '100%' }}>
                <div style={{
                  backgroundColor: 'var(--dark-navy)',
                  borderRadius: '24px',
                  padding: '3rem',
                  color: '#FFFFFF',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%'
                }}>
                  <motion.div style={{
                    position: 'absolute', top: -50, right: -50, width: '250px', height: '250px',
                    background: 'radial-gradient(circle, rgba(0, 156, 252, 0.25) 0%, transparent 70%)',
                    borderRadius: '50%',
                    y: parallaxY
                  }} />

                  <h3 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1.5rem' }}>
                    Enterprise Integrity & Regulatory Standards
                  </h3>

                  <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '2rem' }}>
                    We operate as an extension of your trade compliance team, ensuring every commercial invoice, packing list, and bill of lading meets Singapore Customs rules.
                  </p>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Singapore Head office
                    </div>
                    <div style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '0.25rem' }}>
                      26 Upper Dickson Road, Singapore 207478
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                      UEN: [202028266G] | Contact: contact@aulapermits.sg
                    </div>
                  </div>
                </div>
              </FadeUp>

            </div>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="section-padding" style={{ backgroundColor: 'var(--brand-blue-subtle)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
              <FadeUp delay={0.1}>
                <TextReveal
                  text="Built on Rigor & Precision"
                  mode="lines"
                  style={{ color: 'var(--dark-navy)', fontSize: '2rem', fontWeight: 700, justifyContent: 'center' }}
                />
              </FadeUp>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {pillars.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <FadeUp key={idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
                    <div className="card-clean" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--brand-blue-light)',
                        color: 'var(--brand-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={26} />
                      </div>

                      <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-navy)', fontWeight: 700, margin: 0 }}>
                        {item.title}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.65, margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Lead Banner */}
        <LeadCTA
          title="Partner with Singapore’s Trade Specialists"
          description="Contact AULA Permits today for a comprehensive review of your permit declaration and trade compliance requirements."
          buttonText="Request a Consultation"
        />

        <style>{`
          @media (min-width: 992px) {
            .about-grid {
              grid-template-columns: 1.1fr 0.9fr !important;
            }
          }
        `}</style>

      </div>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default About;
