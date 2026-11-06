import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COIN_POOL } from "./gameLogic";

export default function Collectibles({ gameRef }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 20);
    g.rotateX(Math.PI / 2); // face the camera
    return g;
  }, []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FFD43B", emissive: "#FFD43B", emissiveIntensity: 1.2 }),
    []
  );

  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat]
  );

  useFrame((state) => {
    const list = gameRef.current.coinList;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c.active) {
        dummy.position.set(c.x, 1 + Math.sin(t * 4 + i) * 0.08, c.z);
        dummy.rotation.set(0, t * 3 + i, 0);
        dummy.scale.setScalar(1);
      } else {
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, COIN_POOL]} frustumCulled={false} />;
}