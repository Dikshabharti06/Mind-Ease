
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { api } from '@/services/api';
import { Loader, Heart, MessageSquare, Calendar, ArrowLeft, Send } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

const CommunityPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Please login to view this post');
    }
  }, [isAuthenticated, navigate]);

  const { data: postData, isLoading, error, refetch } = useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPost(id as string),
    enabled: isAuthenticated && !!id,
  });

  const post = postData?.data;

  const handleLike = async () => {
    if (!id) return;
    
    try {
      const response = await api.likePost(id);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      refetch();
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.addComment(id, {
        content: comment,
        isAnonymous,
      });
      
      if (response.error) {
        toast.error(response.error || 'Failed to post comment');
        console.error('Comment error:', response.error);
      } else {
        setComment('');
        toast.success('Comment posted successfully');
        refetch();
      }
    } catch (err) {
      console.error('Comment submission error:', err);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <NavBar />
      
      <div className="page-container pt-24">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center" 
          onClick={() => navigate('/community')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary h-8 w-8" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-500">Error loading post. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/community')}
            >
              Back to Community
            </Button>
          </Card>
        ) : post ? (
          <div className="space-y-8">
            {/* Post */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <div className="flex flex-wrap gap-2 text-muted-foreground mt-2">
                    <span className="text-sm">Posted by {post.author.name}</span>
                    <span>•</span>
                    <span className="text-sm flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {post.category}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="whitespace-pre-line">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleLike}
                >
                  <Heart 
                    className={`h-4 w-4 ${post.userLiked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  <span>{post.likes?.length || 0}</span>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Add Comment */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Leave a comment</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts, advice, or support..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="anonymous-comment"
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                      />
                      <Label htmlFor="anonymous-comment">Comment anonymously</Label>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                      {isSubmitting ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Comments */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Comments ({post.comments?.length || 0})
              </h2>
              
              {post.comments?.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Be the first to leave a comment!</p>
                </Card>
              ) : (
                post.comments?.map((comment: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{comment.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-line">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Post not found.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/community')}
            >
              Back to Community
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityPost;
