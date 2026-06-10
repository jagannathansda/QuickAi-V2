"use client";
import { Mesh, Program, Renderer, Geometry, Vec3 } from 'ogl';
import { useEffect, useRef } from 'react';

function hexToVec3(color) {
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;
  return new Vec3(r, g, b);
}

export default function Orb() {
  const ctnDom = useRef(null);

  const vert = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec3 backgroundColor;
    varying vec2 vUv;

    vec3 hash33(vec3 p3) { 
        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787)); 
        p3 += dot(p3, p3.yxz + 19.19); 
        return -1.0 + 2.0 * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx); 
    }

    float snoise3(vec3 p) { 
        const float K1 = 0.333333333, K2 = 0.166666667; 
        vec3 i = floor(p + (p.x + p.y + p.z) * K1); 
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2); 
        vec3 e = step(vec3(0.0), d0 - d0.yzx); 
        vec3 i1 = e * (1.0 - e.zxy); 
        vec3 i2 = 1.0 - e.zxy * (1.0 - e); 
        vec3 d1 = d0 - (i1 - K2); 
        vec3 d2 = d0 - (i2 - K1); 
        vec3 d3 = d0 - 0.5; 
        vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0); 
        vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0))); 
        return dot(vec4(31.316), n); 
    }

    const vec3 baseColor1 = vec3(0.611, 0.262, 0.996); 
    const vec3 baseColor2 = vec3(0.298, 0.760, 0.913); 
    const vec3 baseColor3 = vec3(0.062, 0.078, 0.600); 

    float light1(float i, float a, float d) { return i / (1.0 + d * a); }
    float light2(float i, float a, float d) { return i / (1.0 + d * d * a); }

    vec4 draw(vec2 uv) {
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
      
      float n0 = snoise3(vec3(uv * 0.65, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(0.6, 1.0, 0.4), mix(0.6, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0) * smoothstep(r0 * 1.05, r0, len) * mix(smoothstep(r0 * 0.8, r0 * 0.95, len), 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      float d = distance(uv, vec2(cos(a), sin(a)) * r0);
      float v1 = light2(1.5, 5.0, d) * light1(1.0, 50.0, d0);
      float v2 = smoothstep(1.0, mix(0.6, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(0.6, mix(0.6, 1.0, 0.5), len);
      
      vec3 colBase = mix(baseColor1, baseColor2, cl);
      vec3 darkCol = clamp((mix(baseColor3, colBase, v0) + v1) * v2 * v3, 0.0, 1.0);
      vec3 lightCol = clamp(mix(backgroundColor, (colBase + v1) * mix(1.0, v2 * v3, mix(1.0, 0.1, bgLuminance)), v0), 0.0, 1.0);
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
      
      return vec4(finalCol, 1.0); 
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      gl_FragColor = mainImage(fragCoord);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        backgroundColor: { value: hexToVec3('#000000') }
      }
    });

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const isMobile = window.innerWidth <= 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + 'px';
      gl.canvas.style.height = height + 'px';
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    let rafId;
    const update = t => {
      rafId = requestAnimationFrame(update);
      program.uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      if (gl) gl.deleteProgram(program.program);
    };
  }, []);

  return <div ref={ctnDom} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />;
}