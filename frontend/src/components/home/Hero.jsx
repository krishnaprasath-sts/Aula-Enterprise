import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import ConsultationModal from '../common/ConsultationModal';
import TextReveal from '../common/TextReveal';

const DEFAULT_HERO = {
  title: 'Navigate Global Trade With Absolute Confidence.',
  subtitle: 'Smart permit declaration, customs clearance and trade compliance solutions that help Singapore businesses move goods faster, accurately and compliantly.',
  ctaText: 'Apply Permit',
  ctaLink: '/contact',
  mediaType: 'video',
  mediaUrl: '/src/assets/home.mp4',
  trustRate: '100%',
  trustLabel: 'Customs Compliance Rate'
};

const Hero = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [heroData, setHeroData] = useState(DEFAULT_HERO);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/hero-banners');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const active = data.find(b => b.status === 'Active') || data[0];
            if (active) {
              setHeroData({
                title: active.title || DEFAULT_HERO.title,
                subtitle: active.subtitle || DEFAULT_HERO.subtitle,
                ctaText: active.ctaText || DEFAULT_HERO.ctaText,
                ctaLink: active.ctaLink || DEFAULT_HERO.ctaLink,
                mediaType: active.mediaType || DEFAULT_HERO.mediaType,
                mediaUrl: active.mediaUrl || DEFAULT_HERO.mediaUrl,
                trustRate: active.trustRate || DEFAULT_HERO.trustRate,
                trustLabel: active.trustLabel || DEFAULT_HERO.trustLabel,
              });
            }
          }
        }
      } catch (err) {
        // Fallback to local storage or defaults
        const saved = localStorage.getItem('aula_hero_banners');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const active = parsed.find(b => b.status === 'Active') || parsed[0];
            if (active) setHeroData(active);
          } catch (e) {}
        }
      }
    };

    fetchHero();
  }, []);

  const animationConfig = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.1 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <>
      <section className="hero-section">
        {/* Full Screen Background Media */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1
        }}>
          {heroData.mediaType === 'image' ? (
            <img 
              src={heroData.mediaUrl || '/src/assets/hero.png'}
              alt="Hero Background"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <video
              src={heroData.mediaUrl || '/src/assets/home.mp4'}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
            />
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
        `}</style>
      </section>

      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Hero;
