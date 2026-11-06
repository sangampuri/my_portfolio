import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Player from "./Player";
import Obstacles from "./Obstacles";
import Collectibles from "./Collectibles";
import { step, BASE_SPEED, MAX_SPEED } from "./gameLogic";

const TILE = 8;
// world scroll speed for scenery (menu = slow drift, paused/over = still)
const sceneSpeed = (g, st) => (st === "playing" ? g.speed : st === "initial" ? 6 : 0);

/* ---------- loop ---------- */
function GameLoop({ gameRef, statusRef, onCrash, onHud }) {
  const acc = useRef(0);
  useFrame((_, delta) => {
    if (statusRef.current !== "playing") return;
    const dt = Math.min(delta, 0.05); // avoid huge jumps after tab switch
    const g = gameRef.current;
    const crashed = step(g, dt);
    acc.current += dt;
    if (acc.current > 0.1) {
      acc.current = 0;
      onHud(g.score, g.coins);
    }
    if (crashed) onCrash();
  });
  return null;
}

/* ---------- road ---------- */
function Road({ gameRef, statusRef }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d");
    x.fillStyle = "#0b0d16";
    x.fillRect(0, 0, 256, 256);
    x.fillStyle = "#FF2E93";
    x.fillRect(0, 0, 6, 256);
    x.fillRect(250, 0, 6, 256);
    x.fillStyle = "#00D9FF";
    [85, 171].forEach((px) => x.fillRect(px - 2, 0, 4, 128));
    x.fillStyle = "rgba(157,78,221,0.35)";
    x.fillRect(0, 0, 256, 3);
    const t = new THREE.CanvasTexture(c);
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 140 / TILE);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    tex.offset.y = (tex.offset.y + (sceneSpeed(gameRef.current, statusRef.current) * dt) / TILE) % 1;
    // road looks like it moves backwards? change + to - on the line above
  });

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -60]}>
        <planeGeometry args={[6.6, 140]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, -60]}>
        <planeGeometry args={[90, 140]} />
        <meshBasicMaterial color="#08090F" />
      </mesh>
    </>
  );
}

/* ---------- city ---------- */
const DARK = ["#12152a", "#171a33", "#1b1230", "#10202e"];
const NEON = ["#00D9FF", "#9D4EDD", "#FF2E93", "#00F5D4"];

function Buildings({ gameRef, statusRef }) {
  const body = useRef();
  const trim = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const matBody = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.7, metalness: 0.3 }), []);
  const matTrim = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff" }), []);
  const items = useMemo(() => {
    const arr = [];
    for (let r = 0; r < 20; r++) {
      for (const side of [-1, 1]) {
        arr.push({
          x: side * (6 + Math.random() * 7),
          z: 10 - r * 7 + Math.random() * 2,
          h: 4 + Math.random() * 16,
          w: 2 + Math.random() * 3,
          d: 3 + Math.random() * 3,
          ci: Math.floor(Math.random() * 4),
        });
      }
    }
    return arr;
  }, []);

  useEffect(() => {
    const c = new THREE.Color();
    items.forEach((b, i) => {
      body.current.setColorAt(i, c.set(DARK[b.ci]));
      trim.current.setColorAt(i, c.set(NEON[b.ci]));
    });
    body.current.instanceColor.needsUpdate = true;
    trim.current.instanceColor.needsUpdate = true;
  }, [items]);

  useEffect(
    () => () => {
      geo.dispose();
      matBody.dispose();
      matTrim.dispose();
    },
    [geo, matBody, matTrim]
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const move = sceneSpeed(gameRef.current, statusRef.current) * dt;
    items.forEach((b, i) => {
      b.z += move;
      if (b.z > 12) b.z -= 140;
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      body.current.setMatrixAt(i, dummy.matrix);
      dummy.position.set(b.x, b.h, b.z);
      dummy.scale.set(b.w + 0.1, 0.15, b.d + 0.1);
      dummy.updateMatrix();
      trim.current.setMatrixAt(i, dummy.matrix);
    });
    body.current.instanceMatrix.needsUpdate = true;
    trim.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={body} args={[geo, matBody, items.length]} frustumCulled={false} />
      <instancedMesh ref={trim} args={[geo, matTrim, items.length]} frustumCulled={false} />
    </>
  );
}

/* ---------- atmosphere ---------- */
function Dust({ gameRef, statusRef, count }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 24;
      a[i * 3 + 1] = Math.random() * 8;
      a[i * 3 + 2] = -100 + Math.random() * 108;
    }
    return a;
  }, [count]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const move = sceneSpeed(gameRef.current, statusRef.current) * dt * 0.8;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] += move;
      if (positions[i * 3 + 2] > 8) positions[i * 3 + 2] -= 108;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (count === 0) return null;
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00F5D4" size={0.06} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Lights({ gameRef, statusRef }) {
  const light = useRef();
  useFrame(() => {
    const g = gameRef.current;
    const frac = (g.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
    light.current.intensity = 25 + frac * 25;
    light.current.color.set(statusRef.current === "over" ? "#ff2e53" : "#00D9FF");
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 8, 5]} intensity={1.2} color="#FF2E93" />
      <pointLight ref={light} position={[0, 3, 2]} distance={25} color="#00D9FF" />
    </>
  );
}

export default function GameScene({ gameRef, statusRef, onCrash, onHud, mobile, reduced, visible }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 2]}
      frameloop={visible ? "always" : "never"}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      camera={{ position: mobile ? [0, 4.2, 8.5] : [0, 3.4, 6.5], fov: 60, near: 0.1, far: 200 }}
      onCreated={({ camera }) => camera.lookAt(0, 1, -10)}
    >
      <color attach="background" args={["#08090F"]} />
      <fog attach="fog" args={["#08090F", 25, 90]} />

      <Lights gameRef={gameRef} statusRef={statusRef} />
      <Road gameRef={gameRef} statusRef={statusRef} />
      <Buildings gameRef={gameRef} statusRef={statusRef} />
      <Dust gameRef={gameRef} statusRef={statusRef} count={reduced ? 0 : mobile ? 40 : 100} />
      <Obstacles gameRef={gameRef} />
      <Collectibles gameRef={gameRef} />
      <Player gameRef={gameRef} statusRef={statusRef} />
      <GameLoop gameRef={gameRef} statusRef={statusRef} onCrash={onCrash} onHud={onHud} />
    </Canvas>
  );
}