
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface ReframedThought {
  original: string;
  reframed: string;
}

const ThoughtDetox = () => {
  const [thought, setThought] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reframedThoughts, setReframedThoughts] = useState<ReframedThought[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [completedDetox, setCompletedDetox] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setIsProcessing(true);
    
    try {
      const response = await api.reframeThought(thought);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setReframedThoughts(prev => [
        ...prev, 
        { original: thought, reframed: response.data.reframed }
      ]);
      setThought('');
      
    } catch (error) {
      console.error('Error reframing thought:', error);
      toast({
        title: "Reframing failed",
        description: "We couldn't reframe your thought. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setCompletedDetox(true);
    toast({
      title: "Thought released!",
      description: "You've successfully let go of your negative thought.",
    });
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCompletedDetox(false);
      setReframedThoughts([]);
    }, 3000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-calmBlue-500" />
          Thought Detox
        </CardTitle>
        <CardDescription>
          Transform negative thoughts into positive perspectives
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {completedDetox ? (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            </motion.div>
            <h3 className="text-xl font-medium text-center">Great job!</h3>
            <p className="text-center text-gray-600 mt-2">
              You've successfully processed and released your thoughts
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Write down a negative thought that's bothering you..."
                className="min-h-[100px] bg-gray-50"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isProcessing || !thought.trim()}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Reframing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Reframe This Thought
                  </>
                )}
              </Button>
            </form>

            {reframedThoughts.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Your reframed thoughts:</h3>
                {reframedThoughts.map((item, index) => (
                  <div 
                    key={index}
                    className="rounded-lg border p-4 bg-white"
                  >
                    <div className="text-gray-500 italic mb-2">
                      "{item.original}"
                    </div>
                    <div className="text-calmBlue-700 font-medium">
                      "{item.reframed}"
                    </div>
                    
                    {index === reframedThoughts.length - 1 && (
                      <motion.div 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        whileDrag={{ scale: 0.95, opacity: 0.8 }}
                        className="mt-4 flex justify-center"
                      >
                        <Button variant="outline" className="text-gray-500">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Drag to let go
                        </Button>
                      </motion.div>
                    )}
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

export default ThoughtDetox;
