import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

// Language to locale mapping for hreflang and og:locale
const languageLocales: Record<string, { hreflang: string; ogLocale: string }> = {
  en: { hreflang: 'en', ogLocale: 'en_US' },
  ka: { hreflang: 'ka', ogLocale: 'ka_GE' },
  ru: { hreflang: 'ru', ogLocale: 'ru_RU' },
  tr: { hreflang: 'tr', ogLocale: 'tr_TR' },
  uk: { hreflang: 'uk', ogLocale: 'uk_UA' },
  ar: { hreflang: 'ar', ogLocale: 'ar_AE' },
  zh: { hreflang: 'zh', ogLocale: 'zh_CN' },
  de: { hreflang: 'de', ogLocale: 'de_DE' },
  fr: { hreflang: 'fr', ogLocale: 'fr_FR' },
};

export const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  type = 'website',
  noindex = false
}: SEOProps) => {
  const location = useLocation();
  const { language } = useLanguage();
  const { pageSEO, globalSettings, isLoading } = useSEO(location.pathname);

  if (isLoading) return null;

  const baseUrl = 'https://orbicitybatumi.com';

  // Use prop values first, then page-specific SEO, then defaults
  const finalTitle = title || pageSEO?.title || 'Orbi City Batumi - Luxury Apartments with Sea View';
  const finalDescription = description || pageSEO?.description || 'Discover luxury apartments in Orbi City Batumi with stunning sea views. Premium serviced apartments near Black Sea beach.';
  const finalKeywords = keywords || pageSEO?.keywords || 'Orbi City Batumi, luxury apartments batumi, sea view apartments, hotel batumi, apartments batumi, batumi beach hotel';
  const finalOgImage = ogImage || pageSEO?.og_image || globalSettings?.default_og_image || `${baseUrl}/og-image.jpg`;
  const finalCanonical = canonical || pageSEO?.canonical_url || `${baseUrl}${location.pathname}`;

  const siteName = globalSettings?.site_name || 'Orbi City Batumi';
  const twitterHandle = globalSettings?.twitter_handle || '@orbicitybatumi';

  // Get current language locale info
  const currentLocale = languageLocales[language] || languageLocales.en;

  // Supported languages for hreflang
  const supportedLanguages = ['en', 'ka', 'ru'];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <link rel="canonical" href={finalCanonical} />

      {/* Hreflang Tags for Multi-Language SEO */}
      {supportedLanguages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={languageLocales[lang].hreflang}
          href={finalCanonical}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:site_name" content={siteName} />
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}
      {finalOgImage && <meta property="og:image:width" content="1200" />}
      {finalOgImage && <meta property="og:image:height" content="630" />}
      {finalOgImage && <meta property="og:image:alt" content={finalTitle} />}
      <meta property="og:locale" content={currentLocale.ogLocale} />
      {/* Alternate locales */}
      {supportedLanguages.filter(l => l !== language).map(lang => (
        <meta key={lang} property="og:locale:alternate" content={languageLocales[lang].ogLocale} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalCanonical} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalOgImage && <meta name="twitter:image" content={finalOgImage} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Additional SEO tags */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={currentLocale.hreflang} />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="GE-AJ" />
      <meta name="geo.placename" content="Batumi" />
      <meta name="geo.position" content="41.642883;41.644944" />
      <meta name="ICBM" content="41.642883, 41.644944" />

      {/* Additional Trust Signals */}
      <meta name="author" content="Orbi City Batumi" />
      <meta name="publisher" content="ORBICITY SYSTEM" />
      <meta name="copyright" content="Orbi City Batumi" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};
