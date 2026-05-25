
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, CheckCircle, Star, Trophy } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'gratitude' | 'mindfulness' | 'reflection' | 'action';
  completed: boolean;
  date: string;
}

const MindGym = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await api.getDailyChallenges();
        if (response.data) {
          setChallenges(response.data.challenges);
          setStreak(response.data.streak || 0);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        // Fallback data if API fails
        setChallenges([
          {
            id: '1',
            title: 'Gratitude Practice',
            description: 'Write down 3 things you are grateful for today',
            type: 'gratitude',
            completed: false,
            date: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Deep Breathing',
            description: 'Take 5 deep breaths, holding each for 5 seconds',
            type: 'mindfulness',
            completed: false,
            date: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Digital Detox',
            description: 'Take a 30-minute break from all screens today',
            type: 'action',
            completed: false,
            date: new Date().toISOString()
          }
        ]);
        setStreak(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const completeChallenge = async (id: string) => {
    try {
      const response = await api.completeChallenge(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge.id === id ? { ...challenge, completed: true } : challenge
        )
      );
      
      // Check if all challenges are completed
      const updatedChallenges = challenges.map(challenge => 
        challenge.id === id ? { ...challenge, completed: true } : challenge
      );
      
      if (updatedChallenges.every(challenge => challenge.completed)) {
        setShowCompletionAnimation(true);
        setStreak(prev => prev + 1);
        
        setTimeout(() => {
          setShowCompletionAnimation(false);
        }, 3000);
      }
      
      toast({
        title: "Challenge completed!",
        description: "Great job taking care of your mental health today.",
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      // Optimistically update UI even if API fails
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge.id === id ? { ...challenge, completed: true } : challenge
        )
      );
      
      toast({
        title: "Challenge completed!",
        description: "Great job taking care of your mental health today.",
      });
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'gratitude':
        return <Star className="w-5 h-5 text-amber-500" />;
      case 'mindfulness':
        return <Activity className="w-5 h-5 text-calmBlue-500" />;
      case 'reflection':
        return <Calendar className="w-5 h-5 text-violet-500" />;
      case 'action':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Activity className="w-5 h-5 mr-2 text-calmBlue-500" />
          Mind Gym
        </CardTitle>
        <CardDescription>
          Daily exercises to strengthen your mental wellbeing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showCompletionAnimation ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Trophy className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium text-center">All challenges completed!</h3>
            <p className="text-center text-gray-600 mt-2">
              You're on a {streak} day streak! Keep it up!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Trophy className="w-5 h-5 text-amber-500 mr-3" />
              <div>
                <p className="font-medium">Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-600">Complete all challenges to maintain your streak</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <div 
                    key={challenge.id} 
                    className={`p-4 rounded-lg border ${
                      challenge.completed 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mt-1 mr-3">
                          {getChallengeIcon(challenge.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                        </div>
                      </div>
                      {!challenge.completed ? (
                        <Button 
                          size="sm" 
                          onClick={() => completeChallenge(challenge.id)}
                          className="ml-2 flex-shrink-0"
                        >
                          Complete
                        </Button>
                      ) : (
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MindGym;
