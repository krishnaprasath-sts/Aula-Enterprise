import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, X, Check,
  FileCheck, Globe, Layers, ArrowUpRight, Upload
} from 'lucide-react';

import { permitTypesApi, uploadApi } from '../services/api';

const PermitTypes = () => {
  const [permitTypes, setPermitTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPermitType, setCurrentPermitType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    order_index: 0,
    status: 'Active'
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await permitTypesApi.getAll();
      if (data && data.length > 0) {
        const mappedData = data.map(item => ({
          ...item,
          updatedAt: item.updated_at || new Date().toISOString().split('T')[0]
        }));
        setPermitTypes(mappedData.sort((a, b) => a.order_index - b.order_index));
      } else {
        setPermitTypes([]);
      }
    } catch (err) {
      console.error(err);
      setPermitTypes([]);
      showToast('Failed to load permit types', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setCurrentPermitType(null);
    setFormData({
      title: '',
      description: '',
      image: '',
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

  const handleOpenEdit = (item) => {
    setCurrentPermitType(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required!', 'error');
      return;
    }

    try {
      if (currentPermitType) {
        await permitTypesApi.update(currentPermitType.id, formData);
        const updated = permitTypes.map(s => s.id === currentPermitType.id ? { ...formData, id: s.id } : s);
        setPermitTypes(updated.sort((a, b) => a.order_index - b.order_index));
        showToast('Permit Type updated successfully!');
      } else {
        const created = await permitTypesApi.create(formData);
        const updated = [...permitTypes, created];
        setPermitTypes(updated.sort((a, b) => a.order_index - b.order_index));
        showToast('New permit type added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save permit type', 'error');
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await permitTypesApi.delete(itemToDelete.id);
        setPermitTypes(permitTypes.filter(s => s.id !== itemToDelete.id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        showToast('Permit Type removed successfully.');
      } catch (err) {
        showToast('Delete operation failed', 'error');
      }
    }
  };

  const toggleStatus = async (id) => {
    const s = permitTypes.find(item => item.id === id);
    if (s) {
      const nextStatus = s.status === 'Active' ? 'Inactive' : 'Active';
      const updatedItem = { ...s, status: nextStatus };
      await permitTypesApi.update(id, updatedItem).catch(() => {});
      setPermitTypes(permitTypes.map(item => item.id === id ? updatedItem : item));
      showToast('Status changed!');
    }
  };

  const filteredPermitTypes = permitTypes.filter(s => {
    const matchesSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = permitTypes.filter(s => s.status === 'Active').length;

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
            <FileCheck size={28} color="var(--brand-purple)" />
            Permit Types Management
          </h1>
          <p className="page-subtitle">Manage customs permit declarations shown on the homepage.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-blue) 100%)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
          }}
        >
          <Plus size={18} /> Add New Permit
        </button>
      </div>

      {/* Metric Counters Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Permits</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{permitTypes.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>{totalActive}</div>
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
              placeholder="Search by title or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="select-filter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th width="80">Image</th>
                <th>Title & Description</th>
                <th width="80">Order</th>
                <th width="100">Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                  </td>
                </tr>
              ) : filteredPermitTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No permit types found.
                  </td>
                </tr>
              ) : (
                filteredPermitTypes.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '8px', 
                        overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {item.image ? (
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FileCheck size={20} color="var(--text-muted)" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description || item.desc}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{item.order_index}</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {item.status === 'Active' ? <Check size={12} /> : null}
                        {item.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEdit(item)} className="btn-icon edit" title="Edit Permit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="btn-icon delete" title="Delete Permit">
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                {currentPermitType ? 'Edit Permit Type' : 'Add New Permit'}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 900, color: 'var(--text-primary)' }}>
                      Title <span style={{ color: '#EF4444', fontWeight: 900, marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Import Permit"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-textarea" 
                      value={formData.description || formData.desc}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief explanation of the permit type"
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Permit Image</label>
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
                      {formData.image && (
                        <div style={{ 
                          padding: '6px', 
                          border: '1px solid var(--border-light)', 
                          borderRadius: '12px', 
                          backgroundColor: '#FFFFFF', 
                          boxShadow: 'var(--shadow-sm)',
                          flexShrink: 0 
                        }}>
                          <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Order (Sort Index)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.order_index}
                      onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select" 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Active">Active (Published on website)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '20px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">{currentPermitType ? 'Save Changes' : 'Add Permit Type'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Delete Permit Type?</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Are you sure you want to delete <strong>{itemToDelete?.title}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn btn-primary" style={{ flex: 1, background: '#EF4444' }}>
                  Delete Permit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermitTypes;
