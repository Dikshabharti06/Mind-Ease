
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

interface MeditationPlayerProps {
  title: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  onClose: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({
  title,
  duration,
  imageUrl,
  videoUrl,
  onClose,
  onFavorite,
  isFavorite = false,
}) => {
  // Extract video ID for better embedding options
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  let embedUrl = videoUrl;
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const videoId = getVideoId(videoUrl);
    if (videoId !== videoUrl) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto glass-panel animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-600">{duration}</p>
          </div>
          
          <div className="w-full rounded-lg overflow-hidden shadow-md mb-6 aspect-video">
            <iframe 
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
          
          <div className="flex gap-4 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            
            {onFavorite && (
              <Button 
                variant={isFavorite ? "default" : "outline"}
                onClick={onFavorite}
                className={`${isFavorite ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationPlayer;
