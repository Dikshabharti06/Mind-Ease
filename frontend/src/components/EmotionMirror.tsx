
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send, RefreshCw, SmilePlus } from 'lucide-react';
import { useEmotionAnalysis } from '@/hooks/use-emotion-analysis';
import { motion } from 'framer-motion';

const EmotionMirror = () => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { analyzeEmotion, isAnalyzing, result, resetResult } = useEmotionAnalysis();

  // This would need Web Speech API implementation for production
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Here you would process the audio recording
      setInputText(prev => prev + " This is where transcribed audio would appear.");
    } else {
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    await analyzeEmotion(inputText);
  };

  const handleReset = () => {
    resetResult();
    setInputText('');
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'joy': 'text-amber-500',
      'happy': 'text-amber-500',
      'sad': 'text-blue-500',
      'anger': 'text-red-500',
      'angry': 'text-red-500',
      'fear': 'text-purple-500',
      'anxiety': 'text-purple-500',
      'surprise': 'text-green-500',
      'disgust': 'text-emerald-500',
      'neutral': 'text-gray-500',
      'stress': 'text-orange-500',
      'overwhelmed': 'text-pink-500',
    };
    
    // Default case - search for partial matches
    const emotionLower = emotion.toLowerCase();
    for (const [key, value] of Object.entries(colors)) {
      if (emotionLower.includes(key)) {
        return value;
      }
    }
    
    return 'text-calmBlue-500'; // Default color
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <SmilePlus className="w-5 h-5 mr-2 text-calmBlue-500" />
          Emotion Mirror
        </CardTitle>
        <CardDescription>
          Reflect on how you're feeling with AI-powered emotional insights
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-lg bg-gray-50 p-4 border">
              <h3 className="font-medium mb-2">I hear you saying:</h3>
              <p className="text-gray-700 italic">"{inputText}"</p>
            </div>
            
            <div className="rounded-lg bg-white p-4 border">
              <h3 className="font-medium mb-2">Your primary emotion seems to be:</h3>
              <p className={`text-lg font-bold ${getEmotionColor(result.primaryEmotion)}`}>
                {result.primaryEmotion}
              </p>
              
              <h3 className="font-medium mt-4 mb-2">Reflection:</h3>
              <p className="text-gray-700">{result.reflection}</p>
              
              <h3 className="font-medium mt-4 mb-2">Consider these suggestions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700">{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={handleReset}
              variant="outline" 
              className="w-full mt-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start a new reflection
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe how you're feeling right now..."
                className="min-h-[100px] bg-gray-50 pr-12"
                disabled={isAnalyzing}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Mic className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isAnalyzing || !inputText.trim()}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Reflect on my emotions
                </>
              )}
            </Button>
            
            {isRecording && (
              <div className="flex items-center justify-center p-2 bg-red-50 rounded-md border border-red-200">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <span className="text-sm text-red-500">Recording...</span>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionMirror;
