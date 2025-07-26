import type { PerformanceLevel } from '../hooks/useAdaptiveStylePerformance';

interface ShaderProgram {
  program: WebGLProgram;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface CacheEntry {
  shader: ShaderProgram;
  lastUsed: number;
  useCount: number;
}

class ShaderCache {
  private cache = new Map<string, CacheEntry>();
  private maxCacheSize = 50;
  private maxAge = 5 * 60 * 1000; // 5 minutes

  private generateCacheKey(styleId: string, performanceLevel: PerformanceLevel): string {
    return `${styleId}-${performanceLevel}`;
  }

  private createShaderProgram(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ): ShaderProgram | null {
    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return null;
    }

    return {
      program,
      vertexShader,
      fragmentShader,
      uniforms: {}
    };
  }

  private compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private getShaderSource(styleId: string, performanceLevel: PerformanceLevel) {
    const baseVertexShader = `
      attribute vec4 a_position;
      attribute vec2 a_texCoord;
      uniform mat4 u_mvpMatrix;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = u_mvpMatrix * a_position;
        v_texCoord = a_texCoord;
      }
    `;

    let fragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
    `;

    // Base texture sampling
    fragmentShader += `
      vec4 getBaseColor() {
        return texture2D(u_texture, v_texCoord);
      }
    `;

    // Style-specific effects based on performance level
    switch (styleId) {
      case 'epic':
        fragmentShader += this.getEpicEffects(performanceLevel);
        break;
      case 'classic':
        fragmentShader += this.getClassicEffects(performanceLevel);
        break;
      case 'futuristic':
        fragmentShader += this.getFuturisticEffects(performanceLevel);
        break;
      default:
        fragmentShader += `
          void main() {
            gl_FragColor = getBaseColor();
          }
        `;
    }

    return {
      vertex: baseVertexShader,
      fragment: fragmentShader
    };
  }

  private getEpicEffects(performanceLevel: PerformanceLevel): string {
    if (performanceLevel === 'low') {
      return `
        void main() {
          vec4 color = getBaseColor();
          // Simple brightness boost for epic feel
          color.rgb *= 1.2;
          gl_FragColor = color;
        }
      `;
    }

    if (performanceLevel === 'medium') {
      return `
        void main() {
          vec4 color = getBaseColor();
          vec2 uv = v_texCoord;
          
          // Simple glow effect
          float glow = sin(u_time * 2.0) * 0.1 + 0.9;
          color.rgb *= glow;
          
          // Enhanced contrast
          color.rgb = (color.rgb - 0.5) * 1.3 + 0.5;
          
          gl_FragColor = color;
        }
      `;
    }

    // High performance - full effects
    return `
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      vec3 fireEffect(vec2 uv) {
        float noise = hash(uv + u_time * 0.1);
        float fire = pow(noise, 2.0);
        return vec3(fire * 2.0, fire * 0.8, fire * 0.3);
      }
      
      void main() {
        vec4 color = getBaseColor();
        vec2 uv = v_texCoord;
        
        // Fire particle effect
        vec3 fire = fireEffect(uv * 8.0);
        
        // Dynamic glow
        float glow = sin(u_time * 3.0) * 0.2 + 1.0;
        
        // Enhanced saturation and contrast
        color.rgb = mix(color.rgb, fire, 0.1);
        color.rgb *= glow;
        color.rgb = pow(color.rgb, vec3(1.2));
        
        gl_FragColor = color;
      }
    `;
  }

  private getClassicEffects(performanceLevel: PerformanceLevel): string {
    return `
      void main() {
        vec4 color = getBaseColor();
        vec2 uv = v_texCoord;
        
        // Vintage paper texture
        float paper = hash(uv * 512.0) * 0.1;
        
        // Subtle sepia tone
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        vec3 sepia = vec3(gray * 1.2, gray * 1.0, gray * 0.8);
        color.rgb = mix(color.rgb, sepia, 0.15);
        
        // Add paper texture
        color.rgb += paper * 0.05;
        
        // Slight vignette
        float dist = distance(uv, vec2(0.5));
        float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
        color.rgb *= vignette;
        
        gl_FragColor = color;
      }
    `;
  }

  private getFuturisticEffects(performanceLevel: PerformanceLevel): string {
    if (performanceLevel === 'low') {
      return `
        void main() {
          vec4 color = getBaseColor();
          // Simple cyan tint for futuristic feel
          color.rgb = mix(color.rgb, vec3(0.0, 1.0, 1.0), 0.1);
          gl_FragColor = color;
        }
      `;
    }

    return `
      vec2 getHologramUV(vec2 uv) {
        float scanline = sin(uv.y * 800.0 + u_time * 10.0) * 0.01;
        return uv + vec2(scanline, 0.0);
      }
      
      void main() {
        vec2 uv = getHologramUV(v_texCoord);
        vec4 color = texture2D(u_texture, uv);
        
        // Holographic color shift
        float shift = sin(u_time * 2.0 + v_texCoord.y * 10.0) * 0.02;
        vec4 colorShift = texture2D(u_texture, uv + vec2(shift, 0.0));
        
        // Mix original with shifted colors
        color.r = colorShift.r;
        color.gb *= 1.1;
        
        // Scanlines
        float scanlines = sin(v_texCoord.y * 600.0) * 0.1 + 0.9;
        color.rgb *= scanlines;
        
        // Digital noise
        float noise = hash(v_texCoord + u_time * 0.01) * 0.05;
        color.rgb += noise;
        
        // Neon glow effect
        color.rgb += vec3(0.0, 0.3, 0.5) * 0.1;
        
        gl_FragColor = color;
      }
    `;
  }

  getCachedShader(
    styleId: string,
    performanceLevel: PerformanceLevel,
    gl: WebGLRenderingContext
  ): ShaderProgram | null {
    const cacheKey = this.generateCacheKey(styleId, performanceLevel);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.lastUsed < this.maxAge) {
      cached.lastUsed = Date.now();
      cached.useCount++;
      return cached.shader;
    }

    // Compile new shader
    const shaderSource = this.getShaderSource(styleId, performanceLevel);
    const shader = this.createShaderProgram(gl, shaderSource.vertex, shaderSource.fragment);

    if (shader) {
      this.cache.set(cacheKey, {
        shader,
        lastUsed: Date.now(),
        useCount: 1
      });

      // Clean up old entries if cache is full
      this.cleanup();
    }

    return shader;
  }

  private cleanup() {
    if (this.cache.size <= this.maxCacheSize) return;

    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);

    const toDelete = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
    toDelete.forEach(([key]) => this.cache.delete(key));
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        lastUsed: entry.lastUsed,
        useCount: entry.useCount
      }))
    };
  }
}

export const shaderCache = new ShaderCache();