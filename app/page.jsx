"use client";

import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [isMouseVisible, setIsMouseVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState('video');
  const [showIntro, setShowIntro] = useState(true);
  const [imageFadeOpacity, setImageFadeOpacity] = useState(0);
  const [imageFadeOut, setImageFadeOut] = useState(false);

  const highlightRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setIsMouseVisible(true);
      if (highlightRef.current) {
        highlightRef.current.style.left = `${e.clientX}px`;
        highlightRef.current.style.top = `${e.clientY}px`;
      }
    };
    const handleMouseLeave = () => setIsMouseVisible(false);
    const handleMouseEnter = () => setIsMouseVisible(true);
    const handleKeyDown = (e) => { if (e.key === 'Escape' && showIntro) skipIntro(); };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showIntro]);

  useEffect(() => {
    if (videoRef.current && (introPhase === 'video' || introPhase === 'video-with-image-fade')) {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        if (video.duration > 0) {
          const progress = video.currentTime / video.duration;
          if (progress >= 0.9 && introPhase === 'video') setIntroPhase('video-with-image-fade');
          if (progress >= 0.9) {
            const fadeProgress = (progress - 0.9) / 0.1;
            setImageFadeOpacity(Math.min(fadeProgress, 1));
          }
        }
      };
      const handleVideoEnd = () => { setIntroPhase('image'); setImageFadeOpacity(1); };
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleVideoEnd);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [introPhase]);

  useEffect(() => {
    if (introPhase === 'image') {
      const timer = setTimeout(() => {
        setImageFadeOut(true);
        setIntroPhase('fade');
        setTimeout(() => { setIntroPhase('complete'); setShowIntro(false); }, 3000);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for joining the waitlist, ${email}!`);
    setEmail('');
  };

  const skipIntro = () => { setIntroPhase('complete'); setShowIntro(false); };

  return (
    <div className="landing-page">
      {showIntro && (
        <div className={`intro-overlay ${introPhase}`}>
          {(introPhase === 'video' || introPhase === 'video-with-image-fade') && (
            <video ref={videoRef} className="intro-video" autoPlay muted playsInline>
              <source src="/img/Untitled_Artwork.mp4" type="video/mp4" />
            </video>
          )}
          {(introPhase === 'video-with-image-fade' || introPhase === 'image' || introPhase === 'fade') && (
            <div className="intro-image-overlay" style={{ opacity: imageFadeOpacity }}>
              <img src="/img/image.png" alt="Intro" className={`intro-image ${imageFadeOut ? 'fade-out' : ''}`} />
            </div>
          )}
        </div>
      )}

      <div ref={highlightRef} className={`mouse-highlight ${!isMouseVisible ? 'hidden' : ''}`} />

      <header className="header">
        <div className="logo">
          <span className="logo-icon">
            <img src="/img/logo.png" alt="Cliquie Logo" className="logo-img" />
          </span>
          <span className="logo-text">Cliquie</span>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-card">
            <h1 className="hero-title">Still consulting ChatGPT to talk to girls?</h1>
            <p className="hero-subtitle">We got you covered</p>
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="email-input" required />
              <button type="submit" className="join-button">Join Waitlist</button>
            </form>
          </div>
        </div>

        <div className="why-join-section">
          <h2 className="section-title">Why join Cliquie?</h2>
          <p className="section-subtitle">Get early access to our platform</p>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-content"><div className="feature-text"><div className="feature-icon">💬</div><h3>Smart Conversation Starters</h3><p>Get personalized pickup lines and conversation topics that actually work on campus</p></div></div></div>
            <div className="feature-card"><div className="feature-content"><div className="feature-text"><div className="feature-icon">🎯</div><h3>Campus Dating Intel</h3><p>Know which spots, events, and timing work best for meeting people at your university</p></div></div></div>
            <div className="feature-card"><div className="feature-content"><div className="feature-text"><div className="feature-icon">🚀</div><h3>Confidence Boosters</h3><p>Daily tips and challenges to build your social skills and dating confidence naturally</p></div></div></div>
          </div>
        </div>
      </main>
    </div>
  );
}