import { useRef, useState, useCallback, useEffect } from "react";

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      console.log('[useWebcam] Starting webcam...');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }

      // Request camera with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log('[useWebcam] Got stream from camera');
      mediaStreamRef.current = stream;
      const video = videoRef.current;

      if (!video) {
        stream.getTracks().forEach(t => t.stop());
        throw new Error('Video element not available');
      }

      // Attach stream to video element
      video.srcObject = stream;
      console.log('[useWebcam] Stream attached to video element');

      // Wait for loadedmetadata event
      return new Promise<void>((resolve, reject) => {
        const onLoadedMetadata = () => {
          console.log('[useWebcam] Video metadata loaded');
          console.log('[useWebcam] Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          
          video.play()
            .then(() => {
              console.log('[useWebcam] Video playing successfully');
              setIsStreaming(true);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              resolve();
            })
            .catch(err => {
              console.error('[useWebcam] Play failed:', err);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              reject(err);
            });
        };

        const timeout = setTimeout(() => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          reject(new Error('Video metadata timeout'));
        }, 5000);

        video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
      });

    } catch (error) {
      console.error('[useWebcam] Error:', error);
      setIsStreaming(false);
      throw error;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    console.log('[useWebcam] Stopping webcam...');
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
  }, []);

  const captureFrame = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || !isStreaming) return null;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        console.warn('[useWebcam] Invalid canvas dimensions:', canvas.width, 'x', canvas.height);
        return null;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw video frame with mirror effect
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      });
    } catch (error) {
      console.error('[useWebcam] Capture error:', error);
      return null;
    }
  }, [isStreaming]);

  return { videoRef, canvasRef, startWebcam, stopWebcam, captureFrame, isStreaming };
};
