import { TemplateEngine, AnimationFrame } from '../engine';

// Cosmic Dance Template - Sun descent, moon drop, card positioning for sunset alignment
const COSMIC_KEYFRAMES: AnimationFrame[] = [
  // Dawn - Starting positions
  {
    progress: 0,
    sun: { x: -30, y: 30, scale: 0.8, opacity: 0.6, glow: 0.3, color: '#FFA500' },
    moon: { x: 0, y: 80, scale: 0.2, opacity: 0.4 },
    card: { y: 0, lean: 0 },
    environment: { backgroundColor: 'rgba(15, 15, 15, 0.95)', intensity: 0.4 },
    lighting: { intensity: 0.6, color: '#FFA500' }
  },
  
  // Early descent - Sun begins journey, card starts positioning
  {
    progress: 0.25,
    sun: { x: -15, y: 45, scale: 1.0, opacity: 0.8, glow: 0.5, color: '#FFB84D' },
    moon: { x: 0, y: 100, scale: 0.3, opacity: 0.6 },
    card: { y: 1, lean: 20 },
    environment: { backgroundColor: 'rgba(20, 15, 25, 0.9)', intensity: 0.6 },
    lighting: { intensity: 0.8, color: '#FFB84D' }
  },
  
  // Mid journey - Alignment begins
  {
    progress: 0.5,
    sun: { x: 0, y: 60, scale: 1.3, opacity: 0.9, glow: 0.7, color: '#FFD700' },
    moon: { x: 0, y: 110, scale: 0.4, opacity: 0.8 },
    card: { y: 2.5, lean: 45, lock: true }, // Control taken here
    environment: { backgroundColor: 'rgba(25, 20, 35, 0.85)', intensity: 0.7 },
    lighting: { intensity: 1.0, color: '#FFD700' }
  },
  
  // Pre-sunset - Final positioning
  {
    progress: 0.75,
    sun: { x: 15, y: 70, scale: 1.6, opacity: 1.0, glow: 0.9, color: '#FFED4E' },
    moon: { x: 0, y: 120, scale: 0.5, opacity: 0.9 },
    card: { y: 3.5, lean: 65, lock: true },
    environment: { backgroundColor: 'rgba(30, 25, 45, 0.8)', intensity: 0.85 },
    lighting: { intensity: 1.2, color: '#FFED4E' }
  },
  
  // Sunset alignment - Perfect cosmic moment
  {
    progress: 1.0,
    sun: { x: 30, y: 80, scale: 2.0, opacity: 1.0, glow: 1.2, color: '#FFFFFF' },
    moon: { x: 0, y: 120, scale: 0.5, opacity: 0.9 },
    card: { y: 4.5, lean: 80, lock: true },
    environment: { backgroundColor: 'rgba(40, 35, 65, 0.7)', intensity: 1.0 },
    lighting: { intensity: 1.5, color: '#FFFFFF' }
  }
];

export const cosmicTemplate: TemplateEngine = {
  id: 'cosmic',
  name: 'Cosmic Dance',
  initialCamera: {
    position: [0, 0, 15],
    target: [0, -2, 0],
    zoom: 1
  },
  keyframes: COSMIC_KEYFRAMES,
  autoTrigger: true,
  transitionToStudio: true,
  replayable: true,
  footerHUD: {
    statusLines: [
      'Cosmic Dance Template',
      'Aligning sun and moon positions...',
      'Card positioning for optimal lighting',
      'Preparing cinematic preview'
    ],
    showReplay: true,
    showContinue: true,
    compact: true
  }
};