from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.predict import router as predict_router
from api.routes.dashboard import router as dashboard_router
from api.routes.tutor import router as tutor_router
from api.routes.settings import router as settings_router

app = FastAPI(
    title="Sign Language Tutor API",
    description="CNN-LSTM based Sign Language Recognition with Text & Audio",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/predict", tags=["Prediction"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(tutor_router, prefix="/tutor", tags=["Learning"])
app.include_router(settings_router, prefix="/settings", tags=["Settings"])

@app.get("/")
def root():
    return {"status": "API running"}
