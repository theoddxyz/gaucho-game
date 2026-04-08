// --- Shader de distorsión por calor ---
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export function createHeatPass() {
  const shader = {
    uniforms: {
      tDiffuse:    { value: null },
      uTime:       { value: 0 },
      uIntensity:  { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        if (uIntensity <= 0.0) { gl_FragColor = texture2D(tDiffuse, vUv); return; }
        float s1 = sin(vUv.y * 18.0 + uTime * 2.1) * 0.0018;
        float s2 = sin(vUv.x * 12.0 + uTime * 1.7 + 1.2) * 0.0012;
        float s3 = sin(vUv.y * 34.0 + uTime * 3.3 + 2.4) * 0.0008;
        vec2 distort = vec2(s1 + s2, s2 + s3) * uIntensity;
        gl_FragColor = texture2D(tDiffuse, vUv + distort);
      }
    `,
  };
  return new ShaderPass(shader);
}
