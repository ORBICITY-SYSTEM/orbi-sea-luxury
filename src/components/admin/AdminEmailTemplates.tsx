import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Edit, Loader2, Send, Eye, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  subject_en: string;
  subject_ka: string;
  body_en: string;
  body_ka: string;
  is_active: boolean;
}

interface EmailLog {
  id: string;
  template_key: string | null;
  recipient_email: string;
  recipient_name: string | null;
  status: string;
  error_message: string | null;
  sent_at: string;
}

export function AdminEmailTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_key');
      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const { data: logs } = useQuery({
    queryKey: ['email-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as EmailLog[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (template: EmailTemplate) => {
      const { error } = await supabase
        .from('email_templates')
        .update({
          template_name: template.template_name,
          subject_en: template.subject_en,
          subject_ka: template.subject_ka,
          body_en: template.body_en,
          body_ka: template.body_ka,
          is_active: template.is_active,
        })
        .eq('id', template.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'წარმატება', description: 'შაბლონი განახლდა' });
      setEditingTemplate(null);
    },
    onError: () => {
      toast({ title: 'შეცდომა', variant: 'destructive' });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });

  const handlePreview = (html: string) => {
    // Replace template variables with example data
    const previewData = {
      '{{guest_name}}': 'გიორგი ბერიძე',
      '{{check_in}}': '15 იანვარი 2026',
      '{{check_out}}': '18 იანვარი 2026',
      '{{apartment_type}}': 'Premium Suite',
      '{{total_price}}': '450',
    };

    let preview = html;
    Object.entries(previewData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key, 'g'), value);
    });
    setPreviewHtml(preview);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Email ნოტიფიკაციები</h2>
        <p className="text-muted-foreground">მართეთ email შაბლონები და ნახეთ გაგზავნილი წერილების ისტორია</p>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            შაბლონები
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Mail className="h-4 w-4 mr-2" />
            ლოგები ({logs?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates?.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.template_name}</CardTitle>
                      <CardDescription className="font-mono text-xs">{template.template_key}</CardDescription>
                    </div>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: template.id, is_active: checked })}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Subject (EN):</p>
                    <p className="text-sm text-muted-foreground truncate">{template.subject_en}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Subject (KA):</p>
                    <p className="text-sm text-muted-foreground truncate">{template.subject_ka}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      რედაქტირება
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(template.body_ka)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Variables Help */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">ხელმისაწვდომი ცვლადები</CardTitle>
              <CardDescription>გამოიყენეთ ეს ცვლადები შაბლონებში</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{'{{guest_name}}'}</Badge>
                <Badge variant="secondary">{'{{check_in}}'}</Badge>
                <Badge variant="secondary">{'{{check_out}}'}</Badge>
                <Badge variant="secondary">{'{{apartment_type}}'}</Badge>
                <Badge variant="secondary">{'{{total_price}}'}</Badge>
                <Badge variant="secondary">{'{{booking_id}}'}</Badge>
                <Badge variant="secondary">{'{{guests}}'}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>გაგზავნილი წერილები</CardTitle>
              <CardDescription>ბოლო 50 email</CardDescription>
            </CardHeader>
            <CardContent>
              {logs && logs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>თარიღი</TableHead>
                      <TableHead>მიმღები</TableHead>
                      <TableHead>შაბლონი</TableHead>
                      <TableHead>სტატუსი</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {format(new Date(log.sent_at), 'd MMM, HH:mm', { locale: ka })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.recipient_name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{log.recipient_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.template_key || 'custom'}</Badge>
                        </TableCell>
                        <TableCell>
                          {log.status === 'sent' ? (
                            <Badge className="bg-green-100 text-green-800">გაგზავნილი</Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              შეცდომა
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>გაგზავნილი წერილები არ არის</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>შაბლონის რედაქტირება</DialogTitle>
            <DialogDescription>{editingTemplate?.template_key}</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>შაბლონის სახელი</Label>
                <Input
                  value={editingTemplate.template_name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, template_name: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject (EN)</Label>
                  <Input
                    value={editingTemplate.subject_en}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject_en: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject (KA)</Label>
                  <Input
                    value={editingTemplate.subject_ka}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject_ka: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Body (EN) - HTML</Label>
                  <Textarea
                    value={editingTemplate.body_en}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body_en: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body (KA) - HTML</Label>
                  <Textarea
                    value={editingTemplate.body_ka}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body_ka: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>გაუქმება</Button>
            <Button onClick={() => editingTemplate && updateMutation.mutate(editingTemplate)} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              შენახვა
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div 
            className="border rounded-lg p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: previewHtml || '' }}
          />
          <DialogFooter>
            <Button onClick={() => setPreviewHtml(null)}>დახურვა</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
