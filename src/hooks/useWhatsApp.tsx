import { useSiteSettings } from '@/hooks/useSiteSettings';

export const useWhatsApp = () => {
  const { settings, isLoading } = useSiteSettings();
  const whatsappPhone = settings?.whatsapp_phone || '995555199090';
  
  // Use api.whatsapp.com/send format - works better with browser security
  const getWhatsAppUrl = (message?: string) => {
    const baseUrl = `https://api.whatsapp.com/send`;
    const params = new URLSearchParams({
      phone: whatsappPhone,
      type: 'phone_number',
      app_absent: '0'
    });
    if (message) {
      params.set('text', message);
    }
    return `${baseUrl}?${params.toString()}`;
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
