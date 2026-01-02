import { useSiteSettings } from '@/hooks/useSiteSettings';

export const useWhatsApp = () => {
  const { settings, isLoading } = useSiteSettings();
  const whatsappPhone = settings?.whatsapp_phone || '995555199090';
  
  // Use wa.me format - more reliable and widely supported
  const getWhatsAppUrl = (message?: string) => {
    let url = `https://wa.me/${whatsappPhone}`;
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    return url;
  };

  const whatsappUrl = getWhatsAppUrl();

  const openWhatsApp = (message?: string) => {
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return {
    whatsappPhone,
    whatsappUrl,
    getWhatsAppUrl,
    openWhatsApp,
    isLoading,
  };
};
