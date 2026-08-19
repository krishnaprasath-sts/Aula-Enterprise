import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import axios from 'axios';
import FadeUp from '../components/common/FadeUp';
import TextReveal from '../components/common/TextReveal';
import { API_BASE_URL } from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    service: 'Permit Declaration',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [contactInfo] = useState({
    phone1: '+65 8322 5509',
    phone2: '+65 8370 1443',
    whatsapp: '+65 8919 7865',
    email: 'permits@aulaenterprises.com',
    address: '26 Upper Dickson Road, Singapore 207478',
    operatingHours: 'Mon - Fri: 08:30 AM - 06:30 PM | Sat: 09:00 AM - 01:00 PM',
    emergencySupport: '24/7 Urgent Permit Standby Available',
    companyName: 'AULA Permits Pte. Ltd.',
    googleMapsUrl: 'https://maps.google.com/?q=26+Upper+Dickson+Road+Singapore+207478'
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'fullName') {
      // Only allow letters, spaces, hyphens, and apostrophes
      value = value.replace(/[^a-zA-Z\s\-']/g, '');
    } else if (name === 'phone') {
      // Only allow numbers, plus, spaces, dashes, and parentheses
      value = value.replace(/[^0-9+\-\s()]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let validFiles = [];
    let sizeError = false;
    for (let f of selectedFiles) {
      if (f.size > 1024 * 1024 * 1024) {
        sizeError = true;
      } else {
        validFiles.push(f);
      }
    }
    // Filter out duplicates (same name and size)
    setFiles(prev => {
      const existingMap = new Set(prev.map(item => `${item.name}-${item.size}`));
      const nonDuplicates = validFiles.filter(item => !existingMap.has(`${item.name}-${item.size}`));
      return [...prev, ...nonDuplicates];
    });
    if (sizeError) {
      setErrors(prev => ({ ...prev, file: 'Some files exceed 1GB limit and were skipped.' }));
    } else {
      setErrors(prev => ({ ...prev, file: '' }));
    }
    e.target.value = null; // Clear input to allow re-selecting the same file if needed
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (formData.phone.length < 8) {
      newErrors.phone = 'Valid phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let attachmentsJSON = '';
      if (files.length > 0) {
        const uploadData = new FormData();
        files.forEach(f => uploadData.append('mediaFiles', f));
        const res = await axios.post(`${API_BASE_URL}/upload-multiple`, uploadData);
        if (res.data.urls) {
          attachmentsJSON = JSON.stringify(res.data.urls);
        }
      }

      const payload = {
        name: formData.fullName,
        company: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        serviceNeeded: formData.service,
        message: formData.message,
        attachments: attachmentsJSON
      };
      await axios.post(`${API_BASE_URL}/contact-submissions`, payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit the form. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '7rem', width: '100%', overflowX: 'clip' }}>
      <Helmet>
        <title>Contact Us | AULA Permits Singapore</title>
        <meta name="description" content="Get in touch with AULA Permits for all your Singapore customs clearance, import/export permits, and trade documentation needs." />
      </Helmet>

      {/* Page Hero */}
      <section style={{ backgroundColor: 'var(--brand-blue-subtle)', padding: '5rem 0', borderBottom: '1px solid var(--border-blue)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <FadeUp delay={0.1}>
            <TextReveal
              text="Let’s Simplify Your Trade."
              mode="chars"
              style={{ color: 'var(--dark-navy)', marginBottom: '1.25rem', fontSize: '2.5rem', fontWeight: 800 }}
            />
          </FadeUp>
          <FadeUp delay={0.2}>
            <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Speak with our Singapore customs specialists. No obligations—just expert advice tailored to your business shipments.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Main Grid: Contact Info + High-Converting Form */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
            alignItems: 'start'
          }} className="contact-page-grid">

            {/* Left Contact Details Panel */}
            <div>
              <FadeUp delay={0.1}>
                <TextReveal
                  text="Singapore Customs Support Hotline"
                  mode="words"
                  style={{ color: 'var(--dark-navy)', marginBottom: '1.25rem', fontSize: '2rem', fontWeight: 700 }}
                />
              </FadeUp>
              <FadeUp delay={0.2}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  Whether you require a one-time import/export permit declaration or ongoing trade compliance management, our team is available 24/7 to assist.
                </p>
              </FadeUp>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>

                <FadeUp delay={0.3}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Phone size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        24/7 Telephone Hotline
                      </span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <a href={`tel:${contactInfo.phone1.replace(/[^0-9+]/g, '')}`}>{contactInfo.phone1}</a>
                        <a href={`tel:${contactInfo.phone2.replace(/[^0-9+]/g, '')}`}>{contactInfo.phone2}</a>
                      </div>
                    </div>
                  </div>
                </FadeUp>

                <FadeUp delay={0.4}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Mail size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Official Email Enquiries
                      </span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
                        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                      </div>
                    </div>
                  </div>
                </FadeUp>

                <FadeUp delay={0.5}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MapPin size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Singapore Head Office
                      </span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--dark-navy)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {contactInfo.address}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeUp>

                <FadeUp delay={0.6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Operating Hours
                      </span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--dark-navy)', marginTop: '0.2rem' }}>
                        {contactInfo.operatingHours}
                      </div>
                    </div>
                  </div>
                </FadeUp>

              </div>

              <FadeUp delay={0.7}>
                <div style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'var(--brand-blue-subtle)',
                  border: '1px solid var(--border-blue)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: 'var(--dark-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <ShieldCheck size={24} color="var(--brand-blue)" />
                  <span><strong>UEN:</strong> {contactInfo.uenNumber} | Registered Singapore Declaring Agent</span>
                </div>
              </FadeUp>
            </div>

            {/* Right Lead Conversion Form Panel */}
            <FadeUp delay={0.3} style={{ height: '100%' }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                height: '100%'
              }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto'
                    }}>
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--dark-navy)', marginBottom: '0.75rem' }}>
                      Enquiry Submitted
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '440px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                      Thank you. Our team will get back to you shortly with pricing and declaration guidance.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ fullName: '', companyName: '', email: '', phone: '', service: 'Permit Declaration', message: '' });
                        setFiles([]);
                        setErrors({});
                      }}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.6rem', color: 'var(--dark-navy)', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Request Trade Consultation / Quote
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                        Fill out your shipment details for prompt assistance from our declaring agent team.
                      </p>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 900, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          Full Name <span style={{ color: '#EF4444', fontWeight: 900, marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Tan"
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: `1px solid ${errors.fullName ? '#ef4444' : 'var(--border-light)'}`,
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                        {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{errors.fullName}</span>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Your Company Pte Ltd"
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: `1px solid var(--border-light)`,
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 900, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          Email Address <span style={{ color: '#EF4444', fontWeight: 900, marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-light)'}`,
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                        {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{errors.email}</span>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 900, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          Phone Number <span style={{ color: '#EF4444', fontWeight: 900, marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+65 9123 4567"
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border-light)'}`,
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                        {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{errors.phone}</span>}
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="+65 9123 4567"
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.95rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                          Service Required
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <option value="Import Permit">Import Permits</option>
                          <option value="Export Permit">Export Permits</option>
                          <option value="GST & Transhipment">GST & Transhipment Permits</option>
                          <option value="Strategic Goods Permit">Strategic Goods Permits</option>
                          <option value="Certificate of Origin">Certificate of Origin (COO)</option>
                          <option value="Customs Compliance Consultation">Customs Compliance Consultation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                        Upload Documents (All formats supported, Max 1GB)
                      </label>
                      <input
                        type="file"
                        name="file"
                        multiple
                        accept="*/*"
                        onChange={handleFileChange}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: `1px solid ${errors.file ? '#ef4444' : 'var(--border-light)'}`,
                          fontSize: '0.95rem',
                          outline: 'none',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                      />
                      {errors.file && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{errors.file}</span>}
                      {files.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{ color: 'var(--brand-blue)', fontSize: '0.85rem', fontWeight: 600 }}>Selected ({files.length}): </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.6rem' }}>
                            {files.map((f, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', border: '1px solid var(--border-light)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '85%' }}>{f.name}</span>
                                <button type="button" onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem' }} title="Remove file">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button type="button" onClick={() => setFiles([])} style={{ display: 'block', marginTop: '0.5rem', color: '#ef4444', background: 'none', border: 'none', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>
                            Clear All Files
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.4rem' }}>
                        Remarks
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your cargo (origin, destination, item description, timeline)..."
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.95rem',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem' }}
                    >
                      {loading ? 'Sending...' : <><Send size={18} /> Send Enquiry</>}
                    </button>

                  </form>
                )}
              </div>
            </FadeUp>

          </div>

          {/* Interactive Map Section */}
          <FadeUp delay={0.5}>
            <div style={{
              marginTop: '4rem',
              width: '100%',
              height: '450px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF'
            }}>
              <iframe
                src={contactInfo.googleMapsUrl?.includes('/embed') ? contactInfo.googleMapsUrl : `https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address || 'Singapore')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </FadeUp>

        </div>

        <style>{`
          @media (min-width: 992px) {
            .contact-page-grid {
              grid-template-columns: 1fr 1.15fr !important;
            }
          }
          @media (max-width: 640px) {
            .form-row-2 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

    </div>
  );
};

export default Contact;
