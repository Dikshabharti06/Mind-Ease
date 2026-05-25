
import React, { useState, useEffect } from 'react';
import MeditationPlayer from '@/components/MeditationPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { Moon, Search, Clock, Play, Brain, Activity, HeadphonesIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  videoUrl: string;
  imageUrl: string;
  focusArea?: string;
}

const Meditation = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [filteredMeditations, setFilteredMeditations] = useState<Meditation[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async (refresh = false) => {
    setIsLoading(true);
    try {
      let url = refresh ? '?refresh=true' : '';
      const response = await api.getMeditations(url);
      if (response.data) {
        // Add focus areas for overthinking specifically
        const enhancedMeditations = response.data.map((med: any) => ({
          ...med,
          focusArea: assignFocusArea(med.category, med.title)
        }));
        setMeditations(enhancedMeditations);
        setFilteredMeditations(enhancedMeditations);
      }
    } catch (error) {
      console.error('Error fetching meditations:', error);
      toast.error('Failed to load meditation practices');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing meditation content...');
    await fetchMeditations(true);
    toast.success('Meditation content refreshed!');
  };

  const assignFocusArea = (category: string, title: string) => {
    const titleLower = title.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    if (titleLower.includes('overthinking') || titleLower.includes('thought') || titleLower.includes('mind')) 
      return 'Thought Patterns';
      
    if (titleLower.includes('stress') || titleLower.includes('calm') || categoryLower.includes('stress'))
      return 'Stress Relief';
      
    if (titleLower.includes('sleep') || categoryLower.includes('sleep')) 
      return 'Better Sleep';
      
    if (titleLower.includes('breath') || titleLower.includes('breathing')) 
      return 'Breathing';
      
    if (titleLower.includes('focus') || titleLower.includes('attention')) 
      return 'Focus';
      
    if (titleLower.includes('anxiety') || categoryLower.includes('anxiety')) 
      return 'Anxiety Relief';
      
    return 'General Wellbeing';
  };

  useEffect(() => {
    let filtered = meditations;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(meditation => 
        meditation.category.toLowerCase() === activeCategory.toLowerCase() ||
        (meditation.focusArea && meditation.focusArea.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(meditation => 
        meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meditation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMeditations(filtered);
  }, [activeCategory, searchTerm, meditations]);

  const categories = ['All', 'Thought Patterns', 'Stress Relief', 'Anxiety Relief', 'Focus', 'Sleep'];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category.toLowerCase());
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    setSelectedMeditation(meditation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <HeadphonesIcon className="w-7 h-7 mr-2 text-calmBlue-500" />
                Mindfulness Practices
              </h1>
              <p className="text-gray-600 mt-1">
                Video guidance to calm your overthinking mind and reduce stress
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex gap-2 items-center"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Content</span>
            </Button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search meditations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs 
              value={activeCategory} 
              onValueChange={handleCategoryChange}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()}
                    className="text-xs sm:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Featured Section for Overthinking */}
          {activeCategory === 'all' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                Recommended for Overthinking
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeditations
                  .filter(med => 
                    med.focusArea === 'Thought Patterns' || 
                    med.title.toLowerCase().includes('overthinking')
                  )
                  .slice(0, 3)
                  .map(meditation => (
                    <Card 
                      key={meditation.id} 
                      className="overflow-hidden hover-lift bg-white border border-gray-200"
                    >
                      <div className="relative h-40">
                        <img 
                          src={meditation.imageUrl} 
                          alt={meditation.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex items-center text-white">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{meditation.duration}</span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Button 
                            size="icon" 
                            className="rounded-full w-10 h-10 bg-white text-purple-600 hover:bg-purple-50"
                            onClick={() => handlePlayMeditation(meditation)}
                          >
                            <Play className="w-5 h-5 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex gap-2 mb-2">
                          <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                            Overthinking
                          </div>
                          {meditation.focusArea && (
                            <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                              {meditation.focusArea}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{meditation.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{meditation.description}</p>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => handlePlayMeditation(meditation)}
                        >
                          Play Practice
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Stress Relief Section */}
          {activeCategory === 'all' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Stress Relief Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeditations
                  .filter(med => med.focusArea === 'Stress Relief')
                  .slice(0, 3)
                  .map(meditation => (
                    <Card 
                      key={meditation.id} 
                      className="overflow-hidden hover-lift bg-white border border-gray-200"
                    >
                      <div className="relative h-40">
                        <img 
                          src={meditation.imageUrl} 
                          alt={meditation.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex items-center text-white">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">{meditation.duration}</span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Button 
                            size="icon" 
                            className="rounded-full w-10 h-10 bg-white text-blue-600 hover:bg-blue-50"
                            onClick={() => handlePlayMeditation(meditation)}
                          >
                            <Play className="w-5 h-5 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 mb-2">
                          {meditation.focusArea}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{meditation.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{meditation.description}</p>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => handlePlayMeditation(meditation)}
                        >
                          Play Practice
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Meditations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {activeCategory === 'all' ? 'All Practices' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Practices`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
                ))
              ) : filteredMeditations.length > 0 ? (
                filteredMeditations.map(meditation => (
                  <Card 
                    key={meditation.id} 
                    className="overflow-hidden hover-lift bg-white border border-gray-200"
                  >
                    <div className="relative h-40">
                      <img 
                        src={meditation.imageUrl} 
                        alt={meditation.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center text-white">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{meditation.duration}</span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Button 
                          size="icon" 
                          className="rounded-full w-10 h-10 bg-white text-calmBlue-600 hover:bg-calmBlue-50"
                          onClick={() => handlePlayMeditation(meditation)}
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-calmBlue-50 text-calmBlue-600">
                          {meditation.category}
                        </div>
                        {meditation.focusArea && (
                          <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                            {meditation.focusArea}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{meditation.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{meditation.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handlePlayMeditation(meditation)}
                      >
                        Play Practice
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Moon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No practices found</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? `No results found for "${searchTerm}"`
                      : "No practices available for this category yet"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Meditation Player Modal */}
      {selectedMeditation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MeditationPlayer
            title={selectedMeditation.title}
            duration={selectedMeditation.duration}
            imageUrl={selectedMeditation.imageUrl}
            videoUrl={selectedMeditation.videoUrl}
            onClose={() => setSelectedMeditation(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Meditation;
