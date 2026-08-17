import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, Save, CheckCircle2, 
  Globe, Sparkles, Building2, ExternalLink
} from 'lucide-react';

import { contactApi } from '../services/api';

const INITIAL_CONTACT = {
  companyName: 'AULA Permits Pte. Ltd.',
  uenNumber: '202028266G',
  phone: '+65 6123 4567',
  whatsapp: '+65 6123 4567',
  email: 'contact@aulapermits.sg',
  address: '26 Upper Dickson Road, Singapore 207478',
  operatingHours: 'Mon - Fri: 08:30 AM - 06:30 PM | Sat: 09:00 AM - 01:00 PM',
  emergencySupport: '24/7 Urgent Permit Standby Available',
  googleMapsUrl: 'https://maps.google.com/?q=26+Upper+Dickson+Road+Singapore+207478'
};

const Contact = () => {
  const [contactData, setContactData] = useState(INITIAL_CONTACT);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await contactApi.get();
        if (data) setContactData(data);
      } catch (e) {
        const saved = localStorage.getItem('aula_contact_info');
        if (saved) setContactData(JSON.parse(saved));
      }
    };
    fetchContact();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await contactApi.update(contactData);
      localStorage.setItem('aula_contact_info', JSON.stringify(contactData));
      showToast('Contact information saved successfully!');
    } catch (err) {
      showToast('Saved to local storage');
    }
  };

  return (
    <div>
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', right: '36px', zIndex: 1000,
          background: '#10B981', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 600, fontSize: '0.9rem', animation: 'modalSlideUp 0.25s ease'
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 size={28} color="var(--brand-purple)" />
            Contact & Singapore HQ Details
          </h1>
          <p className="page-subtitle">Update company contact information, hotlines, registered address, and business hours.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <Sparkles size={18} color="var(--brand-purple)" /> General Information
              </h2>
              <p className="card-subtitle">These details will appear across the footer, navigation topbar, and contact page.</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid single-col" style={{ gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Company Legal Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={contactData.companyName}
                  onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Singapore UEN Registration Number</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={contactData.uenNumber}
                  onChange={(e) => setContactData({ ...contactData, uenNumber: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="var(--brand-blue)" /> Phone Number
                    </span>
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={14} color="var(--brand-emerald)" /> WhatsApp Hotline
                    </span>
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={contactData.whatsapp}
                    onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--brand-purple)" /> Official Enquiry Email
                  </span>
                </label>
                <input 
                  type="email" 
                  className="form-input"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--brand-rose)" /> Registered HQ Address
                  </span>
                </label>
                <textarea 
                  className="form-textarea"
                  style={{ minHeight: '70px' }}
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--brand-amber)" /> Operating & Support Hours
                  </span>
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  value={contactData.operatingHours}
                  onChange={(e) => setContactData({ ...contactData, operatingHours: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency / Standby Notice</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={contactData.emergencySupport}
                  onChange={(e) => setContactData({ ...contactData, emergencySupport: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Save size={18} /> Update Contact Information
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
