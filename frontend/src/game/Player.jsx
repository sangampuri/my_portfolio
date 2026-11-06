import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LANE_X } from "./gameLogic";

const dark = { color: "#171A26", metalness: 0.6, roughness: 0.4 };

export default function Player({ gameRef, statusRef }) {
  const root = useRef();
  const body = useRef();
  const legL = useRef();
  const legR = useRef();
  const armL = useRef();
  const armR = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = gameRef.current;
    const st = statusRef.current;
    const p = g.player;

    root.current.position.set(p.x, p.y, 0);

    const running = st === "playing";
    const air = p.y > 0.05;
    if (running) t.current += dt * (8 + g.speed * 0.25);
    const swing = running && !air ? Math.sin(t.current) : 0;

    legL.current.rotation.x = air ? -0.9 : swing * 0.9;
    legR.current.rotation.x = air ? 0.5 : -swing * 0.9;
    armL.current.rotation.x = air ? -2.2 : -swing * 0.8;
    armR.current.rotation.x = air ? -2.2 : swing * 0.8;
    body.current.position.y = 0.95 + (running && !air ? Math.abs(Math.sin(t.current)) * 0.06 : 0);

    const lean = (p.x - LANE_X[p.lane]) * 0.15;
    const targetZ = st === "over" ? 1.3 : lean;
    root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, targetZ, 0.15);
  });

  return (
    <group ref={root}>
      <group ref={body} position={[0, 0.95, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.7, 0.35]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.42, 0.36, 0.36]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        {/* visor (front, -z) */}
        <mesh position={[0, 0.57, -0.19]}>
          <boxGeometry args={[0.3, 0.1, 0.02]} />
          <meshBasicMaterial color="#00F5D4" />
        </mesh>
        {/* back light strip (what camera sees) */}
        <mesh position={[0, 0.05, 0.18]}>
          <boxGeometry args={[0.1, 0.5, 0.02]} />
          <meshBasicMaterial color="#00D9FF" />
        </mesh>
        <mesh position={[0, 0.55, 0.19]}>
          <boxGeometry args={[0.3, 0.06, 0.02]} />
          <meshBasicMaterial color="#FF2E93" />
        </mesh>

        <group ref={legL} position={[-0.15, -0.35, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.6, 0.22]} />
            <meshStandardMaterial color="#10121C" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
        <group ref={legR} position={[0.15, -0.35, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.2, 0.6, 0.22]} />
            <meshStandardMaterial color="#10121C" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        <group ref={armL} position={[-0.4, 0.2, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.14, 0.5, 0.14]} />
            <meshStandardMaterial color="#9D4EDD" emissive="#9D4EDD" emissiveIntensity={0.5} />
          </mesh>
        </group>
        <group ref={armR} position={[0.4, 0.2, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.14, 0.5, 0.14]} />
            <meshStandardMaterial color="#9D4EDD" emissive="#9D4EDD" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}