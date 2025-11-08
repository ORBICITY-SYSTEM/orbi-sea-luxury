import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Star, Trash2, Image as ImageIcon, Video, Edit, FileUp } from 'lucide-react';
import { ImageEditor } from './ImageEditor';
import { BulkUploadZone } from './BulkUploadZone';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  url: string;
  thumbnail_url: string | null;
  category: string | null;
  is_featured: boolean;
  display_order: number;
}

export const AdminMedia = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMedia, setNewMedia] = useState({
    title: '',
    url: '',
    thumbnail_url: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      
      // Auto-fill title from filename if empty
      if (!newMedia.title) {
        setNewMedia({ ...newMedia, title: file.name.split('.')[0] });
      }
    }
  };

  const handleEditImage = () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file first',
        variant: 'destructive',
      });
      return;
    }
    setEditingImage(selectedFile);
    setShowEditor(true);
  };

  const handleSaveEditedImage = async (editedBlob: Blob) => {
    setShowEditor(false);
    
    // Create a new file from the edited blob
    const editedFile = new File([editedBlob], selectedFile?.name || 'edited.png', {
      type: 'image/png',
    });
    
    setSelectedFile(editedFile);
    
    toast({
      title: 'Success',
      description: 'Image edited successfully. Click Upload to save.',
    });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    if (!newMedia.title) {
      toast({
        title: 'Error',
        description: 'Please enter a title',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${newMedia.category || 'general'}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setUploadProgress(75);

      // Save to database
      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          title: newMedia.title,
          url: publicUrl,
          thumbnail_url: null,
          category: newMedia.category || null,
          description: newMedia.description || null,
          media_type: 'image',
          is_featured: false,
          display_order: media.length,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      // Reset form
      setNewMedia({
        title: '',
        url: '',
        thumbnail_url: '',
        category: '',
        description: '',
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      fetchMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddMedia = async () => {
    if (!newMedia.title || !newMedia.url) {
      toast({
        title: 'Error',
        description: 'Title and URL are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('media_library')
        .insert({
          title: newMedia.title,
          url: newMedia.url,
          thumbnail_url: newMedia.thumbnail_url || null,
          category: newMedia.category || null,
          description: newMedia.description || null,
          media_type: mediaType,
          is_featured: false,
          display_order: media.length,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Media added successfully',
      });

      setNewMedia({
        title: '',
        url: '',
        thumbnail_url: '',
        category: '',
        description: '',
      });

      fetchMedia();
    } catch (error) {
      console.error('Error adding media:', error);
      toast({
        title: 'Error',
        description: 'Failed to add media',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (item: MediaItem) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ is_featured: !item.is_featured })
        .eq('id', item.id);

      if (error) throw error;

      setMedia(media.map(m => 
        m.id === item.id ? { ...m, is_featured: !m.is_featured } : m
      ));

      toast({
        title: 'Success',
        description: `${item.is_featured ? 'Removed from' : 'Added to'} featured`,
      });
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: 'Error',
        description: 'Failed to update media',
        variant: 'destructive',
      });
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedia(media.filter(m => m.id !== id));

      toast({
        title: 'Success',
        description: 'Media deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    }
  };

  const images = media.filter(m => m.media_type === 'image');
  const videos = media.filter(m => m.media_type === 'video');

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
        <h2 className="text-3xl font-bold">Media Library</h2>
        <p className="text-muted-foreground">Manage images and videos for your website</p>
      </div>

      {/* Bulk Upload with Drag & Drop */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkUploadZone 
            onUploadComplete={fetchMedia}
            category={newMedia.category || 'general'}
          />
        </CardContent>
      </Card>

      {/* Add New Media */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={mediaType === 'image' ? 'default' : 'outline'}
              onClick={() => setMediaType('image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button
              variant={mediaType === 'video' ? 'default' : 'outline'}
              onClick={() => setMediaType('video')}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
          </div>

          {/* Image Upload Section */}
          {mediaType === 'image' && (
            <div className="border-2 border-dashed border-border rounded-lg p-6 space-y-4">
              <div className="text-center">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-semibold mb-1">Upload Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click to select or drag and drop your image (Max 10MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />

              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </Button>

                {selectedFile && (
                  <>
                    <Badge variant="outline" className="text-xs">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                    <Button
                      onClick={handleEditImage}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Image
                    </Button>
                  </>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    placeholder="Image title"
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={newMedia.category}
                    onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                    placeholder="e.g., apartments, amenities"
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={newMedia.description}
                    onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    placeholder="Image description"
                    disabled={uploading}
                  />
                </div>
              </div>

              <Button 
                onClick={handleUploadFile} 
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Video URL Section */}
          {mediaType === 'video' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    placeholder="Video title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={newMedia.category}
                    onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                    placeholder="e.g., tours, testimonials"
                  />
                </div>

                <div className="space-y-2">
                  <Label>YouTube Video ID *</Label>
                  <Input
                    value={newMedia.url}
                    onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                    placeholder="e.g., dQw4w9WgXcQ"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={newMedia.thumbnail_url}
                    onChange={(e) => setNewMedia({ ...newMedia, thumbnail_url: e.target.value })}
                    placeholder="Video thumbnail URL"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={newMedia.description}
                    onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    placeholder="Video description"
                  />
                </div>
              </div>

              <Button onClick={handleAddMedia}>
                <Upload className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">
            Images ({images.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-gradient-gold">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFeatured(item)}
                      className="flex-1"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMedia(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {item.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-gradient-gold">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFeatured(item)}
                      className="flex-1"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMedia(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Editor Modal */}
      <ImageEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        imageFile={editingImage}
        onSave={handleSaveEditedImage}
      />
    </div>
  );
};