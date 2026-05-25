
import React from 'react';
import ThoughtDetox from '@/components/ThoughtDetox';
import EmotionMirror from '@/components/EmotionMirror';
import MindGym from '@/components/MindGym';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, SmilePlus, Activity } from 'lucide-react';

const Tools = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mental Wellness Tools</h1>
            <p className="text-gray-600 mt-1">
              Practical tools to help manage overthinking and improve your mental wellbeing
            </p>
          </div>

          {/* Content */}
          <Tabs defaultValue="thought-detox" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="thought-detox" className="flex items-center justify-center">
                <Brain className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Thought Detox</span>
                <span className="sm:hidden">Detox</span>
              </TabsTrigger>
              <TabsTrigger value="emotion-mirror" className="flex items-center justify-center">
                <SmilePlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Emotion Mirror</span>
                <span className="sm:hidden">Mirror</span>
              </TabsTrigger>
              <TabsTrigger value="mind-gym" className="flex items-center justify-center">
                <Activity className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Mind Gym</span>
                <span className="sm:hidden">Gym</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="thought-detox" className="mt-0">
              <ThoughtDetox />
            </TabsContent>
            
            <TabsContent value="emotion-mirror" className="mt-0">
              <EmotionMirror />
            </TabsContent>
            
            <TabsContent value="mind-gym" className="mt-0">
              <MindGym />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Tools;
