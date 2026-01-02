import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPostBySlug, blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'ka' ? 'სტატია ვერ მოიძებნა' : 'Post Not Found'}
          </h1>
          <Button onClick={() => navigate('/blog')}>
            {language === 'ka' ? 'დაბრუნება ბლოგზე' : 'Back to Blog'}
          </Button>
        </div>
      </Layout>
    );
  }

  const title = language === 'ka' ? post.title_ka : post.title;
  const excerpt = language === 'ka' ? post.excerpt_ka : post.excerpt;
  const content = language === 'ka' ? post.content_ka : post.content;
  const category = language === 'ka' ? post.category_ka : post.category;

  // Find related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Find previous and next posts
  const currentIndex = blogPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: language === 'ka' ? 'ლინკი დაკოპირდა!' : 'Link copied!',
        description: language === 'ka' ? 'ლინკი დაკოპირდა ბუფერში' : 'Link copied to clipboard',
      });
    }
  };

  // Convert markdown-like content to HTML-safe format
  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{line.slice(4)}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold my-2 text-foreground">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 list-disc text-muted-foreground">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-6 list-decimal text-muted-foreground">{line.slice(3)}</li>;
        }
        if (line.startsWith('---')) {
          return <hr key={index} className="my-8 border-border" />;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-muted-foreground leading-relaxed my-2">{line}</p>;
      });
  };

  return (
    <Layout>
      <SEO 
        title={`${title} | Orbi City Batumi Blog`}
        description={excerpt}
        keywords={`${post.category}, Batumi, Orbi City, ${title}`}
        ogImage={post.image}
        type="article"
      />

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img 
          src={post.image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <Badge className="mb-4">{category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime} {language === 'ka' ? 'წუთი კითხვა' : 'min read'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Breadcrumbs items={[
        { label: language === 'ka' ? 'ბლოგი' : 'Blog', href: '/blog' },
        { label: title }
      ]} />

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Share Button */}
            <div className="flex justify-end mb-8">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {language === 'ka' ? 'გაზიარება' : 'Share'}
              </Button>
            </div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              {formatContent(content)}
            </motion.div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">Batumi</Badge>
                <Badge variant="outline">Orbi City</Badge>
                <Badge variant="outline">{language === 'ka' ? 'საქართველო' : 'Georgia'}</Badge>
              </div>
            </div>

            {/* Post Navigation */}
            <div className="mt-12 grid md:grid-cols-2 gap-4">
              {prevPost && (
                <Link to={`/blog/${prevPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {language === 'ka' ? 'წინა სტატია' : 'Previous'}
                      </div>
                      <p className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {language === 'ka' ? prevPost.title_ka : prevPost.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="md:col-start-2">
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                        {language === 'ka' ? 'შემდეგი სტატია' : 'Next'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {language === 'ka' ? nextPost.title_ka : nextPost.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'ka' ? 'მსგავსი სტატიები' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={relatedPost.image} 
                          alt={language === 'ka' ? relatedPost.title_ka : relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {language === 'ka' ? relatedPost.title_ka : relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {language === 'ka' ? relatedPost.excerpt_ka : relatedPost.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPostDetail;
