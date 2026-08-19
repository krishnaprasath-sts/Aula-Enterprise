import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';
import TextReveal from '../common/TextReveal';
import { fetchApi, formatImageUrl } from '../../config/api';

const Hero = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [heroData, setHeroData] = useState({
    title: 'Navigate Global Trade With Absolute Confidence.',
    subtitle: 'Smart permit declaration, customs clearance and trade compliance solutions that help Singapore businesses move goods faster, accurately and compliantly.',
    ctaText: 'Apply Permit',
    ctaLink: '/contact',
    mediaType: 'video',
    mediaUrl: '',
    trustRate: '100%',
    trustLabel: 'Customs Compliance Rate'
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await fetchApi(`/hero-banners?t=${Date.now()}`, { cache: 'no-store' });
        if (Array.isArray(data) && data.length > 0) {
          const active = data.find(b => b.status === 'Active') || data[0];
          if (active) {
            setHeroData({
              title: active.title || '',
              subtitle: active.subtitle || '',
              ctaText: active.ctaText || 'Apply Permit',
              ctaLink: active.ctaLink || '/contact',
              mediaType: active.mediaType || 'video',
              mediaUrl: formatImageUrl(active.mediaUrl),
              trustRate: active.trustRate || '100%',
              trustLabel: active.trustLabel || 'Customs Compliance Rate',
            });
          }
        }
      } catch (err) {
        console.warn('Hero banners API error:', err);
      }
    };

    fetchHero();
  }, []);

  // Ensure mobile video plays inline, muted, and loops properly
  useEffect(() => {
    if (videoRef.current && heroData.mediaType === 'video' && heroData.mediaUrl) {
      const vid = videoRef.current;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.setAttribute('muted', '');

      const playVideo = () => {
        const p = vid.play();
        if (p !== undefined) {
          p.catch((e) => {
            console.log('Mobile video autoplay deferred:', e);
          });
        }
      };

      vid.addEventListener('canplay', playVideo, { once: true });
      vid.addEventListener('loadeddata', playVideo, { once: true });
      
      // Fallback for mobile Low Power Mode: start video on first interaction
      const handleUserInteraction = () => {
        if (vid.paused) {
          vid.play().catch(() => {});
        }
      };
      window.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
      window.addEventListener('scroll', handleUserInteraction, { once: true, passive: true });
      window.addEventListener('click', handleUserInteraction, { once: true, passive: true });

      playVideo();

      return () => {
        vid.removeEventListener('canplay', playVideo);
        vid.removeEventListener('loadeddata', playVideo);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
        window.removeEventListener('click', handleUserInteraction);
      };
    }
  }, [heroData.mediaUrl, heroData.mediaType]);

  const animationConfig = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.1 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <>
      <section className="hero-section">
        {/* Full Screen Background Media from Admin Panel */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
          overflow: 'hidden',
          backgroundColor: '#0B1220'
        }}>
          {/* Contrast Overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(180deg, rgba(11, 18, 32, 0.6) 0%, rgba(11, 18, 32, 0.85) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }} />

          {heroData.mediaType === 'image' ? (
            heroData.mediaUrl ? (
              <img
                key={heroData.mediaUrl}
                src={heroData.mediaUrl}
                alt="Hero Background"
                className="hero-media"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            ) : null
          ) : (
            heroData.mediaUrl ? (
              <video
                ref={videoRef}
                key={heroData.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="metadata"
                className="hero-media"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              >
                <source src={heroData.mediaUrl} type="video/mp4" />
              </video>
            ) : null
          )}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            maxWidth: '850px', margin: '0', textAlign: 'left', paddingTop: '40px'
          }}>

            <TextReveal
              key={heroData.title}
              text={heroData.title}
              mode="lines"
              style={{
                color: '#FFFFFF',
                marginBottom: '1.75rem',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                fontWeight: 800
              }}
            />

            <motion.p
              key={heroData.subtitle}
              {...animationConfig}
              transition={{ ...animationConfig.transition, delay: 0.15 }}
              style={{
                fontSize: '1.25rem',
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '700px',
                marginBottom: '3rem',
                lineHeight: 1.7
              }}
            >
              {heroData.subtitle}
            </motion.p>

            <motion.div
              {...animationConfig}
              transition={{ ...animationConfig.transition, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-start' }}
            >
              <button
                onClick={() => {
                  if (heroData.ctaLink === 'modal') {
                    setModalOpen(true);
                  } else {
                    navigate(heroData.ctaLink || '/contact');
                  }
                }}
                className="btn-primary interactive"
                style={{ padding: '1.1rem 2.5rem', fontSize: '1.05rem', cursor: 'pointer', zIndex: 100, position: 'relative' }}
              >
                {heroData.ctaText} <ArrowRight size={20} />
              </button>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              {...animationConfig}
              transition={{ ...animationConfig.transition, delay: 0.45 }}
              className="hero-metrics"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '3rem', marginTop: '4.5rem',
                paddingTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                  {heroData.trustRate}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                  {heroData.trustLabel}
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        <style>{`
          .hero-video-btn:hover .play-icon-box {
            transform: scale(1.1);
            background-color: var(--brand-blue);
            border-color: var(--brand-blue);
          }
          
          .hero-media {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
          }

          @media (max-width: 768px) {
            .hero-media {
              /* Keep it as cover to avoid ugly black bars, 
                 but we can adjust the object-position if a specific side needs focus */
              object-position: center center;
            }
          }
        `}</style>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Hero;
