import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Send, FileSearch, Edit3, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';
import FadeUp from '../common/FadeUp';
import TextReveal from '../common/TextReveal';

const PermitProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const timelineRef = useRef(null);

  const steps = [
    {
      num: '01',
      title: 'Share Shipment Details',
      desc: 'Provide commercial invoice, packing list, bill of lading / airway bill, and cargo specs.',
      detail: 'Submit your shipping invoice and packing details via email or portal. Our specialists review item descriptions and trade terms (Incoterms).',
      icon: Send
    },
    {
      num: '02',
      title: 'Document Review',
      desc: 'Our specialists audit HS Code classification, country of origin, and valuation accuracy.',
      detail: 'Verifying HS Codes and controlled goods compliance against Singapore Customs databases.',
      icon: FileSearch
    },
    {
      num: '03',
      title: 'Declaration Preparation',
      desc: 'Formulating exact TradeNet parameters, GST relief codes, and customs duty calculations.',
      detail: 'Drafting declaration parameters, applying GST relief schemes, and computing accurate customs duties.',
      icon: Edit3
    },
    {
      num: '04',
      title: 'Permit Submission',
      desc: 'Direct electronic transmission into Singapore TradeNet system for customs processing.',
      detail: 'Instant electronic lodgement with Singapore Customs & Controlling Agencies (AVA, HSA, SPF) for automated clearance authorization.',
      icon: ShieldCheck
    },
    {
      num: '05',
      title: 'Approval / Completion',
      desc: 'Customs approval issued with official permit number ready for cargo movement.',
      detail: 'Approved customs permit PDF and In-Permit copies delivered to your freight forwarder or logistics team for immediate clearance.',
      icon: CheckCircle2
    }
  ];

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start start', 'end end']
  });

  // Map directly to scrollYProgress since Lenis already provides smooth scrolling.
  // This eliminates double-smoothing which causes rubber-banding/jerks.
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let currentStep = 0;
    if (latest >= 0.99) currentStep = 4;
    else if (latest >= 0.75) currentStep = 3;
    else if (latest >= 0.50) currentStep = 2;
    else if (latest >= 0.25) currentStep = 1;

    if (currentStep !== activeStep) {
      setActiveStep(currentStep);
    }
  });

  const handleStepClick = (idx) => {
    setActiveStep(idx);
  };

  return (
    <>
      <section style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
        <style>{`
          .permit-timeline-scroll {
            height: 230vh;
            position: relative;
          }

          .permit-timeline-sticky {
            position: sticky;
            top: 0;
            height: 100svh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem 0;
          }

          @media (max-width: 768px) {
            .permit-timeline-scroll {
              height: 150vh; /* Reduced height for faster mobile scroll */
            }

            .permit-timeline-sticky {
              padding: 5rem 0 2rem; /* Give space for navbar */
            }
          }
        `}</style>
        <div className="container">

          {/* Scroll-driven Process Timeline */}
          <div ref={timelineRef} className="permit-timeline-scroll">
            <div className="permit-timeline-sticky">
              {/* Section Header */}
              <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
                <TextReveal
                  text="Permit Declaration, Made Simple."
                  style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 700, justifyContent: 'center' }}
                />

                <FadeUp delay={0.2}>
                  <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                    AULA Permits helps businesses manage the documentation and declaration requirements involved in moving goods into, out of and through Singapore.
                  </p>
                </FadeUp>
              </div>

              <FadeUp delay={0.3}>
                <div style={{
                  position: 'relative',
                  marginBottom: '1.5rem',
                  overflowX: 'auto',
                  paddingBottom: '1rem',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none'
                }}>
                  <style>{`
                .process-scroll-container::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

                  <div style={{ position: 'relative' }} className="process-scroll-container">
                    {/* Progress Line */}
                    <div className="process-line" style={{
                      position: 'absolute',
                      top: '38px',
                      left: '10%',
                      right: '10%',
                      height: '3px',
                      backgroundColor: 'var(--border-subtle)',
                      zIndex: 0
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          width: progressWidth,
                          backgroundColor: 'var(--brand-blue)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>

                    {/* Steps Grid */}
                    <div className="process-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: 0,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {steps.map((step, idx) => {
                        const isActive = activeStep === idx;
                        const isPassed = idx <= activeStep;
                        const IconComp = step.icon;

                        return (
                          <div
                            key={idx}
                            onClick={() => handleStepClick(idx)}
                            onMouseEnter={() => handleStepClick(idx)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            {/* Circle Node */}
                            <div className="step-circle" style={{
                              width: '76px',
                              height: '76px',
                              borderRadius: '50%',
                              backgroundColor: isActive ? 'var(--brand-blue)' : (isPassed ? 'var(--dark-navy)' : '#FFFFFF'),
                              color: isActive || isPassed ? '#FFFFFF' : 'var(--text-muted)',
                              border: isActive ? '4px solid var(--brand-blue-light)' : '2px solid var(--border-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '1.25rem',
                              boxShadow: isActive ? 'var(--shadow-blue-glow)' : 'var(--shadow-sm)',
                              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                              <IconComp className="step-icon" size={28} />
                            </div>

                            {/* Step Number & Title */}
                            <span className="step-num" style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: isActive ? 'var(--brand-blue)' : 'var(--text-muted)',
                              letterSpacing: '0.05em',
                              marginBottom: '0.35rem'
                            }}>
                              STEP {step.num}
                            </span>

                            <h4 className="step-title" style={{
                              fontSize: '1rem',
                              fontWeight: isActive ? 700 : 600,
                              color: isActive ? 'var(--dark-navy)' : 'var(--text-secondary)',
                              lineHeight: 1.35
                            }}>
                              {step.title}
                            </h4>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Active Step Description Card */}
              <FadeUp delay={0.4}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      maxWidth: '850px',
                      margin: '0 auto',
                      backgroundColor: 'var(--brand-blue-subtle)',
                      border: '1px solid var(--border-blue)',
                      borderRadius: '20px',
                      padding: '2.25rem 2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    className="process-card-padding"
                  >
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          backgroundColor: 'var(--brand-blue)',
                          color: '#FFFFFF',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          Step {steps[activeStep].num}
                        </span>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', margin: 0 }}>
                          {steps[activeStep].title}
                        </h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', margin: 0, lineHeight: 1.6 }}>
                        {steps[activeStep].detail}
                      </p>
                    </div>

                    <button
                      onClick={() => setModalOpen(true)}
                      className="btn-primary"
                      style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      Get Started <ArrowRight size={18} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </FadeUp>
            </div>
          </div>

        </div>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default PermitProcess;
