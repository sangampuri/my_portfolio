import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { makeLabelTexture, makeScreenTexture } from "./labelTexture";

function NeonBox({ size, position, color = "#171A26", edge = "#00D9FF" }) {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);
  return (
    <group position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={edge} />
      </lineSegments>
    </group>
  );
}

function Badge({ text, color, position }) {
  const tex = useMemo(() => makeLabelTexture(text, { fg: color }), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial map={tex} emissive={color} emissiveMap={tex} emissiveIntensity={0.7} />
      </mesh>
    </Float>
  );
}

export function Particles({ count }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * 12;
    return a;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00F5D4" size={0.05} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

const SIZES = {
  desk: [5, 0.2, 2.6],
  frame: [2.8, 1.7, 0.14],
  stand: [0.3, 0.7, 0.3],
  base: [1.2, 0.08, 0.7],
  keyboard: [1.9, 0.07, 0.6],
};

export default function Workstation({ mobile, reduced }) {
  const group = useRef();
  const lightA = useRef();
  const lightB = useRef();
  const screenTex = useMemo(() => makeScreenTexture(), []);
  useEffect(() => () => screenTex.dispose(), [screenTex]);

  useFrame((state) => {
    if (reduced) return;
    const { x, y } = state.pointer;
    const g = group.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.35, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.1, 0.05);
    const t = state.clock.elapsedTime;
    lightA.current.color.setHSL(0.52 + Math.sin(t * 0.3) * 0.05, 1, 0.55);
    lightB.current.color.setHSL(0.78 + Math.cos(t * 0.25) * 0.05, 0.8, 0.55);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={lightA} position={[-4, 3, 3]} intensity={60} color="#00D9FF" />
      <pointLight ref={lightB} position={[4, 2, -2]} intensity={50} color="#9D4EDD" />

      <group ref={group}>
        <gridHelper args={[12, 24, "#9D4EDD", "#1c2036"]} position={[0, -0.3, 0]} />

        <NeonBox size={SIZES.desk} position={[0, 0, 0]} edge="#9D4EDD" />
        <NeonBox size={SIZES.base} position={[0, 0.14, -0.4]} />
        <NeonBox size={SIZES.stand} position={[0, 0.5, -0.4]} />

        <group position={[0, 1.6, -0.4]}>
          <NeonBox size={SIZES.frame} position={[0, 0, 0]} color="#0b0d16" />
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[2.6, 1.5]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} />
          </mesh>
        </group>

        <Float speed={1.5} floatIntensity={0.5} rotationIntensity={0.15}>
          <NeonBox size={SIZES.keyboard} position={[0, 0.8, 0.7]} edge="#FF2E93" />
        </Float>

        <Badge text="PY" color="#00D9FF" position={[-2.6, 2.4, 0.5]} />
        <Badge text="JS" color="#FFD43B" position={[2.7, 2.8, 0.2]} />
        <Badge text="DJ" color="#00F5D4" position={[2.4, 1.0, 1.6]} />
        <Badge text="{ }" color="#FF2E93" position={[-2.4, 0.9, 1.4]} />

        <Particles count={mobile ? 60 : 200} />
      </group>
    </>
  );
}