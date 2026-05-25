
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Smile, Frown, Meh, AlertCircle, Brain, Clock, Activity, CheckCircle2, Lightbulb } from 'lucide-react';

interface JournalEntryProps {
  entry: {
    id: string;
    date: string;
    title: string;
    content: string;
    mood: string;
    overthinkingLevel?: string;
    triggers?: string[];
    reframedThoughts?: string;
    actionSteps?: string[];
    reflectionNotes?: string;
  };
  onClick?: () => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ entry, onClick }) => {
  const { title, content, date, mood, overthinkingLevel, triggers, reframedThoughts, actionSteps } = entry;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad':
        return <Frown className="w-5 h-5 text-purple-500" />;
      case 'neutral':
        return <Meh className="w-5 h-5 text-gray-500" />;
      case 'anxious':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'calm':
        return <Meh className="w-5 h-5 text-blue-500" />;
      case 'stressed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'overwhelmed':
        return <Brain className="w-5 h-5 text-red-600" />;
      default:
        return <Meh className="w-5 h-5 text-gray-500" />;
    }
  };

  const getOverthinkingLevelColor = (level: string = 'moderate') => {
    switch (level.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card 
      className="hover-lift overflow-hidden cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(date)}
          </div>
          <div className="flex items-center">
            {getMoodIcon(mood)}
            <span className="ml-1 capitalize">{mood}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {overthinkingLevel && (
          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getOverthinkingLevelColor(overthinkingLevel)} mb-2`}>
            <div className="flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              <span>{overthinkingLevel.charAt(0).toUpperCase() + overthinkingLevel.slice(1)}</span>
            </div>
          </div>
        )}
        
        {triggers && triggers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {triggers.slice(0, 2).map((trigger, index) => (
              <div key={index} className="bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 text-xs">
                {trigger}
              </div>
            ))}
            {triggers.length > 2 && (
              <div className="bg-gray-50 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                +{triggers.length - 2} more
              </div>
            )}
          </div>
        )}
        
        <p className="text-gray-600 line-clamp-3">
          {content}
        </p>
        
        {reframedThoughts && (
          <div className="mt-2 flex items-start">
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 mr-1 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-1">
              <span className="font-medium">Reframed:</span> {reframedThoughts}
            </p>
          </div>
        )}
        
        {actionSteps && actionSteps.length > 0 && (
          <div className="mt-2 flex items-start">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">{actionSteps.length} action step{actionSteps.length !== 1 ? 's' : ''}</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-sm text-calmBlue-600">
        Read more
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;
