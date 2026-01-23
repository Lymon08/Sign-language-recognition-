import React, { useState } from 'react';
import StudentPractice from './pages/Student_Practice';
import EducatorDashboard from './pages/Educator_Dashboard';
import LearningModules from './pages/Learning_Modules';
import Settings from './pages/Settings';
import './App.css';

type PageType = 'home' | 'practice' | 'dashboard' | 'modules' | 'settings';

interface NavItem {
  id: PageType;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'practice', label: 'Student Practice', icon: '🤝', description: 'Real-time sign language practice' },
  { id: 'modules', label: 'Learning Modules', icon: '📚', description: 'Structured courses' },
  { id: 'dashboard', label: 'Educator Dashboard', icon: '📊', description: 'Monitor student progress' },
  { id: 'settings', label: 'Settings & Compliance', icon: '⚙️', description: 'Privacy & configuration' }
];

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div className="header-content">
            <div className="header-icon">🤝</div>
            <h1>Sign Learn Tutor</h1>
            <p className="tagline">Inclusive Sign Language Learning Platform</p>
            <p className="description">
              Master sign language through interactive practice, real-time feedback, and comprehensive learning modules. 
              Learn at your own pace with AI-powered recognition and personalized guidance.
            </p>
            <button className="btn-hero" onClick={() => onNavigate('practice')}>
              🎥 Start Practice Session
            </button>
          </div>
        </header>

        <div className="home-features">
          <div className="feature-card">
            <span className="feature-icon">🎥</span>
            <h3>Real-Time Recognition</h3>
            <p>Webcam-based sign recognition with instant feedback</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Personalized Learning</h3>
            <p>Adaptive difficulty levels and targeted practice</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📈</span>
            <h3>Progress Tracking</h3>
            <p>Detailed analytics and performance insights</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔊</span>
            <h3>Audio Support</h3>
            <p>Text-to-speech guidance and pronunciation</p>
          </div>
        </div>

        <nav className="home-nav-grid">
          {navItems.map(item => (
            <button
              key={item.id}
              className="nav-card"
              onClick={() => onNavigate(item.id)}
            >
              <div className="nav-card-icon">{item.icon}</div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </button>
          ))}
        </nav>

        <section className="signs-showcase">
          <h2>Signs You'll Master</h2>
          <div className="signs-grid">
            {['good', 'good_morning', 'goodbye', 'hello', 'help', 'meet', 'nice', 'thankyou'].map(sign => (
              <div key={sign} className="sign-item">
                <span className="sign-emoji">👋</span>
                <span className="sign-name">{sign.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'practice':
        return <StudentPractice />;
      case 'dashboard':
        return <EducatorDashboard />;
      case 'modules':
        return <LearningModules />;
      case 'settings':
        return <Settings />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-container">
          <button className="nav-brand" onClick={() => setCurrentPage('home')} title="Go to home">
            <span className="brand-icon">🤝</span>
            <div className="brand-text-group">
              <span className="brand-text">Sign Learn Tutor</span>
              <span className="brand-subtitle">Inclusive Sign Language Learning</span>
            </div>
          </button>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                  title={item.description}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="app-main">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Sign Learn Tutor - Inclusive Sign Language Learning Platform</p>
        <p>Commited to National University of Science and Technology</p>
      </footer>
    </div>
  );
}

export default App;
