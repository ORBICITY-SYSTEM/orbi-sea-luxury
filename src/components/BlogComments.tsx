import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Trash2, User, Reply, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
import { z } from 'zod';

interface BlogCommentsProps {
  postSlug: string;
}

interface Comment {
  id: string;
  post_slug: string;
  content: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  is_approved: boolean | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

const commentSchema = z.object({
  content: z.string().trim().min(3, { message: "Comment must be at least 3 characters" }).max(1000, { message: "Comment must be less than 1000 characters" }),
  guest_name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100).optional(),
  guest_email: z.string().trim().email({ message: "Invalid email address" }).max(255).optional(),
});

// Recursive component for rendering comments and their replies
const CommentItem = ({
  comment,
  user,
  language,
  onReply,
  onDelete,
  deleteComment,
  depth = 0,
}: {
  comment: Comment;
  user: { id: string } | null;
  language: string;
  onReply: (commentId: string, authorName: string) => void;
  onDelete: (commentId: string) => void;
  deleteComment: { isPending: boolean };
  depth?: number;
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const maxDepth = 3;
  const marginLeft = Math.min(depth, maxDepth) * 24;

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <Card className={depth > 0 ? 'border-l-2 border-l-primary/30' : ''}>
        <CardContent className="p-4 md:p-6">
          <div className="flex gap-3 md:gap-4">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm">
                {comment.guest_name 
                  ? getInitials(comment.guest_name)
                  : <User className="w-4 h-4 md:w-5 md:h-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm md:text-base">
                    {comment.guest_name || (language === 'ka' ? 'რეგისტრირებული მომხმარებელი' : 'Registered User')}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {format(new Date(comment.created_at), 'dd MMM yyyy, HH:mm', {
                      locale: language === 'ka' ? ka : enUS
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(comment.id, comment.guest_name || (language === 'ka' ? 'მომხმარებელი' : 'User'))}
                    className="h-8 px-2 text-xs"
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    {language === 'ka' ? 'პასუხი' : 'Reply'}
                  </Button>
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(comment.id)}
                      disabled={deleteComment.isPending}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              user={user}
              language={language}
              onReply={onReply}
              onDelete={onDelete}
              deleteComment={deleteComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const BlogComments = ({ postSlug }: BlogCommentsProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [errors, setErrors] = useState<{ content?: string; guest_name?: string; guest_email?: string }>({});

  // Fetch approved comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['blog-comments', postSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', postSlug)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Organize comments into tree structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];
      
      (data || []).forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      commentMap.forEach((comment) => {
        if (comment.parent_id && commentMap.has(comment.parent_id)) {
          const parent = commentMap.get(comment.parent_id)!;
          parent.replies = parent.replies || [];
          parent.replies.push(comment);
        } else if (!comment.parent_id) {
          rootComments.push(comment);
        }
      });
      
      return rootComments;
    },
  });

  // Count total comments including replies
  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((count, comment) => {
      return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
    }, 0);
  };

  const totalComments = countAllComments(comments);

  // Submit comment mutation
  const submitComment = useMutation({
    mutationFn: async () => {
      // Validate input
      const validationData: z.infer<typeof commentSchema> = {
        content,
        ...(user ? {} : { guest_name: guestName, guest_email: guestEmail }),
      };

      // Custom validation for guest users
      if (!user) {
        if (!guestName.trim()) {
          throw new Error(language === 'ka' ? 'გთხოვთ შეიყვანოთ სახელი' : 'Please enter your name');
        }
        if (!guestEmail.trim()) {
          throw new Error(language === 'ka' ? 'გთხოვთ შეიყვანოთ ელ-ფოსტა' : 'Please enter your email');
        }
      }

      const result = commentSchema.safeParse(validationData);
      if (!result.success) {
        const fieldErrors: { content?: string; guest_name?: string; guest_email?: string } = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
        throw new Error(result.error.issues[0]?.message || 'Validation error');
      }

      setErrors({});

      const isGuestComment = !user;
      const commentData = {
        post_slug: postSlug,
        content: content.trim(),
        user_id: user?.id || null,
        guest_name: user ? null : guestName.trim(),
        guest_email: user ? null : guestEmail.trim(),
        is_approved: !!user, // Auto-approve authenticated users
        parent_id: replyingTo?.id || null,
      };

      const { error } = await supabase
        .from('blog_comments')
        .insert(commentData);

      if (error) throw error;

      // Send email notification for guest comments (pending moderation)
      if (isGuestComment) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: 'comment_moderation',
              to: 'info@orbicitybatumi.com',
              data: {
                postSlug,
                authorName: guestName.trim(),
                authorEmail: guestEmail.trim(),
                content: content.trim(),
                createdAt: new Date().toLocaleString('ka-GE'),
                isReply: !!replyingTo,
                replyToName: replyingTo?.name,
              },
            },
          });
        } catch (emailError) {
          console.error('Failed to send moderation email:', emailError);
        }
      }
    },
    onSuccess: () => {
      setContent('');
      setGuestName('');
      setGuestEmail('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postSlug] });
      
      toast({
        title: user 
          ? (language === 'ka' ? 'კომენტარი დაემატა!' : 'Comment added!')
          : (language === 'ka' ? 'კომენტარი გაიგზავნა!' : 'Comment submitted!'),
        description: user 
          ? (language === 'ka' ? 'თქვენი კომენტარი გამოქვეყნდა' : 'Your comment has been published')
          : (language === 'ka' ? 'თქვენი კომენტარი მოელოდება მოდერაციას' : 'Your comment is pending moderation'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postSlug] });
      toast({
        title: language === 'ka' ? 'კომენტარი წაიშალა' : 'Comment deleted',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment.mutate();
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    // Scroll to form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {language === 'ka' ? 'კომენტარები' : 'Comments'} ({totalComments})
          </h2>
        </div>

        {/* Comment Form */}
        <Card className="mb-8" id="comment-form">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {replyingTo 
                  ? (language === 'ka' ? `პასუხი: ${replyingTo.name}` : `Reply to: ${replyingTo.name}`)
                  : (language === 'ka' ? 'დატოვეთ კომენტარი' : 'Leave a Comment')}
              </CardTitle>
              {replyingTo && (
                <Button variant="ghost" size="sm" onClick={cancelReply}>
                  <X className="w-4 h-4 mr-1" />
                  {language === 'ka' ? 'გაუქმება' : 'Cancel'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!user && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName">
                      {language === 'ka' ? 'თქვენი სახელი' : 'Your Name'} *
                    </Label>
                    <Input
                      id="guestName"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={language === 'ka' ? 'სახელი' : 'Name'}
                      maxLength={100}
                    />
                    {errors.guest_name && (
                      <p className="text-sm text-destructive">{errors.guest_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">
                      {language === 'ka' ? 'ელ-ფოსტა' : 'Email'} *
                    </Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder={language === 'ka' ? 'email@example.com' : 'email@example.com'}
                      maxLength={255}
                    />
                    {errors.guest_email && (
                      <p className="text-sm text-destructive">{errors.guest_email}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="content">
                  {language === 'ka' ? 'კომენტარი' : 'Comment'} *
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    replyingTo
                      ? (language === 'ka' ? `დაწერეთ პასუხი ${replyingTo.name}-ს...` : `Write your reply to ${replyingTo.name}...`)
                      : (language === 'ka' ? 'დაწერეთ თქვენი კომენტარი...' : 'Write your comment...')
                  }
                  rows={4}
                  maxLength={1000}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground text-right">
                  {content.length}/1000
                </p>
              </div>

              {!user && (
                <p className="text-sm text-muted-foreground">
                  {language === 'ka' 
                    ? '* თქვენი კომენტარი გამოქვეყნდება მოდერაციის შემდეგ'
                    : '* Your comment will be published after moderation'}
                </p>
              )}

              <Button 
                type="submit" 
                disabled={submitComment.isPending || !content.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {submitComment.isPending 
                  ? (language === 'ka' ? 'იგზავნება...' : 'Submitting...')
                  : replyingTo
                    ? (language === 'ka' ? 'პასუხის გაგზავნა' : 'Send Reply')
                    : (language === 'ka' ? 'გაგზავნა' : 'Submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'ka' 
                  ? 'ჯერ კომენტარები არ არის. იყავით პირველი!'
                  : 'No comments yet. Be the first to comment!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CommentItem
                    comment={comment}
                    user={user}
                    language={language}
                    onReply={handleReply}
                    onDelete={(id) => deleteComment.mutate(id)}
                    deleteComment={deleteComment}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
