import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPosts, getFeaturedPosts } from '@/data/blogPosts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Blog = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(blogPosts.map(post => language === 'ka' ? post.category_ka : post.category))];
  
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => (language === 'ka' ? post.category_ka : post.category) === selectedCategory)
    : blogPosts;

  const featuredPosts = getFeaturedPosts();

  return (
    <Layout>
      <SEO 
        title={language === 'ka' ? 'ბლოგი | Orbi City Batumi' : 'Blog | Orbi City Batumi'}
        description={language === 'ka' 
          ? 'ისტორიები, რჩევები და სიახლეები Orbi City-დან და ბათუმიდან. აღმოაჩინეთ საუკეთესო ადგილები, რესტორნები და ღირსშესანიშნაობები.'
          : 'Stories, tips, and news from Orbi City and Batumi. Discover the best places, restaurants, and attractions.'}
        keywords="Batumi blog, Orbi City, travel tips, Georgian tourism, Black Sea"
      />
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-primary/90 via-primary to-primary/80 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-[0_4px_8px_rgba(212,175,55,0.4)] [text-shadow:_0_1px_0_rgb(255_255_255_/_40%),_0_4px_12px_rgba(212,175,55,0.5)]"
          >
            {language === 'ka' ? 'ჩვენი ბლოგი' : 'Our Blog'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)] max-w-2xl"
          >
            {language === 'ka' 
              ? 'ისტორიები, რჩევები და სიახლეები Orbi City-დან და ბათუმიდან'
              : 'Stories, tips, and news from Orbi City and Batumi'}
          </motion.p>
        </div>
      </div>

      <Breadcrumbs items={[{ label: language === 'ka' ? 'ბლოგი' : 'Blog' }]} />

      {/* Category Filter */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer text-sm px-4 py-2"
              onClick={() => setSelectedCategory(null)}
            >
              {language === 'ka' ? 'ყველა' : 'All'}
            </Badge>
            {categories.map(category => (
              <Badge 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-sm px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {!selectedCategory && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">
              {language === 'ka' ? 'გამორჩეული სტატიები' : 'Featured Articles'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={language === 'ka' ? post.title_ka : post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge className="absolute top-4 left-4">
                          {language === 'ka' ? post.category_ka : post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {language === 'ka' ? post.title_ka : post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {language === 'ka' ? post.excerpt_ka : post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime} {language === 'ka' ? 'წუთი' : 'min'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">
            {selectedCategory || (language === 'ka' ? 'ყველა სტატია' : 'All Articles')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={post.image} 
                        alt={language === 'ka' ? post.title_ka : post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {language === 'ka' ? post.category_ka : post.category}
                      </Badge>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {language === 'ka' ? post.title_ka : post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {language === 'ka' ? post.excerpt_ka : post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} {language === 'ka' ? 'წთ' : 'min'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
