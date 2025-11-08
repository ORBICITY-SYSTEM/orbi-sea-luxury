import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const AdminContactSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Submission marked as ${status}`,
      });

      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedSubmission) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast({
        title: 'Notes Saved',
        description: 'Admin notes updated successfully',
      });

      fetchSubmissions();
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>
            Manage and respond to customer inquiries ({submissions.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No submissions yet</p>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{submission.name}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {submission.email}
                          </span>
                          {submission.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {submission.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(submission.created_at), 'PPp')}
                          </span>
                        </div>
                      </div>
                      <Select
                        value={submission.status}
                        onValueChange={(value) => updateSubmissionStatus(submission.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                    </div>

                    {submission.admin_notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Admin Notes:
                        </p>
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">{submission.admin_notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setAdminNotes(submission.admin_notes || '');
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {submission.admin_notes ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Reply via Email
                      </Button>
                      {submission.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://wa.me/${submission.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes Modal */}
      {selectedSubmission && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Admin Notes - {selectedSubmission.name}</CardTitle>
            <CardDescription>Add internal notes about this submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add your notes here..."
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={saveAdminNotes}>
                Save Notes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSubmission(null);
                  setAdminNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
