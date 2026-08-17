import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, Layers, Building2, Users, 
  LogOut, User, Bell, Search, ExternalLink, ChevronRight, FileCheck
} from 'lucide-react';
import logo from '../assets/logo.png';

import { setToken, setCurrentUser, getCurrentUser } from '../services/api';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={19} /> },
    { name: 'Hero Banner', path: '/hero', icon: <Sparkles size={19} /> },
    { name: 'Services', path: '/services', icon: <Layers size={19} /> },
    { name: 'Permit Types', path: '/permit-types', icon: <FileCheck size={19} /> },
    { name: 'Enquiries', path: '/enquiry', icon: <Users size={19} /> },
    { name: 'Contact Submissions', path: '/contact-submissions', icon: <Building2 size={19} /> },
  ];

  // Get human friendly page title for topbar
  const getPageInfo = () => {
    const p = location.pathname;
    if (p.includes('hero')) return { title: 'Hero Banner Management', section: 'Homepage' };
    if (p.includes('services')) return { title: 'Services Management', section: 'Content' };
    if (p.includes('permit-types')) return { title: 'Permit Types', section: 'Content' };
    if (p.includes('enquiry')) return { title: 'Consultation Enquiries', section: 'Leads' };
    if (p.includes('contact-submissions')) return { title: 'Contact Submissions', section: 'Leads' };
    return { title: 'Executive Dashboard', section: 'Overview' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo-container" style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <img src={logo} alt="AULA Logo" className="sidebar-logo" style={{ maxWidth: '150px', height: 'auto', borderRadius: '4px' }} />
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Navigation</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-left">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">
              <User size={20} />
            </div>
            <div className="admin-info">
              <span className="admin-name"> Admin</span>
              <span className="admin-role">
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title-group">
              <div className="topbar-breadcrumb">
                AULA Portal <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {pageInfo.section}
              </div>
              <span className="topbar-title">{pageInfo.title}</span>
            </div>
          </div>

          <div className="topbar-right">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
