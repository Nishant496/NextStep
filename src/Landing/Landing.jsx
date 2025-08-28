// Landing.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import './Landing.css';

// Clerk-enabled content
const LandingWithClerk = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // Navigation handlers - Updated for Clerk integration
  const handleGetStarted = () => {
    // This will be handled by Clerk's SignUpButton instead
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Navigate to dashboard for existing users
  const handleDashboard = () => {
    navigate('/dashboard'); // Navigate to dashboard.jsx for existing users
  };

  // Remove auto-redirect; Clerk handles post-auth routes via provider config
  useEffect(() => {
    if (!isLoaded) return;
  }, [isLoaded]);

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
        
        {/* Clerk Authentication Buttons */}
        <div className="nav-buttons">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="nav-button">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="nav-button">
                Register
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <button onClick={handleDashboard} className="nav-button">
              Dashboard
            </button>
            <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
              <button className="nav-button">
                Logout
              </button>
            </SignOutButton>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ml-2"
                }
              }}
            />
          </SignedIn>
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
          
          {/* Conditional Hero Buttons based on auth state */}
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="hero-btn">
                Get Started
              </button>
            </SignUpButton>
            <button onClick={handleLearnMore} className="hero-btn">
              Learn More
            </button>
          </SignedOut>
          
          <SignedIn>
            <button onClick={handleDashboard} className="hero-btn">
              Go to Dashboard
            </button>
            <button onClick={handleLearnMore} className="hero-btn">
              Learn More
            </button>
          </SignedIn>
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

// Fallback content when Clerk is not configured
const LandingNoAuth = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();

  const handleLearnMore = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="brand">NextStep</div>
        <div className="nav-links">
          <span onClick={scrollToHome} className="nav-link">Home</span>
          <span onClick={scrollToAbout} className="nav-link">Features</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-button" disabled title="Auth disabled in dev (no Clerk key)">Login</button>
          <button className="nav-button" disabled title="Auth disabled in dev (no Clerk key)">Register</button>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-left">
          <h1>Welcome to NextStep</h1>
          <p>
            Your AI-powered platform for career growth, skill building, and 
            placement success.
          </p>
          <button onClick={handleLearnMore} className="hero-btn">
            Learn More
          </button>
        </div>
        <div className="hero-right">
          <img 
            src="/images/NextStep.png" 
            alt="NextStep Platform Illustration" 
            className="hero-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hero-image-placeholder" style={{ display: 'none' }}>
            NextStep Platform
          </div>
        </div>
      </section>

      <section className="features" id="features" ref={featuresRef}>
        <h2>Features of NextStep</h2>
        <div className="feature-card left">
          <h3>Profile Analysis</h3>
          <p>Get AI-driven insights into your skills and strengths.</p>
        </div>
        <div className="feature-card right">
          <h3>Roadmap Generator</h3>
          <p>Receive personalized learning paths tailored to your goals.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 NextStep. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const Landing = () => {
  const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  return hasClerk ? <LandingWithClerk /> : <LandingNoAuth />;
};

export default Landing;