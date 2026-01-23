import React, { useEffect } from 'react';
import { speakText } from '../utils/speech';
import '../styles/PredictionOverlay.css';

interface PredictionOverlayProps {
  label: string;
  confidence: number;
  isCorrect?: boolean;
}

export default function PredictionOverlay({ label, confidence, isCorrect }: PredictionOverlayProps) {
  useEffect(() => {
    if (confidence > 0.75) {
      speakText(label);
    }
  }, [label, confidence]);

  const confidencePercentage = (confidence * 100).toFixed(1);
  const confidenceLevel = confidence > 0.9 ? 'high' : confidence > 0.75 ? 'medium' : 'low';

  return (
    <div className={`prediction-overlay ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="prediction-content">
        <div className="prediction-label-section">
          <h2 className="prediction-label">{label}</h2>
          <div className={`confidence-badge ${confidenceLevel}`}>
            {confidencePercentage}%
          </div>
        </div>

        <div className="prediction-status">
          {isCorrect !== undefined && (
            <>
              {isCorrect ? (
                <div className="status success">
                  <span className="checkmark">✓</span>
                  <span>Correct!</span>
                </div>
              ) : (
                <div className="status incorrect">
                  <span className="cross">✕</span>
                  <span>Try Again</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="confidence-meter">
          <div className="meter-bar">
            <div 
              className="meter-fill" 
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <div className="meter-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}