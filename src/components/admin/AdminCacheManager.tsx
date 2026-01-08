import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, HardDrive, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CacheInfo {
  name: string;
  size: string;
  entries: number;
}

export const AdminCacheManager = () => {
  const [caches, setCaches] = useState<CacheInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [swStatus, setSwStatus] = useState<'checking' | 'active' | 'none' | 'error'>('checking');
  const { toast } = useToast();

  // Check service worker status on mount
  useState(() => {
    checkServiceWorker();
    loadCacheInfo();
  });

  const checkServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      setSwStatus('none');
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      setSwStatus(registrations.length > 0 ? 'active' : 'none');
    } catch {
      setSwStatus('error');
    }
  };

  const loadCacheInfo = async () => {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await window.caches.keys();
      const cacheInfoList: CacheInfo[] = [];

      for (const name of cacheNames) {
        const cache = await window.caches.open(name);
        const keys = await cache.keys();
        
        // Estimate size (rough calculation)
        let totalSize = 0;
        for (const request of keys.slice(0, 50)) { // Sample first 50
          try {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.clone().blob();
              totalSize += blob.size;
            }
          } catch {
            // Skip errors
          }
        }
        
        const estimatedSize = keys.length > 50 
          ? (totalSize / 50) * keys.length 
          : totalSize;

        cacheInfoList.push({
          name,
          size: formatBytes(estimatedSize),
          entries: keys.length,
        });
      }

      setCaches(cacheInfoList);
    } catch (error) {
      console.error('Failed to load cache info:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAllCaches = async () => {
    setLoading(true);
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(name => window.caches.delete(name)));
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      toast({
        title: 'წარმატება!',
        description: 'ყველა ქეში გასუფთავდა. გვერდი განახლდება...',
      });

      // Reload after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to clear caches:', error);
      toast({
        title: 'შეცდომა',
        description: 'ქეშის გასუფთავება ვერ მოხერხდა',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSpecificCache = async (cacheName: string) => {
    try {
      await window.caches.delete(cacheName);
      toast({
        title: 'წარმატება!',
        description: `${cacheName} გასუფთავდა`,
      });
      loadCacheInfo();
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'ქეშის გასუფთავება ვერ მოხერხდა',
        variant: 'destructive',
      });
    }
  };

  const forceUpdate = async () => {
    setLoading(true);
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
      toast({
        title: 'წარმატება!',
        description: 'Service Worker განახლების მოთხოვნა გაიგზავნა',
      });
    } catch (error) {
      toast({
        title: 'შეცდომა',
        description: 'განახლება ვერ მოხერხდა',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          PWA და ქეშის მართვა
        </CardTitle>
        <CardDescription>
          Service Worker-ის სტატუსი და ბრაუზერის ქეშის მართვა
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Worker Status */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {swStatus === 'active' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {swStatus === 'none' && (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            {swStatus === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {swStatus === 'checking' && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            <div>
              <p className="font-medium">Service Worker</p>
              <p className="text-sm text-muted-foreground">
                {swStatus === 'active' && 'აქტიურია და მუშაობს'}
                {swStatus === 'none' && 'არ არის რეგისტრირებული'}
                {swStatus === 'error' && 'შეცდომა'}
                {swStatus === 'checking' && 'მოწმდება...'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={forceUpdate}
            disabled={loading || swStatus !== 'active'}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            განახლება
          </Button>
        </div>

        {/* Cache List */}
        {caches.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              ქეშირებული მონაცემები
            </h4>
            <div className="space-y-2">
              {caches.map((cache) => (
                <div 
                  key={cache.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{cache.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {cache.entries} ფაილი
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {cache.size}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearSpecificCache(cache.name)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear All Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            onClick={clearAllCaches}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            ყველა ქეშის გასუფთავება და გვერდის განახლება
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            ეს გაასუფთავებს ყველა ქეშირებულ მონაცემს და განაახლებს გვერდს
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
