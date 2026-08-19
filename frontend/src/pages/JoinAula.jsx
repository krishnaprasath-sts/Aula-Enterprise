import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, ChevronRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import FadeUp from '../components/common/FadeUp';
import TextReveal from '../components/common/TextReveal';
import JobApplicationModal from '../components/common/JobApplicationModal';
import { fetchApi } from '../config/api';

const heroBg = '/assets/ship.png';

const JoinAula = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await fetchApi('/jobs');
        setJobs(data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="careers-hero" style={{ 
        padding: '12rem 5% 6rem',
        background: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
      <Helmet>
        <title>Careers | AULA Permits Singapore</title>
        <meta name="description" content="Join our dynamic team of trade compliance experts and customs declarants. View open positions at AULA Permits Singapore." />
      </Helmet>
        {/* Abstract Background Elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 1 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', color: '#93C5FD', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Careers at AULA
            </div>
          </FadeUp>
          <TextReveal as="h1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Join The Future of <span style={{ color: 'var(--brand-blue)' }}>Trade & Logistics.</span>
          </TextReveal>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '3rem' }}>
              We are an established professional Singapore customs & trade compliance company looking for driven individuals to join our growing team.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Jobs Listing Section */}
      <section className="careers-listing" style={{ padding: '6rem 5%', backgroundColor: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="careers-listing-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Current Openings</h2>
              <p style={{ color: '#64748B' }}>Find your next role at AULA Permits</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748B' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: 'var(--brand-blue)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
              Loading current openings...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Briefcase size={48} style={{ color: '#CBD5E1', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>No Openings Right Now</h3>
              <p style={{ color: '#64748B' }}>We currently do not have any open positions. Please check back later!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {jobs.map((job, index) => (
                <FadeUp key={job.id} delay={index * 0.1}>
                  <div className="interactive job-card" style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '16px', 
                    padding: '2rem', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(37,99,235,0.1)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    {/* Header Row: Title + Status + Button */}
                    <div 
                      className="job-card-header"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}
                      onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                    >
                      <div>
                        <div className="job-card-title-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-navy)', margin: 0 }}>{job.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#059669', padding: '0.3rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></span>
                            {job.status.toUpperCase()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#64748B', fontSize: '0.95rem', marginBottom: expandedJobId === job.id ? '1.5rem' : '0' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> {job.department}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {job.location}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {job.employment_type}</span>
                        </div>
                      </div>
                      
                      <div className="job-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                        <button 
                          className="btn-primary"
                          style={{ padding: '0.75rem 2rem', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                        >
                          Apply Now
                        </button>
                        <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#F8FAFC', transition: 'background 0.2s' }}>
                          {expandedJobId === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {expandedJobId === job.id && (
                      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9', marginTop: '1.5rem', animation: 'modalFadeIn 0.3s ease-out' }}>
                        {job.description && (
                      <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>{job.description}</p>
                    )}

                    <div className="job-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                      {job.requirements && (
                        <div>
                          <h4 style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: '1.05rem' }}>Requirements:</h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                <Check size={16} style={{ color: 'var(--brand-blue)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {job.responsibilities && (
                        <div>
                          <h4 style={{ color: 'var(--dark-navy)', marginBottom: '1rem', fontSize: '1.05rem' }}>Responsibilities:</h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {job.responsibilities.split('\n').filter(r => r.trim()).map((res, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                <ChevronRight size={16} style={{ color: 'var(--brand-blue)', flexShrink: 0, marginTop: '2px' }} />
                                <span>{res}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedJob && (
        <JobApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
};

export default JoinAula;
