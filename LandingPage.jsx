import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import logo from '../img/logo.png';
import introVideo from '../img/Untitled_Artwork.mp4';
import introImage from '../img/image.png';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseVisible, setIsMouseVisible] = useState(true);
  const [introPhase, setIntroPhase] = useState('video'); // 'video', 'video-with-image-fade', 'image', 'fade', 'complete'
  const [showIntro, setShowIntro] = useState(true);
  const [imageFadeOpacity, setImageFadeOpacity] = useState(0);
  const [imageFadeOut, setImageFadeOut] = useState(false);
  
  const highlightRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseVisible(true);
      
      if (highlightRef.current) {
        highlightRef.current.style.left = `${e.clientX}px`;
        highlightRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseLeave = () => {
      setIsMouseVisible(false);
    };

    const handleMouseEnter = () => {
      setIsMouseVisible(true);
    };

    // ESC key to skip intro
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showIntro) {
        skipIntro();
      }
    };

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
          
          // Start fading in image at 90% completion
          if (progress >= 0.9 && introPhase === 'video') {
            setIntroPhase('video-with-image-fade');
          }
          
          // Calculate fade opacity from 90% to 100%
          if (progress >= 0.9) {
            const fadeProgress = (progress - 0.9) / 0.1; // 0 to 1 over the last 10%
            setImageFadeOpacity(Math.min(fadeProgress, 1));
          }
        }
      };

      const handleVideoEnd = () => {
        // Video finished, now show image fully
        setIntroPhase('image');
        setImageFadeOpacity(1);
      };

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
      // Show image for 2.5 seconds, then start fade
      const timer = setTimeout(() => {
        setImageFadeOut(true);
        setIntroPhase('fade');
        // Complete fade after 3 seconds (matching CSS transition)
        setTimeout(() => {
          setIntroPhase('complete');
          setShowIntro(false);
        }, 3000);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
    alert('Thanks for joining the waitlist!');
    setEmail('');
  };

  const skipIntro = () => {
    setIntroPhase('complete');
    setShowIntro(false);
  };

  return (
    <div className="landing-page">
      {/* Video Intro Overlay */}
      {showIntro && (
        <div className={`intro-overlay ${introPhase}`}>
          {(introPhase === 'video' || introPhase === 'video-with-image-fade') && (
            <video
              ref={videoRef}
              className="intro-video"
              autoPlay
              muted
              playsInline
            >
              <source src={introVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          
          {(introPhase === 'video-with-image-fade' || introPhase === 'image' || introPhase === 'fade') && (
            <div 
              className="intro-image-overlay"
              style={{ opacity: imageFadeOpacity }}
            >
              <img 
                src={introImage} 
                alt="Intro" 
                className={`intro-image ${imageFadeOut ? 'fade-out' : ''}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Mouse highlight effect */}
      <div 
        ref={highlightRef}
        className={`mouse-highlight ${!isMouseVisible ? 'hidden' : ''}`}
      />
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">
            <img src={logo} alt="Cliquie Logo" className="logo-img"/>
          </span>
          <span className="logo-text">Cliquie</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-card">
            <h1 className="hero-title">
              Still consulting ChatGPT to talk to girls?
            </h1>
            <p className="hero-subtitle">We got you covered</p>
            
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <button type="submit" className="join-button">
                Join Waitlist
              </button>
            </form>
          </div>
        </div>

        {/* Why Join Section */}
        <div className="why-join-section">
          <h2 className="section-title">Why join Cliquie?</h2>
          <p className="section-subtitle">Get early access to our platform</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-content">
                <div className="feature-text">
                  <div className="feature-icon">💬</div>
                  <h3>Smart Conversation Starters</h3>
                  <p>Get personalized pickup lines and conversation topics that actually work on campus</p>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-content">
                <div className="feature-text">
                  <div className="feature-icon">🎯</div>
                  <h3>Campus Dating Intel</h3>
                  <p>Know which spots, events, and timing work best for meeting people at your university</p>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-content">
                <div className="feature-text">
                  <div className="feature-icon">🚀</div>
                  <h3>Confidence Boosters</h3>
                  <p>Daily tips and challenges to build your social skills and dating confidence naturally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 