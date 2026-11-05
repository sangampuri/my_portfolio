import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  varying vec2 vUv;

  vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
    float d = length(p - m);

    vec2 pull = (m - p) * exp(-d * 3.0) * 0.6;
    vec2 q = p + pull;

    float n1 = fbm(q * 2.5 + vec2(uTime * 0.05, -uTime * 0.04));
    float n2 = fbm(q * 3.0 + n1 * 2.0 - uTime * 0.03);

    vec3 col = palette(n2 + uTime * 0.02 + d * 0.3);
    vec3 bg = vec3(0.031, 0.035, 0.059);
    float strength = 0.10 + exp(-d * 2.5) * 0.25 * n2;
    gl_FragColor = vec4(mix(bg, col, strength), 1.0);
  }
`;

function LiquidPlane() {
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const size = useThree((s) => s.size);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useEffect(() => {
    const onMove = (e) => {
      target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    mouse.current.lerp(target.current, 0.05);
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function LiquidBackground() {
  const useFallback = useMemo(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    return reduce || small || !canUseWebGL();
  }, []);

  if (useFallback) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(157,78,221,.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,217,255,.14), transparent 50%), #08090f",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "low-power" }}>
        <LiquidPlane />
      </Canvas>
    </div>
  );
}