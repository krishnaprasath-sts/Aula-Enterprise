import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Hero from './pages/Hero';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ContactSubmissions from './pages/ContactSubmissions';
import Enquiry from './pages/Enquiry';

import PermitTypes from './pages/PermitTypes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* JWT Protected Routes Wrapper */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero" element={<Hero />} />
          <Route path="services" element={<Services />} />
          <Route path="permit-types" element={<PermitTypes />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="enquiry" element={<Enquiry />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
