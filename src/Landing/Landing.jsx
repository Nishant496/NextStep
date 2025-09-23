import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import './Landing.css';

// ============================================================================
// PREMIUM DATA & CONFIGURATIONS
// ============================================================================

const FEATURES_DATA = [
  {
    id: 'ai-interview',
    title: 'AI-Powered Mock Interviews',
    description: 'Practice with advanced AI that simulates real interview scenarios with instant feedback and performance analytics.',
    icon: '🧠',
    color: 'from-violet-500 to-purple-600',
    stats: '95% Success Rate'
  },
  {
    id: 'aptitude-training', 
    title: 'Adaptive Aptitude Training',
    description: 'Personalized quantitative, logical, and verbal reasoning practice that adapts to your learning pace.',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-600',
    stats: '10K+ Questions'
  },
  {
    id: 'resume-optimizer',
    title: 'Smart Resume Analyzer',
    description: 'ATS-optimized resume analysis with industry-specific suggestions and keyword optimization.',
    icon: '📄',
    color: 'from-emerald-500 to-teal-600',
    stats: '89% ATS Pass Rate'
  },
  {
    id: 'career-roadmap',
    title: 'Personalized Career Roadmaps',
    description: 'Custom learning paths designed for your target companies and dream roles with milestone tracking.',
    icon: '🗺️',
    color: 'from-orange-500 to-red-600',
    stats: '500+ Companies'
  },
  {
    id: 'peer-learning',
    title: 'Collaborative Learning Hub',
    description: 'Connect with peers, join study groups, and participate in mock placement drives with real-time feedback.',
    icon: '👥',
    color: 'from-pink-500 to-rose-600',
    stats: '50K+ Community'
  },
  {
    id: 'placement-insights',
    title: 'Market Intelligence',
    description: 'Real-time placement trends, salary insights, and company-specific preparation strategies.',
    icon: '📊',
    color: 'from-indigo-500 to-blue-600',
    stats: 'Live Data'
  }
];

const TESTIMONIALS_DATA = [
  {
    name: 'Arjun Sharma',
    role: 'Software Engineer at Google',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format',
    content: 'NextStep completely transformed my interview skills. The AI feedback was spot-on and helped me land my dream job!',
    company: 'Google'
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist at Microsoft',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b9d0a15b?w=64&h=64&fit=crop&crop=face&auto=format',
    content: 'The personalized roadmap feature is incredible. It guided me step-by-step to my Microsoft offer.',
    company: 'Microsoft'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Product Manager at Amazon',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format',
    content: 'From zero PM experience to Amazon PM in 6 months. NextStep made the impossible possible!',
    company: 'Amazon'
  }
];

// ============================================================================
// PREMIUM COMPONENT
// ============================================================================

