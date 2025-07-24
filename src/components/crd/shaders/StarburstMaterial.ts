import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform float intensity;
uniform vec3 color;
varying vec2 vUv;

float starburstPattern(vec2 p, float time) {
    float angle = atan(p.y - 0.5, p.x - 0.5);
    float rays = 12.0;
    float spike = sin(angle * rays + time) * 0.5 + 0.5;
    float dist = length(p - 0.5);
    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    return spike * falloff;
}

void main() {
    vec2 p = vUv;
    float starburst = starburstPattern(p, time);
    float glow = pow(1.0 - length(p - 0.5) * 2.0, 3.0);
    vec3 finalColor = color * (starburst * intensity + glow);
    gl_FragColor = vec4(finalColor, (starburst + glow) * intensity);
}
`;

export class StarburstMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.0 },
        color: { value: new THREE.Color(0xFFD700) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }

  update(time: number) {
    this.uniforms.time.value = time;
  }

  setIntensity(value: number) {
    this.uniforms.intensity.value = value;
  }
}