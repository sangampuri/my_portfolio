import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OBSTACLE_DIMS, OBSTACLE_POOL } from "./gameLogic";

export default function Obstacles({ gameRef }) {
  const refs = useRef([]);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mats = useMemo(
    () => ({
      barrier: new THREE.MeshStandardMaterial({ color: "#2a0f22", emissive: "#FF2E93", emissiveIntensity: 0.9 }),
      wall: new THREE.MeshStandardMaterial({ color: "#0f1f2a", emissive: "#00D9FF", emissiveIntensity: 0.7 }),
    }),
    []
  );

  useEffect(
    () => () => {
      geo.dispose();
      mats.barrier.dispose();
      mats.wall.dispose();
    },
    [geo, mats]
  );

  useFrame(() => {
    const list = gameRef.current.obstacles;
    for (let i = 0; i < OBSTACLE_POOL; i++) {
      const m = refs.current[i];
      const o = list[i];
      if (!m) continue;
      if (!o.active) {
        m.visible = false;
        continue;
      }
      const d = OBSTACLE_DIMS[o.type];
      m.visible = true;
      m.material = mats[o.type];
      m.position.set(o.x, d.h / 2, o.z);
      m.scale.set(d.w, d.h, d.d);
    }
  });

  return (
    <group>
      {Array.from({ length: OBSTACLE_POOL }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={geo} material={mats.barrier} visible={false} />
      ))}
    </group>
  );
}