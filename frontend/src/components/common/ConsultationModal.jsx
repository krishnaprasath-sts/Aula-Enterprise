import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, Clock, CloudUpload, User, FileText, MessageSquare, Zap, Headphones, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const COUNTRY_CODES = [
  { code: '+65', image: '/assets/flags/singapore.png', name: 'SG', placeholder: '9123 4567' },
  { code: '+60', image: '/assets/flags/malaysia.png', name: 'MY', placeholder: '12-345 6789' },
  { code: '+91', image: '/assets/flags/india.png', name: 'IN', placeholder: '98765 43210' },
  { code: '+971', image: '/assets/flags/uae.png', name: 'UAE', placeholder: '50 123 4567' }
];

const ConsultationModal = ({ isOpen, onClose, initialService = 'Permit Declaration' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phoneCode: '+65',
    phone: '',
    whatsappCode: '+65',
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
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen, initialService]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'fullName') {
      value = value.replace(/[^a-zA-Z\s\-']/g, '');
    } else if (name === 'phone' || name === 'whatsapp') {
      value = value.replace(/[^0-9+\-\s()]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let validFiles = [];
    let sizeError = false;
    for (let f of selectedFiles) {
      if (f.size > 10 * 1024 * 1024) { // 10MB limit per design
        sizeError = true;
      } else {
        validFiles.push(f);
      }
    }
    setFiles(prev => {
      const existingMap = new Set(prev.map(item => `${item.name}-${item.size}`));
      const nonDuplicates = validFiles.filter(item => !existingMap.has(`${item.name}-${item.size}`));
      return [...prev, ...nonDuplicates];
    });
    if (sizeError) {
      setErrors(prev => ({ ...prev, file: 'Some files exceed 10MB limit and were skipped.' }));
    } else {
      setErrors(prev => ({ ...prev, file: '' }));
    }
    e.target.value = null;
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
    if (!validate()) {
      // scroll to top of form if error
      const formEl = document.getElementById('consultation-form-top');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setLoading(true);
    try {
      let attachmentsJSON = '';
      const actualFiles = files.filter(f => f !== null);
      if (actualFiles.length > 0) {
        const uploadData = new FormData();
        actualFiles.forEach(f => uploadData.append('mediaFiles', f));
        const res = await axios.post(`${API_BASE_URL}/upload-multiple`, uploadData);
        if (res.data.urls) {
          attachmentsJSON = JSON.stringify(res.data.urls);
        }
      }

      const payload = {
        name: formData.fullName,
        company: formData.companyName,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phone}`,
        whatsapp: `${formData.whatsappCode} ${formData.whatsapp}`,
        serviceNeeded: formData.service,
        message: formData.message,
        attachments: attachmentsJSON
      };
      await axios.post(`${API_BASE_URL}/enquiries`, payload);
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
      fullName: '', companyName: '', email: '', phone: '', whatsapp: '', service: initialService, message: ''
    });
    setFiles([]);
    setErrors({});
    onClose();
  };

  const sgFlagIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj48cmVjdCBmaWxsPSIjZWQyOTM5IiB3aWR0aD0iOTAwIiBoZWlnaHQ9IjMwMCIvPjxyZWN0IGZpbGw9IiNmZmYiIHk9IjMwMCIgd2lkdGg9IjkwMCIgaGVpZ2h0PSIzMDAiLz48cGF0aCBkPSJNMjQzLjMgMTc1LjJhODMuNCA4My40IDAgMSAwIDAgMTQ5LjYgMTAwIDEwMCAwIDEgMSAwLTE0OS42eiIgZmlsbD0iI2ZmZiIvPjxnIGZpbGw9IiNmZmYiPjxwb2x5Z29uIHBvaW50cz0iMjg3LjEsMTQwLjggMjczLjMsMTgzLjIgMzA5LjMsMTU3LjEgMjY0LjgsMTU3LjEgMzAwLjksMTgzLjIiLz48cG9seWdvbiBwb2ludHM9IjM1My45LDE2OS42IDMyNi40LDE5Ny4xIDM2NSwxODYuNCAzMjYuNCwxNzUuNyAzNTMuOSwyMDMuMiIvPjxwb2x5Z29uIHBvaW50cz0iMzc5LjgsMjI5IDM0MiwyMjkgMzcyLjIsMjUwLjUgMzYwLjcsMjE1IDM0OS4yLDI1MC41Ii8+PHBvbHlnb24gcG9pbnRzPSIzNTMuOSwyODguNSAzMjYuNCwyNjEgMzY1LDI3MS43IDMyNi40LDI4Mi40IDM1My45LDI1NC45Ii8+PHBvbHlnb24gcG9pbnRzPSIyODcuMSwzMTcuMiAyNzMuMywyNzQuOCAzMDkuMywzMDEgMjY0LjgsMzAxIDMwMC45LDI3NC44Ii8+PC9nPjwvc3ZnPg==";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#020817', // Dark navy background
            zIndex: 99999, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100, width: '44px', height: '44px',
                borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              <X size={24} />
            </button>

            {/* Hero Section */}
            <div style={{
              position: 'relative', width: '100%', minHeight: '350px', paddingTop: '4rem', paddingBottom: '6rem',
              background: '#0B1120',
              borderBottom: 'none',
              boxShadow: 'none',
              overflow: 'hidden'
            }}>
              {/* Extended Image Container */}
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: '90%',
                backgroundImage: 'url("/assets/form.png")', backgroundSize: 'contain', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat',
                zIndex: 1
              }} />

              {/* Gradient Overlay over the image */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                background: 'linear-gradient(to right, #0B1120 0%, #0B1120 45%, transparent 60%)'
              }} />

              <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(30, 58, 138, 0.6)', border: '1px solid rgba(96, 165, 250, 0.4)', borderRadius: '20px', color: '#93C5FD', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(4px)' }}>
                  <ShieldCheck size={16} /> SINGAPORE TRADE & CUSTOMS PERMIT
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 0.5rem 0', maxWidth: '700px', letterSpacing: '-1px' }}>
                  <span style={{ background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    APPLY PERMIT INSTANTLY
                  </span><br />
                  <span style={{ color: '#FFFFFF' }}>WITHIN</span> <span style={{ color: '#FBBF24' }}>30 MINS</span> <Zap size={36} color="#FBBF24" style={{ display: 'inline', verticalAlign: 'middle', marginTop: '-8px' }} />
                </h1>
                <p style={{ color: '#E2E8F0', fontSize: '1.05rem', lineHeight: 1.5, maxWidth: '500px', margin: '0 0 1.5rem 0' }}>
                  <strong style={{ color: '#FFFFFF' }}>Fast. Secure. Reliable.</strong><br />
                  We process your permit application instantly and keep your business moving.
                </p>

                {/* Badges Row */}
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {[
                    { icon: <ShieldCheck size={18} color="#60A5FA" />, title: '100% SECURE', sub: 'YOUR DATA IS', desc: 'SAFE & PROTECTED' },
                    { icon: <Zap size={18} color="#60A5FA" />, title: 'FAST PROCESS', sub: 'PERMITS READY', desc: 'WITHIN 30 MINS' },
                    { icon: <Clock size={18} color="#60A5FA" />, title: '24/7 SERVICE', sub: 'WE ARE ALWAYS', desc: 'HERE TO HELP' }
                  ].map((badge, i) => (
                    <div key={i} style={{
                      background: 'rgba(2, 8, 23, 0.6)', border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)',
                      borderRadius: '12px', padding: '0.75rem', width: '140px', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                    }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {badge.icon}
                      </div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800 }}>{badge.title}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, marginTop: '2px', lineHeight: 1.2 }}>
                          {badge.sub}<br />{badge.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Form Area */}
            <div id="consultation-form-top" className="consultation-page-form" style={{ maxWidth: '1200px', margin: '-5rem auto 4rem auto', position: 'relative', zIndex: 20, padding: '0 2rem' }}>

              {/* Progress Bar Removed per user request */}

              {submitted ? (
                <div style={{ background: '#0F172A', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Consultation Request Received</h3>
                  <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>Thank you. Our customs specialists will review your shipment details and contact you shortly.</p>
                  <button onClick={resetForm} style={{ background: '#3B82F6', color: '#FFF', border: 'none', padding: '1rem 3rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                </div>
              ) : (
                <div style={{ background: 'linear-gradient(145deg, rgba(11,17,32,0.95) 0%, rgba(6,10,20,0.98) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1)' }}>
                  <form onSubmit={handleSubmit}>

                    {/* Your Details Header */}
                    <div style={{ padding: '2rem 2.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <h2 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <User size={24} color="#3B82F6" /> YOUR DETAILS
                      </h2>
                    </div>

                    <div style={{ padding: '2rem 2.5rem' }}>
                      <div className="consultation-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        {/* Name */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. David Tan" style={{ width: '100%', padding: '1rem 1.25rem', background: '#020817', border: `1px solid ${errors.fullName ? '#ef4444' : 'rgba(59, 130, 246, 0.3)'}`, borderRadius: '12px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                          {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                        </div>

                        {/* Company */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Company Name <span style={{ color: '#94A3B8', fontWeight: 500 }}>(Optional)</span></label>
                          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Global Logistic Pte Ltd" style={{ width: '100%', padding: '1rem 1.25rem', background: '#020817', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                        </div>

                        {/* Email */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. david@company.com" style={{ width: '100%', padding: '1rem 1.25rem', background: '#020817', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(59, 130, 246, 0.3)'}`, borderRadius: '12px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                          {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                          <div style={{ display: 'flex', background: '#020817', border: `1px solid ${errors.phone ? '#ef4444' : 'rgba(59, 130, 246, 0.3)'}`, borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(255,255,255,0.02)', paddingLeft: '1rem', position: 'relative' }}>
                              <img src={COUNTRY_CODES.find(c => c.code === formData.phoneCode)?.image || '/assets/flags/singapore.png'} alt="Flag" style={{ width: '22px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                              <select name="phoneCode" value={formData.phoneCode} onChange={handleChange} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', padding: '0 0.25rem 0 0.5rem', height: '100%', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', zIndex: 2 }}>
                                {COUNTRY_CODES.map(c => (
                                  <option key={`phone-${c.name}`} value={c.code} style={{ background: '#020817', color: '#FFF' }}>{c.name} ({c.code})</option>
                                ))}
                              </select>
                              <ChevronDown size={14} color="#94A3B8" style={{ marginRight: '8px', pointerEvents: 'none' }} />
                            </div>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={COUNTRY_CODES.find(c => c.code === formData.phoneCode)?.placeholder || '9123 4567'} style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                          </div>
                          {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                        </div>

                        {/* WhatsApp */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>WhatsApp Number <span style={{ color: '#EF4444' }}>*</span></label>
                          <div style={{ display: 'flex', background: '#020817', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(255,255,255,0.02)', paddingLeft: '1rem', position: 'relative' }}>
                              <img src={COUNTRY_CODES.find(c => c.code === formData.whatsappCode)?.image || '/assets/flags/singapore.png'} alt="Flag" style={{ width: '22px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
                              <select name="whatsappCode" value={formData.whatsappCode} onChange={handleChange} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', padding: '0 0.25rem 0 0.5rem', height: '100%', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', zIndex: 2 }}>
                                {COUNTRY_CODES.map(c => (
                                  <option key={`wa-${c.name}`} value={c.code} style={{ background: '#020817', color: '#FFF' }}>{c.name} ({c.code})</option>
                                ))}
                              </select>
                              <ChevronDown size={14} color="#94A3B8" style={{ marginRight: '8px', pointerEvents: 'none' }} />
                            </div>
                            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder={COUNTRY_CODES.find(c => c.code === formData.whatsappCode)?.placeholder || '9123 4567'} style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                          </div>
                        </div>

                        {/* Service Required */}
                        <div>
                          <label style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Service Required <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="service" value={formData.service} onChange={handleChange} placeholder="e.g. Customs Clearance" style={{ width: '100%', padding: '1rem 1.25rem', background: '#020817', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }} />
                        </div>
                      </div>

                      {/* Upload Documents */}
                      <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <FileText size={20} color="#60A5FA" /> UPLOAD DOCUMENTS
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>You may upload multiple documents. All formats supported. Max file size 10MB each.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>

                          {/* Dynamically render uploaded files */}
                          {files.map((f, i) => (
                            <div key={i} style={{
                              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '12px', padding: '1.5rem 1rem',
                              textAlign: 'center', position: 'relative', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1)'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={28} color="#34D399" />
                                <div style={{ color: '#FFFFFF', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: 600 }}>
                                  {f.name}
                                </div>
                                <button type="button" onClick={() => removeFile(i)} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 16px', borderRadius: '12px', fontSize: '0.7rem', cursor: 'pointer', marginTop: '4px', transition: 'background 0.2s' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                                >Remove</button>
                              </div>
                            </div>
                          ))}

                          {/* Always show an "Upload More" box */}
                          <div style={{
                            background: 'rgba(59, 130, 246, 0.05)', border: '2px dashed rgba(96, 165, 250, 0.5)', borderRadius: '12px', padding: '1.5rem 1rem',
                            textAlign: 'center', position: 'relative', transition: 'all 0.3s', cursor: 'pointer'
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.borderColor = '#60A5FA'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'; e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'; }}
                          >
                            <CloudUpload size={28} color="#60A5FA" style={{ margin: '0 auto 0.75rem auto' }} />
                            <div style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Add Document</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>Drag & drop or</div>
                            <div style={{ display: 'inline-block', background: '#3B82F6', color: '#FFF', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '12px', marginTop: '0.5rem', fontWeight: 600 }}>Choose File</div>
                            <input type="file" multiple onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                          </div>
                        </div>
                        {errors.file && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>{errors.file}</span>}

                        <div style={{ marginTop: '1.5rem', background: '#020817', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={22} color="#FFFFFF" />
                          </div>
                          <div>
                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 800 }}>Uploaded Documents</div>
                            <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '2px' }}>
                              {files.length > 0
                                ? `${files.length} document(s) uploaded ready for review.`
                                : 'No documents uploaded yet. Upload your documents to proceed.'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <MessageSquare size={20} color="#3B82F6" /> REMARKS <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 500, textTransform: 'none' }}>(Optional)</span>
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1rem' }}>Briefly describe your cargo, origin/destination, timeline or specific permit requirement...</p>
                        <textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Type your message here..." style={{ width: '100%', padding: '1.25rem', background: '#020817', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
                      </div>

                    </div>

                    {/* Footer Buttons */}
                    <div className="consultation-submit-area" style={{ padding: '0 2.5rem 3rem 2.5rem', display: 'flex', justifyContent: 'center', background: 'transparent' }}>
                      <button type="submit" className="consultation-submit-button" disabled={loading} style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: '#FFFFFF', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)', transition: 'all 0.2s', opacity: loading ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {loading ? 'Processing...' : 'Apply Permit'} <Send size={18} />
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Trust Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { icon: <ShieldCheck size={28} color="#3B82F6" />, title: '100% SECURE', desc: 'Your data is safe and protected' },
                  { icon: <Zap size={28} color="#3B82F6" />, title: 'FAST PROCESSING', desc: 'Permits processed within 30 mins' },
                  { icon: <User size={28} color="#3B82F6" />, title: 'EXPERT TEAM', desc: 'Professional support 24/7' },
                  { icon: <ShieldCheck size={28} color="#3B82F6" />, title: 'TRUSTED PARTNER', desc: 'Many businesses trust Aula Permits' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 800 }}>{item.title}</div>
                      <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '4px' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple Bottom Copyright */}
              <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', padding: '2rem 0' }}>
                © 2026 AULA Permits. Your Trusted Permit Partner in Singapore. All Rights Reserved.
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;
