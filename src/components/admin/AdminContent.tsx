import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface ContentSection {
  id: string;
  section_key: string;
  section_name: string;
  content_en: string | null;
  content_ka: string | null;
  page: string;
  section_type: string;
}

export const AdminContent = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('page', { ascending: true })
        .order('section_name', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: ContentSection, field: 'content_en' | 'content_ka', value: string) => {
    setSaving(section.id);
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ [field]: value })
        .eq('id', section.id);

      if (error) throw error;

      setSections(sections.map(s => 
        s.id === section.id ? { ...s, [field]: value } : s
      ));

      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const pages = [...new Set(sections.map(s => s.page))];
  const filteredSections = sections.filter(s => s.page === selectedPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Content Management</h2>
        <p className="text-muted-foreground">Edit website text content in multiple languages</p>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList>
          {pages.map(page => (
            <TabsTrigger key={page} value={page} className="capitalize">
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map(page => (
          <TabsContent key={page} value={page} className="space-y-4">
            {filteredSections.map(section => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.section_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Key: {section.section_key}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* English Content */}
                    <div className="space-y-2">
                      <Label htmlFor={`${section.id}-en`}>English</Label>
                      {section.section_type === 'textarea' ? (
                        <Textarea
                          id={`${section.id}-en`}
                          value={section.content_en || ''}
                          onChange={(e) => {
                            setSections(sections.map(s => 
                              s.id === section.id ? { ...s, content_en: e.target.value } : s
                            ));
                          }}
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={`${section.id}-en`}
                          value={section.content_en || ''}
                          onChange={(e) => {
                            setSections(sections.map(s => 
                              s.id === section.id ? { ...s, content_en: e.target.value } : s
                            ));
                          }}
                        />
                      )}
                      <Button
                        onClick={() => handleSave(section, 'content_en', section.content_en || '')}
                        disabled={saving === section.id}
                        size="sm"
                      >
                        {saving === section.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-1" />
                        )}
                        Save English
                      </Button>
                    </div>

                    {/* Georgian Content */}
                    <div className="space-y-2">
                      <Label htmlFor={`${section.id}-ka`}>ქართული</Label>
                      {section.section_type === 'textarea' ? (
                        <Textarea
                          id={`${section.id}-ka`}
                          value={section.content_ka || ''}
                          onChange={(e) => {
                            setSections(sections.map(s => 
                              s.id === section.id ? { ...s, content_ka: e.target.value } : s
                            ));
                          }}
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={`${section.id}-ka`}
                          value={section.content_ka || ''}
                          onChange={(e) => {
                            setSections(sections.map(s => 
                              s.id === section.id ? { ...s, content_ka: e.target.value } : s
                            ));
                          }}
                        />
                      )}
                      <Button
                        onClick={() => handleSave(section, 'content_ka', section.content_ka || '')}
                        disabled={saving === section.id}
                        size="sm"
                      >
                        {saving === section.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-1" />
                        )}
                        ქართულის შენახვა
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};