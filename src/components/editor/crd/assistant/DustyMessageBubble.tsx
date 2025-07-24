import React, { useEffect, useState } from 'react';

interface DustyMessage {
  id: string;
  text: string;
  type: 'greeting' | 'suggestion' | 'encouragement' | 'guidance' | 'completion';
  expression: 'neutral' | 'friendly' | 'excited' | 'thinking' | 'encouraging';
}

interface DustyMessageBubbleProps {
  message: DustyMessage;
}

export const DustyMessageBubble: React.FC<DustyMessageBubbleProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset state for new message
    setIsVisible(true);
    setIsTyping(true);
    setDisplayText('');

    // Typing animation with proper cleanup
    let currentIndex = 0;
    let isActive = true;
    
    const typingInterval = setInterval(() => {
      if (!isActive) return;
      
      if (currentIndex <= message.text.length) {
        setDisplayText(message.text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => {
      isActive = false;
      clearInterval(typingInterval);
    };
  }, [message.id]); // Use message.id instead of message.text to prevent unnecessary re-runs

  const getBubbleStyle = () => {
    switch (message.type) {
      case 'encouragement':
        return 'bg-gradient-to-r from-crd-green/10 to-crd-blue/10 border-crd-green/30';
      case 'suggestion':
        return 'bg-gradient-to-r from-crd-blue/10 to-crd-purple/10 border-crd-blue/30';
      case 'completion':
        return 'bg-gradient-to-r from-crd-yellow/10 to-crd-orange/10 border-crd-yellow/30';
      default:
        return 'bg-crd-darker/60 border-crd-mediumGray/30';
    }
  };

  return (
    <div className={`
      relative p-4 rounded-2xl rounded-bl-sm border transition-all duration-500
      ${getBubbleStyle()}
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
    `}>
      {/* Speech bubble tail */}
      <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-crd-mediumGray/30 border-b-8 border-b-transparent" />
      
      <p className="text-crd-white text-sm leading-relaxed">
        {displayText}
        {isTyping && <span className="inline-block w-2 h-4 bg-crd-blue animate-pulse ml-1" />}
      </p>
    </div>
  );
};