const LandingWithClerk = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Smooth scroll handler
  const scrollToSection = useCallback((ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleDashboard = useCallback(() => navigate('/dashboard'), [navigate]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-premium">
      {/* Floating Navigation */}
      <nav className={`nav-premium ${scrollY > 50 ? 'nav-premium--scrolled' : ''}`}>
        <div className="nav-premium__container">
          <div className="nav-premium__brand">
            <div className="nav-premium__logo">
              <div className="nav-premium__logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="nav-premium__logo-text">NextStep</span>
            </div>
            <span className="nav-premium__badge">AI-Powered</span>
          </div>

          <div className="nav-premium__links">
            <a href="#features" className="nav-premium__link">Features</a>
            <a href="#how-it-works" className="nav-premium__link">Process</a>
            <a href="#testimonials" className="nav-premium__link">Stories</a>
            <a href="#pricing" className="nav-premium__link">Pricing</a>
          </div>

          <div className="nav-premium__actions">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-premium btn-premium--ghost">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-premium btn-premium--primary">
                  Start Free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button onClick={handleDashboard} className="btn-premium btn-premium--primary">
                Dashboard
              </button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="hero-premium">
        <div className="hero-premium__bg">
          <div className="hero-premium__gradient"></div>
          <div className="hero-premium__grid"></div>
          <div className="hero-premium__orbs">
            <div className="orb orb--1"></div>
            <div className="orb orb--2"></div>
            <div className="orb orb--3"></div>
          </div>
        </div>

        <div className="hero-premium__container">
          <div className="hero-premium__content">
            <div className="hero-premium__badge animate-on-scroll">
              🚀 Trusted by 100K+ Students • 95% Success Rate
            </div>

            <h1 className="hero-premium__title animate-on-scroll">
              Your AI-Powered
              <span className="hero-premium__title-gradient"> Dream Job </span>
              Accelerator
            </h1>

            <p className="hero-premium__subtitle animate-on-scroll">
              Transform your placement journey with cutting-edge AI coaching, personalized 
              learning paths, and a thriving community of future tech leaders.
            </p>

            <div className="hero-premium__stats animate-on-scroll">
              <div className="stat-item">
                <div className="stat-item__number">100K+</div>
                <div className="stat-item__label">Students Placed</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">95%</div>
                <div className="stat-item__label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">500+</div>
                <div className="stat-item__label">Partner Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-item__number">4.9⭐</div>
                <div className="stat-item__label">User Rating</div>
              </div>
            </div>

            <div className="hero-premium__actions animate-on-scroll">
              <SignUpButton mode="modal">
                <button className="btn-premium btn-premium--primary btn-premium--xl">
                  Start Your Journey Free
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SignUpButton>
              <button 
                onClick={() => scrollToSection(featuresRef)}
                className="btn-premium btn-premium--secondary btn-premium--xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12L16 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Watch Demo
              </button>
            </div>

            <div className="hero-premium__social-proof animate-on-scroll">
              <p className="social-proof__text">Trusted by students at</p>
              <div className="company-logos">
                <div className="company-logo">Google</div>
                <div className="company-logo">Microsoft</div>
                <div className="company-logo">Amazon</div>
                <div className="company-logo">Meta</div>
                <div className="company-logo">Netflix</div>
              </div>
            </div>
          </div>

          <div className="hero-premium__visual animate-on-scroll">
            <div className="hero-premium__dashboard">
              <div className="dashboard-window">
                <div className="window-header">
                  <div className="window-controls">
                    <span className="control control--red"></span>
                    <span className="control control--yellow"></span>
                    <span className="control control--green"></span>
                  </div>
                  <div className="window-title">NextStep AI Dashboard</div>
                </div>
                
                <div className="window-content">
                  <div className="dashboard-sidebar">
                    <div className="sidebar-item sidebar-item--active">
                      🧠 AI Interview
                    </div>
                    <div className="sidebar-item">📊 Analytics</div>
                    <div className="sidebar-item">🗺️ Roadmap</div>
                    <div className="sidebar-item">👥 Community</div>
                  </div>
                  
                  <div className="dashboard-main">
                    <div className="interview-session">
                      <div className="session-header">
                        <div className="ai-avatar">
                          <div className="avatar-glow"></div>
                          🤖
                        </div>
                        <div className="session-info">
                          <h4>AI Interview Coach</h4>
                          <p className="status-live">🔴 Live Session</p>
                        </div>
                      </div>
                      
                      <div className="chat-messages">
                        <div className="message message--ai">
                          "Tell me about a challenging project you worked on and how you overcame obstacles..."
                        </div>
                        <div className="typing-indicator">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                      
                      <div className="session-metrics">
                        <div className="metric">
                          <span className="metric-label">Confidence</span>
                          <div className="metric-bar">
                            <div className="metric-fill" style={{width: '87%'}}></div>
                          </div>
                          <span className="metric-value">87%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Grid */}
      <section id="features" ref={featuresRef} className="features-premium">
        <div className="features-premium__container">
          <div className="section-header-premium animate-on-scroll">
            <div className="section-badge">✨ Powerful Features</div>
            <h2 className="section-title">Everything You Need to Land Your Dream Job</h2>
            <p className="section-subtitle">
              Comprehensive AI-powered tools designed by industry experts and validated by successful placements at top companies.
            </p>
          </div>

          <div className="features-premium__grid">
            {FEATURES_DATA.map((feature, index) => (
              <div key={feature.id} className={`feature-card-premium animate-on-scroll ${feature.color}`} style={{'--delay': `${index * 0.1}s`}}>
                <div className="feature-card-premium__header">
                  <div className="feature-card-premium__icon">
                    <span className="feature-icon">{feature.icon}</span>
                  </div>
                  <div className="feature-card-premium__stats">
                    {feature.stats}
                  </div>
                </div>
                
                <div className="feature-card-premium__content">
                  <h3 className="feature-card-premium__title">{feature.title}</h3>
                  <p className="feature-card-premium__description">{feature.description}</p>
                </div>

                <div className="feature-card-premium__footer">
                  <button className="feature-card-premium__cta">
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div className="feature-card-premium__gradient"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Premium Process */}
      <section id="how-it-works" className="process-premium">
        <div className="process-premium__container">
          <div className="section-header-premium animate-on-scroll">
            <div className="section-badge">🎯 Simple Process</div>
            <h2 className="section-title">Land Your Dream Job in 3 Steps</h2>
            <p className="section-subtitle">
              Our proven methodology has helped thousands of students secure offers at top tech companies.
            </p>
          </div>

          <div className="process-premium__steps">
            <div className="process-step animate-on-scroll">
              <div className="process-step__number">01</div>
              <div className="process-step__content">
                <div className="process-step__icon">🔍</div>
                <h3>Smart Assessment</h3>
                <p>Complete our comprehensive AI-powered skill assessment to identify your strengths and growth areas.</p>
                <div className="process-step__features">
                  <span className="feature-tag">15-min Assessment</span>
                  <span className="feature-tag">Skill Profiling</span>
                  <span className="feature-tag">Career Matching</span>
                </div>
              </div>
            </div>

            <div className="process-step animate-on-scroll">
              <div className="process-step__number">02</div>
              <div className="process-step__content">
                <div className="process-step__icon">🗺️</div>
                <h3>Personalized Roadmap</h3>
                <p>Receive a custom learning path with daily goals, milestones, and progress tracking tailored to your target companies.</p>
                <div className="process-step__features">
                  <span className="feature-tag">Custom Curriculum</span>
                  <span className="feature-tag">Daily Goals</span>
                  <span className="feature-tag">Progress Tracking</span>
                </div>
              </div>
            </div>

            <div className="process-step animate-on-scroll">
              <div className="process-step__number">03</div>
              <div className="process-step__content">
                <div className="process-step__icon">🚀</div>
                <h3>Practice & Excel</h3>
                <p>Engage with AI tools, practice with peers, and track your improvement with detailed analytics and real-time feedback.</p>
                <div className="process-step__features">
                  <span className="feature-tag">AI Practice</span>
                  <span className="feature-tag">Peer Learning</span>
                  <span className="feature-tag">Live Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Carousel */}
      <section id="testimonials" className="testimonials-premium">
        <div className="testimonials-premium__container">
          <div className="section-header-premium animate-on-scroll">
            <div className="section-badge">💬 Success Stories</div>
            <h2 className="section-title">What Our Community Says</h2>
            <p className="section-subtitle">
              Real results from real students who transformed their careers with NextStep.
            </p>
          </div>

          <div className="testimonials-premium__carousel">
            <div className="testimonial-track" style={{'--active': activeTestimonial}}>
              {TESTIMONIALS_DATA.map((testimonial, index) => (
                <div key={index} className={`testimonial-card ${index === activeTestimonial ? 'testimonial-card--active' : ''}`}>
                  <div className="testimonial-card__content">
                    <div className="testimonial-card__quote">
                      "{testimonial.content}"
                    </div>
                    <div className="testimonial-card__author">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="testimonial-card__avatar"
                      />
                      <div className="testimonial-card__info">
                        <div className="testimonial-card__name">{testimonial.name}</div>
                        <div className="testimonial-card__role">{testimonial.role}</div>
                        <div className="testimonial-card__company">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-card__decoration"></div>
                </div>
              ))}
            </div>

            <div className="testimonial-indicators">
              {TESTIMONIALS_DATA.map((_, index) => (
                <button 
                  key={index}
                  className={`indicator ${index === activeTestimonial ? 'indicator--active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="cta-premium">
        <div className="cta-premium__bg">
          <div className="cta-premium__gradient"></div>
        </div>
        
        <div className="cta-premium__container animate-on-scroll">
          <div className="cta-premium__content">
            <h2 className="cta-premium__title">
              Ready to Transform Your Career?
            </h2>
            <p className="cta-premium__subtitle">
              Join 100,000+ students who've accelerated their careers with NextStep. 
              Start your free trial today and experience the future of placement preparation.
            </p>
            
            <div className="cta-premium__benefits">
              <div className="benefit-item">✅ 14-day free trial</div>
              <div className="benefit-item">✅ No credit card required</div>
              <div className="benefit-item">✅ Cancel anytime</div>
              <div className="benefit-item">✅ 24/7 support included</div>
            </div>

            <div className="cta-premium__actions">
              <SignUpButton mode="modal">
                <button className="btn-premium btn-premium--white btn-premium--xl">
                  Start Free Trial
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </SignUpButton>
              <button className="btn-premium btn-premium--outline btn-premium--xl">
                Schedule Demo
              </button>
            </div>
            
            <div className="cta-premium__guarantee">
              🔒 30-day money-back guarantee
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Premium */}
      <footer className="footer-premium">
        <div className="footer-premium__container">
          <div className="footer-premium__content">
            <div className="footer-premium__brand">
              <div className="footer-premium__logo">
                <div className="footer-premium__logo-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="footer-premium__logo-text">NextStep</span>
              </div>
              <p className="footer-premium__description">
                Empowering the next generation of tech professionals with AI-powered 
                career acceleration tools and personalized guidance.
              </p>
            </div>

            <div className="footer-premium__links">
              <div className="footer-section">
                <h4>Platform</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#api">API</a></li>
                  <li><a href="#integrations">Integrations</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#guides">Career Guides</a></li>
                  <li><a href="#webinars">Webinars</a></li>
                  <li><a href="#community">Community</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#press">Press</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-premium__bottom">
            <p className="footer-premium__copyright">
              © 2025 NextStep AI. All rights reserved. Built with ❤️ for ambitious students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LandingNoAuth = () => (
  <div className="landing-premium landing-premium--no-auth">
    <nav className="nav-premium">
      <div className="nav-premium__container">
        <div className="nav-premium__brand">
          <div className="nav-premium__logo">
            <div className="nav-premium__logo-icon">NS</div>
            <span className="nav-premium__logo-text">NextStep</span>
          </div>
        </div>
        <div className="nav-premium__actions">
          <button className="btn-premium btn-premium--ghost" disabled>Sign In</button>
          <button className="btn-premium btn-premium--primary" disabled>Get Started</button>
        </div>
      </div>
    </nav>
    
    <main className="main-premium">
      <div className="no-auth-premium">
        <div className="no-auth-premium__icon">🔧</div>
        <h1 className="no-auth-premium__title">Setup Required</h1>
        <p className="no-auth-premium__description">
          Please configure your Clerk authentication keys to access the full NextStep experience.
        </p>
      </div>
    </main>
  </div>
);

const Landing = () => {
  const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  return hasClerk ? <LandingWithClerk /> : <LandingNoAuth />;
};

export default Landing;
