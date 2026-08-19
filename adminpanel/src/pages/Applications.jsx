import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, Calendar, Search, CheckCircle2, AlertCircle, 
  X, Trash2, Eye, MessageSquare, Clock, Filter, Sparkles, Building,
  ArrowRight, Download, Briefcase, FileText, ExternalLink, Check,
  UserCheck, UserX, ChevronRight, User
} from 'lucide-react';

import { applicationsApi } from '../services/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationsApi.getAll();
      setApplications(data || []);
    } catch (e) {
      console.error(e);
      setApplications([]);
      showToast('Failed to load applications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenView = (app) => {
    setSelectedApplication(app);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await applicationsApi.updateStatus(id, newStatus);
      const updated = applications.map(a => a.id === id ? { ...a, status: newStatus } : a);
      setApplications(updated);
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
      showToast(`Application #${id} status changed to "${newStatus}"!`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    try {
      await applicationsApi.delete(applicationToDelete.id);
      setApplications(current => current.filter(app => app.id !== applicationToDelete.id));
      if (selectedApplication?.id === applicationToDelete.id) {
        setSelectedApplication(null);
        setIsViewModalOpen(false);
      }
      showToast(`${applicationToDelete.name || 'Application'} was deleted.`);
      setApplicationToDelete(null);
    } catch (err) {
      showToast('Failed to delete application', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalApplications = applications.length;
  const countNew = applications.filter(a => a.status === 'New').length;
  const countReviewed = applications.filter(a => a.status === 'Reviewed').length;
  const countHired = applications.filter(a => a.status === 'Hired').length;
  const countRejected = applications.filter(a => a.status === 'Rejected').length;
  
  const uniqueJobs = Array.from(new Set(applications.map(a => a.job_title).filter(Boolean)));

  const filteredApplications = applications.filter(a => {
    const matchesSearch = (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.current_company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.job_title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesJob = jobFilter === 'All' || a.job_title === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'new';
      case 'Reviewed': return 'reviewed';
      case 'Rejected': return 'rejected';
      case 'Hired': return 'hired';
      default: return 'new';
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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
            Job Applications & Candidates
          </h1>
          <p className="page-subtitle">Review candidate profiles, screen resumes, and manage recruitment pipeline stages.</p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        {/* Total Applications */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Submissions</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{totalApplications}</div>
          </div>
        </div>

        {/* New / Unread */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Applications</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-purple)', lineHeight: 1.2 }}>{countNew}</div>
          </div>
        </div>

        {/* Reviewed / In Progress */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--brand-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Under Review</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-amber)', lineHeight: 1.2 }}>{countReviewed}</div>
          </div>
        </div>

        {/* Hired / Accepted */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hired Candidates</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-emerald)', lineHeight: 1.2 }}>{countHired}</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar">
        <div className="toolbar-left">
          {/* Search Box */}
          <div className="search-input-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search candidate name, email, role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '280px' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '4px', borderRadius: '10px', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { key: 'All', label: 'All', count: totalApplications },
              { key: 'New', label: 'New', count: countNew },
              { key: 'Reviewed', label: 'Reviewed', count: countReviewed },
              { key: 'Hired', label: 'Hired', count: countHired },
              { key: 'Rejected', label: 'Rejected', count: countRejected }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: statusFilter === tab.key ? '#FFFFFF' : 'transparent',
                  color: statusFilter === tab.key ? 'var(--brand-purple)' : 'var(--text-secondary)',
                  boxShadow: statusFilter === tab.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Job Filter */}
          {uniqueJobs.length > 0 && (
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                fontWeight: 500,
                outline: 'none'
              }}
            >
              <option value="All">All Applied Positions</option>
              {uniqueJobs.map(jobTitle => (
                <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
              ))}
            </select>
          )}
        </div>

        <div className="toolbar-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Showing <b>{filteredApplications.length}</b> of <b>{totalApplications}</b> candidates
          </span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading candidate applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F1F5F9', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>No Applications Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              {searchQuery || statusFilter !== 'All' ? 'Try clearing your search query or selecting another status filter.' : 'When candidates apply on the Join AULA page, their submissions will appear here.'}
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Position</th>
                <th>Experience & Background</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  {/* Candidate Column */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                        color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.5px', flexShrink: 0
                      }}>
                        {getInitials(app.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '2px' }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Mail size={11} /> {app.email}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={11} /> {app.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Target Position */}
                  <td>
                    <span className="category-badge" style={{ background: 'rgba(124, 58, 237, 0.08)', color: 'var(--brand-purple)' }}>
                      <Briefcase size={12} style={{ marginRight: '4px' }} />
                      {app.job_title || 'Position Applied'}
                    </span>
                  </td>

                  {/* Experience */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                        {app.experience_years} Years Experience
                      </span>
                      {app.current_company ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building size={12} /> {app.current_company}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No current company</span>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#64748B" />
                      {new Date(app.created_at || app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        outline: 'none',
                        background: 
                          app.status === 'New' ? 'rgba(124, 58, 237, 0.1)' :
                          app.status === 'Reviewed' ? 'rgba(245, 158, 11, 0.1)' :
                          app.status === 'Hired' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color:
                          app.status === 'New' ? '#6D28D9' :
                          app.status === 'Reviewed' ? '#D97706' :
                          app.status === 'Hired' ? '#059669' : '#DC2626'
                      }}
                    >
                      <option value="New">🟣 New</option>
                      <option value="Reviewed">🟡 Reviewed</option>
                      <option value="Hired">🟢 Hired</option>
                      <option value="Rejected">🔴 Rejected</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button 
                      className="btn-primary btn-sm" 
                      onClick={() => handleOpenView(app)}
                      style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Eye size={14} />
                      <span>View application</span>
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete"
                      onClick={() => setApplicationToDelete(app)}
                      aria-label={`Delete application from ${app.name}`}
                      title="Delete application"
                      style={{ marginLeft: '8px', verticalAlign: 'middle' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Candidate Modal */}
      {isViewModalOpen && selectedApplication && (
        <div className="modal-backdrop">
          <div className="modal-dialog application-view-dialog" style={{ maxWidth: '780px', width: '95%' }}>
            
            {/* Modal Header */}
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #1E293B 100%)', color: '#FFFFFF' }}>
              <div className="application-identity">
                <div style={{
                  width: '54px', height: '54px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}>
                  {getInitials(selectedApplication.name)}
                </div>
                <div>
                  <span className="application-eyebrow">Applicant profile</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>
                    {selectedApplication.name}
                  </h2>
                  <div className="application-identity-meta">
                    <span>Applying for <strong style={{ color: '#38BDF8' }}>{selectedApplication.job_title || 'Position'}</strong></span>
                    <span>•</span>
                    <span>Application #{selectedApplication.id}</span>
                  </div>
                </div>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setIsViewModalOpen(false)}
                style={{ color: '#FFFFFF', background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', maxHeight: '68vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Quick Status Bar */}
              <div className="application-stage-card">
                <div className="application-stage-summary">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>RECRUITMENT PIPELINE STAGE</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span className={`status-badge ${getStatusBadgeClass(selectedApplication.status)}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                      {selectedApplication.status}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Submitted on {new Date(selectedApplication.created_at || selectedApplication.date).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="application-stage-actions">
                  <button 
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'Reviewed')}
                    style={{
                      padding: '7px 14px', borderRadius: '8px', border: '1px solid #F59E0B',
                      background: selectedApplication.status === 'Reviewed' ? '#F59E0B' : '#FEF3C7',
                      color: selectedApplication.status === 'Reviewed' ? '#FFFFFF' : '#92400E',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Eye size={13} /> Mark Reviewed
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'Hired')}
                    style={{
                      padding: '7px 14px', borderRadius: '8px', border: '1px solid #10B981',
                      background: selectedApplication.status === 'Hired' ? '#10B981' : '#D1FAE5',
                      color: selectedApplication.status === 'Hired' ? '#FFFFFF' : '#065F46',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={13} /> Hire Candidate
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'Rejected')}
                    style={{
                      padding: '7px 14px', borderRadius: '8px', border: '1px solid #EF4444',
                      background: selectedApplication.status === 'Rejected' ? '#EF4444' : '#FEE2E2',
                      color: selectedApplication.status === 'Rejected' ? '#FFFFFF' : '#991B1B',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <UserX size={13} /> Reject
                  </button>
                </div>
              </div>

              {/* Profile Details Grid */}
              <section className="application-section">
                <div className="application-section-heading">
                  <div>
                    <span>Candidate profile</span>
                    <h3>Contact & experience</h3>
                  </div>
                  <User size={19} />
                </div>
                <div className="application-profile-grid">
                
                {/* Email */}
                <div className="application-info-card">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </span>
                  <a href={`mailto:${selectedApplication.email}`} style={{ color: 'var(--brand-blue)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> {selectedApplication.email}
                  </a>
                </div>

                {/* Phone */}
                <div className="application-info-card">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Phone Contact
                  </span>
                  <a href={`tel:${selectedApplication.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> {selectedApplication.phone}
                  </a>
                </div>

                {/* Experience */}
                <div className="application-info-card">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Experience & Background
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                    {selectedApplication.experience_years} Years
                  </span>
                </div>

                {/* Company */}
                <div className="application-info-card">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Current / Recent Employer
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#64748B" />
                    {selectedApplication.current_company || 'Not Specified'}
                  </span>
                </div>
                </div>
              </section>

              {/* LinkedIn Profile */}
              {selectedApplication.linkedin && (
                <div className="application-linkedin-card application-resource-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      in
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-blue)', display: 'block' }}>LinkedIn Profile Linked</span>
                      <span style={{ fontSize: '0.85rem', color: '#475569' }}>{selectedApplication.linkedin}</span>
                    </div>
                  </div>
                  <a 
                    href={selectedApplication.linkedin.startsWith('http') ? selectedApplication.linkedin : `https://${selectedApplication.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary btn-sm"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>View Profile</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* Resume Download Card */}
              {selectedApplication.resume_url ? (
                <div className="application-resume-card application-resource-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={26} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        Candidate Resume (Curriculum Vitae)
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Attached applicant documentation for review
                      </p>
                    </div>
                  </div>
                  <a 
                    href={selectedApplication.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.88rem' }}
                  >
                    <Download size={16} />
                    <span>Download / Open Resume</span>
                  </a>
                </div>
              ) : (
                <div className="application-no-resume">
                  No resume file was attached with this submission.
                </div>
              )}

              {/* Cover Message / Note */}
              <section className="application-section">
                <div className="application-section-heading">
                  <div>
                    <span>Candidate note</span>
                    <h3>Cover message</h3>
                  </div>
                  <MessageSquare size={19} />
                </div>
                <div className={`application-cover-message ${selectedApplication.cover_message ? '' : 'is-empty'}`}>
                  {selectedApplication.cover_message || 'No personal cover message was provided by the applicant.'}
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="application-modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setApplicationToDelete(selectedApplication)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Trash2 size={16} /> Delete Application
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsViewModalOpen(false)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationToDelete && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => !isDeleting && setApplicationToDelete(null)}>
          <div className="modal-dialog modal-sm" role="dialog" aria-modal="true" aria-labelledby="delete-application-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 id="delete-application-title" className="modal-title" style={{ color: '#DC2626' }}>
                  <Trash2 size={20} /> Delete application?
                </h2>
              </div>
              <button className="modal-close-btn" onClick={() => setApplicationToDelete(null)} disabled={isDeleting} aria-label="Close delete confirmation">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Permanently delete the application from <strong>{applicationToDelete.name || 'this candidate'}</strong>? This cannot be undone.
              </p>
              {applicationToDelete.resume_url && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '10px' }}>
                  The attached resume will also be removed if no other application uses it.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setApplicationToDelete(null)} disabled={isDeleting}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteApplication} disabled={isDeleting} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} /> {isDeleting ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
