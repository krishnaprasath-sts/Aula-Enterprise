import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Sparkles, Layers, Building2, ArrowRight, ArrowUpRight, 
  Clock, CheckCircle2, AlertCircle, Eye, Plus, ExternalLink, Activity
} from 'lucide-react';
import { heroApi, servicesApi, enquiryApi } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dynamic counts from API
  const [heroCount, setHeroCount] = useState(2);
  const [servicesCount, setServicesCount] = useState(6);
  const [enquiries, setEnquiries] = useState([]);
  const [activeHeroTitle, setActiveHeroTitle] = useState('Navigate Global Trade With Absolute Confidence.');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Hero Banners
        const banners = await heroApi.getAll();
        setHeroCount(banners.length);
        const active = banners.find(b => b.status === 'Active') || banners[0];
        if (active) setActiveHeroTitle(active.title);
        
        // Fetch Services
        const services = await servicesApi.getAll();
        setServicesCount(services.length);

        // Fetch Enquiries
        const enqs = await enquiryApi.getAll();
        if (enqs && enqs.length > 0) {
          setEnquiries(enqs);
        } else {
          setEnquiries([]);
        }
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      }
    };
    
    fetchData();
  }, []);

  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 4 Interactive Section Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Hero Card */}
        <Link to="/hero" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={26} />
            </div>
            <span className="badge badge-featured">Live Sync</span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Hero Banner Section
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            {heroCount} Banners
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--brand-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage Banner <ArrowRight size={14} />
          </div>
        </Link>

        {/* Services Card */}
        <Link to="/services" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={26} />
            </div>
            <span className="badge badge-active">Active</span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Services Offerings
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            {servicesCount} Services
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--brand-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </div>
        </Link>



        {/* Enquiries Card */}
        <Link to="/enquiry" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={26} />
            </div>
            <span className="badge badge-danger">{newEnquiriesCount} New</span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Customer Enquiries
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
            {enquiries.length} Inquiries
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--brand-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Review Leads <ArrowRight size={14} />
          </div>
        </Link>



      </div>

      {/* Split Section: Quick Recent Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Recent Leads */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Users size={18} color="var(--brand-blue)" /> Recent Leads
              </h3>
              <p className="card-subtitle">Latest incoming permit consultation requests</p>
            </div>
            <Link to="/enquiry" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {enquiries.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: '#F8FAFC', borderRadius: '10px' }}>
                No recent leads found.
              </div>
            ) : (
              enquiries.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '16px', borderRadius: '12px', background: '#FFFFFF', 
                  border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                onClick={() => navigate('/enquiry')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-blue)', fontWeight: 700 }}>
                      {item.name ? item.name.substring(0, 2).toUpperCase() : 'NA'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={12} /> {item.company || 'Individual'} 
                        <span style={{ color: '#CBD5E1' }}>|</span> 
                        <Layers size={12} /> {item.serviceNeeded}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span className={`badge ${item.status === 'New' ? 'badge-danger' : 'badge-warning'}`} style={{ padding: '4px 10px' }}>
                      {item.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
