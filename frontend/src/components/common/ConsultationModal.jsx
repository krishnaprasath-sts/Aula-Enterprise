import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, Clock, FileText } from 'lucide-react';
import axios from 'axios';

const ConsultationModal = ({ isOpen, onClose, initialService = 'Permit Declaration' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    service: initialService,
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, service: initialService }));
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen, initialService]);

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
    setFiles(prev => [...prev, ...validFiles]);
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
        const res = await axios.post('http://localhost:5000/api/upload-multiple', uploadData);
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
      await axios.post('http://localhost:5000/api/enquiries', payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit the form. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      whatsapp: '',
      service: initialService,
      message: ''
    });
    setFiles([]);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 99999,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Modal Header Banner */}
            <div style={{
              backgroundColor: 'var(--dark-navy)',
              padding: '1.75rem 3.5rem 1.75rem 2rem',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'white',
                  marginBottom: '0.5rem',
                  borderBottom: '2px solid var(--brand-blue)',
                  paddingBottom: '0.2rem'
                }}>
                  <ShieldCheck size={14} /> Singapore Trade & Customs Consultation
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 700, margin: 0, }}>
                  Request a Trade Consultation
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  right: '2rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <X size={20} />
              </button>
            </div>

          {/* Modal Content */}
          <div style={{ padding: '3rem 2rem', maxWidth: '1800px', margin: '0 auto', paddingBottom: '6rem' }}>
            {submitted ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2.5rem', 
                  maxWidth: '500px', 
                  margin: '2rem auto',
                  background: '#F8FAFC',
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--brand-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', color: 'var(--dark-navy)', marginBottom: '1rem', fontWeight: 800 }}>
                    Consultation Request Received
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 2rem auto' }}>
                    Thank you. Our Singapore customs specialists will review your shipment details and reach out shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', borderRadius: '12px' }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. David Tan"
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: `1px solid ${errors.fullName ? '#ef4444' : 'var(--border-light)'}`,
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                      {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{errors.fullName}</span>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Global Logistics Pte Ltd"
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)',
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                       Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="david@company.com"
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-light)'}`,
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                      {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{errors.email}</span>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+65 9123 4567"
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border-light)'}`,
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                      {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+65 9123 4567"
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)',
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                        Service Required
                      </label>
                      <input
                        type="text"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="consultation-input"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)',
                          fontSize: '1rem',
                          outline: 'none',
                          background: '#F8FAFC'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                      Upload Documents (All formats supported, Max 1GB)
                    </label>
                    <input
                      type="file"
                      name="file"
                      multiple
                      accept="*/*"
                      onChange={handleFileChange}
                      className="consultation-input"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: `1px solid ${errors.file ? '#ef4444' : 'var(--border-light)'}`,
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        background: '#F8FAFC'
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
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                      Remarks
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Briefly describe your cargo, origin/destination, timeline or specific permit requirement..."
                      className="consultation-input"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-light)',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        background: '#F8FAFC',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {loading ? 'Submitting...' : <><Send size={18} /> Request Consultation</>}
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem'
                  }}>
                  </div>
                </form>
              )}
            </div>
            
            <style>{`
              .consultation-input {
                color: var(--dark-navy) !important;
                caret-color: var(--brand-blue) !important;
                background-color: #FFFFFF !important;
              }
              .consultation-input::placeholder {
                color: #9CA3AF !important;
              }
              .consultation-input:focus {
                border-color: var(--brand-blue) !important;
              }
            `}</style>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;
