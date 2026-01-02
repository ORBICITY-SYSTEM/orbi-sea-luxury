import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  User, 
  Mail, 
  Calendar,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogComment {
  id: string;
  post_slug: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  content: string;
  is_approved: boolean | null;
  created_at: string;
  updated_at: string;
}

export function AdminComments() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchComments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filter === 'approved') {
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('კომენტარების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('კომენტარი დადასტურდა');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('კომენტარის დადასტურება ვერ მოხერხდა');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: false })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('კომენტარი უარყოფილია');
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('კომენტარის უარყოფა ვერ მოხერხდა');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('კომენტარი წაიშალა');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('კომენტარის წაშლა ვერ მოხერხდა');
    }
  };

  const pendingCount = comments.filter(c => !c.is_approved).length;
  const approvedCount = comments.filter(c => c.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ბლოგის კომენტარები</h1>
          <p className="text-muted-foreground">მართეთ და მოდერირეთ ბლოგის კომენტარები</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'approved') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ფილტრი" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა ({comments.length})</SelectItem>
              <SelectItem value="pending">მოლოდინში ({pendingCount})</SelectItem>
              <SelectItem value="approved">დადასტურებული ({approvedCount})</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchComments} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            განახლება
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">სულ კომენტარები</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">მოლოდინში</CardTitle>
            <XCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">დადასტურებული</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">კომენტარები არ მოიძებნა</h3>
              <p className="text-muted-foreground">ჯერ არანაირი კომენტარი არ არის დამატებული</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className={!comment.is_approved ? 'border-amber-500/50 bg-amber-50/5' : ''}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={comment.is_approved ? 'default' : 'secondary'}>
                        {comment.is_approved ? 'დადასტურებული' : 'მოლოდინში'}
                      </Badge>
                      <a 
                        href={`/blog/${comment.post_slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {comment.post_slug}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{comment.guest_name || 'რეგისტრირებული მომხმარებელი'}</span>
                      </div>
                      {comment.guest_email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{comment.guest_email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}</span>
                      </div>
                    </div>
                    
                    <p className="text-foreground bg-muted/50 p-3 rounded-lg">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!comment.is_approved && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        დადასტურება
                      </Button>
                    )}
                    {comment.is_approved && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        onClick={() => handleReject(comment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        უარყოფა
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>კომენტარის წაშლა</AlertDialogTitle>
                          <AlertDialogDescription>
                            დარწმუნებული ხართ, რომ გსურთ ამ კომენტარის წაშლა? ეს მოქმედება შეუქცევადია.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(comment.id)}>
                            წაშლა
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
