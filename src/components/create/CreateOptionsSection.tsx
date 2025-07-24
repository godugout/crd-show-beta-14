import React from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreateOptionsSection: React.FC = () => {
  return (
    <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 min-h-screen bg-space-to-purple">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <p className="font-caveat text-5xl md:text-6xl text-crd-orange font-bold transform -rotate-2 text-center" style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.5), 6px 6px 0px rgba(0,0,0,0.3)' }}>
              No glue needed!<sup className="text-crd-lightGray text-xs ml-1">TM</sup>
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-crd-white mb-6">
            What do you feel like creating today?
          </h2>
          <p className="text-lg md:text-xl text-crd-lightGray max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into interactive 3D collectibles that collectors will treasure.
          </p>
        </div>

        {/* Creation Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* CRD Collectibles Card */}
          <div className="bg-crd-darkGray border border-crd-mediumGray rounded-xl p-8 hover:border-crd-blue transition-colors duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-crd-blue rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-crd-white mb-1">
                  CRD Collectibles
                </h3>
                <p className="text-crd-lightGray">
                  Digital Trading Cards
                </p>
              </div>
            </div>

            <p className="text-crd-white mb-6 leading-relaxed">
              Create premium digital trading cards with advanced 3D effects, holographic finishes, and interactive elements. 
              Professional card creation optimized for collecting, trading, and printing.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crd-green" />
                <span className="text-crd-white">
                  Print-ready high resolution output
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crd-green" />
                <span className="text-crd-white">
                  Professional frames and layouts
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crd-green" />
                <span className="text-crd-white">
                  CRD standard compliance built-in
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crd-green" />
                <span className="text-crd-white">
                  Optimized for physical production
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-crd-lightGray mb-6">
              <span>Professional • Interactive • Collectible</span>
            </div>

            <Link to="/create/crd">
              <button className="w-full bg-gradient-to-r from-crd-blue to-crd-purple text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2">
                Create CRD Collectible
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* STRY Capsules Card */}
          <div className="bg-crd-darkGray border border-crd-mediumGray rounded-xl p-8 opacity-60 relative">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-crd-orange text-crd-darkest text-sm font-semibold px-3 py-1 rounded-full">
              Coming Soon
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-crd-mediumGray rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-crd-lightGray"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-crd-lightGray mb-1">
                  STRY Capsules
                </h3>
                <p className="text-crd-lightGray">
                  Interactive & Animated Stories
                </p>
              </div>
            </div>

            <p className="text-crd-lightGray mb-6 leading-relaxed">
              Design immersive story cards that reveal narratives through layers, animations, and interactive discoveries. 
              Advanced interactive cards with scripting and dynamic behaviors perfect for digital storytelling.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-crd-lightGray" />
                <span className="text-crd-lightGray">
                  Advanced animation & particle systems
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-crd-lightGray" />
                <span className="text-crd-lightGray">
                  Visual programming & scripting
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-crd-lightGray" />
                <span className="text-crd-lightGray">
                  Interactive behaviors & states
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-crd-lightGray" />
                <span className="text-crd-lightGray">
                  Environmental & biometric triggers
                </span>
              </div>
            </div>

            <div className="flex items-center text-sm text-crd-lightGray mb-6">
              <span>Narrative • Immersive • Interactive</span>
            </div>

            <button 
              className="w-full bg-crd-mediumGray text-crd-lightGray py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
              disabled
            >
              Create STRY Capsule
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Help Text */}
        <div className="text-center">
          <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
            New to card creation? Start with CRD Collectibles to master the fundamentals, 
            then explore STRY Capsules for advanced interactive experiences.
          </p>
        </div>
      </div>
    </div>
  );
};