
import { useState, useEffect } from 'react';
import { FrameRepository, type FrameWithCreator } from '@/repositories/frames';

export const useFrames = (category?: string) => {
  const [frames, setFrames] = useState<FrameWithCreator[]>([]);
  const [trendingFrames, setTrendingFrames] = useState<FrameWithCreator[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [framesData, trendingData, categoriesData] = await Promise.all([
          FrameRepository.getFramesByCategory(category),
          FrameRepository.getTrendingFrames(),
          FrameRepository.getFrameCategories()
        ]);
        
        setFrames(framesData);
        setTrendingFrames(trendingData);
        setCategories(categoriesData);
        
      } catch (err) {
        console.error('Error fetching frames:', err);
        setError('Failed to load frames');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return { frames, trendingFrames, categories, loading, error };
};

export const useCreatorFrames = (creatorId: string) => {
  const [frames, setFrames] = useState<FrameWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatorFrames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const framesData = await FrameRepository.getFramesByCreator(creatorId);
        setFrames(framesData);
        
      } catch (err) {
        console.error('Error fetching creator frames:', err);
        setError('Failed to load creator frames');
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorFrames();
    }
  }, [creatorId]);

  return { frames, loading, error };
};
