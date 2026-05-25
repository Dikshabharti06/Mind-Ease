
import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

type EmotionAnalysisResult = {
  primaryEmotion: string;
  reflection: string;
  suggestions: string[];
  intensity: number;
};

type RecommendedMeditation = {
  _id: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageUrl: string;
};

// Define the API response type to include recommendations
type EmotionAnalysisResponse = {
  data: EmotionAnalysisResult;
  recommendations?: RecommendedMeditation[];
  error?: string;
};

export function useEmotionAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedMeditation[]>([]);

  const analyzeEmotion = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter your feelings to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await api.analyzeEmotion(text);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setResult(response.data);

      // Check if response has recommendations and they are in the expected format
      if (response.recommendations && Array.isArray(response.recommendations)) {
        setRecommendations(response.recommendations);
      }
      
      return {
        data: response.data,
        recommendations: response.recommendations || []
      };
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your emotions. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeEmotion,
    isAnalyzing,
    result,
    recommendations,
    resetResult: () => {
      setResult(null);
      setRecommendations([]);
    }
  };
}
