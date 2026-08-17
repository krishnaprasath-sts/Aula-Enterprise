import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ConsultationModal from '../components/common/ConsultationModal';
import FadeUp from '../components/common/FadeUp';
import TextReveal from '../components/common/TextReveal';
import LeadCTA from '../components/home/LeadCTA';
import logisticImg from '../assets/logistic.jpg';

const Services = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        if (isMounted) {
          const activeServices = data.filter(s => s.status === 'Active');
          setServices(activeServices);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchServices();
    
    // Poll every 5 seconds for live updates
    const intervalId = setInterval(fetchServices, 5000);
    
    // Also fetch immediately when user switches back to this tab
    window.addEventListener('focus', fetchServices);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener('focus', fetchServices);
    };
  }, []);

  return (
    <>
      <div style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>

        {/* Page Hero with Logistics Background */}
        <section style={{
          position: 'relative',
          padding: '6.5rem 0',
          backgroundImage: `linear-gradient(rgba(11, 18, 32, 0.85), rgba(11, 18, 32, 0.88)), url(${logisticImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: '#FFFFFF',
          borderBottom: '1px solid var(--border-blue)'
        }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
            <FadeUp delay={0.1}>
              <TextReveal
                text="Comprehensive Trade & Customs Services"
                mode="lines"
                style={{ color: '#FFFFFF', marginBottom: '1.25rem', fontSize: '2.5rem', fontWeight: 800 }}
              />
            </FadeUp>

            <FadeUp delay={0.2}>
              <p style={{ fontSize: '1.18rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7 }}>
                From single permit declarations to ongoing trade compliance management, AULA Permits delivers precision across every facet of Singapore trade.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Services List Section */}
        <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="container">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading services...</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2.5rem'
              }}>
                {services.map((service, idx) => (
                  <FadeUp key={service.id || idx} delay={0.1 + (idx * 0.1)} style={{ height: '100%' }}>
                    <div
                      className="card-clean"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        height: '100%'
                      }}
                    >
                      <div>
                        {service.image && (
                          <div style={{
                            width: '100%',
                            height: '200px',
                            marginBottom: '1.5rem',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)'
                          }}>
                            <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} className="service-img-hover" />
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', fontWeight: 700, margin: 0 }}>
                            {service.title}
                          </h3>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                          {service.shortDesc}
                        </p>
                        
                        {/* Render processing time instead of missing details array */}
                        {service.processingTime && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '0.88rem', color: 'var(--dark-navy)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-blue)' }} />
                              Turnaround: {service.processingTime}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => { setSelectedService(service.title); setModalOpen(true); }}
                        className="btn-secondary"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Enquire for Service <ArrowRight size={16} />
                      </button>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lead CTA Banner */}
        <LeadCTA
          title="Need Tailored Customs Support?"
          description="Speak with our senior customs advisors regarding your company’s trade volume and permit requirements."
          buttonText="Request a Consultation"
        />

      </div>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialService={selectedService || 'Permit Declaration'} />
    </>
  );
};

export default Services;
