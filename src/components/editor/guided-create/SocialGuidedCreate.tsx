import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GuidedCreateFlow } from './GuidedCreateFlow';

interface TrendingTemplate {
  id: string;
  name: string;
  image_url: string;
  uses_count: number;
  creator: {
    id: string;
    name: string;
    avatar_url: string;
    badge?: 'verified' | 'featured' | 'pro';
  };
  effects: string[];
  sport?: string;
}

interface FeaturedCreator {
  id: string;
  name: string;
  avatar_url: string;
  badge?: 'verified' | 'featured' | 'pro';
  cards_created: number;
  followers: number;
  specialty: string;
  recent_cards: Array<{
    id: string;
    image_url: string;
    title: string;
  }>;
}

interface LiveSession {
  id: string;
  creator: {
    id: string;
    name: string;
    avatar_url: string;
  };
  title: string;
  viewers: number;
  card_preview: string;
  started_at: string;
}

interface CollaborativeCollection {
  id: string;
  name: string;
  theme: string;
  members: number;
  cards: number;
  deadline?: string;
  image_url: string;
}

interface SocialGuidedCreateProps {
  onComplete?: (cardData: any) => void;
  onCancel?: () => void;
}

export const SocialGuidedCreate: React.FC<SocialGuidedCreateProps> = ({
  onComplete,
  onCancel,
}) => {
  const [showFlow, setShowFlow] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TrendingTemplate | null>(null);
  const [trendingTemplates, setTrendingTemplates] = useState<
    TrendingTemplate[]
  >([]);
  const [featuredCreators, setFeaturedCreators] = useState<FeaturedCreator[]>(
    []
  );
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [collections, setCollections] = useState<CollaborativeCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      // Load trending templates
      const { data: templates } = await supabase
        .from('card_templates')
        .select(
          `
          *,
          creator:users(id, username, avatar_url)
        `
        )
        .order('uses_count', { ascending: false })
        .limit(8);

      if (templates) {
        setTrendingTemplates(
          templates.map(t => ({
            id: t.id,
            name: t.name,
            image_url: t.preview_url,
            uses_count: t.uses_count || 0,
            creator: {
              id: t.creator.id,
              name: t.creator.username,
              avatar_url: t.creator.avatar_url,
              badge: t.creator.is_featured ? 'featured' : undefined,
            },
            effects: t.effects || [],
            sport: t.sport,
          }))
        );
      }

      // Load featured creators
      const { data: creators } = await supabase
        .from('users')
        .select(
          `
          *,
          cards:cards(count),
          recent_cards:cards(id, title, image_url)
        `
        )
        .eq('is_featured', true)
        .limit(6);

      if (creators) {
        setFeaturedCreators(
          creators.map(c => ({
            id: c.id,
            name: c.username,
            avatar_url: c.avatar_url,
            badge: 'featured' as const,
            cards_created: c.cards?.[0]?.count || 0,
            followers: c.followers_count || 0,
            specialty: c.specialty || 'All Sports',
            recent_cards: c.recent_cards?.slice(0, 3) || [],
          }))
        );
      }

      // Simulate live sessions (would be real-time in production)
      setLiveSessions([
        {
          id: '1',
          creator: {
            id: '1',
            name: 'ProCardMaker',
            avatar_url: '/api/placeholder/32/32',
          },
          title: 'Creating Epic Basketball Cards',
          viewers: 234,
          card_preview: '/api/placeholder/200/280',
          started_at: new Date(Date.now() - 15 * 60000).toISOString(),
        },
      ]);

      // Load collaborative collections
      const { data: colls } = await supabase
        .from('collections')
        .select('*')
        .eq('is_collaborative', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (colls) {
        setCollections(
          colls.map(c => ({
            id: c.id,
            name: c.name,
            theme: c.theme || 'General',
            members: c.member_count || 1,
            cards: c.card_count || 0,
            deadline: c.deadline,
            image_url: c.cover_image || '/api/placeholder/200/150',
          }))
        );
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: TrendingTemplate) => {
    setSelectedTemplate(template);
    setShowFlow(true);

    // Track template usage
    supabase
      .from('card_templates')
      .update({ uses_count: template.uses_count + 1 })
      .eq('id', template.id)
      .then(() => {
        toast.success(
          `Using ${template.name} template by ${template.creator.name}`
        );
      });
  };

  const handleJoinLiveSession = (session: LiveSession) => {
    toast.info(`Joining ${session.creator.name}'s live session...`);
    // In production, this would open a live view
  };

  const handleJoinCollection = (collection: CollaborativeCollection) => {
    toast.success(`Joined "${collection.name}" collection!`);
    // Track collection membership
  };

  if (showFlow) {
    return (
      <GuidedCreateFlow
        onComplete={onComplete}
        onCancel={() => {
          setShowFlow(false);
          setSelectedTemplate(null);
        }}
        initialTemplate={selectedTemplate}
      />
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container max-w-7xl mx-auto p-6 space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Create with the Community
          </h1>
          <p className='text-xl text-muted-foreground'>
            Get inspired by trending designs and collaborate with creators
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue='trending' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='trending'>
              <TrendingUp className='w-4 h-4 mr-2' />
              Trending
            </TabsTrigger>
            <TabsTrigger value='creators'>
              <Star className='w-4 h-4 mr-2' />
              Creators
            </TabsTrigger>
            <TabsTrigger value='live'>
              <Eye className='w-4 h-4 mr-2' />
              Live Now
            </TabsTrigger>
            <TabsTrigger value='collections'>
              <Users className='w-4 h-4 mr-2' />
              Collections
            </TabsTrigger>
          </TabsList>

          {/* Trending Templates */}
          <TabsContent value='trending' className='mt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {trendingTemplates.map(template => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className='overflow-hidden cursor-pointer group'
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className='relative aspect-[3/4]'>
                      <img
                        src={template.image_url}
                        alt={template.name}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

                      {/* Overlay Info */}
                      <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage src={template.creator.avatar_url} />
                            <AvatarFallback>
                              {template.creator.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>
                            {template.creator.name}
                          </span>
                          {template.creator.badge && (
                            <Badge variant='secondary' className='text-xs'>
                              {template.creator.badge}
                            </Badge>
                          )}
                        </div>
                        <h3 className='font-semibold'>{template.name}</h3>
                        <div className='flex items-center gap-4 text-sm'>
                          <span className='flex items-center gap-1'>
                            <Users className='w-3 h-3' />
                            {template.uses_count}
                          </span>
                          {template.sport && (
                            <Badge variant='outline' className='text-xs'>
                              {template.sport}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Featured Creators */}
          <TabsContent value='creators' className='mt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {featuredCreators.map(creator => (
                <Card key={creator.id} className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='w-12 h-12'>
                        <AvatarImage src={creator.avatar_url} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-semibold flex items-center gap-2'>
                          {creator.name}
                          {creator.badge && (
                            <Badge variant='secondary' className='text-xs'>
                              <Award className='w-3 h-3 mr-1' />
                              {creator.badge}
                            </Badge>
                          )}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          {creator.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 mb-4 text-center'>
                    <div>
                      <div className='text-2xl font-bold'>
                        {creator.cards_created}
                      </div>
                      <div className='text-xs text-muted-foreground'>Cards</div>
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>
                        {creator.followers}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Followers
                      </div>
                    </div>
                  </div>

                  {creator.recent_cards.length > 0 && (
                    <div className='grid grid-cols-3 gap-2 mb-4'>
                      {creator.recent_cards.map(card => (
                        <div
                          key={card.id}
                          className='aspect-[3/4] rounded overflow-hidden'
                        >
                          <img
                            src={card.image_url}
                            alt={card.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button className='w-full' variant='outline'>
                    <MessageCircle className='w-4 h-4 mr-2' />
                    Follow Creator
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Sessions */}
          <TabsContent value='live' className='mt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {liveSessions.map(session => (
                <Card key={session.id} className='overflow-hidden'>
                  <div className='flex'>
                    <div className='w-1/3 relative'>
                      <img
                        src={session.card_preview}
                        alt={session.title}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute top-2 left-2'>
                        <Badge variant='destructive' className='animate-pulse'>
                          <Eye className='w-3 h-3 mr-1' />
                          LIVE
                        </Badge>
                      </div>
                    </div>
                    <div className='flex-1 p-6'>
                      <div className='flex items-center gap-2 mb-3'>
                        <Avatar className='w-8 h-8'>
                          <AvatarImage src={session.creator.avatar_url} />
                          <AvatarFallback>
                            {session.creator.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>
                          {session.creator.name}
                        </span>
                      </div>
                      <h3 className='font-semibold mb-2'>{session.title}</h3>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
                        <span className='flex items-center gap-1'>
                          <Eye className='w-4 h-4' />
                          {session.viewers} watching
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          Started{' '}
                          {new Date(session.started_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <Button
                        className='w-full'
                        onClick={() => handleJoinLiveSession(session)}
                      >
                        Join Session
                        <ArrowRight className='w-4 h-4 ml-2' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaborative Collections */}
          <TabsContent value='collections' className='mt-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {collections.map(collection => (
                <Card key={collection.id} className='overflow-hidden'>
                  <div className='aspect-video relative'>
                    <img
                      src={collection.image_url}
                      alt={collection.name}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                      <Badge className='mb-2'>{collection.theme}</Badge>
                      <h3 className='text-xl font-bold mb-1'>
                        {collection.name}
                      </h3>
                      <div className='flex items-center gap-4 text-sm'>
                        <span className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          {collection.members} members
                        </span>
                        <span className='flex items-center gap-1'>
                          <Heart className='w-4 h-4' />
                          {collection.cards} cards
                        </span>
                        {collection.deadline && (
                          <span className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            Ends{' '}
                            {new Date(collection.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='p-4'>
                    <Button
                      className='w-full'
                      variant='outline'
                      onClick={() => handleJoinCollection(collection)}
                    >
                      <Share2 className='w-4 h-4 mr-2' />
                      Join Collection
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Start Button */}
        <div className='fixed bottom-8 right-8'>
          <Button
            size='lg'
            className='shadow-lg'
            onClick={() => setShowFlow(true)}
          >
            Start Creating
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  );
};
