
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { BookOpen, Plus, X, Search, Brain, RotateCcw } from 'lucide-react';
import { api } from '@/services/api';
import NavBar from '@/components/NavBar';
import JournalEntry from '@/components/JournalEntry';

interface Entry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  overthinkingLevel?: string;
  triggers?: string[];
}

const Journal = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  
  // New entry form state
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryMood, setNewEntryMood] = useState('neutral');
  const [overthinkingLevel, setOverthinkingLevel] = useState('moderate');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReframeDialog, setShowReframeDialog] = useState(false);
  const [reframedThoughts, setReframedThoughts] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const response = await api.getJournalEntries();
        if (response.data) {
          setEntries(response.data);
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleCreateEntry = async () => {
    if (!newEntryTitle || !newEntryContent) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.createJournalEntry({
        title: newEntryTitle,
        content: newEntryContent,
        mood: newEntryMood,
        overthinkingLevel,
        triggers
      });
      
      if (response.data) {
        setEntries(prev => [response.data, ...prev]);
        resetNewEntryForm();
        setShowNewEntryDialog(false);
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetNewEntryForm = () => {
    setNewEntryTitle('');
    setNewEntryContent('');
    setNewEntryMood('neutral');
    setOverthinkingLevel('moderate');
    setTriggers([]);
    setTriggerInput('');
  };

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
  };

  const addTrigger = () => {
    if (triggerInput.trim() && !triggers.includes(triggerInput.trim())) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const removeTrigger = (triggerToRemove: string) => {
    setTriggers(triggers.filter(t => t !== triggerToRemove));
  };

  const handleReframeThoughts = () => {
    // Mock implementation - in a real app, this could use an AI API
    setReframedThoughts(
      "Consider that this situation might not be as critical as it feels right now. " +
      "Try challenging your thoughts by asking: What's the evidence? What would I tell a friend in this situation? " +
      "Remember that thoughts are not facts - they're just mental events that come and go."
    );
    setShowReframeDialog(true);
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <BookOpen className="w-7 h-7 mr-2 text-calmBlue-500" />
                Thought Journal
              </h1>
              <p className="text-gray-600 mt-1">
                Track your overthinking patterns and reframe negative thoughts
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-full md:w-64"
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button onClick={() => setShowNewEntryDialog(true)} className="bg-calmBlue-500 hover:bg-calmBlue-600">
                <Plus className="w-4 h-4 mr-1" />
                New Entry
              </Button>
            </div>
          </div>

          {/* Journal Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
              ))
            ) : filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <JournalEntry 
                  key={entry.id} 
                  entry={{
                    ...entry,
                    overthinkingLevel: entry.overthinkingLevel || 'moderate'
                  }} 
                  onClick={() => handleEntryClick(entry)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No thought journal entries yet</h3>
                {searchTerm ? (
                  <p className="text-gray-600">No results found for "{searchTerm}"</p>
                ) : (
                  <p className="text-gray-600">Start tracking your thoughts and overthinking patterns</p>
                )}
                <Button 
                  onClick={() => setShowNewEntryDialog(true)} 
                  className="mt-4 bg-calmBlue-500 hover:bg-calmBlue-600"
                >
                  Create Your First Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Entry Dialog */}
      <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
        <DialogContent className="max-w-2xl glass-panel">
          <DialogHeader>
            <DialogTitle>New Thought Journal Entry</DialogTitle>
            <DialogDescription>
              Document your overthinking patterns to better understand and manage them
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Name this thought pattern"
                value={newEntryTitle}
                onChange={e => setNewEntryTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mood">How are you feeling?</Label>
                <Select 
                  value={newEntryMood} 
                  onValueChange={setNewEntryMood}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="stressed">Stressed</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="overwhelmed">Overwhelmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="overthinkingLevel">Overthinking Level</Label>
                <Select 
                  value={overthinkingLevel} 
                  onValueChange={setOverthinkingLevel}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild (Passing Thoughts)</SelectItem>
                    <SelectItem value="moderate">Moderate (Distracting)</SelectItem>
                    <SelectItem value="severe">Severe (All-Consuming)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>What triggered these thoughts?</Label>
              <div className="flex mt-1">
                <Input
                  placeholder="Add a trigger..."
                  value={triggerInput}
                  onChange={e => setTriggerInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTrigger();
                    }
                  }}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={addTrigger}
                  variant="outline"
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              
              {triggers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {triggers.map((trigger, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
                      {trigger}
                      <button 
                        onClick={() => removeTrigger(trigger)} 
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="content">Describe your thoughts</Label>
              <Textarea
                id="content"
                placeholder="What are you overthinking about? How does it make you feel?"
                value={newEntryContent}
                onChange={e => setNewEntryContent(e.target.value)}
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleCreateEntry} 
              disabled={!newEntryTitle || !newEntryContent || isSubmitting}
              className="bg-calmBlue-500 hover:bg-calmBlue-600"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Entry Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl glass-panel">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEntry.title}</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedEntry.date)} • {selectedEntry.mood.charAt(0).toUpperCase() + selectedEntry.mood.slice(1)}
                  {selectedEntry.overthinkingLevel && (
                    <span className="ml-2">• Overthinking: {selectedEntry.overthinkingLevel.charAt(0).toUpperCase() + selectedEntry.overthinkingLevel.slice(1)}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                {selectedEntry.triggers && selectedEntry.triggers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Triggers:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.triggers.map((trigger, index) => (
                        <div key={index} className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm">
                          {trigger}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="whitespace-pre-line">{selectedEntry.content}</p>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={handleReframeThoughts}
                  className="mr-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reframe Thoughts
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button variant="outline">Edit</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reframe Thoughts Dialog */}
      <Dialog open={showReframeDialog} onOpenChange={setShowReframeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-500" />
              Thought Reframing
            </DialogTitle>
            <DialogDescription>
              Here are some alternative perspectives to consider
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-blue-800">{reframedThoughts}</p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Thank You</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Journal;
