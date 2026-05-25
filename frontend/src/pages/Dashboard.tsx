
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import MoodTracker from '@/components/MoodTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, ArrowRight, Moon, Calendar, Smile, Brain, Activity, Clock, Bed, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '@/services/api';
import ThoughtDetox from '@/components/ThoughtDetox';
import MindGym from '@/components/MindGym';
import { toast } from "sonner";
import AOS from 'aos';
import "aos/dist/aos.css";

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  note: string;
}

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  imageUrl: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [recentMeditations, setRecentMeditations] = useState<Meditation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const fetchMeditationData = async (refresh = false) => {
    try {
      let queryParams = '';
      if (refresh) {
        queryParams = '?refresh=true';
        setIsRefreshing(true);
      }
      
      const meditationsResponse = await api.getMeditations(queryParams);
      if (meditationsResponse.data) {
        setRecentMeditations(meditationsResponse.data.slice(0, 2));
      } else if (meditationsResponse.error) {
        console.error('Error in meditation response:', meditationsResponse.error);
        toast.error("Failed to load meditation videos");
      }
    } catch (error) {
      console.error('Error fetching meditation data:', error);
      toast.error("Failed to load meditation videos");
      setRecentMeditations([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const moodResponse = await api.getMoodData();
        if (moodResponse.data) {
          setMoodEntries(moodResponse.data);
        }

        await fetchMeditationData();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefreshMeditations = () => {
    fetchMeditationData(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      
      <main className="pt-24 pb-16">
        <div className="page-container">
          <div className="mb-8" data-aos="fade-down">
            <p className="text-indigo-500 font-medium">{getDayName()}</p>
            <h1 className="text-3xl font-bold mt-1 text-indigo-900">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage overthinking, track your mood, and strengthen your mental wellbeing today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div data-aos="fade-up" data-aos-delay="100">
                <MoodTracker />
              </div>

              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-xl">
                    <Smile className="w-5 h-5 mr-2 text-indigo-500" />
                    Recent Moods
                  </CardTitle>
                  <CardDescription>
                    Your mood history from the past few days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : moodEntries.length > 0 ? (
                    <div className="space-y-3">
                      {moodEntries.slice(0, 5).map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                        >
                          <div className="mr-3">
                            <div className="text-sm text-gray-500">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <span className="font-medium capitalize">{entry.mood}</span>
                              {entry.note && (
                                <span className="ml-2 text-sm text-gray-600 line-clamp-1">
                                  - {entry.note}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No mood entries yet. Start tracking your mood above.
                    </div>
                  )}

                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Mood History
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-xl">
                    <Brain className="w-5 h-5 mr-2 text-indigo-500" />
                    Thought Detox
                  </CardTitle>
                  <CardDescription>
                    Transform negative thoughts into positive perspectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The Thought Detox tool helps you identify and reframe negative thinking patterns that contribute to overthinking.
                  </p>
                  <Button asChild variant="default" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
                    <Link to="/tools?tab=thought-detox">
                      Start Thought Detox Session
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="150">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start bg-white text-indigo-700 border border-indigo-100 hover:bg-indigo-50" variant="outline">
                    <Link to="/journal">
                      <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                      Write in Journal
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start bg-white text-purple-700 border border-purple-100 hover:bg-purple-50" variant="outline">
                    <Link to="/meditation">
                      <Moon className="w-4 h-4 mr-2 text-purple-500" />
                      Start Meditation
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start bg-white text-blue-700 border border-blue-100 hover:bg-blue-50" variant="outline">
                    <Link to="/sleep">
                      <Bed className="w-4 h-4 mr-2 text-blue-500" />
                      Track Sleep
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start bg-white text-teal-700 border border-teal-100 hover:bg-teal-50" variant="outline">
                    <Link to="/chat">
                      <MessageCircle className="w-4 h-4 mr-2 text-teal-500" />
                      Talk to AI Assistant
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start bg-white text-amber-700 border border-amber-100 hover:bg-amber-50" variant="outline">
                    <Link to="/tools">
                      <Activity className="w-4 h-4 mr-2 text-amber-500" />
                      Mental Wellness Tools
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="250">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                    Mind Gym Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 mb-4">
                    <h3 className="font-medium mb-2 text-indigo-900">Today's challenges:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Write 3 things you're grateful for
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        Take a 2-minute deep breathing exercise
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                        Unfollow 1 negative social media account
                      </li>
                    </ul>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/tools?tab=mind-gym" className="flex items-center justify-center">
                      <span>Go to Mind Gym</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="350">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl">
                    <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                    Recommended Meditations
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={handleRefreshMeditations}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading || isRefreshing ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : recentMeditations.length > 0 ? (
                    <div className="space-y-4">
                      {recentMeditations.map((meditation) => (
                        <Link 
                          key={meditation.id} 
                          to={`/meditation?id=${meditation.id}`}
                          className="block group"
                        >
                          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group-hover:scale-[1.02]">
                            <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                              <img
                                src={meditation.imageUrl || '/placeholder.svg'}
                                alt={meditation.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-indigo-600 transition-colors">
                                {meditation.title}
                              </h4>
                              <p className="text-sm text-gray-600">{meditation.duration}</p>
                              <p className="text-xs text-gray-500 mt-1">{meditation.category}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No meditations found. Click refresh to try again.
                    </div>
                  )}

                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/meditation" className="flex items-center justify-center">
                        <span>Explore All Meditations</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel" data-aos="fade-up" data-aos-delay="450">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Bed className="w-5 h-5 mr-2 text-indigo-500" />
                    Sleep Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Track your sleep patterns to improve your mental well-being and reduce overthinking.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/sleep" className="flex items-center justify-center">
                      <span>Go to Sleep Tracker</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
