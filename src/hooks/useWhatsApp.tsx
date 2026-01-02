import { useSiteSettings } from '@/hooks/useSiteSettings';

export const useWhatsApp = () => {
  const { settings, isLoading } = useSiteSettings();
  const whatsappPhone = settings?.whatsapp_phone || '995555199090';
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  const openWhatsApp = (message?: string) => {
    const url = message 
      ? `${whatsappUrl}?text=${encodeURIComponent(message)}`
      : whatsappUrl;
    window.open(url, '_blank');
  };

  return {
    whatsappPhone,
    whatsappUrl,
    openWhatsApp,
    isLoading,
  };
};
