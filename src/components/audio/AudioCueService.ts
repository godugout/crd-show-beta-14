interface AudioCue {
  id: string;
  url: string;
  volume: number;
  duration: number;
  category: 'ui' | 'feedback' | 'ambient' | 'celebration';
}

interface AudioSettings {
  enabled: boolean;
  masterVolume: number;
  categoryVolumes: {
    ui: number;
    feedback: number;
    ambient: number;
    celebration: number;
  };
}

export class AudioCueService {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private settings: AudioSettings;
  private loadingPromises: Map<string, Promise<AudioBuffer>> = new Map();

  constructor() {
    this.settings = this.loadSettings();
    this.initializeAudioContext();
  }

  private loadSettings(): AudioSettings {
    const stored = localStorage.getItem('cardshow_audio_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse audio settings from storage');
      }
    }

    return {
      enabled: true,
      masterVolume: 0.3, // Subtle by default
      categoryVolumes: {
        ui: 0.5,
        feedback: 0.7,
        ambient: 0.3,
        celebration: 0.8
      }
    };
  }

  private saveSettings() {
    localStorage.setItem('cardshow_audio_settings', JSON.stringify(this.settings));
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context on user interaction (required by browsers)
      document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
      document.addEventListener('touchstart', this.resumeAudioContext.bind(this), { once: true });
      
      await this.preloadAudioCues();
    } catch (error) {
      console.warn('Audio context not supported or failed to initialize:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private async preloadAudioCues() {
    const cues: AudioCue[] = [
      {
        id: 'click',
        url: '/audio/click.mp3',
        volume: 0.3,
        duration: 150,
        category: 'ui'
      },
      {
        id: 'success',
        url: '/audio/success.mp3',
        volume: 0.5,
        duration: 800,
        category: 'feedback'
      },
      {
        id: 'error',
        url: '/audio/error.mp3',
        volume: 0.4,
        duration: 600,
        category: 'feedback'
      },
      {
        id: 'level_up',
        url: '/audio/level-up.mp3',
        volume: 0.8,
        duration: 2000,
        category: 'celebration'
      },
      {
        id: 'achievement',
        url: '/audio/achievement.mp3',
        volume: 0.7,
        duration: 1500,
        category: 'celebration'
      },
      {
        id: 'step_transition',
        url: '/audio/step-transition.mp3',
        volume: 0.2,
        duration: 400,
        category: 'ui'
      },
      {
        id: 'magic_wand',
        url: '/audio/magic-wand.mp3',
        volume: 0.4,
        duration: 800,
        category: 'feedback'
      },
      {
        id: 'card_flip',
        url: '/audio/card-flip.mp3',
        volume: 0.3,
        duration: 500,
        category: 'ui'
      },
      {
        id: 'ambient_creativity',
        url: '/audio/ambient-creativity.mp3',
        volume: 0.1,
        duration: 30000,
        category: 'ambient'
      }
    ];

    // Load audio buffers in parallel
    const loadPromises = cues.map(cue => this.loadAudioBuffer(cue));
    await Promise.allSettled(loadPromises);
  }

  private async loadAudioBuffer(cue: AudioCue): Promise<void> {
    if (!this.audioContext || this.audioBuffers.has(cue.id)) return;

    // Check if already loading
    if (this.loadingPromises.has(cue.id)) {
      await this.loadingPromises.get(cue.id);
      return;
    }

    const loadPromise = this.fetchAndDecodeAudio(cue);
    this.loadingPromises.set(cue.id, loadPromise);

    try {
      const buffer = await loadPromise;
      this.audioBuffers.set(cue.id, buffer);
    } catch (error) {
      console.warn(`Failed to load audio cue: ${cue.id}`, error);
    } finally {
      this.loadingPromises.delete(cue.id);
    }
  }

  private async fetchAndDecodeAudio(cue: AudioCue): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('Audio context not available');

    // For demo purposes, create synthetic audio buffers
    // In a real app, you would fetch actual audio files
    const buffer = this.audioContext.createBuffer(
      1, // mono
      this.audioContext.sampleRate * (cue.duration / 1000),
      this.audioContext.sampleRate
    );

    const channelData = buffer.getChannelData(0);
    
    // Generate different synthetic sounds based on cue type
    switch (cue.id) {
      case 'click':
        this.generateClickSound(channelData, this.audioContext.sampleRate);
        break;
      case 'success':
        this.generateSuccessSound(channelData, this.audioContext.sampleRate);
        break;
      case 'error':
        this.generateErrorSound(channelData, this.audioContext.sampleRate);
        break;
      case 'level_up':
        this.generateLevelUpSound(channelData, this.audioContext.sampleRate);
        break;
      case 'achievement':
        this.generateAchievementSound(channelData, this.audioContext.sampleRate);
        break;
      case 'step_transition':
        this.generateTransitionSound(channelData, this.audioContext.sampleRate);
        break;
      case 'magic_wand':
        this.generateMagicSound(channelData, this.audioContext.sampleRate);
        break;
      case 'card_flip':
        this.generateFlipSound(channelData, this.audioContext.sampleRate);
        break;
      default:
        this.generateGenericSound(channelData, this.audioContext.sampleRate);
    }

    return buffer;
  }

  private generateClickSound(data: Float32Array, sampleRate: number) {
    const duration = 0.1;
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      if (t < duration) {
        const envelope = Math.exp(-t * 50);
        data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.3;
      }
    }
  }

  private generateSuccessSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3);
      const freq = 440 + (t * 200); // Rising frequency
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.4;
    }
  }

  private generateErrorSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 4);
      const freq = 200 - (t * 50); // Falling frequency
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }
  }

  private generateLevelUpSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.max(0, 1 - t / 2);
      const freq1 = 440 * Math.pow(2, t); // Ascending scale
      const freq2 = 440 * Math.pow(2, t + 0.25);
      data[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * envelope * 0.2;
    }
  }

  private generateAchievementSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.max(0, 1 - t / 1.5);
      const freq = 523.25; // C note
      const harmony = 659.25; // E note
      data[i] = (Math.sin(2 * Math.PI * freq * t) + Math.sin(2 * Math.PI * harmony * t)) * envelope * 0.3;
    }
  }

  private generateTransitionSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.sin(Math.PI * t / 0.4); // Smooth fade in/out
      const freq = 600 + Math.sin(t * 10) * 100; // Subtle frequency modulation
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
    }
  }

  private generateMagicSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2);
      const freq = 800 + Math.sin(t * 30) * 400; // Magic sparkle effect
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }
  }

  private generateFlipSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 6);
      const freq = 300 + (t < 0.25 ? t * 400 : (0.5 - t) * 400); // Swoosh effect
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    }
  }

  private generateGenericSound(data: Float32Array, sampleRate: number) {
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5);
      data[i] = Math.sin(2 * Math.PI * 440 * t) * envelope * 0.3;
    }
  }

  public async playAudioCue(cueId: string, options: { volume?: number; delay?: number } = {}) {
    if (!this.settings.enabled || !this.audioContext || this.audioContext.state !== 'running') {
      return;
    }

    const buffer = this.audioBuffers.get(cueId);
    if (!buffer) {
      console.warn(`Audio cue not found: ${cueId}`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Calculate final volume
    const cue = this.getAudioCueById(cueId);
    const categoryVolume = cue ? this.settings.categoryVolumes[cue.category] : 1;
    const finalVolume = this.settings.masterVolume * categoryVolume * (options.volume || 1);
    
    gainNode.gain.value = finalVolume;

    const startTime = this.audioContext.currentTime + (options.delay || 0);
    source.start(startTime);
  }

  private getAudioCueById(id: string): AudioCue | null {
    // This would normally be stored separately or fetched from a service
    const cues = [
      { id: 'click', category: 'ui' as const },
      { id: 'success', category: 'feedback' as const },
      { id: 'error', category: 'feedback' as const },
      { id: 'level_up', category: 'celebration' as const },
      { id: 'achievement', category: 'celebration' as const },
      { id: 'step_transition', category: 'ui' as const },
      { id: 'magic_wand', category: 'feedback' as const },
      { id: 'card_flip', category: 'ui' as const },
      { id: 'ambient_creativity', category: 'ambient' as const }
    ];

    return cues.find(cue => cue.id === id) as AudioCue || null;
  }

  // Convenience methods for common actions
  public playClick() {
    this.playAudioCue('click');
  }

  public playSuccess() {
    this.playAudioCue('success');
  }

  public playError() {
    this.playAudioCue('error');
  }

  public playLevelUp() {
    this.playAudioCue('level_up');
  }

  public playAchievement() {
    this.playAudioCue('achievement');
  }

  public playStepTransition() {
    this.playAudioCue('step_transition');
  }

  public playMagicWand() {
    this.playAudioCue('magic_wand');
  }

  public playCardFlip() {
    this.playAudioCue('card_flip');
  }

  public setEnabled(enabled: boolean) {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  public setMasterVolume(volume: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public setCategoryVolume(category: keyof AudioSettings['categoryVolumes'], volume: number) {
    this.settings.categoryVolumes[category] = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }
}

export const audioCueService = new AudioCueService();