import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/data/blogPosts';

interface BlogArticleSchemaProps {
  post: BlogPost;
  language: 'en' | 'ka';
  url: string;
}

export const BlogArticleSchema = ({ post, language, url }: BlogArticleSchemaProps) => {
  const title = language === 'ka' ? post.title_ka : post.title;
  const description = language === 'ka' ? post.excerpt_ka : post.excerpt;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": post.image,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://orbicitybatumi.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Orbi City Batumi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://orbicitybatumi.com/logo.jpg"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": post.category,
    "wordCount": Math.round(post.readTime * 200), // Approximate words based on read time
    "inLanguage": language === 'ka' ? 'ka-GE' : 'en-US',
    "about": {
      "@type": "Place",
      "name": "Batumi, Georgia",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Batumi",
        "addressCountry": "Georgia"
      }
    },
    "isPartOf": {
      "@type": "Blog",
      "name": "Orbi City Batumi Blog",
      "url": "https://orbicitybatumi.com/blog"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
