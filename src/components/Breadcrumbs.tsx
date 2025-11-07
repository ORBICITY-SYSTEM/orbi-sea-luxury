import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="bg-muted/30 py-4">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {item.href ? (
                <Link to={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-secondary font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
