import React from 'react';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const HomeBlogSection = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: 'guide-singapore-customs-permit-declaration',
      category: 'Permit Declaration',
      date: 'May 14, 2026',
      title: 'Essential Guide to Singapore Customs Permit Declarations for Importers',
      desc: 'Understanding TradeNet permit categories, HS Code classification best practices, and avoiding costly port clearance delays.'
    },
    {
      id: 'mes-gst-suspension-scheme-explained',
      category: 'Trade Compliance',
      date: 'Apr 28, 2026',
      title: 'Maximizing Cash Flow with Singapore Major Exporter Scheme (MES)',
      desc: 'How Singapore businesses suspend GST on imported goods and maintain IRAS trade compliance standards.'
    },
    {
      id: 'strategic-goods-control-act-singapore',
      category: 'Customs',
      date: 'Apr 10, 2026',
      title: 'Navigating Strategic Goods Control Act (SGCA) Regulations',
      desc: 'Critical permit requirements for dual-use technology, high-tech components, and controlled commercial exports.'
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Trade Insights"
                mode="words"
                style={{ color: 'var(--dark-navy)', margin: 0, fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 700 }}
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem', margin: 0 }}>
                Practical insights for businesses navigating customs and international trade.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.3}>
            <button
              onClick={() => navigate('/blog')}
              className="btn-secondary"
            >
              View All Insights <ArrowUpRight size={18} />
            </button>
          </FadeUp>
        </div>

        {/* 3 Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {articles.map((article, idx) => (
            <FadeUp key={idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
              <div
                onClick={() => navigate(`/blog`)}
                className="blog-card-hover"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%'
                }}
              >
                <div>
                  {/* Meta info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.65rem',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      borderRadius: '6px',
                      fontWeight: 700
                    }}>
                      <Tag size={12} /> {article.category}
                    </span>
                    <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {article.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', fontWeight: 700, marginBottom: '0.85rem', lineHeight: 1.35 }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {article.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--brand-blue)',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <span>Read Article</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>

      <style>{`
        .blog-card-hover:hover {
          transform: translateY(-6px);
          border-color: var(--brand-blue) !important;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </section>
  );
};

export default HomeBlogSection;
