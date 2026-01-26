import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();
  const baseUrl = 'https://orbicitybatumi.com';

  // Generate JSON-LD BreadcrumbList schema
  const breadcrumbSchema = useMemo(() => {
    const itemList = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `${baseUrl}${item.href}` : `${baseUrl}${location.pathname}`
      }))
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemList
    };
  }, [items, location.pathname]);

  return (
    <>
      {/* JSON-LD Breadcrumb Schema for SEO */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav className="bg-muted/30 py-4" aria-label="Breadcrumb">
        <div className="container mx-auto px-4">
          <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            {items.map((item, index) => (
              <li key={index} className="flex items-center space-x-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                {item.href ? (
                  <Link to={item.href} className="text-muted-foreground hover:text-foreground transition-colors" itemProp="item">
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-secondary font-medium" itemProp="name">{item.label}</span>
                )}
                <meta itemProp="position" content={String(index + 2)} />
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};
