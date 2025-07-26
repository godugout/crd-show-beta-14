import { VisionAnalysisResult } from './visionAnalysisService';

interface StylePreset {
  id: string;
  name: string;
  description: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    blur: number;
    vintage: number;
    glow: number;
  };
  overlay?: {
    type: 'gradient' | 'texture' | 'pattern';
    data: string;
    opacity: number;
    blendMode: GlobalCompositeOperation;
  };
  shader?: string;
}

interface StyleTransferOptions {
  style: 'nba-jam' | 'anime' | 'holographic' | 'vintage' | 'cyberpunk' | 'oil-painting' | 'comic';
  intensity: number; // 0-1
  preserveColors?: boolean;
  teamColors?: string[];
}

class StyleTransferService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private glCanvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.initWebGL();
  }

  private initWebGL() {
    try {
      this.glCanvas = document.createElement('canvas');
      this.gl = this.glCanvas.getContext('webgl') || this.glCanvas.getContext('experimental-webgl');
      
      if (this.gl) {
        console.log('✅ WebGL initialized for GPU-accelerated effects');
      }
    } catch (error) {
      console.warn('WebGL not available, using CPU fallback:', error);
    }
  }

  private getStylePresets(): Record<string, StylePreset> {
    return {
      'nba-jam': {
        id: 'nba-jam',
        name: '1990s NBA Jam',
        description: 'Retro arcade basketball style with high contrast and neon effects',
        filters: {
          brightness: 1.2,
          contrast: 1.4,
          saturation: 1.6,
          hue: 10,
          blur: 0,
          vintage: 0.3,
          glow: 0.8
        },
        overlay: {
          type: 'gradient',
          data: 'linear-gradient(45deg, #ff6b00 0%, #ff0000 50%, #8b00ff 100%)',
          opacity: 0.15,
          blendMode: 'overlay'
        },
        shader: this.getNBAJamShader()
      },
      
      'anime': {
        id: 'anime',
        name: 'Anime Style',
        description: 'Cel-shaded anime aesthetic with vibrant colors',
        filters: {
          brightness: 1.1,
          contrast: 1.3,
          saturation: 1.4,
          hue: 5,
          blur: 0.5,
          vintage: 0,
          glow: 0.3
        },
        overlay: {
          type: 'pattern',
          data: 'cel-shading',
          opacity: 0.2,
          blendMode: 'multiply'
        },
        shader: this.getAnimeShader()
      },
      
      'holographic': {
        id: 'holographic',
        name: 'Holographic',
        description: 'Futuristic hologram effect with rainbow gradients',
        filters: {
          brightness: 1.0,
          contrast: 1.2,
          saturation: 1.2,
          hue: 0,
          blur: 0,
          vintage: 0,
          glow: 1.2
        },
        overlay: {
          type: 'gradient',
          data: 'conic-gradient(from 0deg, #ff0080, #00ff80, #8000ff, #ff0080)',
          opacity: 0.25,
          blendMode: 'screen'
        },
        shader: this.getHolographicShader()
      },
      
      'vintage': {
        id: 'vintage',
        name: 'Vintage Card',
        description: 'Classic baseball card aesthetic from the 1950s',
        filters: {
          brightness: 0.9,
          contrast: 0.8,
          saturation: 0.7,
          hue: 15,
          blur: 0.3,
          vintage: 0.8,
          glow: 0
        },
        overlay: {
          type: 'texture',
          data: 'paper-grain',
          opacity: 0.3,
          blendMode: 'multiply'
        }
      },
      
      'cyberpunk': {
        id: 'cyberpunk',
        name: 'Cyberpunk 2077',
        description: 'Neon-soaked futuristic style with chrome effects',
        filters: {
          brightness: 1.1,
          contrast: 1.5,
          saturation: 1.3,
          hue: -10,
          blur: 0,
          vintage: 0,
          glow: 1.0
        },
        overlay: {
          type: 'gradient',
          data: 'linear-gradient(180deg, #00ff9f 0%, #ff006f 100%)',
          opacity: 0.2,
          blendMode: 'hard-light'
        },
        shader: this.getCyberpunkShader()
      }
    };
  }

  async applyStyleTransfer(
    imageElement: HTMLImageElement,
    options: StyleTransferOptions,
    visionData?: VisionAnalysisResult
  ): Promise<HTMLImageElement> {
    console.log(`🎨 Applying ${options.style} style transfer...`);

    const preset = this.getStylePresets()[options.style];
    if (!preset) {
      throw new Error(`Style preset ${options.style} not found`);
    }

    // Setup canvas
    this.canvas.width = imageElement.naturalWidth;
    this.canvas.height = imageElement.naturalHeight;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply GPU-accelerated effects if available
    if (this.gl && preset.shader) {
      return this.applyWebGLStyle(imageElement, preset, options);
    }

    // Fallback to CPU-based style transfer
    return this.applyCPUStyle(imageElement, preset, options, visionData);
  }

  private async applyWebGLStyle(
    imageElement: HTMLImageElement,
    preset: StylePreset,
    options: StyleTransferOptions
  ): Promise<HTMLImageElement> {
    if (!this.gl || !this.glCanvas) {
      throw new Error('WebGL not available');
    }

    console.log('⚡ Using GPU acceleration for style transfer');

    this.glCanvas.width = imageElement.naturalWidth;
    this.glCanvas.height = imageElement.naturalHeight;

    const gl = this.gl;
    gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);

    // Create shader program
    const program = this.createShaderProgram(preset.shader!);
    if (!program) {
      throw new Error('Failed to create shader program');
    }

    gl.useProgram(program);

    // Setup texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageElement);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Setup uniforms
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    gl.uniform1f(intensityLocation, options.intensity);
    gl.uniform1f(timeLocation, Date.now() * 0.001);
    gl.uniform2f(resolutionLocation, this.glCanvas.width, this.glCanvas.height);

    // Setup geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Render
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Convert back to image
    const resultImage = new Image();
    resultImage.src = this.glCanvas.toDataURL('image/png');

    return new Promise((resolve) => {
      resultImage.onload = () => resolve(resultImage);
    });
  }

  private async applyCPUStyle(
    imageElement: HTMLImageElement,
    preset: StylePreset,
    options: StyleTransferOptions,
    visionData?: VisionAnalysisResult
  ): Promise<HTMLImageElement> {
    console.log('🖥️ Using CPU for style transfer');

    // Draw original image
    this.ctx.drawImage(imageElement, 0, 0);

    // Apply filters
    this.applyImageFilters(preset.filters, options.intensity);

    // Apply team color enhancement if available
    if (options.teamColors && visionData?.teamColors) {
      this.enhanceTeamColors(options.teamColors, visionData.teamColors);
    }

    // Apply overlay effects
    if (preset.overlay) {
      this.applyOverlay(preset.overlay);
    }

    // Apply special effects based on style
    switch (preset.id) {
      case 'nba-jam':
        this.applyNBAJamEffects();
        break;
      case 'anime':
        this.applyAnimeEffects();
        break;
      case 'holographic':
        this.applyHolographicEffects();
        break;
      case 'vintage':
        this.applyVintageEffects();
        break;
    }

    // Convert to image
    const resultImage = new Image();
    resultImage.src = this.canvas.toDataURL('image/png');

    return new Promise((resolve) => {
      resultImage.onload = () => resolve(resultImage);
    });
  }

  private applyImageFilters(filters: StylePreset['filters'], intensity: number) {
    const adjustedFilters = Object.entries(filters).map(([key, value]) => {
      if (key === 'brightness' || key === 'contrast' || key === 'saturation') {
        const adjusted = 1 + (value - 1) * intensity;
        return `${key}(${adjusted})`;
      }
      return `${key}(${value * intensity})`;
    });

    this.ctx.filter = adjustedFilters.join(' ');
    
    // Redraw with filters
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(imageData, 0, 0);
    this.ctx.filter = 'none';
  }

  private enhanceTeamColors(targetColors: string[], detectedColors: any) {
    console.log('🎽 Enhancing team colors');
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    // Simple color replacement logic
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel is close to detected team color
      const currentColor = `rgb(${r},${g},${b})`;
      
      // Enhance detected team colors
      if (this.isTeamColor(currentColor, detectedColors)) {
        data[i] = Math.min(255, r * 1.2);     // Enhance red
        data[i + 1] = Math.min(255, g * 1.2); // Enhance green  
        data[i + 2] = Math.min(255, b * 1.2); // Enhance blue
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private isTeamColor(color: string, teamColors: any): boolean {
    // Simplified team color detection
    return Math.random() > 0.8; // Demo implementation
  }

  private applyOverlay(overlay: StylePreset['overlay']) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = overlay.blendMode;
    this.ctx.globalAlpha = overlay.opacity;

    if (overlay.type === 'gradient') {
      this.applyGradientOverlay(overlay.data);
    } else if (overlay.type === 'texture') {
      this.applyTextureOverlay(overlay.data);
    }

    this.ctx.restore();
  }

  private applyGradientOverlay(gradientData: string) {
    // Parse gradient and apply
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, '#ff6b00');
    gradient.addColorStop(0.5, '#ff0000');
    gradient.addColorStop(1, '#8b00ff');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private applyTextureOverlay(textureType: string) {
    // Generate procedural texture based on type
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    if (textureType === 'paper-grain') {
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private applyNBAJamEffects() {
    // Add glow effect
    this.ctx.save();
    this.ctx.shadowColor = '#ff6600';
    this.ctx.shadowBlur = 20;
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.restore();
  }

  private applyAnimeEffects() {
    // Posterize effect for anime look
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const levels = 4;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / (255 / levels)) * (255 / levels);
      data[i + 1] = Math.floor(data[i + 1] / (255 / levels)) * (255 / levels);
      data[i + 2] = Math.floor(data[i + 2] / (255 / levels)) * (255 / levels);
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private applyHolographicEffects() {
    // Chromatic aberration effect
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.globalAlpha = 0.3;
    
    // Red channel offset
    this.ctx.fillStyle = '#ff0000';
    this.ctx.drawImage(this.canvas, 2, 0);
    
    // Blue channel offset  
    this.ctx.fillStyle = '#0000ff';
    this.ctx.drawImage(this.canvas, -2, 0);
    
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1;
  }

  private applyVintageEffects() {
    // Sepia tone
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private createShaderProgram(fragmentShaderSource: string): WebGLProgram | null {
    if (!this.gl) return null;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) / 2.0;
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    if (!program) return null;

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader program failed to link:', this.gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Shader source code for different styles
  private getNBAJamShader(): string {
    return `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_intensity;
      uniform float u_time;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        
        // Increase contrast and saturation
        color.rgb = (color.rgb - 0.5) * (1.0 + u_intensity) + 0.5;
        color.rgb = mix(vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114))), color.rgb, 1.0 + u_intensity);
        
        // Add subtle glow
        vec2 offset = vec2(sin(u_time), cos(u_time)) * 0.002;
        vec4 glow = texture2D(u_texture, v_texCoord + offset);
        color = mix(color, glow, u_intensity * 0.3);
        
        gl_FragColor = color;
      }
    `;
  }

  private getAnimeShader(): string {
    return `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_intensity;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        
        // Posterize effect
        float levels = mix(256.0, 8.0, u_intensity);
        color.rgb = floor(color.rgb * levels) / levels;
        
        // Enhance contrast
        color.rgb = (color.rgb - 0.5) * (1.0 + u_intensity * 0.5) + 0.5;
        
        gl_FragColor = color;
      }
    `;
  }

  private getHolographicShader(): string {
    return `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_intensity;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 uv = v_texCoord;
        
        // Chromatic aberration
        float aberration = u_intensity * 0.01;
        vec4 color;
        color.r = texture2D(u_texture, uv + vec2(aberration, 0.0)).r;
        color.g = texture2D(u_texture, uv).g;
        color.b = texture2D(u_texture, uv - vec2(aberration, 0.0)).b;
        color.a = texture2D(u_texture, uv).a;
        
        // Rainbow effect
        float rainbow = sin(uv.y * 10.0 + u_time) * 0.5 + 0.5;
        vec3 rainbowColor = vec3(
          sin(rainbow * 6.28),
          sin(rainbow * 6.28 + 2.09),
          sin(rainbow * 6.28 + 4.18)
        ) * 0.5 + 0.5;
        
        color.rgb = mix(color.rgb, rainbowColor, u_intensity * 0.3);
        
        gl_FragColor = color;
      }
    `;
  }

  private getCyberpunkShader(): string {
    return `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_intensity;
      uniform float u_time;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        
        // Neon glow effect
        vec3 neon = vec3(0.0, 1.0, 0.6);
        float glow = length(color.rgb - neon);
        color.rgb = mix(color.rgb, neon, u_intensity * (1.0 - glow));
        
        // Scanlines
        float scanline = sin(v_texCoord.y * 800.0) * 0.1;
        color.rgb += scanline * u_intensity;
        
        gl_FragColor = color;
      }
    `;
  }

  // Real-time style morphing with slider
  async morphBetweenStyles(
    imageElement: HTMLImageElement,
    style1: StyleTransferOptions,
    style2: StyleTransferOptions,
    morphAmount: number // 0-1
  ): Promise<HTMLImageElement> {
    console.log(`🔄 Morphing between ${style1.style} and ${style2.style}`);

    // Apply both styles
    const [result1, result2] = await Promise.all([
      this.applyStyleTransfer(imageElement, style1),
      this.applyStyleTransfer(imageElement, style2)
    ]);

    // Blend the results
    this.canvas.width = imageElement.naturalWidth;
    this.canvas.height = imageElement.naturalHeight;

    this.ctx.globalAlpha = 1 - morphAmount;
    this.ctx.drawImage(result1, 0, 0);

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = morphAmount;
    this.ctx.drawImage(result2, 0, 0);

    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';

    const morphedImage = new Image();
    morphedImage.src = this.canvas.toDataURL('image/png');

    return new Promise((resolve) => {
      morphedImage.onload = () => resolve(morphedImage);
    });
  }
}

export const styleTransferService = new StyleTransferService();