import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { makeLabelTexture, makeSignTexture } from "./labelTexture";
import { Particles } from "./Workstation";

/* ---------- shapes ---------- */
function LabelBox({ text, color }) {
  const tex = useMemo(() => makeLabelTexture(text, { fg: color }), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={tex} emissive={color} emissiveMap={tex} emissiveIntensity={0.8} />
    </mesh>
  );
}

function Atom({ color }) {
  const rings = [
    [Math.PI / 2, 0, 0],
    [Math.PI / 2, 0, Math.PI / 3],
    [Math.PI / 2, 0, -Math.PI / 3],
  ];
  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r}>
          <torusGeometry args={[0.6, 0.04, 12, 48]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function Stack({ color }) {
  return (
    <group>
      {[-0.4, 0, 0.4].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.28, 24]} />
          <meshStandardMaterial color="#171A26" emissive={color} emissiveIntensity={0.35} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Monitor({ color }) {
  const tex = useMemo(() => makeLabelTexture(">_", { fg: color }), [color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 1, 0.12]} />
        <meshStandardMaterial color="#0b0d16" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Shape({ item }) {
  switch (item.shape) {
    case "atom": return <Atom color={item.color} />;
    case "stack": return <Stack color={item.color} />;
    case "monitor": return <Monitor color={item.color} />;
    default: return <LabelBox text={item.text} color={item.color} />;
  }
}

/* ---------- interactive wrapper ---------- */
function Interactive({ item, selected, onSelect, reduced }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (!reduced) g.rotation.y += dt * (selected ? 2.5 : hovered ? 1.2 : 0.3);
    const target = hovered || selected ? 1.25 : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.12));
  });

  return (
    <Float speed={reduced ? 0 : 1.5} floatIntensity={0.6} rotationIntensity={0}>
      <group position={item.position}>
        <group
          ref={ref}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
        >
          <Shape item={item} />
        </group>

        {selected && (
          <mesh rotation-x={-Math.PI / 2} position={[0, -0.75, 0]}>
            <ringGeometry args={[0.7, 0.8, 48]} />
            <meshBasicMaterial color={item.color} />
          </mesh>
        )}

        {hovered && (
          <Html position={[0, 1.1, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
            <div
              className="font-mono text-[10px] tracking-widest px-2 py-1 bg-bg border whitespace-nowrap"
              style={{ color: item.color, borderColor: item.color }}
            >
              {item.name.toUpperCase()}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

/* ---------- decoration ---------- */
function Platform({ position, size, edge }) {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);
  return (
    <group position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#171A26" roughness={0.5} metalness={0.4} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={edge} />
      </lineSegments>
    </group>
  );
}

function SpinCube({ position, color, reduced }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.x += dt * 0.5;
    ref.current.rotation.y += dt * 0.7;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

function NeonSign() {
  const tex = useMemo(() => makeSignTexture("DEV_PLAYGROUND", "#FF2E93"), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 3.4, -2.8]} rotation-y={Math.PI / 4}>
      <planeGeometry args={[4, 1]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/* ---------- scene ---------- */
function World({ items, selectedId, onSelect, mobile, reduced }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[-5, 4, 4]} intensity={70} color="#00D9FF" />
      <pointLight position={[5, 3, -3]} intensity={60} color="#9D4EDD" />

      <gridHelper args={[14, 28, "#9D4EDD", "#1c2036"]} position={[0, -0.4, 0]} />

      <Platform position={[0, 0, 0]} size={[7, 0.3, 5]} edge="#9D4EDD" />
      <Platform position={[-3.5, 1.2, -2.5]} size={[2, 0.2, 2]} edge="#00D9FF" />
      <Platform position={[3.5, 1.8, -2]} size={[2, 0.2, 2]} edge="#FF2E93" />

      <NeonSign />

      <SpinCube position={[-4.5, 3.2, 1]} color="#00F5D4" reduced={reduced} />
      <SpinCube position={[4.6, 3.8, 1.5]} color="#9D4EDD" reduced={reduced} />
      <SpinCube position={[0.5, 4, -1]} color="#FF2E93" reduced={reduced} />

      {items.map((it) => (
        <Interactive
          key={it.id}
          item={it}
          selected={selectedId === it.id}
          onSelect={onSelect}
          reduced={reduced}
        />
      ))}

      <Particles count={mobile ? 50 : 150} />
    </>
  );
}

export default function PlaygroundScene({ items, selectedId, onSelect, mobile, reduced, visible }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 2]}
      frameloop={visible ? "always" : "never"}
      gl={{ alpha: true, antialias: !mobile }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => onSelect(null)}
    >
      <OrthographicCamera
        makeDefault
        position={[8, 6, 8]}
        zoom={mobile ? 48 : 70}
        near={0.1}
        far={100}
        onUpdate={(c) => c.lookAt(0, 0.9, 0)}
      />
      {!mobile && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          target={[0, 0.9, 0]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      )}
      <World items={items} selectedId={selectedId} onSelect={onSelect} mobile={mobile} reduced={reduced} />
    </Canvas>
  );
}