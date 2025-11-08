import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, ExternalLink, RefreshCw } from 'lucide-react';

interface SEOPage {
  id: string;
  page_path: string;
  page_name: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  canonical_url: string;
  is_active: boolean;
}

export const AdminSEO = () => {
  const { toast } = useToast();
  const [seoPages, setSeoPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);
  const [formData, setFormData] = useState<Partial<SEOPage>>({});

  useEffect(() => {
    fetchSEOPages();
  }, []);

  const fetchSEOPages = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setSeoPages(data || []);
    } catch (error) {
      console.error('Error fetching SEO pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SEO settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (page: SEOPage) => {
    setSelectedPage(page);
    setFormData(page);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      const { error } = await supabase
        .from('seo_pages')
        .update({
          title: formData.title,
          description: formData.description,
          keywords: formData.keywords,
          og_image: formData.og_image,
          canonical_url: formData.canonical_url,
          is_active: formData.is_active,
        })
        .eq('id', selectedPage.id);

      if (error) throw error;

      toast({
        title: 'SEO Settings Updated',
        description: 'Page SEO settings saved successfully',
      });

      fetchSEOPages();
    } catch (error) {
      console.error('Error updating SEO:', error);
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive',
      });
    }
  };

  const generateSitemap = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-sitemap');
      
      if (error) throw error;

      toast({
        title: 'Sitemap Generated',
        description: 'Sitemap.xml has been generated successfully',
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate sitemap',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">SEO პარამეტრები</h2>
          <p className="text-muted-foreground mt-2">მართეთ თითოეული გვერდის SEO კონფიგურაცია</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={generateSitemap}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Sitemap
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://orbicitybatumi.com/sitemap.xml', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Sitemap
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">გვერდები</TabsTrigger>
          <TabsTrigger value="global">გლობალური პარამეტრები</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pages List */}
            <Card>
              <CardHeader>
                <CardTitle>გვერდების სია</CardTitle>
                <CardDescription>აირჩიეთ გვერდი რედაქტირებისთვის</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {seoPages.map((page) => (
                    <Button
                      key={page.id}
                      variant={selectedPage?.id === page.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => handlePageSelect(page)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{page.page_name}</div>
                        <div className="text-xs opacity-70">{page.page_path}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Page Editor */}
            {selectedPage && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPage.page_name} - SEO</CardTitle>
                  <CardDescription>{selectedPage.page_path}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meta Title ({formData.title?.length || 0}/60)</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Page title for SEO"
                      maxLength={60}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Description ({formData.description?.length || 0}/160)</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Page description for SEO"
                      rows={3}
                      maxLength={160}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords (comma separated)</Label>
                    <Textarea
                      id="keywords"
                      value={formData.keywords || ''}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_image">Open Graph Image URL</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image || ''}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      value={formData.canonical_url || ''}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://orbicitybatumi.com/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>გლობალური SEO პარამეტრები</CardTitle>
              <CardDescription>
                გლობალური პარამეტრები მართავთ პარამეტრები → საკონტაქტო ინფორმაცია და სოციალური მედია სექციებში
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Structured Data (Schema.org)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    საიტზე ავტომატურად ემატება Schema.org structured data:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Organization Schema</li>
                    <li>LocalBusiness / Hotel Schema</li>
                    <li>BreadcrumbList Schema</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Sitemap & Robots.txt</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open('https://orbicitybatumi.com/sitemap.xml', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Sitemap.xml
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open('https://orbicitybatumi.com/robots.txt', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Robots.txt
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
