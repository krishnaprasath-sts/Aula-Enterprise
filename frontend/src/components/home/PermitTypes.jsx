import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';
import { fetchApi } from '../../config/api';

const DEFAULT_PERMITS = [
  { id: 1, title: 'Import Permit', description: 'Required for bringing commercial goods into Singapore customs territory, verifying GST, duties, and controlling agency permits.', image: '/assets/import.jpg', status: 'Active' },
  { id: 2, title: 'Export Permit', description: 'Official authorization for outbound shipments, strategic items, re-exports, or outward processed goods leaving Singapore.', image: '/assets/export.jpg', status: 'Active' },
  { id: 3, title: 'GST Permit', description: 'Goods and Services Tax declaration, exemption filings, temporary import relief, and MES scheme reporting.', image: '/assets/gst.jpg', status: 'Active' },
  { id: 4, title: 'Transhipment Permit', description: 'Documentation for cargo moving through Singapore ports to third-country destinations without entering local commerce.', image: '/assets/transhipment.jpg', status: 'Active' },
  { id: 5, title: 'Strategic Goods Permit', description: 'Strict compliance for dual-use technology, military hardware, or controlled items under Strategic Goods Control Act.', image: '/assets/strategic goods image.png', status: 'Active' },
  { id: 6, title: 'Certificate of Origin', description: 'Preferential & Non-Preferential COO documentation under Singapore Free Trade Agreements (FTAs).', image: '/assets/Certificate of Origin (COO) Support.png', status: 'Active' },
  { id: 7, title: 'Shut-Out Permit', description: 'Declarations for export cargo cancelled, rejected at port terminals, or returned to local warehouses.', image: '/assets/shut out permit image.png', status: 'Active' },
  { id: 8, title: 'Hand Carry Permit', description: 'Customs declaration for high-value components, jewelry, or prototypes carried via passenger baggage.', image: '/assets/hand carry permit image.png', status: 'Active' },
  { id: 9, title: 'Re-Export Permit', description: 'Permits for foreign-origin goods imported temporarily for warehousing or re-packing prior to export.', image: '/assets/re-export permit image.jpg', status: 'Active' },
  { id: 10, title: 'Major Exporter Scheme', description: 'IRAS-approved GST suspension management for major Singapore export and manufacturing enterprises.', image: '/assets/major export permit image.jpg', status: 'Active' },
  { id: 11, title: 'Transport Mode Declarations', description: 'Customized permits for Sea Freight, Air Cargo, Land Trucking (Causeway/Tuas), and Parcel Post.', image: '/assets/transportation image.png', status: 'Active' }
];

const PermitTypes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState('');

  const [permitCategories, setPermitCategories] = useState(DEFAULT_PERMITS);

  useEffect(() => {
    fetchApi('/permit-types')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const activePermits = data.filter(p => p.status === 'Active');
          if (activePermits.length > 0) {
            setPermitCategories(activePermits);
          }
        }
      })
      .catch(err => console.error("Error fetching permit types:", err));
  }, []);

  return (
    <>
      <section className="section-padding" style={{
        backgroundColor: 'var(--bg-white)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 0 6rem'
      }}>
        {/* Creative Background Image Watermark */}

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem auto' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Complete Singapore Customs Permit Coverage"
                mode="chars"
                style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 700, justifyContent: 'center' }}
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                We handle every Singapore Customs permit category with absolute regulatory accuracy and rapid TradeNet processing.
              </p>
            </FadeUp>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {permitCategories.map((permit, idx) => (
              <FadeUp key={idx} delay={0.1 + (idx * 0.05)} style={{ height: '100%' }}>
                <div
                  className="flip-card"
                  onClick={() => { setSelectedPermit(permit.title); setModalOpen(true); }}
                  style={{ height: '220px' }}
                >
                  <div className="flip-card-inner">
                    {/* Front of Card */}
                    <div className="flip-card-front" style={{
                      backgroundColor: '#F4F6F9',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{
                        width: '149px',
                        height: '149px',
                        flexShrink: 0,
                        borderRadius: '50%',
                        padding: '3px',
                        background: 'linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-pink) 50%, var(--brand-blue) 100%)',
                        overflow: 'hidden',
                        marginBottom: '1.25rem'
                      }}>
                        <img
                          src={permit.image || permit.img}
                          alt={permit.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      </div>
                      <h3 style={{
                        fontSize: '1.15rem',
                        color: 'var(--dark-navy)',
                        fontWeight: 800,
                        margin: 0,
                        lineHeight: 1.3,
                        textAlign: 'center'
                      }}>
                        {permit.title}
                      </h3>
                    </div>

                    {/* Back of Card */}
                    <div className="flip-card-back" style={{
                      backgroundColor: 'var(--dark-navy)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1.75rem',
                      boxShadow: 'var(--shadow-md)',
                      color: '#FFFFFF'
                    }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-blue-light)' }}>
                        {permit.title}
                      </h3>
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        {permit.description || permit.desc}
                      </p>

                      <button style={{
                        marginTop: 'auto',
                        alignSelf: 'center',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--dark-navy)',
                        border: 'none',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Apply Permit <ArrowUpRight size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>



        </div>

        <style>{`
          .flip-card {
            perspective: 1000px;
            cursor: pointer;
            width: 100%;
          }
          
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
          }
          
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}</style>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialService={selectedPermit || 'Permit Declaration'} />
    </>
  );
};

export default PermitTypes;
