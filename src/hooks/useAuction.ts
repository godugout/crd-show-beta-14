import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuction = () => {
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isEndingAuction, setIsEndingAuction] = useState(false);

  const placeBid = async (
    auctionId: string,
    amount: number,
    proxyMax?: number
  ): Promise<boolean> => {
    setIsPlacingBid(true);
    try {
      const { data, error } = await supabase.functions.invoke('place-auction-bid', {
        body: {
          auction_id: auctionId,
          amount: amount,
          proxy_max: proxyMax,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to place bid');
        return false;
      }

      if (data.is_winning) {
        toast.success('Your bid is now the highest!');
      } else {
        toast.success('Bid placed successfully!');
      }

      return true;
    } catch (error) {
      console.error('Bid placement error:', error);
      toast.error('Failed to place bid');
      return false;
    } finally {
      setIsPlacingBid(false);
    }
  };

  const endAuction = async (auctionId: string): Promise<boolean> => {
    setIsEndingAuction(true);
    try {
      const { data, error } = await supabase.functions.invoke('end-auction', {
        body: {
          auction_id: auctionId,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to end auction');
        return false;
      }

      if (data.has_winner) {
        toast.success(`Auction ended! Winner: $${data.winning_amount}`);
      } else {
        toast.info('Auction ended with no bids');
      }

      return true;
    } catch (error) {
      console.error('Auction ending error:', error);
      toast.error('Failed to end auction');
      return false;
    } finally {
      setIsEndingAuction(false);
    }
  };

  return {
    placeBid,
    endAuction,
    isPlacingBid,
    isEndingAuction,
  };
};