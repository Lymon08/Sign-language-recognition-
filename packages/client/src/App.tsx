import { useState, useEffect } from 'react'
import './App.css'

interface Prediction {
  label: string
  probability: number
}

interface PredictResponse {
  model: string
  predictions: Prediction[]
  processing_time_ms: number
  threshold: number
}

interface CompareResponse {
  model_comparisons: {
    [key: string]: Prediction[]
  }
  processing_time_ms: number
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<PredictResponse | null>(null)
  const [comparisons, setComparisons] = useState<CompareResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState('mobilenetv2')
  const [threshold, setThreshold] = useState(0)
  const [mode, setMode] = useState<'single' | 'compare'>('single')
  const [processingTime, setProcessingTime] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setError(null)
    }
  }

  const handlePredict = async () => {
    if (!file) {
      setError('Please select an image')
      return
    }

    setLoading(true)
    setError(null)
    setPredictions(null)
    setComparisons(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const url = mode === 'single' 
        ? `/api/predict?model_name=${selectedModel}&threshold=${threshold}`
        : '/api/compare'

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        if (mode === 'single') {
          setPredictions(data)
          setProcessingTime(data.processing_time_ms)
        } else {
          setComparisons(data)
          setProcessingTime(data.processing_time_ms)
        }
      }
    } catch (err) {
      setError(`Upload failed: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>Sign Language Recognition</h1>
      
      <div className="upload-section">
        <div className="controls">
          <div className="mode-selector">
            <label>
              <input 
                type="radio" 
                value="single" 
                checked={mode === 'single'}
                onChange={(e) => setMode(e.target.value as 'single' | 'compare')}
                disabled={loading}
              />
              Single Model
            </label>
            <label>
              <input 
                type="radio" 
                value="compare" 
                checked={mode === 'compare'}
                onChange={(e) => setMode(e.target.value as 'single' | 'compare')}
                disabled={loading}
              />
              Compare Models
            </label>
          </div>

          {mode === 'single' && (
            <>
              <div className="control-group">
                <label htmlFor="model-select">Model:</label>
                <select 
                  id="model-select"
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={loading}
                >
                  <option value="mobilenetv2">MobileNetV2</option>
                  <option value="resnet50">ResNet50</option>
                  <option value="vgg16">VGG16</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="threshold">Confidence Threshold: {threshold.toFixed(2)}</label>
                <input 
                  id="threshold"
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>

        <h2>Upload Image</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={loading}
        />
        
        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button 
          onClick={handlePredict} 
          disabled={!file || loading}
          className="primary-btn"
        >
          {loading ? 'Analyzing...' : mode === 'single' ? 'Predict' : 'Compare Models'}
        </button>

        {error && <p className="error">{error}</p>}

        {processingTime && (
          <p className="info">Processing time: {processingTime}ms</p>
        )}

        {predictions && (
          <div className="predictions">
            <h3>{predictions.model?.toUpperCase() || 'Model'} Predictions</h3>
            {predictions.threshold !== undefined && predictions.threshold > 0 && (
              <p className="threshold-info">Threshold: {predictions.threshold.toFixed(2)}</p>
            )}
            <ul>
              {predictions.predictions.map((pred, idx) => (
                <li key={idx}>
                  <span className="label">{pred.label}</span>
                  <span className="probability">
                    {(pred.probability * 100).toFixed(2)}%
                    <div className="bar" style={{ width: `${pred.probability * 100}%` }}></div>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comparisons && (
          <div className="comparisons">
            <h3>Model Comparison</h3>
            <div className="models-grid">
              {Object.entries(comparisons.model_comparisons).map(([modelName, preds]) => (
                <div key={modelName} className="model-card">
                  <h4>{modelName.toUpperCase()}</h4>
                  <ul>
                    {preds.slice(0, 3).map((pred, idx) => (
                      <li key={idx}>
                        <span className="label">{pred.label}</span>
                        <span className="probability">{(pred.probability * 100).toFixed(2)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
