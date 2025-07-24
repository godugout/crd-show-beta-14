import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, MessageCircle, Send, Minimize2, Maximize2 } from 'lucide-react';
import { DustyAvatar } from './DustyAvatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'dusty';
  timestamp: Date;
  expression?: 'neutral' | 'friendly' | 'thinking' | 'excited';
}

interface FloatingChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle?: string;
  selectedTemplate?: string;
}

export const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  isOpen,
  onClose,
  cardTitle,
  selectedTemplate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hey there! I'm Dusty, your CRD creation assistant. ${cardTitle ? `I see you're working on "${cardTitle}". ` : ''}How can I help you today?`,
      sender: 'dusty',
      timestamp: new Date(),
      expression: 'friendly'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate Dusty's response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I can definitely help you improve that aspect of your card.",
        "Here's what I'd suggest for your card design...",
        "That's an interesting approach! Have you considered...",
        "Let me walk you through the best way to do that."
      ];
      
      const dustyResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'dusty',
        timestamp: new Date(),
        expression: 'thinking'
      };

      setMessages(prev => [...prev, dustyResponse]);
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === chatRef.current || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <Card
      ref={chatRef}
      className={`fixed z-50 bg-crd-darker/95 border-crd-mediumGray/30 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-64 h-12' : 'w-80 h-96'
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-3 border-b border-crd-mediumGray/20 cursor-grab">
        <div className="flex items-center gap-2">
          <DustyAvatar size="small" expression="friendly" />
          <span className="text-crd-white text-sm font-medium">Dusty Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-crd-lightGray hover:text-crd-white"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-crd-lightGray hover:text-crd-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-72">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'dusty' && (
                  <DustyAvatar size="small" expression={message.expression || 'neutral'} />
                )}
                <div
                  className={`max-w-[200px] p-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-crd-blue text-white'
                      : 'bg-crd-mediumGray/20 text-crd-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-crd-mediumGray/20">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Dusty anything..."
                className="flex-1 bg-crd-darkest border-crd-mediumGray/30 text-crd-white placeholder:text-crd-lightGray text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-crd-blue hover:bg-crd-blue/80 text-white h-8 w-8 p-0"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};