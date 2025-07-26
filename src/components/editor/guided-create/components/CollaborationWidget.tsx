import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, Mic, MicOff, VideoOff, Share2, Vote, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  cursor?: { x: number; y: number };
  currentStep?: number;
}

interface Vote {
  id: string;
  type: 'template' | 'color' | 'effect';
  options: string[];
  votes: Record<string, string>; // userId -> optionId
  createdBy: string;
  expiresAt: string;
}

interface CollaborationWidgetProps {
  isCollaborating: boolean;
  collaborators: Collaborator[];
  currentVote?: Vote;
  onToggleCollaboration: () => void;
  onStartVote: (type: string, options: string[]) => void;
  onVote: (voteId: string, option: string) => void;
}

export const CollaborationWidget: React.FC<CollaborationWidgetProps> = ({
  isCollaborating,
  collaborators,
  currentVote,
  onToggleCollaboration,
  onStartVote,
  onVote
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const onlineCollaborators = collaborators.filter(c => c.status === 'online');

  return (
    <div className="fixed top-24 right-6 z-50">
      {/* Main Collaboration Button */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isCollaborating ? "default" : "outline"}
          onClick={onToggleCollaboration}
          className="bg-background/80 backdrop-blur-sm border-white/10 hover:bg-background/90"
        >
          <Users className="w-4 h-4 mr-2" />
          {isCollaborating ? 'Collaborating' : 'Create with Friends'}
          {onlineCollaborators.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {onlineCollaborators.length}
            </Badge>
          )}
        </Button>

        {/* Online indicator */}
        {isCollaborating && onlineCollaborators.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Collaboration Panel */}
      <AnimatePresence>
        {isCollaborating && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-2"
          >
            <Card className="p-4 bg-background/90 backdrop-blur-sm border-white/10 min-w-[280px]">
              {/* Collaborators List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Active Collaborators</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs"
                  >
                    {showDetails ? 'Hide' : 'Show'} Details
                  </Button>
                </div>

                <div className="space-y-2">
                  {onlineCollaborators.map((collaborator) => (
                    <motion.div
                      key={collaborator.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      whileHover={{ backgroundColor: 'rgba(var(--muted-rgb), 0.8)' }}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{collaborator.name}</p>
                        {showDetails && collaborator.currentStep && (
                          <p className="text-xs text-muted-foreground">
                            Step {collaborator.currentStep}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          collaborator.status === 'online' ? 'bg-green-500' :
                          collaborator.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Media Controls */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button
                    variant={videoEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className="flex-1"
                  >
                    {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant={audioEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="flex-1"
                  >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => onStartVote('template', ['Template A', 'Template B', 'Template C'])}
                  >
                    <Vote className="w-3 h-3 mr-2" />
                    Start Vote
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <Share2 className="w-3 h-3 mr-2" />
                    Share Screen
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Vote */}
      <AnimatePresence>
        {currentVote && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-2"
          >
            <Card className="p-4 bg-background/90 backdrop-blur-sm border-white/10 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Vote className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Active Vote: {currentVote.type}</h3>
                </div>

                <div className="space-y-2">
                  {currentVote.options.map((option, index) => {
                    const voteCount = Object.values(currentVote.votes).filter(v => v === option).length;
                    const isVoted = Object.values(currentVote.votes).includes(option);
                    
                    return (
                      <motion.button
                        key={option}
                        className={`w-full p-2 text-left rounded-lg border transition-colors ${
                          isVoted 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => onVote(currentVote.id, option)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{option}</span>
                          <Badge variant="secondary" className="text-xs">
                            {voteCount}
                          </Badge>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Expires in {Math.floor((new Date(currentVote.expiresAt).getTime() - Date.now()) / 1000 / 60)} minutes
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Indicators for Other Users */}
      {onlineCollaborators.map((collaborator) => 
        collaborator.cursor && (
          <motion.div
            key={`cursor-${collaborator.id}`}
            className="fixed pointer-events-none z-50"
            style={{
              left: collaborator.cursor.x,
              top: collaborator.cursor.y
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
              <div className="absolute top-5 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {collaborator.name}
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
};