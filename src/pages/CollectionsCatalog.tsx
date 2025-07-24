
import React from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CardsCatalogSection } from '@/components/cards/components/CardsCatalogSection';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const CollectionsCatalog = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/collections" className="text-gray-400 hover:text-white">
                      Collections
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">
                    Card Catalog
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Card Catalog</h1>
            <p className="text-gray-400">
              Browse and discover cards from your collections
            </p>
          </div>

          {/* Catalog Section */}
          <CardsCatalogSection />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CollectionsCatalog;
