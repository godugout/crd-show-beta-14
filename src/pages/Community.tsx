
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Star, Trophy, ExternalLink } from 'lucide-react';

const Community = () => {
  const stats = [
    { label: "Active Creators", value: "1,200+", icon: Users },
    { label: "Cards Created", value: "5,400+", icon: Star },
    { label: "Community Posts", value: "890+", icon: MessageSquare },
    { label: "Featured Artists", value: "50+", icon: Trophy }
  ];

  const communitySpaces = [
    {
      name: "Discord Server",
      description: "Join our active Discord community for real-time chat, support, and collaboration.",
      members: "800+ members",
      link: "#",
      color: "bg-purple-600"
    },
    {
      name: "Creator Showcase",
      description: "Share your latest creations and get feedback from fellow artists.",
      members: "Daily posts",
      link: "/gallery",
      color: "bg-blue-600"
    },
    {
      name: "Tutorial Hub",
      description: "Learn new techniques and share your knowledge with video tutorials.",
      members: "50+ tutorials",
      link: "/help",
      color: "bg-green-600"
    }
  ];

  const featuredCreators = [
    {
      name: "ArtistOne",
      specialty: "Fantasy Cards",
      cards: 45,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "DigitalMaster",
      specialty: "Sci-Fi Designs",
      cards: 38,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "NatureLover",
      specialty: "Nature Cards",
      cards: 52,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Join Our Community</h1>
          <p className="text-xl text-crd-lightGray mb-8">
            Connect with creators, share your work, and learn from the best
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-crd-dark border-crd-mediumGray p-6 text-center">
                <IconComponent className="h-8 w-8 text-crd-green mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-crd-lightGray text-sm">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Community Spaces */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Community Spaces</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {communitySpaces.map((space, index) => (
              <Card key={index} className="bg-crd-dark border-crd-mediumGray p-6 hover:border-crd-green transition-colors">
                <div className={`w-12 h-12 ${space.color} rounded-lg flex items-center justify-center mb-4`}>
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{space.name}</h3>
                <p className="text-crd-lightGray mb-4">{space.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-crd-lightGray">{space.members}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
                  >
                    Join <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Creators */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Featured Creators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <Card key={index} className="bg-crd-dark border-crd-mediumGray p-6 text-center">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-white mb-1">{creator.name}</h3>
                <p className="text-crd-green text-sm mb-2">{creator.specialty}</p>
                <p className="text-crd-lightGray text-sm">{creator.cards} cards created</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-crd-dark border-crd-mediumGray p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-crd-lightGray mb-6">
            Become part of our growing community of talented creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black">
              Join Discord Server
            </Button>
            <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
              Browse Creator Gallery
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Community;
