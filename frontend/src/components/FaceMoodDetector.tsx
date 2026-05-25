
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Webcam, AlertCircle, Camera, RefreshCw, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface FaceMoodDetectorProps {
  onMoodDetected: (mood: string) => void;
}

const FaceMoodDetector: React.FC<FaceMoodDetectorProps> = ({ onMoodDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);

  // Map expression to our mood categories
  const mapExpressionToMood = (expression: faceapi.FaceExpressions): string => {
    const maxProb = Math.max(
      expression.happy, 
      expression.sad, 
      expression.angry, 
      expression.neutral
    );
    
    if (expression.happy === maxProb) return 'happy';
    if (expression.sad === maxProb) return 'sad';
    if (expression.angry === maxProb) return 'anxious'; // We'll map angry to anxious in our system
    return 'neutral';
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        // Load models from public directory
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        
        setModelsLoaded(true);
        console.log('Face detection models loaded');
      } catch (error) {
        console.error('Error loading face-api models:', error);
        toast.error("Failed to load face detection models");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModels();
    
    return () => {
      // Clean up webcam when component unmounts
      if (isWebcamActive) {
        stopWebcam();
      }
    };
  }, []);

  // Start webcam
  const startWebcam = async () => {
    if (!modelsLoaded) {
      toast.error("Face detection models are not loaded yet");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast.error("Could not access webcam. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
      setDetectedMood(null);
    }
  };

  // Detect mood from webcam
  const detectMood = async () => {
    if (!isWebcamActive || !videoRef.current || !canvasRef.current || !modelsLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // Make detection
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        // Display result on canvas
        const displaySize = { width: 640, height: 480 };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        }
        
        // Map expression to our mood categories
        const mood = mapExpressionToMood(detections.expressions);
        setDetectedMood(mood);
        
        // Send mood to parent component
        onMoodDetected(mood);
        
        toast.success(`Detected mood: ${mood}`);
      } else {
        toast.warning("No face detected. Please adjust your position.");
      }
    } catch (error) {
      console.error('Error detecting mood:', error);
      toast.error("Error during mood detection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Camera className="w-5 h-5 mr-2 text-calmBlue-500" />
          Webcam Mood Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-md overflow-hidden">
            <video 
              ref={videoRef}
              className="w-full h-auto"
              autoPlay
              playsInline
              muted
              style={{ display: isWebcamActive ? 'block' : 'none' }}
            />
            
            {!isWebcamActive && (
              <div className="flex items-center justify-center h-40 bg-gray-100 border border-dashed border-gray-300 rounded-md">
                <div className="text-center text-gray-500">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p>Start webcam to detect your mood</p>
                </div>
              </div>
            )}
            
            <canvas 
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full" 
            />
          </div>

          <div className="flex space-x-3">
            {!isWebcamActive ? (
              <Button
                onClick={startWebcam}
                disabled={isLoading || !modelsLoaded}
                className="flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                Start Camera
              </Button>
            ) : (
              <>
                <Button
                  onClick={detectMood}
                  disabled={isLoading}
                  className="flex-1 bg-calmBlue-500 hover:bg-calmBlue-600"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-4 h-4 mr-2" />
                  )}
                  Detect Mood
                </Button>
                <Button
                  onClick={stopWebcam}
                  variant="outline"
                  className="flex-1"
                >
                  Stop Camera
                </Button>
              </>
            )}
          </div>

          {detectedMood && (
            <div className="mt-4 p-3 bg-calmBlue-50 border border-calmBlue-100 rounded-lg text-center">
              <p className="font-medium">Detected Mood</p>
              <p className="text-lg font-semibold capitalize text-calmBlue-700">{detectedMood}</p>
            </div>
          )}

          {!modelsLoaded && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Loading face detection models...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FaceMoodDetector;
