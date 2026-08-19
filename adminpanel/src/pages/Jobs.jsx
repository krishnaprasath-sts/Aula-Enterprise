import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, X,
  Briefcase, MapPin, Building2, Clock, Check, Sparkles, Filter,
  Layers, ArrowRight, ToggleLeft, ToggleRight, FileText, Globe
} from 'lucide-react';
import { jobsApi } from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: 'Singapore',
    employment_type: 'Full-Time',
    description: '',
    requirements: '',
    responsibilities: '',
    status: 'Open'
  });

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobsApi.getAll();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
      showToast('Failed to load job vacancies', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setCurrentJob(null);
    setFormData({
      title: '',
      department: '',
      location: 'Singapore',
      employment_type: 'Full-Time',
      description: '',
      requirements: '',
      responsibilities: '',
      status: 'Open'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setCurrentJob(job);
    setFormData({ ...job });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Job Title is required!', 'error');
      return;
    }

    try {
      if (currentJob) {
        await jobsApi.update(currentJob.id, formData);
        setJobs(jobs.map(j => j.id === currentJob.id ? { ...formData, id: j.id } : j));
        showToast('Job vacancy updated successfully!');
      } else {
        const created = await jobsApi.create(formData);
        setJobs([created, ...jobs]);
        showToast('New job vacancy posted successfully!');
        loadJobs();
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save job', 'error');
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      await jobsApi.update(job.id, { ...job, status: nextStatus });
      setJobs(jobs.map(j => j.id === job.id ? { ...j, status: nextStatus } : j));
      showToast(`Position "${job.title}" set to ${nextStatus}!`);
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async () => {
    if (jobToDelete) {
      try {
        await jobsApi.delete(jobToDelete.id);
        setJobs(jobs.filter(j => j.id !== jobToDelete.id));
        showToast('Job posting deleted successfully!');
      } catch (err) {
        showToast(err.message || 'Failed to delete job', 'error');
      }
    }
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  // Derived metrics
  const totalJobs = jobs.length;
  const countOpen = jobs.filter(j => j.status === 'Open').length;
  const countClosed = jobs.filter(j => j.status === 'Closed').length;
  const uniqueDepartments = Array.from(new Set(jobs.map(j => j.department).filter(Boolean)));

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = (j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (j.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || j.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || j.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
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
            <Briefcase size={28} color="var(--brand-blue)" />
            Job Vacancies & Careers
          </h1>
          <p className="page-subtitle">Manage recruitment openings, job specs, and active career listings on the public portal.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenAdd} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '11px 22px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* 4 KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        {/* Total Vacancies */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Positions</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{totalJobs}</div>
          </div>
        </div>

        {/* Active Openings */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Openings</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-emerald)', lineHeight: 1.2 }}>{countOpen}</div>
          </div>
        </div>

        {/* Closed Positions */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(100, 116, 139, 0.1)', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Closed Listings</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#64748B', lineHeight: 1.2 }}>{countClosed}</div>
          </div>
        </div>

        {/* Departments */}
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Departments</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-purple)', lineHeight: 1.2 }}>{uniqueDepartments.length}</div>
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
              placeholder="Search by role, department, location..." 
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

          {/* Quick Status Filter Tabs */}
          <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
            {['All', 'Open', 'Closed'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: statusFilter === tab ? '#FFFFFF' : 'transparent',
                  color: statusFilter === tab ? 'var(--brand-blue)' : 'var(--text-secondary)',
                  boxShadow: statusFilter === tab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                {tab} {tab === 'All' ? `(${totalJobs})` : tab === 'Open' ? `(${countOpen})` : `(${countClosed})`}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          {uniqueDepartments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
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
              <option value="All">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}
        </div>

        <div className="toolbar-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Showing <b>{filteredJobs.length}</b> of <b>{totalJobs}</b> positions
          </span>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="table-container">
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: 'var(--brand-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading vacancies...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F1F5F9', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Briefcase size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>No Job Vacancies Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 20px' }}>
              {searchQuery || statusFilter !== 'All' ? 'Try adjusting your search criteria or filter options.' : 'Get started by creating your first job opening.'}
            </p>
            <button 
              className="btn btn-primary" 
              onClick={handleOpenAdd}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} strokeWidth={2.5} /> Post First Vacancy
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title & ID</th>
                <th>Department</th>
                <th>Location & Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        background: job.status === 'Open' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: job.status === 'Open' ? 'var(--brand-blue)' : '#64748B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem'
                      }}>
                        {job.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '2px' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>ID #{job.id}</span>
                          <span>•</span>
                          <span>{job.requirements ? `${job.requirements.split('\n').filter(r => r.trim()).length} requirements` : 'No requirements'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      <Building2 size={12} style={{ marginRight: '4px' }} />
                      {job.department || 'General'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#64748B" /> {job.location || 'Singapore'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {job.employment_type || 'Full-Time'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-badge ${job.status?.toLowerCase()}`}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: job.status === 'Open' ? '#10B981' : '#64748B',
                          display: 'inline-block'
                        }}></span>
                        {job.status}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(job)}
                        title={`Click to switch to ${job.status === 'Open' ? 'Closed' : 'Open'}`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: job.status === 'Open' ? 'var(--brand-emerald)' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', padding: '2px'
                        }}
                      >
                        {job.status === 'Open' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        className="btn-icon edit" 
                        onClick={() => handleOpenEdit(job)} 
                        title="Edit Job Specs"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => { setJobToDelete(job); setIsDeleteModalOpen(true); }} 
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Job Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '800px', width: '95%' }}>
            
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {currentJob ? 'Edit Job Posting' : 'Post New Career Opportunity'}
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {currentJob ? `Update vacancy details for ID #${currentJob.id}` : 'Fill in role responsibilities, requirements, and location'}
                  </p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', maxHeight: '68vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Section 1: Overview */}
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="var(--brand-blue)" /> Basic Information
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                        Job Title <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        placeholder="e.g. Declarant Officer" 
                        required 
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                        Department
                      </label>
                      <input 
                        type="text" 
                        value={formData.department} 
                        onChange={e => setFormData({...formData, department: e.target.value})} 
                        placeholder="e.g. Permit Operations / Sales" 
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                        Location
                      </label>
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={e => setFormData({...formData, location: e.target.value})} 
                        placeholder="e.g. Singapore (Changi / Jurong)" 
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                        Employment Type
                      </label>
                      <select 
                        value={formData.employment_type} 
                        onChange={e => setFormData({...formData, employment_type: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#FFFFFF' }}
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                        Status
                      </label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#FFFFFF' }}
                      >
                        <option value="Open">🟢 Open (Visible to Public)</option>
                        <option value="Closed">⚪ Closed (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Description */}
                <div className="form-group">
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>
                    Role Overview / Summary (Optional)
                  </label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    placeholder="Provide a high-level summary of what this role entails..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'vertical' }}
                  ></textarea>
                </div>

                {/* Section 3: Requirements */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Requirements & Qualifications (One per line)
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-blue)', fontWeight: 600 }}>
                      Tip: Enter 1 bullet point per line
                    </span>
                  </div>
                  <textarea 
                    value={formData.requirements} 
                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                    rows="6"
                    placeholder="Must have passed Singapore Customs Declarant examination&#10;Experience in Singapore customs permit declaration&#10;Good written and verbal English communication"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', fontFamily: 'monospace' }}
                  ></textarea>
                </div>

                {/* Section 4: Responsibilities */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Key Responsibilities & Scope (One per line)
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-blue)', fontWeight: 600 }}>
                      Tip: Enter 1 bullet point per line
                    </span>
                  </div>
                  <textarea 
                    value={formData.responsibilities} 
                    onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                    rows="6"
                    placeholder="Prepare and process Singapore customs permit declarations&#10;Verify invoices, packing lists and supporting documents&#10;Coordinate with logistics partners and customers"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', fontFamily: 'monospace' }}
                  ></textarea>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '10px 24px', 
                    borderRadius: '10px', 
                    fontWeight: 700, 
                    fontSize: '0.88rem',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    border: 'none',
                    color: '#FFFFFF'
                  }}
                >
                  <Check size={18} strokeWidth={2.5} />
                  <span>{currentJob ? 'Save Changes' : 'Publish Vacancy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '460px', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ margin: '0 auto 16px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEE2E2', color: '#DC2626', borderRadius: '50%' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Delete Job Vacancy?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Are you sure you want to remove <strong>"{jobToDelete?.title}"</strong>? Any submitted candidate applications linked to this position may also be affected.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}
              >
                Yes, Delete Vacancy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
