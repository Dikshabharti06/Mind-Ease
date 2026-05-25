
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { api } from '@/services/api';
import { Loader } from 'lucide-react';

interface CreatePostFormProps {
  onPostCreated: () => void;
  categories: string[];
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, categories }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState('Overthinking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [seekingAdvice, setSeekingAdvice] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.createPost({
        title,
        content,
        isAnonymous,
        category,
        seekingAdvice
      });
      
      if (response.error) {
        setError(response.error);
      } else {
        setTitle('');
        setContent('');
        setIsAnonymous(false);
        setCategory('Overthinking');
        setSeekingAdvice(true);
        onPostCreated();
      }
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const prompts = [
    "I can't stop thinking about...",
    "I keep replaying this situation in my head where...",
    "I'm stressed about... and can't let it go",
    "I'm overthinking my decision to...",
    "My mind won't stop racing about..."
  ];

  const handleUsePrompt = (prompt: string) => {
    setContent(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your post a title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Writing Prompts</Label>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, index) => (
            <Button 
              key={index} 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleUsePrompt(prompt)}
              className="text-xs"
            >
              {prompt.substring(0, 20)}...
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Your message</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your overthinking experience, struggles, or questions..."
          rows={6}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="advice"
          checked={seekingAdvice}
          onCheckedChange={setSeekingAdvice}
        />
        <Label htmlFor="advice">I'm looking for advice or support</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
        />
        <Label htmlFor="anonymous">Post anonymously</Label>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Share with Support Circle'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
