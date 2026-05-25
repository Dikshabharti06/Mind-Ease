
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id?: string;
    name: string;
  };
  category: string;
  isAnonymous: boolean;
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, currentPage, totalPages, onPageChange }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  const truncateContent = (content: string) => {
    return content.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/community/${post._id}`} className="text-xl font-semibold hover:text-primary transition-colors">
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <span className="text-sm">Posted by {post.author.name}</span>
                  <span>•</span>
                  <span className="text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(post.createdAt)}
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
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-gray-700">{truncateContent(post.content)}</p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{post.likes.length}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.comments.length}</span>
              </div>
            </div>
            <Link to={`/community/${post._id}`}>
              <Button variant="outline" size="sm">Read more</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
