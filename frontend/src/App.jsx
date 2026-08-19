import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import CustomCursor from './components/common/CustomCursor';
import WhatsAppButton from './components/common/WhatsAppButton';

import Home from './pages/Home';
import About from './pages/About';
import PermitDeclaration from './pages/PermitDeclaration';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Contact from './pages/Contact';
import JoinAula from './pages/JoinAula';

// ScrollToTop helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <ReactLenis root>
        <Router>
          <CustomCursor />
          <WhatsAppButton />
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'clip' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/permit-declaration" element={<PermitDeclaration />} />
                  <Route path="/services" element={<Services />} />
                  {/* <Route path="/blog" element={<Blog />} /> */}
                  {/* <Route path="/blog/:id" element={<BlogDetails />} /> */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/join-aula" element={<JoinAula />} />
                </Routes>
              </PageTransition>
            </main>
            <Footer />
          </div>
        </Router>
      </ReactLenis>
    </HelmetProvider>
  );
}

export default App;
