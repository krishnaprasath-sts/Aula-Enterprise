import React from 'react';
import { ShieldCheck, FileText, Globe, CheckCircle, ArrowUpRight } from 'lucide-react';
import FadeUp from '../common/FadeUp';

const TrustStrip = () => {
  const trustItems = [
    { label: 'Singapore Customs Declaration', icon: ShieldCheck },
    { label: 'Trade Compliance & Integrity', icon: FileText },
    { label: 'Import Permit Processing', icon: CheckCircle },
    { label: 'Export Permit Approval', icon: Globe },
    { label: 'Transhipment & GST Permits', icon: ArrowUpRight },
    { label: 'Cargo Customs Clearance', icon: ShieldCheck }
  ];

  return (
    <section style={{
      backgroundColor: 'var(--bg-white)',
      padding: '3rem 0 4rem 0',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top subtle fade gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0, 156, 252, 0.2), transparent)'
      }} />

      <FadeUp delay={0.1}>
        <div className="container" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: 'linear-gradient(90deg, transparent, rgba(0, 156, 252, 0.4))' }} />
          <p style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            color: 'var(--brand-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            margin: 0
          }}>
            Trusted by Singapore Businesses For
          </p>
          <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: 'linear-gradient(270deg, transparent, rgba(0, 156, 252, 0.4))' }} />
        </div>

        {/* Horizontal Marquee Ticker */}
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          userSelect: 'none',
          padding: '0.5rem 0',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}>
          <div className="marquee-track">
            {[...trustItems, ...trustItems].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="marquee-item"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.8rem 1.75rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 156, 252, 0.1)',
                    borderRadius: '99px',
                    boxShadow: '0 4px 15px rgba(23, 43, 77, 0.04), 0 1px 3px rgba(0,0,0,0.02)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--dark-navy)',
                    marginRight: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-blue-subtle)'
                  }}>
                    <IconComp size={16} color="var(--brand-blue)" />
                  </div>
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </FadeUp>

      <style>{`
        .marquee-track {
          display: flex;
          animation: marquee 35s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }
        
        .marquee-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 156, 252, 0.12);
          border-color: rgba(0, 156, 252, 0.3) !important;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default TrustStrip;
