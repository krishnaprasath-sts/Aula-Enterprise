import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const JobApplicationModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    job_id: job.id,
    name: '',
    email: '',
    phone: '',
    experience_years: '',
    current_company: '',
    linkedin: '',
    cover_message: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Lock body scroll when modal mounts
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore the page's existing scroll setting when the modal unmounts.
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        setStatus('error');
        setMessage('File size exceeds 5MB limit. Please upload a smaller file.');
        return;
      }
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setStatus('error');
        setMessage('Invalid file type. Only PDF and Word documents are allowed.');
        return;
      }
      setResumeFile(file);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setStatus('error');
      setMessage('Please upload your resume.');
      return;
    }

    setStatus('loading');
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('resume', resumeFile);

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit application. Please try again.');
      }

      setStatus('success');
      setMessage('Your application has been submitted successfully! We will review your profile and get back to you shortly.');
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setMessage(err.message || 'Failed to submit application. Please try again later.');
    }
  };

  return (
    <div data-lenis-prevent="true" className="modal-overlay" onClick={handleOverlayClick} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', padding: '1rem', overflow: 'hidden' }}>
      <div className="modal-content job-application-modal" onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', width: '100%', maxWidth: '600px', maxHeight: 'calc(100dvh - 2rem)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', borderRadius: '16px 16px 0 0' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Apply for Position</h2>
            <p style={{ color: 'var(--brand-blue)', fontWeight: 600, fontSize: '0.95rem' }}>{job.title}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', minHeight: 0, overscrollBehavior: 'contain' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--dark-navy)', marginBottom: '1rem' }}>Application Sent!</h3>
              <p style={{ color: '#64748B', lineHeight: 1.6 }}>{message}</p>
            </div>
          ) : (
            <form id="applicationForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem' }}>
                  <AlertCircle size={20} />
                  <span>{message}</span>
                </div>
              )}

              <div className="application-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="John Doe" />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="john@example.com" />
                </div>
              </div>

              <div className="application-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="+65 9123 4567" />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Years of Experience <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="number" name="experience_years" required min="0" step="0.5" value={formData.experience_years} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="e.g. 3" />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Current/Recent Company</label>
                <input type="text" name="current_company" value={formData.current_company} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="Company Name" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>LinkedIn Profile (Optional)</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none' }} placeholder="https://linkedin.com/in/johndoe" />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Cover Message</label>
                <textarea name="cover_message" value={formData.cover_message} onChange={handleChange} rows="4" style={{ padding: '0.75rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none', resize: 'vertical' }} placeholder="Tell us why you are a great fit for this role..."></textarea>
              </div>

              {/* Resume Upload Area */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Upload Resume <span style={{ color: '#EF4444' }}>*</span> (PDF/DOCX max 5MB)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    border: (status === 'error' && !resumeFile) ? '2px dashed #EF4444' : '2px dashed #CBD5E1', 
                    borderRadius: '8px', 
                    padding: '2rem 1rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: '#F8FAFC',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--brand-blue)'; e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; }}
                >
                  <UploadCloud size={32} style={{ color: 'var(--brand-blue)', margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                    {resumeFile ? (
                      <span style={{ color: 'var(--brand-blue)', fontWeight: 500 }}>{resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    ) : (
                      'Click to upload or drag and drop'
                    )}
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer Actions */}
        {status !== 'success' && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#F8FAFC', borderRadius: '0 0 16px 16px' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', color: '#475569', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              form="applicationForm"
              disabled={status === 'loading'}
              style={{ padding: '0.75rem 2rem', background: 'var(--brand-blue)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {status === 'loading' ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Submitting...
                </>
              ) : 'Submit Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationModal;
