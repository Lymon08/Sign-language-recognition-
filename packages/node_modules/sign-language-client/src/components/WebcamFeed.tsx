import React, { useState, useEffect } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import '../styles/Webcam.css';

interface WebcamFeedProps {
  onFrameCapture?: (frame: HTMLCanvasElement) => void;
  isActive?: boolean;
}

function WebcamFeed({ onFrameCapture, isActive = false }: WebcamFeedProps, ref: React.Ref<HTMLVideoElement>) {
  const { videoRef, startWebcam, stopWebcam } = useWebcam();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const initializeCamera = async () => {
    try {
      setRetrying(true);
      setError(null);
      console.log('[WebcamFeed] Initializing camera...');
      
      await startWebcam();
      console.log('[WebcamFeed] Camera initialized successfully');
      
      setIsInitialized(true);
    } catch (err) {
      console.error('[WebcamFeed] Camera init error:', err);
      
      const errorMsg = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMsg);
      setIsInitialized(false);
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    initializeCamera();
    return () => { stopWebcam(); };
  }, []);

  const handleRetry = () => {
    setError(null);
    initializeCamera();
  };

  return (
    <div className="webcam-feed-wrapper">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`webcam-feed ${isActive ? 'recording' : ''}`}
      />
      
      {isActive && !error && (
        <div className="recording-indicator">
          <span className="recording-dot"></span>
          <span>RECORDING</span>
        </div>
      )}
      
      {!isInitialized && !error && (
        <div className="loading-overlay">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px', animation: 'spin 2s linear infinite' }}>
              ⏳
            </div>
            <p style={{ margin: '0', fontSize: '14px' }}>Initializing camera...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="loading-overlay error-overlay">
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '32px', marginBottom: '15px' }}>❌</div>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Camera Error</p>
            <p style={{ margin: '0 0 15px 0', fontSize: '12px', lineHeight: '1.4', maxWidth: '300px' }}>
              {error}
            </p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              style={{
                background: 'white',
                color: '#f44336',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: retrying ? 'not-allowed' : 'pointer',
                opacity: retrying ? 0.5 : 1,
                fontSize: '14px'
              }}
            >
              {retrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default React.forwardRef(WebcamFeed);
