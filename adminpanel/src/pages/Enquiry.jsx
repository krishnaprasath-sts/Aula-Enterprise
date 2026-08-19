import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, Calendar, Search, CheckCircle2, AlertCircle, 
  X, Trash2, Eye, MessageSquare, Clock, Filter, Sparkles, Building,
  ArrowRight, Download
} from 'lucide-react';

import { enquiryApi } from '../services/api';



const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const data = await enquiryApi.getAll();
      if (data && data.length > 0) {
        setEnquiries(data);
      } else {
        setEnquiries([]);
      }
    } catch (e) {
      console.error(e);
      setEnquiries([]);
      showToast('Failed to load enquiries', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    // Optionally clear stale cache just in case
    localStorage.removeItem('aula_enquiries_list');
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await enquiryApi.updateStatus(id, newStatus);
      const updated = enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e);
      setEnquiries(updated);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      showToast(`Enquiry #${id} marked as ${newStatus}!`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (enquiryToDelete) {
      try {
        await enquiryApi.delete(enquiryToDelete.id);
        setEnquiries(enquiries.filter(e => e.id !== enquiryToDelete.id));
        setIsDeleteModalOpen(false);
        setEnquiryToDelete(null);
        if (isViewModalOpen) setIsViewModalOpen(false);
        showToast('Enquiry removed successfully.');
      } catch (err) {
        showToast('Delete operation failed', 'error');
      }
    }
  };

  const countNew = enquiries.filter(e => e.status === 'New').length;
  const countInProgress = enquiries.filter(e => e.status === 'In Progress').length;
  const countResolved = enquiries.filter(e => e.status === 'Resolved').length;

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.serviceNeeded || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', right: '36px', zIndex: 1000,
          background: notification.type === 'error' ? '#EF4444' : '#10B981',
          color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 600, fontSize: '0.9rem', animation: 'modalSlideUp 0.25s ease'
        }}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {notification.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} color="var(--brand-purple)" />
            Customer Enquiries & Consultation Leads
          </h1>
          <p className="page-subtitle">View and manage customer permit consultation submissions and trade inquiries.</p>
        </div>
      </div>

      {/* Counters Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Enquiries</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{enquiries.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--brand-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>New / Unread</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-rose)' }}>{countNew}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--brand-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Review</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-amber)' }}>{countInProgress}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolved</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>{countResolved}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by client, company, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="New">New Only</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="toolbar-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredEnquiries.length} of {enquiries.length} records
          </span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer / Company</th>
                <th>Service Required</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map(enquiry => (
                  <tr key={enquiry.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {enquiry.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                        <Building size={12} /> {enquiry.company || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-featured">
                        {enquiry.serviceNeeded}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {enquiry.created_at ? new Date(enquiry.created_at).toLocaleString() : enquiry.date}
                    </td>
                    <td>
                      <span className={`badge ${
                        enquiry.status === 'New' ? 'badge-danger' :
                        enquiry.status === 'In Progress' ? 'badge-warning' : 'badge-active'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenView(enquiry)}
                          className="btn-icon edit" 
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setEnquiryToDelete(enquiry); setIsDeleteModalOpen(true); }}
                          className="btn-icon delete" 
                          title="Delete Enquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {isViewModalOpen && selectedEnquiry && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Users size={20} color="var(--brand-purple)" />
                Enquiry Details
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Customer Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedEnquiry.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedEnquiry.company}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Permit Scope</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-purple)' }}>{selectedEnquiry.serviceNeeded}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="var(--brand-purple)" />
                  <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>{selectedEnquiry.email}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="var(--brand-emerald)" />
                  <span style={{ fontWeight: 600 }}>{selectedEnquiry.phone}</span>
                </div>
                {selectedEnquiry.whatsapp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={16} color="#10B981" />
                    <span style={{ fontWeight: 600, color: '#10B981' }}>{selectedEnquiry.whatsapp} (WA)</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Client Message / Consultation Request</label>
                <div style={{ 
                  background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px', 
                  borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 
                }}>
                  {selectedEnquiry.message || 'No message provided.'}
                </div>
              </div>

              {selectedEnquiry.attachments && (
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Attachments</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {(() => {
                      try {
                        const urls = typeof selectedEnquiry.attachments === 'string' ? JSON.parse(selectedEnquiry.attachments) : selectedEnquiry.attachments;
                        return Array.isArray(urls) ? urls.map((url, i) => (
                          <a key={i} href={url} download target="_blank" rel="noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#EFF6FF', color: '#3B82F6', padding: '8px 12px',
                            borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                            border: '1px solid #BFDBFE'
                          }}>
                            <Download size={14} /> Download File {i + 1}
                          </a>
                        )) : null;
                      } catch (e) {
                        return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Invalid attachments data</span>;
                      }
                    })()}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'New')}
                    className={`badge ${selectedEnquiry.status === 'New' ? 'badge-danger' : 'badge-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    New
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'In Progress')}
                    className={`badge ${selectedEnquiry.status === 'In Progress' ? 'badge-warning' : 'badge-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    In Progress
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'Resolved')}
                    className={`badge ${selectedEnquiry.status === 'Resolved' ? 'badge-active' : 'badge-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    Resolved
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a 
                    href={`https://wa.me/${(selectedEnquiry.whatsapp || selectedEnquiry.phone || '').replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#059669', borderColor: '#A7F3D0' }}
                  >
                    <MessageSquare size={14} /> WhatsApp Reply
                  </a>
                  <a 
                    href={`mailto:${selectedEnquiry.email}?subject=AULA Permits Consultation Follow-up`} 
                    className="btn btn-primary btn-sm"
                  >
                    <Mail size={14} /> Email Client
                  </a>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setIsViewModalOpen(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && enquiryToDelete && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-sm">
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#DC2626' }}>
                <AlertCircle size={20} color="#DC2626" />
                Delete Enquiry
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Are you sure you want to delete enquiry from <strong>"{enquiryToDelete.name}"</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
