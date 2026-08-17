import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ArrowRight, Send } from 'lucide-react';
import ConsultationModal from '../components/common/ConsultationModal';
import FadeUp from '../components/common/FadeUp';
import TextReveal from '../components/common/TextReveal';
import LeadCTA from '../components/home/LeadCTA';

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--dark-navy)',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none'
        }}
      >
        <span>{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronDown size={20} color="var(--brand-blue)" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.5rem 1.5rem 1.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
              lineHeight: 1.65,
              borderTop: '1px solid var(--border-subtle)'
            }}>
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PermitDeclaration = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const documentChecklist = [
    { title: 'Bill of Lading / Airway Bill', desc: 'Transport document confirming carrier receipt, vessel/flight details, port of loading/discharge.' },
    { title: 'Commercial Invoice', desc: 'Must specify buyer/seller details, itemized descriptions, unit prices, currency, and Incoterms.' },
    { title: 'Packing List', desc: 'Detailed breakdown of package count, gross/net weight, dimensions, and marks & numbers.' },
    { title: 'Harmonized System (HS) Codes', desc: '8-digit Singapore Trade Classification, Customs & Excise Tariff (STCET) codes.' },
    { title: 'Controlling Agency Approvals', desc: 'Licences or approvals from AVA, HSA, SPF, or SFA for controlled or restricted goods.' },
    { title: 'Booking Confirmation', desc: 'Official confirmation of space booked on a vessel, flight, or other transport method.' },
    { title: 'Notice of Arrival', desc: 'Notification from the carrier or agent indicating the expected arrival of the cargo.' }
  ];

  const faqs = [
    {
      q: 'What is a Singapore Customs Permit Declaration?',
      a: 'A Singapore Customs permit is an official electronic authorization required before commercial goods can be imported into, exported out of, or transhipped through Singapore. Declarations are submitted electronically through TradeNet.'
    },
    {
      q: 'How fast can AULA Permits process a permit declaration?',
      a: 'Standard permits with complete documentation are submitted to TradeNet and approved within minutes to 2 hours. For controlled goods requiring Controlling Agency (CA) review, approval times depend on the specific agency clearance.'
    },
    {
      q: 'When is GST payable on imported goods in Singapore?',
      a: 'GST is payable at the time of import declaration unless the importer is registered under a GST suspension scheme such as the Major Exporter Scheme (MES) or goods are stored in a licensed/bonded warehouse.'
    },
    {
      q: 'What are Strategic Goods Permits in Singapore?',
      a: 'Under the Strategic Goods Control Act (SGCA), dual-use items, commercial electronics with encryption, or specialized hardware require Strategic Goods Permits prior to export, transhipment, or re-export.'
    },
    {
      q: 'What happens if a permit declaration contains errors?',
      a: 'Inaccurate declarations can result in Singapore Customs audits, shipment detention at port checkpoints, fines, or loss of MES privileges. AULA Permits conducts pre-filing audits to guarantee 100% filing accuracy.'
    }
  ];

  return (
    <>
      <div style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>

        {/* Page Hero */}
        <section style={{ backgroundColor: 'var(--brand-blue-subtle)', padding: '5.5rem 0', borderBottom: '1px solid var(--border-blue)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Singapore Permit Declaration Services"
                mode="chars"
                style={{ color: 'var(--dark-navy)', marginBottom: '1.25rem', fontSize: '2.5rem', fontWeight: 800 }}
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Comprehensive TradeNet permit filing for Import, Export, GST Relief, Transhipment, Strategic Goods, and Certificates of Origin.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button onClick={() => setModalOpen(true)} className="btn-primary">
                  Apply for Permit <ArrowRight size={18} />
                </button>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Required Document Checklist Section */}
        <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ textAlignment: 'center', textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
              <FadeUp delay={0.1}>
                <TextReveal
                  text="What Is Needed for Your Declaration"
                  mode="lines"
                  style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: '2rem', fontWeight: 700 }}
                />
              </FadeUp>
              <FadeUp delay={0.2}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  To ensure zero delays at Singapore checkpoints, our declaring specialists require the following core transport documents:
                </p>
              </FadeUp>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {documentChecklist.map((item, idx) => (
                <FadeUp key={idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
                  <div
                    className="card-clean"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--brand-blue)',
                      textTransform: 'uppercase'
                    }}>
                      <FileText size={16} /> Required Doc #{idx + 1}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', fontWeight: 700, margin: 0 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="section-padding" style={{ backgroundColor: 'var(--brand-blue-subtle)' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <FadeUp delay={0.1}>
                <TextReveal
                  text="Singapore Customs FAQs"
                  mode="words"
                  style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: '2rem', fontWeight: 700 }}
                />
              </FadeUp>
              <FadeUp delay={0.2}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  Common questions regarding permit rules, GST declarations, and TradeNet clearance.
                </p>
              </FadeUp>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <FadeUp key={idx} delay={0.1 + (idx * 0.05)}>
                    <FaqItem
                      faq={faq}
                      isOpen={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    />
                  </FadeUp>
                );
              })}
            </div>

          </div>
        </section>

        {/* Lead Conversion CTA */}
        <LeadCTA
          title="Need an Immediate Singapore Customs Permit?"
          description="Speak with our declaring agent team for fast, accurate electronic filings into Singapore TradeNet."
          buttonText="Submit Permit Request"
        />

      </div>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default PermitDeclaration;
