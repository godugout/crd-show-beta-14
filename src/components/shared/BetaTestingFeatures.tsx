import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart,
  Bug,
  Camera,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface FeedbackData {
  type: 'bug' | 'feature' | 'general';
  rating?: number;
  message: string;
  screenshot?: string;
  metadata: {
    url: string;
    userAgent: string;
    timestamp: string;
    sessionId: string;
    experimentVariants?: Record<string, string>;
  };
}

interface ABTestConfig {
  id: string;
  name: string;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
  }>;
  metric: string;
}

interface SessionRecording {
  events: Array<{
    type: string;
    timestamp: number;
    data: any;
  }>;
  startTime: number;
  sessionId: string;
}

export const BetaTestingFeatures: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] =
    useState<FeedbackData['type']>('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<string | undefined>();
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  // A/B Testing
  const [experiments, setExperiments] = useLocalStorage<Record<string, string>>(
    'beta-experiments',
    {}
  );
  const [activeTests] = useState<ABTestConfig[]>([
    {
      id: 'onboarding-flow',
      name: 'Onboarding Flow Test',
      variants: [
        { id: 'control', name: 'Original', weight: 0.5 },
        { id: 'variant-a', name: 'Simplified', weight: 0.5 },
      ],
      metric: 'completion_rate',
    },
    {
      id: 'button-placement',
      name: 'Button Placement Test',
      variants: [
        { id: 'top', name: 'Top', weight: 0.33 },
        { id: 'bottom', name: 'Bottom', weight: 0.33 },
        { id: 'floating', name: 'Floating', weight: 0.34 },
      ],
      metric: 'click_rate',
    },
  ]);

  // Session Recording
  const [isRecording, setIsRecording] = useState(false);
  const [sessionRecording, setSessionRecording] = useState<SessionRecording>({
    events: [],
    startTime: Date.now(),
    sessionId,
  });
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize A/B tests
  useEffect(() => {
    activeTests.forEach(test => {
      if (!experiments[test.id]) {
        const variant = selectVariant(test);
        setExperiments(prev => ({ ...prev, [test.id]: variant.id }));
        trackEvent('experiment_assigned', {
          experiment: test.id,
          variant: variant.id,
        });
      }
    });
  }, [activeTests]);

  // Session recording setup
  useEffect(() => {
    if (isRecording) {
      startSessionRecording();
    } else {
      stopSessionRecording();
    }

    return () => {
      stopSessionRecording();
    };
  }, [isRecording]);

  const selectVariant = (test: ABTestConfig) => {
    const random = Math.random();
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (random < cumulative) {
        return variant;
      }
    }

    return test.variants[0];
  };

  const trackEvent = async (eventName: string, data: any) => {
    try {
      await supabase.from('analytics_events').insert({
        event_name: eventName,
        event_data: data,
        session_id: sessionId,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const startSessionRecording = () => {
    // Record initial state
    recordEvent({
      type: 'session_start',
      data: {
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    });

    // Set up event listeners
    document.addEventListener('click', recordClick, true);
    document.addEventListener('input', recordInput, true);
    window.addEventListener('scroll', recordScroll, true);

    // Periodic snapshots
    recordingIntervalRef.current = setInterval(() => {
      recordEvent({
        type: 'snapshot',
        data: {
          scrollPosition: window.scrollY,
          activeElement: document.activeElement?.tagName,
        },
      });
    }, 5000);
  };

  const stopSessionRecording = () => {
    document.removeEventListener('click', recordClick, true);
    document.removeEventListener('input', recordInput, true);
    window.removeEventListener('scroll', recordScroll, true);

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    // Save recording
    if (sessionRecording.events.length > 0) {
      saveSessionRecording();
    }
  };

  const recordEvent = (event: any) => {
    setSessionRecording(prev => ({
      ...prev,
      events: [
        ...prev.events,
        {
          ...event,
          timestamp: Date.now() - prev.startTime,
        },
      ],
    }));
  };

  const recordClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    recordEvent({
      type: 'click',
      data: {
        x: e.clientX,
        y: e.clientY,
        element: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent?.substring(0, 50),
      },
    });
  };

  const recordInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    recordEvent({
      type: 'input',
      data: {
        element: target.tagName,
        id: target.id,
        name: target.name,
        type: target.type,
        valueLength: target.value.length,
      },
    });
  };

  const recordScroll = () => {
    recordEvent({
      type: 'scroll',
      data: {
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      },
    });
  };

  const saveSessionRecording = async () => {
    try {
      await supabase.from('session_recordings').insert({
        session_id: sessionId,
        recording_data: sessionRecording,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save session recording:', error);
    }
  };

  const captureScreenshot = async () => {
    try {
      // In a real app, you'd use a library like html2canvas
      toast.info('Screenshot capture would be implemented here');
      setScreenshot('/api/placeholder/400/300');
    } catch (error) {
      toast.error('Failed to capture screenshot');
    }
  };

  const submitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        type: feedbackType,
        rating: feedbackRating,
        message: feedbackMessage,
        screenshot,
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          sessionId,
          experimentVariants: experiments,
        },
      };

      await supabase.from('beta_feedback').insert(feedbackData);

      toast.success('Thank you for your feedback!');

      // Track feedback event
      trackEvent('feedback_submitted', {
        type: feedbackType,
        rating: feedbackRating,
        hasScreenshot: !!screenshot,
      });

      // Reset form
      setFeedbackMessage('');
      setFeedbackRating(undefined);
      setScreenshot(undefined);
      setShowFeedback(false);
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get experiment variant
  const getVariant = (experimentId: string): string => {
    return experiments[experimentId] || 'control';
  };

  return (
    <>
      {/* Feedback Widget */}
      <div className='fixed bottom-4 right-4 z-50'>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            size='lg'
            className='rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            onClick={() => setShowFeedback(true)}
          >
            <MessageCircle className='w-5 h-5 mr-2' />
            Beta Feedback
          </Button>
        </motion.div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
            onClick={e => {
              if (e.target === e.currentTarget) setShowFeedback(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-background rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
            >
              <Card className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold'>Send Beta Feedback</h2>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowFeedback(false)}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>

                {/* Feedback Type */}
                <div className='mb-6'>
                  <Label>Feedback Type</Label>
                  <RadioGroup
                    value={feedbackType}
                    onValueChange={value =>
                      setFeedbackType(value as FeedbackData['type'])
                    }
                    className='grid grid-cols-3 gap-4 mt-2'
                  >
                    <Label
                      htmlFor='bug'
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        feedbackType === 'bug'
                          ? 'border-primary bg-primary/10'
                          : ''
                      }`}
                    >
                      <RadioGroupItem
                        value='bug'
                        id='bug'
                        className='sr-only'
                      />
                      <Bug className='w-6 h-6 mb-2' />
                      <span className='text-sm'>Bug Report</span>
                    </Label>

                    <Label
                      htmlFor='feature'
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        feedbackType === 'feature'
                          ? 'border-primary bg-primary/10'
                          : ''
                      }`}
                    >
                      <RadioGroupItem
                        value='feature'
                        id='feature'
                        className='sr-only'
                      />
                      <Sparkles className='w-6 h-6 mb-2' />
                      <span className='text-sm'>Feature Request</span>
                    </Label>

                    <Label
                      htmlFor='general'
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        feedbackType === 'general'
                          ? 'border-primary bg-primary/10'
                          : ''
                      }`}
                    >
                      <RadioGroupItem
                        value='general'
                        id='general'
                        className='sr-only'
                      />
                      <MessageCircle className='w-6 h-6 mb-2' />
                      <span className='text-sm'>General</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Rating */}
                <div className='mb-6'>
                  <Label>How's your experience so far?</Label>
                  <div className='flex gap-4 mt-2'>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Button
                        key={rating}
                        variant={
                          feedbackRating === rating ? 'default' : 'outline'
                        }
                        size='lg'
                        onClick={() => setFeedbackRating(rating)}
                        className='flex-1'
                      >
                        {rating <= 2 ? '😞' : rating === 3 ? '😐' : '😊'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className='mb-6'>
                  <Label>Your Feedback</Label>
                  <Textarea
                    value={feedbackMessage}
                    onChange={e => setFeedbackMessage(e.target.value)}
                    placeholder='Tell us what you think...'
                    className='mt-2 min-h-[120px]'
                  />
                </div>

                {/* Screenshot */}
                <div className='mb-6'>
                  <Button
                    variant='outline'
                    onClick={captureScreenshot}
                    className='w-full'
                  >
                    <Camera className='w-4 h-4 mr-2' />
                    Attach Screenshot
                  </Button>

                  {screenshot && (
                    <div className='mt-2 relative'>
                      <img
                        src={screenshot}
                        alt='Screenshot'
                        className='w-full rounded-lg border'
                      />
                      <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-2 right-2'
                        onClick={() => setScreenshot(undefined)}
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Session Recording Consent */}
                <div className='mb-6 p-4 bg-muted rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium'>Help us improve</p>
                      <p className='text-sm text-muted-foreground'>
                        Allow session recording (no personal data)
                      </p>
                    </div>
                    <Button
                      variant={isRecording ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? 'Recording' : 'Start'}
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  className='w-full'
                  size='lg'
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className='w-4 h-4 mr-2' />
                      Send Feedback
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A/B Test Indicator (Debug Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className='fixed top-4 left-4 z-50'>
          <Card className='p-3 text-xs'>
            <p className='font-mono font-bold mb-2 flex items-center gap-2'>
              <BarChart className='w-4 h-4' />
              Active A/B Tests
            </p>
            {activeTests.map(test => (
              <div key={test.id} className='flex items-center gap-2 mb-1'>
                <Badge variant='outline' className='text-xs'>
                  {test.name}
                </Badge>
                <Badge className='text-xs'>
                  {experiments[test.id] || 'not assigned'}
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      )}
    </>
  );
};
