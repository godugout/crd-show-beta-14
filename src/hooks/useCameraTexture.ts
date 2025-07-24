import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

export const useCameraTexture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const startCamera = useCallback(async () => {
    console.log('🎥 Starting camera...');
    try {
      // Request camera permission and get video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // Front-facing camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      
      // Wait for video to load
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      videoRef.current = video;

      // Create Three.js video texture
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;
      videoTexture.flipY = false;

      setTexture(videoTexture);
      setIsActive(true);
      setError(null);
      setHasPermission(true);

      console.log('📷 Camera texture initialized successfully');
    } catch (err) {
      console.error('❌ Camera access failed:', err);
      setError(err instanceof Error ? err.message : 'Camera access failed');
      setIsActive(false);
      setHasPermission(false);
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setHasPermission(false);
  };

  return {
    texture,
    isActive,
    error,
    hasPermission,
    startCamera,
    stopCamera
  };
};