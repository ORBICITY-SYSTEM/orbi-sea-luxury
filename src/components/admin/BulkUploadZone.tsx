import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

interface BulkUploadZoneProps {
  onUploadComplete: () => void;
  category?: string;
}

export const BulkUploadZone = ({ onUploadComplete, category = 'general' }: BulkUploadZoneProps) => {
  const { toast } = useToast();
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate files
    const validFiles = acceptedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file',
          description: `${file.name} is not an image`,
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    // Add to queue
    const newFiles: UploadFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0,
    }));

    setUploadQueue(prev => [...prev, ...newFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true,
  });

  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Update status to uploading
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
        ));

        // Generate unique filename
        const fileExt = uploadFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${uploadFile.id}.${fileExt}`;
        const filePath = `${category}/${fileName}`;

        // Simulate progress for small files
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 30 } : f
        ));

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, uploadFile.file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 60 } : f
        ));

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 80 } : f
        ));

        // Save to database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: uploadFile.file.name.split('.')[0],
            url: publicUrl,
            category: category,
            media_type: 'image',
            is_featured: false,
            display_order: 0,
          });

        if (dbError) throw dbError;

        // Success
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'success' as const, 
            progress: 100,
            url: publicUrl 
          } : f
        ));

        resolve();
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'error' as const, 
            error: error.message 
          } : f
        ));
        reject(error);
      }
    });
  };

  const startBulkUpload = async () => {
    setIsUploading(true);

    const pendingFiles = uploadQueue.filter(f => f.status === 'pending');
    
    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error('Failed to upload:', file.file.name);
      }
    }

    setIsUploading(false);
    
    const successCount = uploadQueue.filter(f => f.status === 'success').length;
    const errorCount = uploadQueue.filter(f => f.status === 'error').length;

    toast({
      title: 'Upload Complete',
      description: `${successCount} images uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
    });

    onUploadComplete();
  };

  const clearQueue = () => {
    setUploadQueue([]);
  };

  const pendingCount = uploadQueue.filter(f => f.status === 'pending').length;
  const successCount = uploadQueue.filter(f => f.status === 'success').length;
  const errorCount = uploadQueue.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">Drag & drop images here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to select files</p>
            <Badge variant="outline">Max 10MB per file</Badge>
          </>
        )}
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Upload Queue ({uploadQueue.length})</h3>
                <div className="flex gap-2 text-sm">
                  <Badge variant="outline">{pendingCount} pending</Badge>
                  {successCount > 0 && <Badge variant="default">{successCount} success</Badge>}
                  {errorCount > 0 && <Badge variant="destructive">{errorCount} failed</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                {!isUploading && pendingCount > 0 && (
                  <Button onClick={startBulkUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All ({pendingCount})
                  </Button>
                )}
                <Button variant="outline" onClick={clearQueue} disabled={isUploading}>
                  Clear Queue
                </Button>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uploadQueue.map(uploadFile => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-1 mt-2" />
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <p className="text-xs text-destructive mt-1">{uploadFile.error}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'pending' && (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    {uploadFile.status === 'uploading' && (
                      <Badge>Uploading...</Badge>
                    )}
                    {uploadFile.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    
                    {uploadFile.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromQueue(uploadFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};