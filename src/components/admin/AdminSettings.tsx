import { useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const AdminSettings = () => {
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const handleSave = async (id: string, key: string) => {
    const value = editedValues[id] || settings?.find(s => s.id === id)?.value || '';
    
    setSavingIds(prev => new Set(prev).add(id));
    
    await updateSetting.mutateAsync({ id, value });
    
    setSavingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    setEditedValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const getValue = (id: string, value: string | null) => {
    return editedValues[id] !== undefined ? editedValues[id] : (value || '');
  };

  const hasChanges = (id: string, originalValue: string | null) => {
    return editedValues[id] !== undefined && editedValues[id] !== (originalValue || '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">პარამეტრები</h2>
        <p className="text-muted-foreground mt-2">
          მართეთ საიტის გლობალური პარამეტრები
        </p>
      </div>

      <div className="grid gap-6">
        {/* YouTube Settings */}
        <Card>
          <CardHeader>
            <CardTitle>YouTube ინტეგრაცია</CardTitle>
            <CardDescription>
              YouTube არხის პარამეტრები ვიდეოების ჩვენებისთვის
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.filter(s => s.key === 'youtube_channel_id').map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>YouTube Channel ID</Label>
                <div className="flex gap-2">
                  <Input
                    id={setting.key}
                    value={getValue(setting.id, setting.value)}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.id]: e.target.value }))}
                    placeholder="მაგ: UCuAXFkgsw1L7xaCfnd5JJOw"
                  />
                  <Button
                    onClick={() => handleSave(setting.id, setting.key)}
                    disabled={!hasChanges(setting.id, setting.value) || savingIds.has(setting.id)}
                  >
                    {savingIds.has(setting.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {setting.description && (
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media Settings */}
        <Card>
          <CardHeader>
            <CardTitle>სოციალური მედია</CardTitle>
            <CardDescription>
              სოციალური ქსელების ბმულები
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.filter(s => ['facebook_url', 'instagram_url', 'twitter_url'].includes(s.key)).map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>
                  {setting.key === 'facebook_url' && 'Facebook URL'}
                  {setting.key === 'instagram_url' && 'Instagram URL'}
                  {setting.key === 'twitter_url' && 'Twitter/X URL'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={setting.key}
                    value={getValue(setting.id, setting.value)}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.id]: e.target.value }))}
                    placeholder="https://..."
                  />
                  <Button
                    onClick={() => handleSave(setting.id, setting.key)}
                    disabled={!hasChanges(setting.id, setting.value) || savingIds.has(setting.id)}
                  >
                    {savingIds.has(setting.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle>საკონტაქტო ინფორმაცია</CardTitle>
            <CardDescription>
              საკონტაქტო გვერდის დეტალები
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.filter(s => ['contact_email', 'contact_phone', 'google_maps_url'].includes(s.key)).map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>
                  {setting.key === 'contact_email' && 'ელ. ფოსტა'}
                  {setting.key === 'contact_phone' && 'ტელეფონი'}
                  {setting.key === 'google_maps_url' && 'Google Maps URL'}
                </Label>
                <div className="flex gap-2">
                  {setting.key === 'google_maps_url' ? (
                    <Textarea
                      id={setting.key}
                      value={getValue(setting.id, setting.value)}
                      onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.id]: e.target.value }))}
                      placeholder="Google Maps embed URL..."
                      rows={3}
                      className="flex-1"
                    />
                  ) : (
                    <Input
                      id={setting.key}
                      value={getValue(setting.id, setting.value)}
                      onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.id]: e.target.value }))}
                      placeholder={setting.key === 'contact_email' ? 'info@example.com' : '+995 XXX XXX XXX'}
                    />
                  )}
                  <Button
                    onClick={() => handleSave(setting.id, setting.key)}
                    disabled={!hasChanges(setting.id, setting.value) || savingIds.has(setting.id)}
                    className={setting.key === 'google_maps_url' ? 'self-start' : ''}
                  >
                    {savingIds.has(setting.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
