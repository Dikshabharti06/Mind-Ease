
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Smile, Frown, Meh,Camera, AlertCircle, ThumbsUp } from 'lucide-react';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import FaceMoodDetector from './FaceMoodDetector';

const moods = [
  { id: 'happy', icon: <ThumbsUp className="w-8 h-8" />, label: 'Happy', color: 'bg-calmBlue-100 text-calmBlue-700 border-calmBlue-200' },
  { id: 'neutral', icon: <Meh className="w-8 h-8" />, label: 'Neutral', color: 'bg-warmSand-100 text-warmSand-700 border-warmSand-200' },
  { id: 'sad', icon: <Frown className="w-8 h-8" />, label: 'Sad', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'anxious', icon: <AlertCircle className="w-8 h-8" />, label: 'Anxious', color: 'bg-gentleLavender-100 text-gentleLavender-700 border-gentleLavender-200' },
];

interface Recommendation {
  _id: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageUrl: string;
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleDetectedMood = (detectedMood: string) => {
    setSelectedMood(detectedMood);
    toast.success(`Mood detected: ${detectedMood}`);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.saveMood({ mood: selectedMood, note });
      
      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        setShowRecommendations(true);
      }
      
      setIsComplete(true);
      setTimeout(() => {
        if (!showRecommendations) {
          setSelectedMood('');
          setNote('');
          setIsComplete(false);
        }
      }, 3000);
      
      toast.success("Mood tracked successfully!");
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error("Failed to save your mood");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMood('');
    setNote('');
    setIsComplete(false);
    setShowRecommendations(false);
    setRecommendations([]);
    setUseWebcam(false);
  };

  const toggleWebcam = () => {
    setUseWebcam(!useWebcam);
  };

  return (
    <Card className="glass-panel animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Smile className="w-5 h-5 mr-2 text-calmBlue-500" />
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isComplete && !showRecommendations ? (
          <div className="py-6 text-center animate-fade-in">
            <div className="mx-auto w-12 h-12 rounded-full bg-mindfulTeal-100 flex items-center justify-center mb-3">
              <ThumbsUp className="w-6 h-6 text-mindfulTeal-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Mood Tracked</h3>
            <p className="text-gray-600 mt-1">Thanks for sharing how you're feeling today.</p>
          </div>
        ) : showRecommendations ? (
          <div className="animate-fade-in">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">Recommended For You</h3>
              <p className="text-sm text-blue-600 mb-3">
                Based on your {selectedMood} mood, we've found these meditations that might help:
              </p>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => (
                    <Link 
                      key={rec._id || rec.id} 
                      to={`/meditation?id=${rec._id || rec.id}`}
                      className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                    >
                      <div className="flex items-center">
                        {rec.imageUrl && (
                          <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                            <img
                              src={rec.imageUrl}
                              alt={rec.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <p className="text-xs text-gray-500">{rec.duration} · {rec.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-3">No specific recommendations found at the moment.</p>
                )}
              </div>
            </div>
            <Button onClick={resetForm} className="w-full">
              Track Another Mood
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Button 
                variant={useWebcam ? "default" : "outline"} 
                onClick={toggleWebcam} 
                className="w-full mb-4"
              >
                <Camera className="w-4 h-4 mr-2" />
                {useWebcam ? "Using Camera Detection" : "Use Camera to Detect Mood"}
              </Button>
              
              {useWebcam ? (
                <FaceMoodDetector onMoodDetected={handleDetectedMood} />
              ) : null}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    selectedMood === mood.id
                      ? `${mood.color} border-2`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mb-2 ${selectedMood === mood.id ? '' : 'text-gray-600'}`}>
                    {mood.icon}
                  </div>
                  <span className="font-medium text-sm">{mood.label}</span>
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Add a note about how you're feeling... (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] mb-4 focus:border-calmBlue-500"
            />

            <Button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="w-full bg-calmBlue-500 hover:bg-calmBlue-600"
            >
              {isSubmitting ? 'Saving...' : 'Save Mood'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
