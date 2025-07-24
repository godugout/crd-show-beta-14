
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GettingStarted = () => {
  const steps = [
    {
      title: "1. Choose Your Template",
      description: "Start with one of our professional templates or create from scratch",
      action: "Browse Templates",
      link: "/create"
    },
    {
      title: "Upload Your Content",
      description: "Add your photo or artwork to bring your card to life",
      action: "Start Creating",
      link: "/create"
    },
    {
      title: "3. Customize & Edit",
      description: "Use our powerful editor to add effects, text, and styling",
      action: "Open Studio",
      link: "/studio"
    },
    {
      title: "4. Share Your Creation",
      description: "Publish your card and share it with the community",
      action: "View Gallery",
      link: "/gallery"
    }
  ];

  const features = [
    "Professional card templates",
    "Advanced 3D effects and lighting",
    "High-quality export options",
    "Community sharing and collections",
    "Real-time collaboration tools",
    "Mobile-friendly editing"
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Getting Started with CRD</h1>
          <p className="text-xl text-crd-lightGray mb-8">
            Create stunning digital trading cards in just a few simple steps
          </p>
          <Link to="/create">
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Steps Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-crd-white mb-3">{step.title}</h3>
              <p className="text-crd-lightGray mb-4">{step.description}</p>
              <Link to={step.link}>
                <Button variant="outline" className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white">
                  {step.action}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">
          Ready to Start Creating?
        </h2>
        <p className="text-crd-lightGray text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are already making amazing digital trading cards
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create">
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
              Create Your First Card
            </Button>
          </Link>
          <Link to="/gallery">
            <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
              Explore Gallery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
