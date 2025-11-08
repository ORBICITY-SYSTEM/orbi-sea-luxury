import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage,
  canonical,
  type = 'website' 
}: SEOProps) => {
  const location = useLocation();
  const { pageSEO, globalSettings, isLoading } = useSEO(location.pathname);

  if (isLoading) return null;

  // Use prop values first, then page-specific SEO, then defaults
  const finalTitle = title || pageSEO?.title || 'Orbi City Batumi - Luxury Apartments with Sea View';
  const finalDescription = description || pageSEO?.description || 'Discover luxury apartments in Orbi City Batumi with stunning sea views';
  const finalKeywords = keywords || pageSEO?.keywords || 'Orbi City Batumi, luxury apartments, sea view';
  const finalOgImage = ogImage || pageSEO?.og_image || globalSettings?.default_og_image || '';
  const finalCanonical = canonical || pageSEO?.canonical_url || `https://orbicitybatumi.com${location.pathname}`;
  
  const siteName = globalSettings?.site_name || 'Orbi City Batumi';
  const twitterHandle = globalSettings?.twitter_handle || '@orbicitybatumi';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:site_name" content={siteName} />
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}
      {finalOgImage && <meta property="og:image:width" content="1200" />}
      {finalOgImage && <meta property="og:image:height" content="630" />}
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalCanonical} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalOgImage && <meta name="twitter:image" content={finalOgImage} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
    </Helmet>
  );
};
