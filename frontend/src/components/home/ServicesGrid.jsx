import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Anchor, FileText, CheckSquare, Truck, Award, MessageCircle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConsultationModal from '../common/ConsultationModal';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const ServicesGrid = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const services = [
    { title: 'Customs Support', desc: 'Advisory and operational assistance for complex Singapore Customs rulings, HS classifications, and valuation matters.', icon: ShieldCheck },
    { title: 'Import Services', desc: 'Complete handling of inbound commercial goods, duty/GST assessment, and controlling agency clearances.', icon: Anchor },
    { title: 'Export Services', desc: 'Outbound cargo documentation, Strategic Goods export permits, and temporary export carnets.', icon: Truck },
    { title: 'Trade Documentation', desc: 'Meticulous verification of Commercial Invoices, Packing Lists, Bills of Lading, and Certificates of Analysis.', icon: FileText },
    { title: 'Compliance Support', desc: 'Pre-audit trade compliance reviews, IRAS Major Exporter Scheme (MES) guidance, and risk management.', icon: CheckSquare },
    { title: 'Cargo Clearance', desc: 'On-the-ground liaison with port authorities, airport air cargo complexes, and checkpoints for rapid release.', icon: ShieldCheck },
    { title: 'Certificate of Origin', desc: 'Formulation and lodgement of Ordinary and Preferential COOs under Singapore Free Trade Agreements.', icon: Award },
    { title: 'Trade Consultation', desc: 'Strategic consultation for new importers/exporters establishing compliant trade operations in Singapore.', icon: MessageCircle }
  ];

  return (
    <div>
      {/* Global Trade Section - Warm & Crafted */}
      <section className="section-padding" style={{ backgroundColor: 'var(--dark-surface)' }}>
        <div className="container">
          <div style={{
            gap: '5rem', alignItems: 'center'
          }} className="responsive-grid-2 trade-grid">

            <div>
              <FadeUp delay={0.1}>
                <TextReveal
                  text="From Singapore to the World."
                  mode="lines"
                  style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '1.25rem' }}
                />
              </FadeUp>
              <FadeUp delay={0.2}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  As Southeast Asia's premier logistics hub, Singapore connects key trade lanes across Asia Pacific, Europe, the Middle East, and the Americas. AULA Permits anchors your cross-border operations with absolute compliance.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <button onClick={() => setModalOpen(true)} className="btn-primary">
                  Apply Permit <ArrowRight size={18} />
                </button>
              </FadeUp>
            </div>

            {/* Organic, crafted stats grid */}
            <div className="responsive-grid-2" style={{
              gap: '1.5rem', position: 'relative'
            }}>
              {/* Decorative soft blob behind stats */}
              <div style={{
                position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
                background: 'linear-gradient(135deg, rgba(0,156,252,0.1), transparent)',
                filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0
              }} />

              {[
                { val: '500+', label: 'Permits Monthly' },
                { val: '24/7', label: 'Customs Operations' },
                { val: '100%', label: 'Filing Accuracy' },
                { val: '11+', label: 'Permit Categories' }
              ].map((stat, idx) => (
                <FadeUp key={idx} delay={0.2 + (idx * 0.1)}>
                  <div style={{
                    padding: '2rem 1.5rem', borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative', zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    transform: idx === 1 || idx === 3 ? 'translateY(20px)' : 'none' // Organic stagger layout
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{stat.val}</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.75rem' }}>{stat.label}</div>
                  </div>
                </FadeUp>
              ))}
            </div>

          </div>
        </div>

        <style>{`
          @media (max-width: 991px) {
            .trade-grid {
              grid-template-columns: 1fr !important;
              gap: 3rem !important;
            }
          }
        `}</style>
      </section>

      {/* Services Grid Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-white)' }}>
        <div className="container">

          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4.5rem auto' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="More Than Permit Declaration"
                mode="chars"
                style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 700, justifyContent: 'center' }}
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                End-to-end customs support, trade compliance, and regulatory documentation tailored for business growth.
              </p>
            </FadeUp>
          </div>

          {/* Grid of 8 Service Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <FadeUp key={idx} delay={0.1 + (idx * 0.05)}>
                  <div
                    onClick={() => navigate('/services')}
                    className="sg-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      height: '100%'
                    }}
                  >
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '14px',
                      backgroundColor: 'var(--brand-blue-subtle)',
                      border: '1px solid rgba(0,156,252,0.1)',
                      color: 'var(--brand-blue)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }} className="sg-icon-box">
                      <IconComp size={28} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {service.title}
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                        {service.desc}
                      </p>
                    </div>

                    <div className="sg-card-link" style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-blue)',
                      marginTop: 'auto', transition: 'all 0.3s ease'
                    }}>
                      <span>Explore Service</span>
                      <div className="sg-arrow" style={{ transition: 'transform 0.3s ease' }}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>

        </div>

        <style>{`
          .sg-card:hover {
            border-color: var(--border-blue);
            box-shadow: var(--shadow-hover);
            transform: translateY(-6px);
          }
          .sg-card:hover .sg-icon-box {
            background-color: var(--brand-blue);
            color: #FFFFFF;
          }
          .sg-card:hover .sg-arrow {
            transform: translateX(6px);
          }
        `}</style>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default ServicesGrid;
