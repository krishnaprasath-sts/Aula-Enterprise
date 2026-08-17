import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, X, Check,
  FileCheck, Shield, Globe, Anchor, Truck, Package, Layers, 
  Star, Filter, LayoutGrid, List, Clock, ArrowUpRight
} from 'lucide-react';

import { servicesApi, uploadApi } from '../services/api';



const ICONS_MAP = {
  FileCheck: <FileCheck size={20} />,
  Shield: <Shield size={20} />,
  Layers: <Layers size={20} />,
  Globe: <Globe size={20} />,
  Anchor: <Anchor size={20} />,
  Truck: <Truck size={20} />,
  Package: <Package size={20} />
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Permits',
    shortDesc: '',
    image: '',
    processingTime: 'Within 2 Hours',
    order_index: 0,
    status: 'Active'
  });

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await servicesApi.getAll();
      if (data && data.length > 0) {
        const mappedData = data.map(s => ({
          ...s,
          updatedAt: s.updatedAt || s.updated_at || new Date().toISOString().split('T')[0]
        }));
        setServices(mappedData.sort((a, b) => (a.sortOrder || a.order) - (b.sortOrder || b.order)));
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error(err);
      setServices([]);
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    localStorage.removeItem('aula_services_list');
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setCurrentService(null);
    setFormData({
      title: '',
      category: 'Permits',
      shortDesc: '',
      image: '',
      processingTime: 'Within 2 Hours',
      order_index: 0,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadApi.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        image: result.url
      }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      showToast('File upload failed: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenEdit = (service) => {
    setCurrentService(service);
    setFormData({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Service Title is required!', 'error');
      return;
    }

    try {
      if (currentService) {
        // Update Backend
        await servicesApi.update(currentService.id, formData);
        const updated = services.map(s => s.id === currentService.id ? { ...formData, id: s.id } : s);
        setServices(updated);
        showToast('Service updated successfully!');
      } else {
        // Create Backend
        const created = await servicesApi.create(formData);
        setServices([created, ...services]);
        showToast('New service added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDelete = async () => {
    if (serviceToDelete) {
      try {
        await servicesApi.delete(serviceToDelete.id);
        setServices(services.filter(s => s.id !== serviceToDelete.id));
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
        showToast('Service removed successfully.');
      } catch (err) {
        showToast('Delete operation failed', 'error');
      }
    }
  };

  const toggleStatus = async (id) => {
    const s = services.find(item => item.id === id);
    if (s) {
      const nextStatus = s.status === 'Active' ? 'Draft' : 'Active';
      const updatedItem = { ...s, status: nextStatus };
      await servicesApi.update(id, updatedItem).catch(() => {});
      setServices(services.map(item => item.id === id ? updatedItem : item));
      showToast('Service status changed!');
    }
  };

  const categories = ['All', ...new Set(services.map(s => s.category).filter(Boolean))];

  const filteredServices = services.filter(s => {
    const matchesSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalActive = services.filter(s => s.status === 'Active').length;
  const totalFeatured = services.filter(s => s.featured).length;

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
            <Layers size={28} color="var(--brand-purple)" />
            Services Management
          </h1>
          <p className="page-subtitle">Manage trade services, customs clearance packages, and documentation offerings.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Metric Counters Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Services</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{services.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Offerings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>{totalActive}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categories</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-blue)' }}>{categories.length - 1}</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search service title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Draft">Drafts Only</option>
          </select>
        </div>

        <div className="toolbar-right">
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button 
              onClick={() => setViewMode('table')}
              className="btn-icon"
              style={{ 
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{ 
                background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SERVICES CONTENT: TABLE OR GRID VIEW */}
      {viewMode === 'table' ? (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Service Offering</th>
                  <th>Category</th>
                  <th>SLA / Turnaround</th>
                  <th>Sort Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                      No services found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map(service => (
                    <tr key={service.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ 
                            width: '42px', height: '42px', borderRadius: '10px', 
                            background: 'rgba(124, 58, 237, 0.08)', color: 'var(--brand-purple)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            {service.image ? (
                              <img src={service.image} alt="Service" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                              {service.title}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {service.shortDesc}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-featured">
                          {service.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <Clock size={14} color="var(--brand-blue)" /> {service.processingTime}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {service.order_index}
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(service.id)}
                          className={`badge ${service.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle status"
                        >
                          {service.status === 'Active' ? <Check size={12} /> : null}
                          {service.status}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleOpenEdit(service)}
                            className="btn-icon edit" 
                            title="Edit Service"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => { setServiceToDelete(service); setIsDeleteModalOpen(true); }}
                            className="btn-icon delete" 
                            title="Delete Service"
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
      ) : (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredServices.map(service => (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '100%', height: '140px', borderRadius: '8px', marginBottom: '16px',
                    background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                  }}>
                    {service.image ? (
                      <img src={service.image} alt="Service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={36} color="var(--brand-purple)" />
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>
                    {service.category}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${service.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {service.status}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                  {service.shortDesc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> {service.processingTime}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleOpenEdit(service)} className="btn-icon edit" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { setServiceToDelete(service); setIsDeleteModalOpen(true); }} className="btn-icon delete" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Layers size={20} color="var(--brand-purple)" />
                {currentService ? 'Edit Service Details' : 'Add New Trade Service'}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label" style={{ fontWeight: 900, color: 'var(--text-primary)' }}>
                      Service Title <span style={{ color: '#EF4444', fontWeight: 900, marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Customs & Trade Permit Declaration"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category Group</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Permits, Logistics, Compliance"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Service Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="form-input"
                        disabled={isUploading}
                        style={{ flex: 1 }}
                      />
                      {isUploading && <span style={{ color: 'var(--brand-blue)', fontSize: '0.9rem', fontWeight: 600 }}>Uploading...</span>}
                    </div>
                    {formData.image && (
                      <div style={{ marginTop: '12px', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px', display: 'inline-block' }}>
                        <img src={formData.image} alt="Preview" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Processing Turnaround (SLA)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Within 2 Hours"
                      value={formData.processingTime}
                      onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Status</label>
                    <select 
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active (Published on website)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Short Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Explain the scope and benefit of this service for client businesses..."
                      value={formData.shortDesc}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Sort Order (0 is first)</label>
                    <input 
                      type="number"
                      className="form-input"
                      value={formData.order_index !== undefined ? formData.order_index : 0}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-sm">
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#DC2626' }}>
                <AlertCircle size={20} color="#DC2626" />
                Remove Service
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>"{serviceToDelete.title}"</strong>? It will no longer appear on your live site.
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

export default Services;
