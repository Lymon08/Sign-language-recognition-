# Sign Language Recognition

A monorepo project for sign language recognition using FastAPI backend and Vite + React frontend with TensorFlow-based image classification.

## Project Structure

```
sign-language-recognition/
├── packages/
│   ├── api/           # FastAPI server with TensorFlow models
│   └── client/        # Vite + React web interface
├── turbo.json         # Turbo monorepo config
├── package.json       # Root package config
└── README.md
```

## Features

### Backend (FastAPI)
- **Multiple pre-trained models**: MobileNetV2, ResNet50, VGG16
- **Image classification endpoints**:
  - `/predict` - Single model prediction with threshold filtering
  - `/compare` - Side-by-side comparison of all models
  - `/models` - List available models
  - `/health` - Health check endpoint
- **Processing time tracking**
- **CORS enabled** for frontend communication
- Built with **TensorFlow/Keras**

### Frontend (React + Vite)
- **Single/Compare modes** - Choose between single model or compare all 3
- **Model selection** - Select specific model
- **Confidence threshold slider** - Filter predictions (0-1)
- **Image preview** - Visual feedback before upload
- **Performance metrics** - Display processing time
- **Responsive grid layout** - Side-by-side model comparison
- **Progress bars** - Visual confidence indicators

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd packages/api

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd packages/client

# Install dependencies
npm install
```

## Running the Project

### Start Backend

```bash
cd packages/api
python main.py
```

Server runs on `http://localhost:8000`

### Start Frontend

In a new terminal:

```bash
cd packages/client
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### GET `/`
Base endpoint with available models and endpoints list.

```bash
curl http://localhost:8000/
```

### GET `/health`
Health check with TensorFlow version and loaded models.

```bash
curl http://localhost:8000/health
```

### GET `/models`
List available models.

```bash
curl http://localhost:8000/models
```

### POST `/predict`
Classify image with selected model.

**Query Parameters:**
- `model_name` (default: `mobilenetv2`) - Model to use: `mobilenetv2`, `resnet50`, `vgg16`
- `threshold` (default: `0.0`) - Confidence threshold (0-1)

**Request:**
```bash
curl -X POST -F "file=@image.jpg" "http://localhost:8000/predict?model_name=resnet50&threshold=0.3"
```

**Response:**
```json
{
  "model": "resnet50",
  "predictions": [
    {"label": "cat", "probability": 0.95},
    {"label": "kitten", "probability": 0.04}
  ],
  "processing_time_ms": 245.32,
  "threshold": 0.3
}
```

### POST `/compare`
Compare predictions across all models.

**Request:**
```bash
curl -X POST -F "file=@image.jpg" http://localhost:8000/compare
```

**Response:**
```json
{
  "model_comparisons": {
    "mobilenetv2": [
      {"label": "cat", "probability": 0.92}
    ],
    "resnet50": [
      {"label": "cat", "probability": 0.95}
    ],
    "vgg16": [
      {"label": "cat", "probability": 0.89}
    ]
  },
  "processing_time_ms": 756.45
}
```

## Development

### Building

```bash
# Build all packages
npm run build

# Build specific package
cd packages/client
npm run build
```

### Linting

```bash
# Lint all packages
npm run lint
```

## Dependencies

### Backend
- `fastapi==0.104.1` - Web framework
- `uvicorn==0.24.0` - ASGI server
- `tensorflow==2.14.0` - ML framework
- `numpy==1.24.3` - Numerical computing
- `pillow==10.1.0` - Image processing
- `python-multipart==0.0.6` - Form data parsing
- `pydantic==2.4.2` - Data validation

### Frontend
- `react` - UI framework
- `vite` - Build tool
- `typescript` - Type safety
- `axios` - HTTP client

## Performance Notes

- **Model loading**: Happens on server startup (5-10 seconds)
- **First inference**: 2-3 seconds (model warm-up)
- **Subsequent inferences**: 200-500ms depending on model
- **Processing time**: Displayed in UI for each prediction

## Models Info

| Model | Accuracy | Speed | Size |
|-------|----------|-------|------|
| MobileNetV2 | High | Fast | Small |
| ResNet50 | High | Medium | Medium |
| VGG16 | High | Slow | Large |

## Future Enhancements

- [ ] Custom sign language model training
- [ ] MediaPipe pose detection integration
- [ ] Batch image processing
- [ ] Model fine-tuning endpoint
- [ ] Image history/saved predictions
- [ ] Performance optimization (model quantization)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request
