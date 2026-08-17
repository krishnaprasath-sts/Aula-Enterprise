import React from 'react';
import { Clock, ShieldCheck, Zap, FileCheck, Headphones, TrendingUp } from 'lucide-react';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const Benefits = () => {
  const benefits = [
    {
      title: 'Reduced Administrative Workload',
      desc: 'Free up internal logistics teams by outsourcing complex permit drafting, HS code research, and TradeNet filings to certified declaring experts.',
      icon: Clock
    },
    {
      title: 'Improved Compliance & Governance',
      desc: 'Mitigate risk of customs penalties, audit queries, or shipment delays with 100% accurate regulatory classification and documentation.',
      icon: ShieldCheck
    },
    {
      title: 'Faster Port & Cargo Clearance',
      desc: 'Direct electronic link with Singapore Customs ensures instant authorization for air cargo, sea freight, and cross-border road trucking.',
      icon: Zap
    },
    {
      title: 'Accurate Declarations',
      desc: 'Eliminate filing errors in customs values, exchange rates, COO eligibility, and GST relief scheme qualifications.',
      icon: FileCheck
    },
    {
      title: 'Professional Customs Support',
      desc: 'Direct access to senior customs advisors who understand your industry, specific cargo requirements, and emergency deadlines.',
      icon: Headphones
    },
    {
      title: 'Better Operational Efficiency',
      desc: 'Streamline your international supply chain with predictable clearance timelines and transparent communication.',
      icon: TrendingUp
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg-sand)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
          <FadeUp delay={0.1}>
            <TextReveal
              text="What You Gain With AULA"
              mode="chars"
              style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 700, justifyContent: 'center' }}
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Empowering Singapore enterprises with seamless customs execution and risk-free trade operations.
            </p>
          </FadeUp>
        </div>

        {/* Benefits Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {benefits.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <FadeUp key={idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
                <div
                  className="benefit-card card-clean"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    padding: '2.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-blue)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--brand-blue-subtle)',
                    border: '1px solid rgba(0, 156, 252, 0.1)',
                    color: 'var(--brand-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <IconComp size={28} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Benefits;
