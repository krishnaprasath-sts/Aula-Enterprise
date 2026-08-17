import React, { useState } from 'react';
import { Search, Tag, Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConsultationModal from '../components/common/ConsultationModal';
import FadeUp from '../components/common/FadeUp';
import TextReveal from '../components/common/TextReveal';
import LeadCTA from '../components/home/LeadCTA';
import img1 from '../assets/Trade Documentation Verification image.png';
import img2 from '../assets/Compliance & Scheme Audits.jpg';
import img3 from '../assets/customs.jpg';
import img4 from '../assets/import.jpg';

export const blogPostsData = [
  {
    id: 'guide-singapore-customs-permit-declaration',
    category: 'Permit Declaration',
    date: 'May 14, 2026',
    title: 'Essential Guide to Singapore Customs Permit Declarations for Importers',
    desc: 'Understanding TradeNet permit categories, HS Code classification best practices, and avoiding costly port clearance delays.',
    img: img1,
    content: `
      Navigating Singapore Customs regulations requires thorough preparation of commercial transport documents. As an enterprise importer or logistics provider, submitting timely and accurate declarations via TradeNet is essential for maintaining supply chain velocity.

      ### Key Document Verification
      Prior to electronic lodgement, every shipment must be backed by:
      1. **Commercial Invoice**: Detailing buyer, seller, Incoterms, currency, and line-item descriptions.
      2. **Packing List**: Outlining gross weight, net weight, package counts, and marks.
      3. **Transport Document**: Bill of Lading (Sea) or Airway Bill (Air).

      ### Avoiding Common HS Code Classification Pitfalls
      Misclassification of 8-digit Singapore Harmonized System (HS) codes remains a leading cause of customs holds. Ensure your declaring agent cross-references Controlling Agency requirements (HSA, AVA, SFA) before submission.
    `
  },
  {
    id: 'mes-gst-suspension-scheme-explained',
    category: 'Trade Compliance',
    date: 'Apr 28, 2026',
    title: 'Maximizing Cash Flow with Singapore Major Exporter Scheme (MES)',
    desc: 'How Singapore businesses suspend GST on imported goods and maintain IRAS trade compliance standards.',
    img: img2,
    content: `
      The Major Exporter Scheme (MES) is designed to ease cash flow for businesses with significant export volume. Approved MES businesses can suspend GST on goods imported for commercial purposes.

      ### Compliance Standards for MES Holders
      To maintain MES privileges, IRAS requires strict internal accounting controls, periodic post-permit reconciliations, and accurate reporting of suspended GST in GST F5 returns.
    `
  },
  {
    id: 'strategic-goods-control-act-singapore',
    category: 'Customs',
    date: 'Apr 10, 2026',
    title: 'Navigating Strategic Goods Control Act (SGCA) Regulations',
    desc: 'Critical permit requirements for dual-use technology, high-tech components, and controlled commercial exports.',
    img: img3,
    content: `
      Singapore enforces strict oversight under the Strategic Goods Control Act (SGCA) to prevent the proliferation of weapons of mass destruction and controlled dual-use commercial items.

      ### Who Needs a Strategic Goods Permit?
      Exporters, transhippers, and brokering agents dealing in advanced microelectronics, telecommunications encryption, or industrial equipment must obtain SGCA permits prior to cargo movement.
    `
  },
  {
    id: 'import-export-gst-relief-codes',
    category: 'Import & Export',
    date: 'Mar 22, 2026',
    title: 'Understanding GST Exemption & Relief Codes in TradeNet',
    desc: 'A breakdown of temporary import relief, repair/re-export permits, and bonded warehouse declarations in Singapore.',
    img: img4,
    content: `
      Singapore Customs provides specific relief codes for temporary imports intended for exhibition, repair, or re-export. Utilizing the correct TradeNet parameters prevents premature GST payment.
    `
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ['All', 'Permit Declaration', 'Trade Compliance', 'Customs', 'Import & Export'];

  const filteredPosts = blogPostsData.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>

        {/* Page Hero */}
        <section style={{ backgroundColor: 'var(--brand-blue-subtle)', padding: '5rem 0', borderBottom: '1px solid var(--border-blue)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Singapore Customs & Trade Intelligence"
                mode="chars"
                style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                Expert analysis, regulatory updates, and practical guidance for businesses navigating international trade compliance.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section style={{ padding: '2.5rem 0 1rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedCategory === cat ? 'var(--brand-blue)' : 'var(--brand-blue-subtle)',
                      color: selectedCategory === cat ? '#FFFFFF' : 'var(--dark-navy)',
                      border: selectedCategory === cat ? '1px solid var(--brand-blue)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.6rem',
                    borderRadius: '99px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Cards Grid */}
        <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container">
            {filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                No trade articles matched your search criteria.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}>
                {filteredPosts.map((article, idx) => (
                  <FadeUp key={idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
                    <div
                      onClick={() => navigate(`/blog/${article.id}`)}
                      className="card-clean"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        height: '100%',
                        padding: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {article.img && (
                        <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                          <img 
                            src={article.img} 
                            alt={article.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}
                      
                      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                        <div>
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

                          <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-navy)', fontWeight: 700, marginBottom: '0.85rem', lineHeight: 1.35 }}>
                            {article.title}
                          </h3>

                          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
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
                          marginTop: '1.75rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--border-subtle)'
                        }}>
                          <span>Read Full Insight</span>
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Client Review Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--dark-navy)', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Background Glows */}
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'var(--brand-blue)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'var(--brand-purple)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <FadeUp delay={0.1}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--brand-blue-light)',
                  marginBottom: '1rem'
                }}>
                  Client Testimonials
                </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>Trusted by Enterprise Leaders</h2>
              </FadeUp>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {/* Review 1 */}
              <FadeUp delay={0.3}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-purple) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontSize: '1.1rem'
                    }}>
                      JL
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>Jonathan Lim</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Logistics Director, GlobalTech Supply</div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.7,
                    flexGrow: 1,
                    marginBottom: '1.5rem'
                  }}>
                    "Aula Permits transformed our entire customs clearance workflow. Their proactive approach to TradeNet compliance and deep understanding of the Major Exporter Scheme saved us thousands in potential delays."
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#F5A623' }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Review 2 */}
              <FadeUp delay={0.4}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-purple) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontSize: '1.1rem'
                    }}>
                      ST
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>Sarah Tan</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>Supply Chain Manager, Apex Pharma</div>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.7,
                    flexGrow: 1,
                    marginBottom: '1.5rem'
                  }}>
                    "The most reliable declaring agent we've worked with in Singapore. Their 24/7 support and absolute accuracy with HS code classification has given us immense peace of mind for our high-value shipments."
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#F5A623' }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Lead Banner */}
        <LeadCTA
          title="Have Specific Permit Questions?"
          description="Our declaring agents are ready to assist with your specific cargo, HS codes, and customs clearance requirements."
          buttonText="Request a Consultation"
        />

      </div>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Blog;
