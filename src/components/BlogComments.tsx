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
import { MessageCircle, Send, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
import { z } from 'zod';

interface BlogCommentsProps {
  postSlug: string;
}

const commentSchema = z.object({
  content: z.string().trim().min(3, { message: "Comment must be at least 3 characters" }).max(1000, { message: "Comment must be less than 1000 characters" }),
  guest_name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100).optional(),
  guest_email: z.string().trim().email({ message: "Invalid email address" }).max(255).optional(),
});

export const BlogComments = ({ postSlug }: BlogCommentsProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

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
              },
            },
          });
        } catch (emailError) {
          console.error('Failed to send moderation email:', emailError);
          // Don't throw - comment was saved, email is secondary
        }
      }
    },
    onSuccess: () => {
      setContent('');
      setGuestName('');
      setGuestEmail('');
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {language === 'ka' ? 'კომენტარები' : 'Comments'} ({comments.length})
          </h2>
        </div>

        {/* Comment Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'ka' ? 'დატოვეთ კომენტარი' : 'Leave a Comment'}
            </CardTitle>
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
                  placeholder={language === 'ka' ? 'დაწერეთ თქვენი კომენტარი...' : 'Write your comment...'}
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
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {comment.guest_name 
                              ? getInitials(comment.guest_name)
                              : <User className="w-5 h-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">
                                {comment.guest_name || (language === 'ka' ? 'რეგისტრირებული მომხმარებელი' : 'Registered User')}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {format(new Date(comment.created_at), 'dd MMM yyyy, HH:mm', {
                                  locale: language === 'ka' ? ka : enUS
                                })}
                              </span>
                            </div>
                            {user?.id === comment.user_id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteComment.mutate(comment.id)}
                                disabled={deleteComment.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
