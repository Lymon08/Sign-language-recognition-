import React, { useState } from "react";
import "../styles/LearningModules.css";

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  lessons: number;
  estimatedTime: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  objective: string;
}

export default function LearningModules() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const modules: Module[] = [
    {
      id: 'basics',
      title: 'Sign Basics',
      description: 'Learn fundamental hand shapes and positions for sign language communication.',
      difficulty: 'Beginner',
      icon: '👋',
      lessons: 8,
      estimatedTime: '2 hours',
      progress: 100,
      status: 'completed',
      objective: 'Master the fundamentals of sign language'
    },
    {
      id: 'everyday',
      title: 'Everyday Signs',
      description: 'Common signs used in daily life and social interactions.',
      difficulty: 'Beginner',
      icon: '🤝',
      lessons: 12,
      estimatedTime: '3 hours',
      progress: 67,
      status: 'in-progress',
      objective: 'Learn 50+ everyday signs'
    },
    {
      id: 'phrases',
      title: 'Common Phrases',
      description: 'Learn how to form and understand complete phrases in sign language.',
      difficulty: 'Intermediate',
      icon: '💬',
      lessons: 15,
      estimatedTime: '4 hours',
      progress: 0,
      status: 'in-progress',
      objective: 'Build conversation skills'
    },
    {
      id: 'advanced',
      title: 'Advanced Grammar',
      description: 'Explore complex grammatical structures and nuanced expressions.',
      difficulty: 'Advanced',
      icon: '📚',
      lessons: 20,
      estimatedTime: '5 hours',
      progress: 0,
      status: 'locked',
      objective: 'Master advanced sign language concepts'
    },
    {
      id: 'emotions',
      title: 'Emotions & Expressions',
      description: 'Express complex emotions and facial expressions in sign language.',
      difficulty: 'Intermediate',
      icon: '😊',
      lessons: 10,
      estimatedTime: '2.5 hours',
      progress: 0,
      status: 'locked',
      objective: 'Convey emotions effectively'
    },
    {
      id: 'storytelling',
      title: 'Storytelling & Narratives',
      description: 'Learn to tell stories and narrate events using sign language.',
      difficulty: 'Advanced',
      icon: '📖',
      lessons: 12,
      estimatedTime: '3.5 hours',
      progress: 0,
      status: 'locked',
      objective: 'Master storytelling techniques'
    }
  ];

  const filteredModules = selectedFilter === 'all' 
    ? modules 
    : modules.filter(m => m.difficulty.toLowerCase() === selectedFilter.toLowerCase());

  const handleContinue = (moduleId: string) => {
    alert(`Continue learning: ${moduleId}`);
  };

  const handleReview = (moduleId: string) => {
    alert(`Review module: ${moduleId}`);
  };

  return (
    <div className="learning-modules-container">
      <div className="modules-header">
        <h1>📚 Learning Modules</h1>
        <p>Master sign language at your own pace with structured, progressive lessons</p>
      </div>

      <div className="modules-filter">
        <button 
          className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All Modules
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'beginner' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('beginner')}
        >
          Beginner
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'intermediate' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('intermediate')}
        >
          Intermediate
        </button>
        <button 
          className={`filter-btn ${selectedFilter === 'advanced' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('advanced')}
        >
          Advanced
        </button>
      </div>

      <div className="modules-grid">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <div key={module.id} className="module-card">
              <div className="module-image">
                <span style={{ fontSize: '60px' }}>{module.icon}</span>
                <div className="difficulty-badge" className={`difficulty-badge difficulty-${module.difficulty.toLowerCase()}`}>
                  {module.difficulty}
                </div>
                {module.status === 'locked' && (
                  <div className="locked-overlay">
                    🔒 Locked
                  </div>
                )}
              </div>

              <div className="module-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>

                <div className="module-meta">
                  <div className="meta-item">
                    <span>📖</span>
                    <span>{module.lessons} lessons</span>
                  </div>
                  <div className="meta-item">
                    <span>⏱️</span>
                    <span>{module.estimatedTime}</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="module-buttons">
                  <button 
                    className="btn-continue"
                    onClick={() => handleContinue(module.id)}
                    disabled={module.status === 'locked'}
                  >
                    {module.status === 'completed' ? '✓ Completed' : module.status === 'in-progress' ? 'Continue' : 'Start'}
                  </button>
                  {module.progress > 0 && (
                    <button 
                      className="btn-review"
                      onClick={() => handleReview(module.id)}
                      disabled={module.status === 'locked'}
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No modules found</h3>
            <p>Try selecting a different difficulty level</p>
          </div>
        )}
      </div>
    </div>
  );
}
