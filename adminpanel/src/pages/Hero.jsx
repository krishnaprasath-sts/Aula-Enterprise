import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, Eye, Video, Image, 
  ArrowRight, Search, Sparkles, AlertCircle, X, Check, Globe, RefreshCw
} from 'lucide-react';
import { heroApi, uploadApi } from '../services/api';


const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: 'Apply Permit',
    ctaLink: '/contact',
    mediaType: 'video',
    mediaUrl: '/src/assets/home.mp4',
    trustRate: '100%',
    trustLabel: 'Customs Compliance Rate',
    status: 'Active'
  });

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await heroApi.getAll();
      if (data && data.length > 0) {
        const mappedData = data.map(b => ({
          ...b,
          updatedAt: b.updatedAt || b.updated_at || new Date().toISOString().split('T')[0]
        }));
        setBanners(mappedData);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error(err);
      setBanners([]);
      showToast('Failed to load hero banners', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    localStorage.removeItem('aula_hero_banners');
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setCurrentBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      ctaText: 'Applt Permit',
      ctaLink: '/contact',
      mediaType: 'video',
      mediaUrl: '/src/assets/home.mp4',
      trustRate: '100%',
      trustLabel: 'Customs Compliance Rate',
      status: banners.length === 0 ? 'Active' : 'Inactive'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setCurrentBanner(banner);
    setFormData({ ...banner });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadApi.uploadFile(file);
      // Ensure mediaType matches the uploaded file
      const isVideo = file.type.startsWith('video');
      setFormData(prev => ({
        ...prev,
        mediaUrl: result.url,
        mediaType: isVideo ? 'video' : 'image'
      }));
      showToast('File uploaded successfully!');
    } catch (err) {
      showToast('File upload failed: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Hero Title is required!', 'error');
      return;
    }

    try {
      if (currentBanner) {
        // Update Backend
        await heroApi.update(currentBanner.id, formData);
        const updated = banners.map(b => {
          if (b.id === currentBanner.id) {
            return {
              ...formData,
              id: b.id,
              updatedAt: new Date().toISOString().split('T')[0]
            };
          }
          if (formData.status === 'Active') {
            return { ...b, status: 'Inactive' };
          }
          return b;
        });
        setBanners(updated);
        showToast('Hero Banner updated successfully!');
      } else {
        // Create Backend
        const created = await heroApi.create(formData);
        let newBanners = banners;
        if (formData.status === 'Active') {
          newBanners = newBanners.map(b => ({ ...b, status: 'Inactive' }));
        }
        setBanners([created, ...newBanners]);
        showToast('New Hero Banner created successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Error saving banner', 'error');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (banner) {
        await heroApi.update(id, { ...banner, status: 'Active' });
      }
      const updated = banners.map(b => ({
        ...b,
        status: b.id === id ? 'Active' : 'Inactive',
        updatedAt: b.id === id ? new Date().toISOString().split('T')[0] : b.updatedAt
      }));
      setBanners(updated);
      showToast('Active hero banner updated!');
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (bannerToDelete) {
      try {
        await heroApi.delete(bannerToDelete.id);
        const updated = banners.filter(b => b.id !== bannerToDelete.id);
        if (bannerToDelete.status === 'Active' && updated.length > 0) {
          updated[0].status = 'Active';
        }
        setBanners(updated);
        setIsDeleteModalOpen(false);
        setBannerToDelete(null);
        showToast('Hero Banner deleted successfully.');
      } catch (err) {
        showToast('Delete operation failed', 'error');
      }
    }
  };

  const activeBanner = banners.find(b => b.status === 'Active') || banners[0];

  const filteredBanners = banners.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
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
            <Sparkles size={28} color="var(--brand-purple)" />
            Hero Banner Management
          </h1>
          <p className="page-subtitle">Configure, preview, and update the primary hero sections displayed on the live homepage.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} /> Create New Banner
        </button>
      </div>



      {/* Toolbar for CRUD Table */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-input-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search hero banners..." 
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
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        <div className="toolbar-right">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredBanners.length} of {banners.length} banners
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Banner Content</th>
                <th>Media Type</th>
                <th>CTA Button</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No hero banners found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBanners.map(banner => (
                  <tr key={banner.id}>
                    <td style={{ maxWidth: '340px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.95rem' }}>
                        {banner.title}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {banner.subtitle}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {banner.mediaType === 'video' ? <Video size={16} color="var(--brand-purple)" /> : <Image size={16} color="var(--brand-blue)" />}
                        {banner.mediaType === 'video' ? 'Video (MP4)' : 'Image (PNG/JPG)'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-featured">
                        {banner.ctaText} → {banner.ctaLink}
                      </span>
                    </td>
                    <td>
                      {banner.status === 'Active' ? (
                        <span className="badge badge-active">
                          <Check size={12} /> Active
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleToggleActive(banner.id)}
                          className="badge badge-inactive"
                          style={{ cursor: 'pointer', border: '1px dashed #CBD5E1' }}
                          title="Click to activate"
                        >
                          Make Active
                        </button>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {banner.updatedAt}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenEdit(banner)}
                          className="btn-icon edit" 
                          title="Edit Banner"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => { setBannerToDelete(banner); setIsDeleteModalOpen(true); }}
                          className="btn-icon delete" 
                          title="Delete Banner"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Sparkles size={20} color="var(--brand-purple)" />
                {currentBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">
                      Hero Headline / Title <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Navigate Global Trade With Absolute Confidence."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Hero Subtitle / Description</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Enter the descriptive paragraph for this banner..."
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTA Button Text</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Apply Permit"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CTA Button Link</label>
                    <select 
                      className="form-select" 
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    >
                      <option value="">Select a link...</option>
                      <option value="modal">Enquiry Form Modal (Popup)</option>
                      <option value="/contact">Contact Page (/contact)</option>
                      <option value="/services">Services Page (/services)</option>
                      <option value="/about">About Us Page (/about)</option>
                      <option value="/">Home Page (/)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Background Media Type & Upload</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select 
                        className="form-select"
                        value={formData.mediaType}
                        onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        style={{ width: '180px' }}
                      >
                        <option value="video">Video (MP4)</option>
                        <option value="image">Image (JPG/PNG)</option>
                      </select>
                      <input 
                        type="file" 
                        accept={formData.mediaType === 'video' ? 'video/mp4' : 'image/png, image/jpeg, image/webp'}
                        className="form-input" 
                        onChange={handleFileUpload}
                        style={{ flexGrow: 1, padding: '8px' }}
                        disabled={isUploading}
                      />
                      {isUploading && <span style={{ fontSize: '0.8rem', color: 'var(--brand-blue)' }}>Uploading...</span>}
                    </div>
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      background: 'var(--bg-surface-subtle)', 
                      border: '1px dashed var(--border-light)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MEDIA PREVIEW</div>
                      {formData.mediaType === 'image' ? (
                        <div style={{ 
                          width: '100%', height: '140px', 
                          background: `url(${formData.mediaUrl}) center/cover no-repeat`,
                          borderRadius: '8px', border: '1px solid var(--border-light)'
                        }} />
                      ) : (
                        <video 
                          src={formData.mediaUrl}
                          controls
                          muted
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border-light)',
                            backgroundColor: '#0F172A'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trust Metric (Value)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 100%"
                      value={formData.trustRate}
                      onChange={(e) => setFormData({ ...formData, trustRate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trust Metric (Label)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Customs Compliance Rate"
                      value={formData.trustLabel}
                      onChange={(e) => setFormData({ ...formData, trustLabel: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="switch-label">
                      <input 
                        type="checkbox"
                        className="switch-input"
                        checked={formData.status === 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                      />
                      <span className="switch-slider"></span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Set as Active Hero Banner (Will be displayed live on homepage)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {currentBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && bannerToDelete && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-sm">
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#DC2626' }}>
                <AlertCircle size={20} color="#DC2626" />
                Delete Hero Banner
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>"{bannerToDelete.title}"</strong>? This action cannot be undone.
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

export default Hero;
