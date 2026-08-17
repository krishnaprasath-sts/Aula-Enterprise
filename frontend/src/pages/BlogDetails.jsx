import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { blogPostsData } from './Blog';
import ConsultationModal from '../components/common/ConsultationModal';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const article = blogPostsData.find(post => post.id === id) || blogPostsData[0];

  return (
    <>
      <div style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>
        
        {/* Article Header */}
        <section style={{ backgroundColor: 'var(--brand-blue-subtle)', padding: '4rem 0', borderBottom: '1px solid var(--border-blue)' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--brand-blue)',
                marginBottom: '1.5rem'
              }}
            >
              <ArrowLeft size={16} /> Back to Trade Insights
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--brand-blue-light)',
                color: 'var(--brand-blue)',
                borderRadius: '6px',
                fontWeight: 700
              }}>
                <Tag size={13} /> {article.category}
              </span>
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> {article.date}
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', color: 'var(--dark-navy)', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
              {article.title}
            </h1>

            <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {article.desc}
            </p>
          </div>
        </section>

        {/* Article Body Content */}
        <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <div style={{
              fontSize: '1.08rem',
              color: 'var(--text-primary)',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <p>
                Singapore Customs plays a pivotal role in preserving Singapore’s status as a world-class trade hub. For commercial enterprises, ensuring that all import, export, and transhipment documentation meets regulatory requirements is vital to avoid port holds, financial penalties, or audit delays.
              </p>

              <h2 style={{ fontSize: '1.65rem', color: 'var(--dark-navy)', fontWeight: 700, marginTop: '1.5rem' }}>
                Key Permit Categories & Documentation Alignment
              </h2>

              <p>
                Prior to lodging a declaration in TradeNet, declaring agents must verify that commercial invoices, packing lists, and transport bills match the physical cargo characteristics. Discrepancies between commercial terms (Incoterms) and declared customs values can trigger mandatory inspections.
              </p>

              <div style={{
                backgroundColor: 'var(--brand-blue-subtle)',
                borderLeft: '4px solid var(--brand-blue)',
                padding: '1.5rem 1.75rem',
                borderRadius: '8px',
                fontSize: '1.05rem',
                color: 'var(--dark-navy)',
                fontWeight: 600,
                margin: '1rem 0'
              }}>
                "Working with a certified Singapore Declaring Agent ensures 100% filing compliance and immediate electronic TradeNet clearance authorization."
              </div>

              <h2 style={{ fontSize: '1.65rem', color: 'var(--dark-navy)', fontWeight: 700, marginTop: '1.5rem' }}>
                Strategic Goods & Controlling Agency Approvals
              </h2>

              <p>
                Certain high-tech commercial goods—such as advanced semiconductors, telecommunications encryption hardware, or specialized chemicals—are classified under the Strategic Goods Control Act (SGCA) or require controlling agency approvals (AVA, HSA, SFA, SPF). Declaring agents must ensure all required licenses are active before submitting the permit declaration.
              </p>

              {/* Consultation Lead Box inside Article */}
              <div style={{
                marginTop: '3rem',
                padding: '2.5rem',
                backgroundColor: 'var(--dark-navy)',
                color: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                textAlign: 'center'
              }}>
                <ShieldCheck size={36} color="var(--brand-blue)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Have Questions About Singapore Customs Declarations?
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.98rem', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
                  Our declaring specialists provide immediate guidance regarding permit classifications, GST relief schemes, and TradeNet filings.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary"
                  style={{ padding: '0.85rem 1.75rem' }}
                >
                  Request a Consultation <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </section>

      </div>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default BlogDetails;
