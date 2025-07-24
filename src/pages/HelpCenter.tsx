
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, MessageCircle, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of creating your first card",
      icon: BookOpen,
      articles: [
        "How to create your first card",
        "Understanding card templates",
        "Basic editing tools",
        "Publishing your card"
      ]
    },
    {
      title: "Card Creation",
      description: "Master the art of card design",
      icon: Video,
      articles: [
        "Advanced editing techniques",
        "Working with effects",
        "Custom templates",
        "Export options"
      ]
    },
    {
      title: "Collections & Sharing",
      description: "Organize and share your cards",
      icon: MessageCircle,
      articles: [
        "Creating collections",
        "Sharing your work",
        "Privacy settings",
        "Community guidelines"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-crd-lightGray mb-8">
            Everything you need to know about creating amazing cards
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-crd-lightGray" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-3 bg-crd-dark border border-crd-mediumGray rounded-lg text-white focus:outline-none focus:border-crd-green"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {helpCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="bg-crd-dark border-crd-mediumGray p-6 hover:border-crd-green transition-colors">
                <div className="flex items-center mb-4">
                  <IconComponent className="h-8 w-8 text-crd-green mr-3" />
                  <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                </div>
                <p className="text-crd-lightGray mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <button className="text-crd-lightGray hover:text-crd-green transition-colors text-left w-full flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-crd-dark rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-crd-lightGray mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
                Contact Support
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
