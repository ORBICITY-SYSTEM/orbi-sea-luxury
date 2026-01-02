import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useIsMobile } from '@/hooks/use-mobile';

export const useWhatsApp = () => {
  const { settings, isLoading } = useSiteSettings();
  const isMobile = useIsMobile();

  const whatsappPhoneRaw = settings?.whatsapp_phone || '995555199090';
  const whatsappPhone = whatsappPhoneRaw.replace(/[^0-9]/g, '');

  // NOTE: Some environments block api.whatsapp.com.
  // - Mobile: use wa.me
  // - Desktop: use web.whatsapp.com
  const getWhatsAppUrl = (message?: string) => {
    const text = message?.trim();
    if (isMobile) {
      let url = `https://wa.me/${whatsappPhone}`;
      if (text) url += `?text=${encodeURIComponent(text)}`;
      return url;
    }

    const params = new URLSearchParams({ phone: whatsappPhone });
    if (text) params.set('text', text);
    return `https://web.whatsapp.com/send?${params.toString()}`;
  };

  const whatsappUrl = getWhatsAppUrl();

  const openWhatsApp = (message?: string) => {
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return {
    whatsappPhone,
    whatsappUrl,
    getWhatsAppUrl,
    openWhatsApp,
    isLoading,
  };
};
