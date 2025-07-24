import React from 'react';
import { Share2, Copy, ExternalLink } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  cardId: string;
  cardTitle: string;
  cardImage?: string;
  className?: string;
  variant?: 'icon' | 'button';
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  cardId, 
  cardTitle, 
  cardImage,
  className = '',
  variant = 'icon'
}) => {
  const { user } = useAuth();

  const shareUrl = `${window.location.origin}/cards/${cardId}`;

  const trackShare = async (shareType: string) => {
    try {
      await supabase
        .from('social_shares')
        .insert({
          card_id: cardId,
          user_id: user?.id,
          share_type: shareType
        });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      await trackShare('link');
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const shareToTwitter = async () => {
    const tweetText = `Check out this amazing card: "${cardTitle}" on Cardshow!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    await trackShare('twitter');
  };

  const shareToFacebook = async () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    await trackShare('facebook');
  };

  const shareToLinkedIn = async () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank');
    await trackShare('linkedin');
  };

  if (variant === 'icon') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`
              p-2 rounded-lg text-crd-lightGray hover:text-crd-white 
              hover:bg-crd-mediumGray/20 transition-all duration-200
              min-h-[44px] min-w-[44px]
              ${className}
            `}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-crd-darker border-crd-mediumGray/20 p-4">
          <ShareContent 
            copyToClipboard={copyToClipboard}
            shareToTwitter={shareToTwitter}
            shareToFacebook={shareToFacebook}
            shareToLinkedIn={shareToLinkedIn}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CRDButton
          variant="outline"
          size="sm"
          className={`min-h-[44px] ${className}`}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </CRDButton>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-crd-darker border-crd-mediumGray/20 p-4">
        <ShareContent 
          copyToClipboard={copyToClipboard}
          shareToTwitter={shareToTwitter}
          shareToFacebook={shareToFacebook}
          shareToLinkedIn={shareToLinkedIn}
        />
      </PopoverContent>
    </Popover>
  );
};

interface ShareContentProps {
  copyToClipboard: () => void;
  shareToTwitter: () => void;
  shareToFacebook: () => void;
  shareToLinkedIn: () => void;
}

const ShareContent: React.FC<ShareContentProps> = ({
  copyToClipboard,
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-crd-white font-medium mb-3">Share this card</h4>
      
      <button
        onClick={copyToClipboard}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/20 transition-colors text-left min-h-[44px]"
      >
        <Copy className="w-4 h-4 text-crd-lightGray" />
        <span className="text-crd-white text-sm">Copy link</span>
      </button>

      <button
        onClick={shareToTwitter}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/20 transition-colors text-left min-h-[44px]"
      >
        <ExternalLink className="w-4 h-4 text-blue-400" />
        <span className="text-crd-white text-sm">Share on Twitter</span>
      </button>

      <button
        onClick={shareToFacebook}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/20 transition-colors text-left min-h-[44px]"
      >
        <ExternalLink className="w-4 h-4 text-blue-600" />
        <span className="text-crd-white text-sm">Share on Facebook</span>
      </button>

      <button
        onClick={shareToLinkedIn}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-crd-mediumGray/20 transition-colors text-left min-h-[44px]"
      >
        <ExternalLink className="w-4 h-4 text-blue-500" />
        <span className="text-crd-white text-sm">Share on LinkedIn</span>
      </button>
    </div>
  );
};