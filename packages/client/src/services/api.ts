import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface PredictionResult {
  label: string;
  confidence: number;
  all: Record<string, number>;
}

export interface PerformanceLog {
  studentId: string;
  targetSign: string;
  predictedSign: string;
  confidence: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface StudentStats {
  studentId: string;
  totalAttempts: number;
  correctPredictions: number;
  accuracy: number;
  averageConfidence: number;
  signPerformance: Record<string, { correct: number; total: number }>;
}

export interface DashboardMetrics {
  total_predictions: number;
  usage_by_label: Record<string, number>;
  [key: string]: any;
}

export const predictSign = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post<PredictionResult>('/predict', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const logPerformance = (data: PerformanceLog) => {
  return api.post('/predict/log', data);
};

export const getStudentStats = (studentId: string) => {
  return api.get<StudentStats>(`/dashboard/student/${studentId}`);
};

export const getStudentPerformance = (studentId: string, targetSign?: string) => {
  const params = new URLSearchParams();
  if (targetSign) params.append('sign', targetSign);
  return api.get(`/dashboard/performance/${studentId}?${params.toString()}`);
};

export const fetchDashboard = () => {
  return api.get<DashboardMetrics>('/dashboard');
};

export const getAllStudents = () => {
  return api.get('/dashboard/students');
};

export const getSignStatistics = (sign: string) => {
  return api.get(`/dashboard/signs/${sign}`);
};

export const fetchModules = () => {
  return api.get('/tutor/modules');
};

export const getTutorSession = (studentId: string, file: File, targetSign: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('target', targetSign);
  return api.post('/tutor', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getSettings = () => {
  return api.get('/settings');
};

export const updateSettings = (settings: any) => {
  return api.post('/settings', settings);
};

export default api;