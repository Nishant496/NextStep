import React, { useEffect, useRef } from 'react';
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

const LandingWithClerk = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();
  const { isLoaded } = useUser();

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDashboard = () => navigate('/dashboard');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-content">
          <div className="logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                <path d="M12 5a3 3 0 1 0-7.82 2.766 2.5 2.5 0 0 1-2.977 4.093 3.5 3.5 0 0 0 .142 5.56 5 5 0 0 0 8.653 2.016A5 5 0 0 0 12 21a5 5 0 0 0 4.996-3.565 5 5 0 0 0 8.653-2.016 3.5 3.5 0 0 0 .142-5.56 2.5 2.5 0 0 1-2.977-4.093A3 3 0 1 0 12 5Z"/>
                <path d="M12 5v16"/>
                <path d="M12 10v11"/>
                <path d="M12 15v6"/>
              </svg>
            </div>
            <span className="logo-text">NextStep</span>
          </div>
          <div className="nav-buttons">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-secondary">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary">Register</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button onClick={handleDashboard} className="btn btn-primary">
                Dashboard
              </button>
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="space-y-8 animate-on-scroll">
              <div>
                <h1 className="hero-title">
                  Your AI-powered<br/>
                  <span className="text-gradient">Placement Preparation</span><br/>
                  Partner
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                  Master your placement journey with personalized AI coaching, practice interviews, and comprehensive preparation tools designed for student success.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignUpButton mode="modal">
                  <button className="btn btn-primary">
                    Start Your Journey
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right" style={{marginLeft: "0.5rem"}}>
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </button>
                </SignUpButton>
                <button onClick={() => scrollToSection(featuresRef)} className="btn btn-secondary">
                  Learn More
                </button>
              </div>
            </div>
            <div className="p-8 bg-blue-100/50 rounded-2xl shadow-2xl animate-on-scroll">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                      <path d="M12 5a3 3 0 1 0-7.82 2.766 2.5 2.5 0 0 1-2.977 4.093 3.5 3.5 0 0 0 .142 5.56 5 5 0 0 0 8.653 2.016A5 5 0 0 0 12 21a5 5 0 0 0 4.996-3.565 5 5 0 0 0 8.653-2.016 3.5 3.5 0 0 0 .142-5.56 2.5 2.5 0 0 1-2.977-4.093A3 3 0 1 0 12 5Z"/>
                      <path d="M12 5v16"/>
                      <path d="M12 10v11"/>
                      <path d="M12 15v6"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Interview Coach</h3>
                    <p className="text-sm text-gray-500">Ready to practice with you</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">"Tell me about yourself and your career goals..."</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-200"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">Comprehensive tools and AI-powered features to accelerate your placement preparation</p>
          </div>
          <div className="features-grid">
            {['AI Interview Prep', 'Aptitude Training', 'Resume Analysis', 'Roadmap Generator', 'Placement Tips'].map((feature, index) => (
              <div key={feature} className="animate-on-scroll" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="feature-card">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                      <path d="M12 5a3 3 0 1 0-7.82 2.766 2.5 2.5 0 0 1-2.977 4.093 3.5 3.5 0 0 0 .142 5.56 5 5 0 0 0 8.653 2.016A5 5 0 0 0 12 21a5 5 0 0 0 4.996-3.565 5 5 0 0 0 8.653-2.016 3.5 3.5 0 0 0 .142-5.56 2.5 2.5 0 0 1-2.977-4.093A3 3 0 1 0 12 5Z"/>
                      <path d="M12 5v16"/>
                      <path d="M12 10v11"/>
                      <path d="M12 15v6"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-600">
                    {feature === 'AI Interview Prep' && 'Practice with intelligent AI interviewer with real-time feedback'}
                    {feature === 'Aptitude Training' && 'Master quantitative, logical, and verbal reasoning'}
                    {feature === 'Resume Analysis' && 'ATS-friendly analysis with actionable suggestions'}
                    {feature === 'Roadmap Generator' && 'Personalized learning paths for target companies'}
                    {feature === 'Placement Tips' && 'Expert guidance from industry professionals'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {['Sign Up & Assessment', 'Get Your Roadmap', 'Practice & Excel'].map((step, index) => (
              <div key={step} className="text-center animate-on-scroll" style={{ '--delay': `${index * 0.1}s` }}>
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-1/2 md:right-0 md:transform-none w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full font-bold text-xl border-4 border-white">
                    0{index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">
                  {step === 'Sign Up & Assessment' && 'Create profile and complete skill assessment'}
                  {step === 'Get Your Roadmap' && 'Receive personalized preparation plan'}
                  {step === 'Practice & Excel' && 'Use AI tools to practice and track progress'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 section">
        <div className="container text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Ace Your Placements?</h2>
          <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto">
            Join thousands of students who've transformed their careers with NextStep. Start your journey today and land your dream job tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="btn bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </button>
            </SignUpButton>
            <button className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 section">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                    <path d="M12 5a3 3 0 1 0-7.82 2.766 2.5 2.5 0 0 1-2.977 4.093 3.5 3.5 0 0 0 .142 5.56 5 5 0 0 0 8.653 2.016A5 5 0 0 0 12 21a5 5 0 0 0 4.996-3.565 5 5 0 0 0 8.653-2.016 3.5 3.5 0 0 0 .142-5.56 2.5 2.5 0 0 1-2.977-4.093A3 3 0 1 0 12 5Z"/>
                    <path d="M12 5v16"/>
                    <path d="M12 10v11"/>
                    <path d="M12 15v6"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">NextStep</span>
              </div>
              <p className="max-w-md text-sm">
                Empowering students with AI-powered placement preparation tools to achieve their career goals and land dream jobs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                {['AI Interview Prep', 'Aptitude Training', 'Resume Analysis', 'Roadmap Generator'].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 NextStep. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LandingNoAuth = () => (
  <div className="landing-page-container">
    <nav className="nav">
      <div className="container nav-content">
        <div className="logo">
          <div className="logo-icon">NS</div>
          <span className="logo-text">NextStep</span>
        </div>
        <div className="nav-buttons">
          <button className="btn btn-secondary" disabled>Login</button>
          <button className="btn btn-primary" disabled>Register</button>
        </div>
      </div>
    </nav>
  </div>
);

const Landing = () => {
  const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  return hasClerk ? <LandingWithClerk /> : <LandingNoAuth />;
};

export default Landing;
