import React, { useState } from 'react';
import '../styles/Settings.css';

interface SettingsState {
  audioFeedback: boolean;
  anonymousAnalytics: boolean;
  performanceMonitoring: boolean;
  videoDataStorage: boolean;
  thirdPartySharing: boolean;
  emailNotifications: boolean;
  dataRetention: 'never' | '1year' | '2years' | '5years';
  theme: 'light' | 'dark';
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    audioFeedback: true,
    anonymousAnalytics: true,
    performanceMonitoring: true,
    videoDataStorage: false,
    thirdPartySharing: false,
    emailNotifications: true,
    dataRetention: '2years',
    theme: 'light'
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (key: keyof SettingsState) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSelectChange = (key: keyof SettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      audioFeedback: true,
      anonymousAnalytics: true,
      performanceMonitoring: true,
      videoDataStorage: false,
      thirdPartySharing: false,
      emailNotifications: true,
      dataRetention: '2years',
      theme: 'light'
    });
  };

  const ToggleSwitch = ({ value }: { value: boolean }) => (
    <div className={`toggle-switch ${value ? 'active' : ''}`}></div>
  );

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        <div className="settings-header">
          <h1>⚙️ Settings & Compliance</h1>
          <p>Manage your privacy, data, and learning preferences</p>
        </div>

        {showSuccess && (
          <div className="success-message">
            <span>✓</span>
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="settings-grid">
          {/* Audio & Learning Preferences */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">🔊</div>
              <h2 className="card-title">Audio & Learning</h2>
            </div>
            <p className="card-description">Control audio feedback and learning notifications</p>
            
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Audio Feedback</span>
                  <span className="setting-description">Text-to-speech feedback during practice</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.audioFeedback ? 'active' : ''}`}
                  onClick={() => handleToggle('audioFeedback')}
                >
                  <ToggleSwitch value={settings.audioFeedback} />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Email Notifications</span>
                  <span className="setting-description">Receive progress updates via email</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`}
                  onClick={() => handleToggle('emailNotifications')}
                >
                  <ToggleSwitch value={settings.emailNotifications} />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Display Theme</span>
                  <span className="setting-description">Choose your preferred interface theme</span>
                </div>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleSelectChange('theme', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Data Collection */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">🔒</div>
              <h2 className="card-title">Privacy & Data</h2>
            </div>
            <p className="card-description">Control how your data is collected and used</p>
            
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Anonymous Analytics</span>
                  <span className="setting-description">Help improve app with usage analytics</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.anonymousAnalytics ? 'active' : ''}`}
                  onClick={() => handleToggle('anonymousAnalytics')}
                >
                  <ToggleSwitch value={settings.anonymousAnalytics} />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Performance Monitoring</span>
                  <span className="setting-description">Track your learning progress</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.performanceMonitoring ? 'active' : ''}`}
                  onClick={() => handleToggle('performanceMonitoring')}
                >
                  <ToggleSwitch value={settings.performanceMonitoring} />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Video Data Storage</span>
                  <span className="setting-description">Store recordings for model improvement</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.videoDataStorage ? 'active' : ''}`}
                  onClick={() => handleToggle('videoDataStorage')}
                >
                  <ToggleSwitch value={settings.videoDataStorage} />
                </button>
              </div>

              <div className="warning-box">
                <h4>⚠️ Important</h4>
                <p>Video data storage helps train better models but requires explicit consent due to privacy concerns.</p>
              </div>
            </div>
          </div>

          {/* Compliance & Data Retention */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">📋</div>
              <h2 className="card-title">Compliance</h2>
            </div>
            <p className="card-description">Our commitment to privacy and data protection</p>
            
            <div className="badges-grid">
              <div className="badge">
                <span className="badge-check">✓</span>
                <span>GDPR Compliant</span>
              </div>
              <div className="badge">
                <span className="badge-check">✓</span>
                <span>FERPA Compliant</span>
              </div>
              <div className="badge">
                <span className="badge-check">✓</span>
                <span>COPPA Compliant</span>
              </div>
              <div className="badge">
                <span className="badge-check">✓</span>
                <span>End-to-End Encryption</span>
              </div>
            </div>

            <div className="setting-item" style={{ marginTop: '20px' }}>
              <div className="setting-label">
                <span className="setting-name">Data Retention Period</span>
                <span className="setting-description">How long we keep your data after deletion</span>
              </div>
              <select 
                value={settings.dataRetention}
                onChange={(e) => handleSelectChange('dataRetention', e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                <option value="never">Never (Permanent)</option>
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
                <option value="5years">5 Years</option>
              </select>
            </div>

            <div className="info-box">
              <h4>🛡️ Your Privacy Matters</h4>
              <p>We are committed to protecting your data with industry-leading security standards and transparent privacy practices.</p>
            </div>
          </div>

          {/* Third-Party & Sharing */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">🔗</div>
              <h2 className="card-title">Data Sharing</h2>
            </div>
            <p className="card-description">Control third-party data sharing and integrations</p>
            
            <div className="settings-section">
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">Third-Party Sharing</span>
                  <span className="setting-description">Share data with research partners</span>
                </div>
                <button 
                  className={`toggle-switch ${settings.thirdPartySharing ? 'active' : ''}`}
                  onClick={() => handleToggle('thirdPartySharing')}
                >
                  <ToggleSwitch value={settings.thirdPartySharing} />
                </button>
              </div>

              {settings.thirdPartySharing && (
                <div className="warning-box">
                  <h4>⚠️ Third-Party Access</h4>
                  <p>Your anonymized learning data will be shared with research institutions to improve sign language recognition technology.</p>
                </div>
              )}

              <div className="info-box">
                <h4>🤝 Research Partners</h4>
                <p>We partner with leading universities and research institutions to advance sign language technology. All data sharing follows strict ethical guidelines.</p>
              </div>
            </div>
          </div>

          {/* Account & Data Management */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">👤</div>
              <h2 className="card-title">Account</h2>
            </div>
            <p className="card-description">Manage your account and personal data</p>
            
            <div className="settings-section">
              <button 
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '2px solid #f44336',
                  color: '#f44336',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffebee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                📥 Download My Data (GDPR)
              </button>
              <button 
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '2px solid #f44336',
                  color: '#f44336',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffebee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                🗑️ Delete My Account
              </button>
            </div>

            <div className="info-box">
              <h4>ℹ️ Data Deletion</h4>
              <p>When you delete your account, all personal data will be permanently removed within 30 days in compliance with GDPR regulations.</p>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSave}>
            💾 Save Settings
          </button>
          <button className="btn-reset" onClick={handleReset}>
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
