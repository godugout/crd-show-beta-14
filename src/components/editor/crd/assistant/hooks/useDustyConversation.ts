import { useState, useEffect } from 'react';

interface DustyMessage {
  id: string;
  text: string;
  type: 'greeting' | 'suggestion' | 'encouragement' | 'guidance' | 'completion';
  expression: 'neutral' | 'friendly' | 'excited' | 'thinking' | 'encouraging';
}

interface DustySuggestedAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'suggestion';
  icon?: 'arrow' | 'lightbulb' | 'check' | 'upload' | 'palette';
  action: () => void;
}

interface ProgressStep {
  id: string;
  label: string;
  status: 'incomplete' | 'in-progress' | 'complete';
  required: boolean;
}

interface ActivityState {
  cardTitle: string;
  playerImage: string | null;
  selectedTemplate: string;
  colorPalette: string;
  effects: string[];
  previewMode: 'edit' | 'preview' | 'print';
  currentStep: 'template' | 'design' | 'content' | 'export';
  timeOnStep: number;
  isIdle: boolean;
}

export const useDustyConversation = (activityState: ActivityState) => {
  const [currentMessage, setCurrentMessage] = useState<DustyMessage>({
    id: 'welcome',
    text: "Hey there! I'm Dusty, your CRD Collectibles assistant. Let's create an amazing card together! 🎨",
    type: 'greeting',
    expression: 'friendly'
  });

  const [suggestedActions, setSuggestedActions] = useState<DustySuggestedAction[]>([]);

  const generateProgressSteps = (): ProgressStep[] => {
    return [
      {
        id: 'template',
        label: 'Choose Template',
        status: activityState.selectedTemplate ? 'complete' : 
                activityState.currentStep === 'template' ? 'in-progress' : 'incomplete',
        required: true
      },
      {
        id: 'design',
        label: 'Pick Colors',
        status: activityState.colorPalette && activityState.selectedTemplate ? 'complete' :
                activityState.currentStep === 'design' ? 'in-progress' : 'incomplete',
        required: true
      },
      {
        id: 'content',
        label: 'Add Content',
        status: (activityState.cardTitle || activityState.playerImage) ? 'complete' :
                activityState.currentStep === 'content' ? 'in-progress' : 'incomplete',
        required: true
      },
      {
        id: 'export',
        label: 'Export Card',
        status: activityState.previewMode === 'print' ? 'complete' :
                activityState.currentStep === 'export' ? 'in-progress' : 'incomplete',
        required: false
      }
    ];
  };

  // Generate contextual messages based on activity - use individual dependencies to prevent unnecessary re-runs
  useEffect(() => {
    const generateMessage = (): DustyMessage => {
      if (activityState.isIdle && activityState.timeOnStep > 60000) {
        return {
          id: 'idle-help',
          text: "Need some help? I'm here if you get stuck! Feel free to try different options. 💪",
          type: 'guidance',
          expression: 'encouraging'
        };
      }

      switch (activityState.currentStep) {
        case 'template':
          if (!activityState.selectedTemplate) {
            return {
              id: 'template-guidance',
              text: "Great start! Pick a template that matches your vision. The Baseball Classic is perfect for sports cards! ⚾",
              type: 'guidance',
              expression: 'friendly'
            };
          }
          break;

        case 'design':
          if (activityState.selectedTemplate && !activityState.colorPalette) {
            return {
              id: 'design-guidance',
              text: "Nice template choice! Now let's add some personality with colors. Try the Sports Red for a bold look! 🎨",
              type: 'suggestion',
              expression: 'excited'
            };
          }
          if (activityState.effects.length === 0) {
            return {
              id: 'effects-suggestion',
              text: "Looking good! Want to make it pop? Try adding a holographic or foil effect for that premium feel! ✨",
              type: 'suggestion',
              expression: 'excited'
            };
          }
          break;

        case 'content':
          if (!activityState.cardTitle && !activityState.playerImage) {
            return {
              id: 'content-guidance',
              text: "Time to bring your card to life! Add a player name and upload their photo to create something special! 📸",
              type: 'guidance',
              expression: 'encouraging'
            };
          }
          if (activityState.cardTitle && !activityState.playerImage) {
            return {
              id: 'image-suggestion',
              text: "Great player name! Now upload a photo to complete the card. High-quality images work best! 🌟",
              type: 'suggestion',
              expression: 'friendly'
            };
          }
          break;

        case 'export':
          return {
            id: 'export-guidance',
            text: "Awesome work! Your card looks fantastic. Ready to export? I recommend PDF for printing! 🎉",
            type: 'completion',
            expression: 'excited'
          };
      }

      return {
        id: 'encouragement',
        text: "You're doing great! Keep going and let me know if you need any tips! 🚀",
        type: 'encouragement',
        expression: 'encouraging'
      };
    };

    const newMessage = generateMessage();
    if (newMessage.id !== currentMessage.id) {
      setCurrentMessage(newMessage);
    }
  }, [
    activityState.currentStep,
    activityState.selectedTemplate,
    activityState.colorPalette,
    activityState.cardTitle,
    activityState.playerImage,
    activityState.effects.length,
    activityState.isIdle,
    activityState.timeOnStep,
    currentMessage.id
  ]);

  // Generate contextual actions - separate effect to prevent coupling
  useEffect(() => {
    const actions: DustySuggestedAction[] = [];

    if (activityState.currentStep === 'template' && !activityState.selectedTemplate) {
      actions.push({
        id: 'suggest-baseball',
        label: 'Try Baseball Classic',
        type: 'suggestion',
        icon: 'lightbulb',
        action: () => console.log('Switch to baseball template')
      });
    }

    if (activityState.currentStep === 'design' && !activityState.effects.length) {
      actions.push({
        id: 'add-foil',
        label: 'Add Foil Effect',
        type: 'suggestion',
        icon: 'palette',
        action: () => console.log('Add foil effect')
      });
    }

    if (activityState.currentStep === 'content' && !activityState.playerImage) {
      actions.push({
        id: 'upload-image',
        label: 'Upload Photo',
        type: 'primary',
        icon: 'upload',
        action: () => console.log('Open image upload')
      });
    }

    setSuggestedActions(actions);
  }, [
    activityState.currentStep,
    activityState.selectedTemplate,
    activityState.effects.length,
    activityState.playerImage
  ]);

  return {
    currentMessage,
    suggestedActions,
    progress: generateProgressSteps()
  };
};