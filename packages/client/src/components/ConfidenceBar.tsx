import React from 'react';

interface ConfidenceBarProps {
  confidence: number;
  label?: string;
}

export default function ConfidenceBar({ confidence, label }: ConfidenceBarProps) {
  const percentage = Math.round(confidence * 100);

  return (
    <div style={{ marginTop: '16px' }}>
      {label && <p style={{ marginBottom: '8px' }}>{label}</p>}
      <div
        style={{
          width: '100%',
          height: '24px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: confidence > 0.8 ? '#4caf50' : confidence > 0.6 ? '#ff9800' : '#f44336',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {percentage > 10 && `${percentage}%`}
        </div>
      </div>
    </div>
  );
}
