import { useState, useRef, useEffect } from 'react';
import { logPerformance } from '../services/api';
import PredictionOverlay from '../components/PredictionOverlay';
import ConfidenceBar from '../components/ConfidenceBar';
import WebcamFeed from '../components/WebcamFeed';
import { speakText } from '../utils/speech';
import '../styles/StudentPractice.css';

interface PredictionResult {
  label: string;
  confidence: number;
  all: Record<string, number>;
}

interface SessionStats {
  totalAttempts: number;
  correctPredictions: number;
  averageConfidence: number;
  predictions: Array<{ label: string; confidence: number; timestamp: string }>;
}

interface CapturedGesture {
  id: string;
  gesture: string;
  text: string;
  timestamp: string;
}

const SIGN_LABELS = ["good", "good_morning", "goodbye", "hello", "help", "meet", "nice", "thankyou"];

const GESTURE_TEXT_MAP: Record<string, string> = {
  'good': 'Good',
  'good_morning': 'Good morning',
  'goodbye': 'Goodbye',
  'hello': 'Hello',
  'help': 'Help',
  'meet': 'Meet',
  'nice': 'Nice',
  'thankyou': 'Thank you'
};

export default function StudentPractice() {
  const [targetSign, setTargetSign] = useState<string>(SIGN_LABELS[0]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | null>(null);
  const [capturedGestures, setCapturedGestures] = useState<CapturedGesture[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalAttempts: 0,
    correctPredictions: 0,
    averageConfidence: 0,
    predictions: []
  });
  const webcamRef = useRef<HTMLVideoElement>(null);
  const recordingRef = useRef(false);

  // Initialize speech synthesis
  useEffect(() => {
    const initSpeech = async () => {
      await speakText("Welcome to Sign Language Practice");
    };
    initSpeech();
  }, []);

  // Announce target sign
  useEffect(() => {
    const announceTarget = async () => {
      await speakText(`Please sign: ${targetSign}`);
    };
    announceTarget();
  }, [targetSign]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    recordingRef.current = true;
    setFeedback('Recording your sign...');
    setFeedbackType('warning');
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    recordingRef.current = false;
    setFeedback('Processing your sign...');
    setFeedbackType('warning');

    // Capture frame from webcam and send to API
    if (webcamRef.current && webcamRef.current.readyState === webcamRef.current.HAVE_ENOUGH_DATA) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(webcamRef.current, 0, 0);
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              const formData = new FormData();
              formData.append('file', blob, 'frame.jpg');
              
              try {
                const response = await fetch('http://localhost:8001/predict/frame', {
                  method: 'POST',
                  body: formData
                });
                
                const prediction = await response.json();
                
                if (prediction.label && prediction.label !== 'error') {
                  setResult(prediction);
                  await processResult(prediction);
                } else {
                  setFeedback('Could not process frame. Please try again.');
                  setFeedbackType('error');
                  await speakText('Could not process frame. Please try again.');
                }
              } catch (error) {
                console.error('API Error:', error);
                setFeedback('Connection error. Please try again.');
                setFeedbackType('error');
                await speakText('Connection error. Please try again.');
              }
            }
          }, 'image/jpeg', 0.9);
        }
      } catch (error) {
        console.error('Error capturing frame:', error);
        setFeedback('Error capturing frame. Please try again.');
        setFeedbackType('error');
      }
    } else {
      setFeedback('Camera not ready. Please try again.');
      setFeedbackType('error');
    }
  };

  const processResult = async (prediction: PredictionResult) => {
    const isCorrect = prediction.label === targetSign;
    const gestureText = GESTURE_TEXT_MAP[prediction.label] || prediction.label;
    
    // Add to captured gestures
    const newGesture: CapturedGesture = {
      id: Date.now().toString(),
      gesture: prediction.label,
      text: gestureText,
      timestamp: new Date().toLocaleTimeString()
    };
    setCapturedGestures(prev => [newGesture, ...prev].slice(0, 10));
    
    // Update stats
    const newStats = { ...sessionStats };
    newStats.totalAttempts += 1;
    if (isCorrect) newStats.correctPredictions += 1;
    newStats.averageConfidence = (newStats.averageConfidence * (newStats.totalAttempts - 1) + prediction.confidence) / newStats.totalAttempts;
    newStats.predictions.push({
      label: prediction.label,
      confidence: prediction.confidence,
      timestamp: new Date().toLocaleTimeString()
    });
    setSessionStats(newStats);

    // Set feedback
    if (isCorrect) {
      if (prediction.confidence > 0.9) {
        setFeedback('Excellent! Perfect sign!');
        await speakText('Excellent! Perfect sign!');
        setFeedbackType('success');
      } else if (prediction.confidence > 0.75) {
        setFeedback('Good! Refine your hand motion slightly.');
        await speakText('Good! Refine your hand motion slightly.');
        setFeedbackType('success');
      } else {
        setFeedback('Correct, but try with better clarity.');
        await speakText('Correct, but try with better clarity.');
        setFeedbackType('success');
      }
    } else {
      setFeedback(`That's ${prediction.label}, but we want ${targetSign}. Try again!`);
      await speakText(`That's ${prediction.label}, but we want ${targetSign}. Try again!`);
      setFeedbackType('error');
    }

    // Speak the gesture text
    await speakText(`You signed: ${gestureText}`);

    // Log to backend
    try {
      await logPerformance({
        studentId: 'student_' + Date.now(),
        targetSign: targetSign,
        predictedSign: prediction.label,
        confidence: prediction.confidence,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log performance:', error);
    }
  };

  const handleNextSign = () => {
    const currentIdx = SIGN_LABELS.indexOf(targetSign);
    const nextIdx = (currentIdx + 1) % SIGN_LABELS.length;
    setTargetSign(SIGN_LABELS[nextIdx]);
    setResult(null);
    setFeedback('');
    setFeedbackType(null);
  };

  const accuracy = sessionStats.totalAttempts > 0 
    ? ((sessionStats.correctPredictions / sessionStats.totalAttempts) * 100).toFixed(1)
    : '0';

  return (
    <div className="student-practice">
      <div className="practice-container">
        <header className="practice-header">
          <h1>🤝 Sign Language Practice</h1>
          <p className="subtitle">Learn sign language through interactive practice</p>
        </header>

        <div className="practice-content">
          {/* Left side - Video and target */}
          <div className="practice-left">
            <div className="target-sign-card">
              <h2 className="target-label">Target Sign</h2>
              <div className="target-sign-display">{targetSign}</div>
              <button className="btn-primary" onClick={handleNextSign} disabled={isRecording}>
                Next Sign
              </button>
            </div>

            <div className="webcam-container">
              <WebcamFeed isActive={isRecording} ref={webcamRef} />
              <div className="recording-controls">
                {!isRecording ? (
                  <button className="btn-record" onClick={handleStartRecording}>
                    🎥 Start Recording
                  </button>
                ) : (
                  <button className="btn-stop" onClick={handleStopRecording}>
                    ⏹️ Stop Recording
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Results and stats */}
          <div className="practice-right">
            {result && (
              <div className="prediction-section">
                <h3>Prediction Result</h3>
                <PredictionOverlay 
                  label={result.label} 
                  confidence={result.confidence}
                  isCorrect={result.label === targetSign}
                />
                
                <div className="confidence-details">
                  <h4>All Predictions:</h4>
                  {Object.entries(result.all)
                    .sort(([, a], [, b]) => b - a)
                    .map(([label, conf]) => (
                      <div key={label} className="confidence-row">
                        <span className="label">{label}</span>
                        <ConfidenceBar confidence={conf} />
                        <span className="value">{(conf * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {feedback && (
              <div className={`feedback-box feedback-${feedbackType}`}>
                <p>{feedback}</p>
              </div>
            )}

            <div className="session-stats">
              <h3>Session Statistics</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-label">Attempts</span>
                  <span className="stat-value">{sessionStats.totalAttempts}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Correct</span>
                  <span className="stat-value">{sessionStats.correctPredictions}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-value">{accuracy}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Avg Confidence</span>
                  <span className="stat-value">{(sessionStats.averageConfidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {sessionStats.predictions.length > 0 && (
                <div className="predictions-history">
                  <h4>Recent Predictions:</h4>
                  <ul>
                    {sessionStats.predictions.slice(-5).reverse().map((pred, idx) => (
                      <li key={idx}>
                        <span className="pred-time">{pred.timestamp}</span>
                        <span className="pred-label">{pred.label}</span>
                        <span className="pred-conf">{(pred.confidence * 100).toFixed(0)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {capturedGestures.length > 0 && (
              <div className="captured-gestures">
                <h3>📝 Captured Gestures & Text</h3>
                <div className="gestures-list">
                  {capturedGestures.map((gesture) => (
                    <div key={gesture.id} className="gesture-card">
                      <div className="gesture-header">
                        <span className="gesture-icon">👋</span>
                        <div className="gesture-info">
                          <div className="gesture-sign">{gesture.gesture}</div>
                          <div className="gesture-time">{gesture.timestamp}</div>
                        </div>
                      </div>
                      <div className="gesture-text-display">
                        <span className="gesture-text-label">Text:</span>
                        <span className="gesture-text">{gesture.text}</span>
                        <button 
                          className="btn-speak" 
                          onClick={() => speakText(gesture.text)}
                          title="Speak this text"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
