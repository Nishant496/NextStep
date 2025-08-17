// NextStepLanding.jsx
import React, { useEffect, useRef } from 'react';
import './Landing.css';

const Landing = () => {
  const featuresRef = useRef(null);

  // Navigation handlers
  const handleLogin = () => {
    // Navigate to Login.jsx - replace with your routing logic
    window.location.href = '/login';
    // For React Router: navigate('/login');
  };

  const handleRegister = () => {
    // Navigate to signUp.jsx - replace with your routing logic
    window.location.href = '/signup';
    // For React Router: navigate('/signup');
  };

  const handleGetStarted = () => {
    // Navigate to signUp.jsx - replace with your routing logic
    window.location.href = '/signup';
    // For React Router: navigate('/signup');
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    // You can create an about section or redirect to about page
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">NextStep</div>
        <div className="nav-links">
          <span onClick={scrollToHome} className="nav-link">Home</span>
          <span onClick={scrollToAbout} className="nav-link">Features</span>
        </div>
        <div className="nav-buttons">
          <button onClick={handleLogin} className="nav-button">
            Login
          </button>
          <button onClick={handleRegister} className="nav-button">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-left">
          <h1>Welcome to NextStep</h1>
          <p>
            Your AI-powered platform for career growth, skill building, and 
            placement success. Transform your career journey with personalized 
            guidance and expert insights.
          </p>
          <button onClick={handleGetStarted} className="hero-btn">
            Get Started
          </button>
          <button onClick={handleLearnMore} className="hero-btn">
            Learn More
          </button>
        </div>
        <div className="hero-right">
          {/* Replace with your actual image */}
          <img 
            src="/images/NextStep.png" 
            alt="NextStep Platform Illustration" 
            className="hero-image"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hero-image-placeholder" style={{ display: 'none' }}>
            NextStep Platform
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features" ref={featuresRef}>
        <h2>Features of NextStep</h2>
        
        <div className="feature-card left">
          <h3>Profile Analysis</h3>
          <p>
            Get AI-driven insights into your skills, strengths, and career 
            potential. Our advanced algorithms analyze your background to 
            provide personalized recommendations.
          </p>
        </div>
        
        <div className="feature-card right">
          <h3>Roadmap Generator</h3>
          <p>
            Receive personalized learning paths tailored specifically to your 
            career goals. Every roadmap is crafted to maximize your growth 
            potential and success rate.
          </p>
        </div>
        
        <div className="feature-card left">
          <h3>Mock Interviews</h3>
          <p>
            Practice with our AI-powered interview simulator that provides 
            real-time feedback, helping you build confidence and improve 
            your performance before the actual interview.
          </p>
        </div>
        
        <div className="feature-card right">
          <h3>Placement Tips</h3>
          <p>
            Get expert guidance from industry professionals who know what 
            it takes to succeed. Learn insider tips and strategies to ace 
            your interviews and land your dream job.
          </p>
        </div>
        
        <div className="feature-card left">
          <h3>Community Support</h3>
          <p>
            Connect with mentors, peers, and industry experts in our vibrant 
            community. Share experiences, get advice, and grow together on 
            your career journey.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 NextStep. All Rights Reserved.</p>
        <p>Empowering careers with AI-driven insights and community support.</p>
      </footer>
    </div>
  );
};

export default Landing;