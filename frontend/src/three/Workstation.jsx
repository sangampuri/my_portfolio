import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { makeLabelTexture, makeSignTexture } from "./labelTexture";

/* ================= helpers ================= */

function NeonBox({ size, position = [0, 0, 0], color = "#171A26", edge = "#00D9FF", rough = 0.5, metal = 0.4 }) {
  const [w, h, d] = size;
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useEffect(() => () => { geo.dispose(); edges.dispose(); }, [geo, edges]);
  return (
    <group position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
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
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial map={tex} emissive={color} emissiveMap={tex} emissiveIntensity={0.7} />
      </mesh>
    </Float>
  );
}

// kept: Playground imports this
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

/* limb between two points (used for arms) */
const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

function placeLimb(mesh, a, b, thickness) {
  tmpDir.subVectors(b, a);
  const len = tmpDir.length();
  mesh.position.addVectors(a, b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
  mesh.scale.set(thickness, len, thickness);
}

/* ================= animated screens ================= */

const CODE = [
  ["#9D4EDD", "from django.db import models"],
  ["#A5A8B5", ""],
  ["#00D9FF", "class Project(models.Model):"],
  ["#F5F5F7", "    title = models.CharField(max_length=150)"],
  ["#F5F5F7", "    stack = models.CharField(max_length=300)"],
  ["#F5F5F7", "    featured = models.BooleanField()"],
  ["#A5A8B5", ""],
  ["#00F5D4", "    def __str__(self):"],
  ["#F5F5F7", "        return self.title"],
  ["#A5A8B5", ""],
  ["#00D9FF", "class ProjectList(ListAPIView):"],
  ["#F5F5F7", "    queryset = Project.objects.all()"],
  ["#F5F5F7", "    serializer_class = ProjectSerializer"],
  ["#A5A8B5", ""],
  ["#FF2E93", "# build. learn. explore."],
  ["#A5A8B5", ""],
];

const LOG = [
  ["#00F5D4", "$ python manage.py runserver"],
  ["#A5A8B5", "System check: 0 issues"],
  ["#A5A8B5", "Watching for file changes"],
  ["#F5F5F7", "GET /api/profile/ 200"],
  ["#F5F5F7", "GET /api/skills/ 200"],
  ["#F5F5F7", "GET /api/projects/ 200"],
  ["#00D9FF", "POST /api/contact/ 201"],
  ["#F5F5F7", "GET /api/experience/ 200"],
  ["#FF2E93", "Quit with CONTROL-C."],
  ["#A5A8B5", ""],
];

const MAIN_OPTS = { rate: 1.1, fontPx: 20, lineH: 28, rows: 9, title: "views.py" };
const SIDE_OPTS = { rate: 0.8, fontPx: 16, lineH: 26, rows: 17, title: "terminal" };

function makeScreen(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { canvas, ctx: canvas.getContext("2d"), tex };
}

function drawLines(s, lines, t, { rate, fontPx, lineH, rows, title }) {
  const { ctx, canvas: c } = s;
  ctx.fillStyle = "#0b0d16";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#171a26";
  ctx.fillRect(0, 0, c.width, 34);
  ["#FF2E93", "#FFD43B", "#00F5D4"].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(18 + i * 20, 17, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#A5A8B5";
  ctx.font = `${fontPx - 6}px monospace`;
  ctx.fillText(title, 90, 22);

  ctx.font = `${fontPx}px monospace`;
  const pos = t * rate;
  const base = Math.floor(pos);
  const frac = pos - base;
  for (let r = 0; r < rows; r++) {
    const [color, text] = lines[(base + r) % lines.length];
    const last = r === rows - 1;
    const shown = last ? text.slice(0, Math.floor(text.length * frac)) : text;
    const y = 70 + r * lineH;
    ctx.fillStyle = color;
    ctx.fillText(shown, 16, y);
    if (last && Math.floor(t * 3) % 2 === 0) {
      const x = 16 + ctx.measureText(shown).width + 2;
      ctx.fillStyle = "#00D9FF";
      ctx.fillRect(x, y - fontPx * 0.8, fontPx * 0.5, fontPx);
    }
  }
  s.tex.needsUpdate = true;
}

/* ================= furniture ================= */

function Monitor({ position, rotY = 0, size, map, neckH, edge = "#00D9FF" }) {
  const [w, h] = size;
  return (
    <group position={position} rotation-y={rotY}>
      <NeonBox size={[w, h, 0.08]} color="#0b0d16" edge={edge} />
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[w - 0.12, h - 0.12]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - neckH / 2, -0.04]}>
        <boxGeometry args={[0.12, neckH, 0.08]} />
        <meshStandardMaterial color="#10121C" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -h / 2 - neckH + 0.015, 0.1]}>
        <boxGeometry args={[0.55, 0.03, 0.35]} />
        <meshStandardMaterial color="#10121C" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function RgbStrip({ position, size }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.color.setHSL((state.clock.elapsedTime * 0.1) % 1, 1, 0.55);
  });
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial ref={ref} color="#FF2E93" />
    </mesh>
  );
}

function Lamp({ position }) {
  const dark = { color: "#10121C", metalness: 0.6, roughness: 0.4 };
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 16]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.74, 8]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      <group position={[-0.12, 0.75, 0.08]} rotation={[0, 0, -0.35]}>
        <mesh>
          <boxGeometry args={[0.42, 0.06, 0.2]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, -0.035, 0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[0.38, 0.16]} />
          <meshBasicMaterial color="#ffd9a0" />
        </mesh>
        <pointLight position={[0, -0.25, 0]} intensity={8} distance={5} color="#ffb86b" />
      </group>
    </group>
  );
}

function Steam({ position, reduced }) {
  const refs = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const p = reduced ? 0.3 : (t * 0.35 + i / 3) % 1;
      m.position.set(Math.sin(t * 2 + i) * 0.03, p * 0.45, 0);
      m.material.opacity = (1 - p) * 0.5;
      m.scale.setScalar(0.5 + p);
    });
  });
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Mug({ position, reduced }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.09, 0.18, 16]} />
        <meshStandardMaterial color="#FF2E93" emissive="#FF2E93" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <torusGeometry args={[0.05, 0.015, 8, 16]} />
        <meshStandardMaterial color="#FF2E93" />
      </mesh>
      <Steam position={[0, 0.12, 0]} reduced={reduced} />
    </group>
  );
}

function Cactus({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.1, 12]} />
        <meshStandardMaterial color="#9D4EDD" flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.055, 0.2, 10]} />
        <meshStandardMaterial color="#00F5D4" emissive="#00F5D4" emissiveIntensity={0.2} flatShading />
      </mesh>
      <mesh position={[0.07, 0.2, 0]}>
        <boxGeometry args={[0.06, 0.05, 0.05]} />
        <meshStandardMaterial color="#00F5D4" flatShading />
      </mesh>
    </group>
  );
}

function Poster({ text, color, position, rotY }) {
  const tex = useMemo(() => makeLabelTexture(text, { fg: color }), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position} rotation-y={rotY}>
      <planeGeometry args={[1.1, 1.1]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function NeonSign({ text, color, position, size }) {
  const tex = useMemo(() => makeSignTexture(text, color), [text, color]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/* ================= programmer ================= */

function Arm({ side, reduced, mat, skin }) {
  const upper = useRef();
  const fore = useRef();
  const hand = useRef();
  const S = useMemo(() => new THREE.Vector3(side * 0.38, 1.35, -0.04), [side]);
  const E = useMemo(() => new THREE.Vector3(side * 0.42, 1.05, -0.28), [side]);
  const H = useMemo(() => new THREE.Vector3(side * 0.2, 1.12, -0.85), [side]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const amp = reduced ? 0 : 0.5 + 0.5 * Math.sin(t * 1.3 + side);
    const tap = Math.max(0, Math.sin(t * (side > 0 ? 13 : 11) + side * 2)) * 0.035 * amp;
    tmpA.copy(H);
    tmpA.y += tap;
    tmpA.x += Math.sin(t * 3 + side) * 0.02 * amp;
    placeLimb(upper.current, S, E, 0.14);
    placeLimb(fore.current, E, tmpA, 0.12);
    hand.current.position.copy(tmpA);
  });

  return (
    <group>
      <mesh ref={upper}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh ref={fore}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh ref={hand}>
        <boxGeometry args={[0.13, 0.07, 0.15]} />
        <meshStandardMaterial {...skin} />
      </mesh>
    </group>
  );
}

function Programmer({ reduced }) {
  const head = useRef();
  const torso = useRef();

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    head.current.rotation.x = Math.sin(t * 0.9) * 0.04;
    head.current.rotation.y = Math.sin(t * 0.4) * 0.12;
    torso.current.rotation.x = -0.12 + Math.sin(t * 1.6) * 0.01;
  });

  const hoodie = { color: "#9D4EDD", emissive: "#9D4EDD", emissiveIntensity: 0.12, flatShading: true, roughness: 0.8 };
  const pants = { color: "#1a1d2e", flatShading: true, roughness: 0.8 };
  const skin = { color: "#e0b394", flatShading: true, roughness: 0.8 };
  const hair = { color: "#120d0a", flatShading: true, roughness: 0.9 };
  const shoe = { color: "#d9d9e3", flatShading: true, roughness: 0.6 };

  return (
    <group position={[0, 0, -0.7]}>
      {/* chair */}
      <NeonBox size={[0.9, 0.1, 0.9]} position={[0, 0.6, 0]} color="#12141f" edge="#FF2E93" />
      <NeonBox size={[0.8, 0.55, 0.08]} position={[0, 0.98, 0.48]} color="#12141f" edge="#FF2E93" />
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#10121C" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 5]} />
        <meshStandardMaterial color="#10121C" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.5, 0.015, 6, 5]} />
        <meshBasicMaterial color="#00D9FF" />
      </mesh>

      {/* legs */}
      <mesh position={[0, 0.72, -0.02]}>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial {...pants} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.17, 0.76, -0.28]}>
            <boxGeometry args={[0.24, 0.2, 0.62]} />
            <meshStandardMaterial {...pants} />
          </mesh>
          <mesh position={[s * 0.17, 0.4, -0.58]}>
            <boxGeometry args={[0.2, 0.55, 0.2]} />
            <meshStandardMaterial {...pants} />
          </mesh>
          <mesh position={[s * 0.17, 0.07, -0.64]}>
            <boxGeometry args={[0.22, 0.1, 0.34]} />
            <meshStandardMaterial {...shoe} />
          </mesh>
          <mesh position={[s * 0.17, 0.015, -0.64]}>
            <boxGeometry args={[0.23, 0.03, 0.35]} />
            <meshBasicMaterial color="#00D9FF" />
          </mesh>
        </group>
      ))}

      {/* torso */}
      <group ref={torso} position={[0, 1.08, 0]} rotation-x={-0.12}>
        <mesh>
          <boxGeometry args={[0.62, 0.75, 0.36]} />
          <meshStandardMaterial {...hoodie} />
        </mesh>
        <mesh position={[0, 0.42, 0.13]}>
          <boxGeometry args={[0.5, 0.2, 0.2]} />
          <meshStandardMaterial color="#7a3bb8" flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0.185]}>
          <boxGeometry args={[0.08, 0.5, 0.01]} />
          <meshBasicMaterial color="#00D9FF" />
        </mesh>
      </group>

      {/* head */}
      <group ref={head} position={[0, 1.62, -0.05]}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.16, 0.14, 0.16]} />
          <meshStandardMaterial {...skin} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.4, 0.42, 0.4]} />
          <meshStandardMaterial {...skin} />
        </mesh>
        <mesh position={[0, 0.06, 0.02]}>
          <boxGeometry args={[0.44, 0.32, 0.42]} />
          <meshStandardMaterial {...hair} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <torusGeometry args={[0.25, 0.025, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#171A26" metalness={0.6} roughness={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.25, 0.0, 0]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial color="#171A26" emissive="#00D9FF" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      <Arm side={-1} reduced={reduced} mat={hoodie} skin={skin} />
      <Arm side={1} reduced={reduced} mat={hoodie} skin={skin} />
    </group>
  );
}

/* ================= scene ================= */

export default function Workstation({ mobile, reduced }) {
  const group = useRef();
  const lightA = useRef();
  const lightB = useRef();
  const acc = useRef(0);

  const mainScreen = useMemo(() => makeScreen(800, 340), []);
  const sideScreen = useMemo(() => makeScreen(360, 520), []);

  useEffect(() => {
    drawLines(mainScreen, CODE, 3, MAIN_OPTS);
    drawLines(sideScreen, LOG, 2, SIDE_OPTS);
    return () => {
      mainScreen.tex.dispose();
      sideScreen.tex.dispose();
    };
  }, [mainScreen, sideScreen]);

  useFrame((state, dt) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;

    acc.current += dt;
    if (acc.current > 0.1) {
      acc.current = 0;
      drawLines(mainScreen, CODE, t, MAIN_OPTS);
      drawLines(sideScreen, LOG, t, SIDE_OPTS);
    }

    const { x, y } = state.pointer;
    const g = group.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.18, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.05, 0.05);

    lightA.current.color.setHSL(0.52 + Math.sin(t * 0.3) * 0.05, 1, 0.55);
    lightB.current.color.setHSL(0.78 + Math.cos(t * 0.25) * 0.05, 0.8, 0.55);
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight ref={lightA} position={[-4, 3.5, 3.5]} intensity={55} color="#00D9FF" />
      <pointLight ref={lightB} position={[4, 2.5, -1]} intensity={45} color="#9D4EDD" />
      <pointLight position={[0, 1.9, -1.9]} intensity={10} distance={6} color="#00D9FF" />

      <group ref={group}>
        {/* room */}
        <NeonBox size={[7.2, 0.2, 6]} position={[0, -0.1, 0]} color="#10121C" edge="#9D4EDD" />
        <NeonBox size={[3.2, 0.02, 2.6]} position={[0, 0.01, -0.5]} color="#171A26" edge="#00D9FF" />
        <NeonBox size={[7.2, 3.6, 0.15]} position={[0, 1.8, -3]} color="#10121C" edge="#2a2f48" />
        <NeonBox size={[0.15, 3.6, 6]} position={[-3.6, 1.8, 0]} color="#10121C" edge="#2a2f48" />
        <RgbStrip position={[0, 0.06, -2.9]} size={[7.1, 0.04, 0.04]} />
        <RgbStrip position={[-3.5, 0.06, 0]} size={[0.04, 0.04, 5.9]} />
        <NeonSign text="</DEV>" color="#FF2E93" position={[1.9, 3.1, -2.91]} size={[1.8, 0.45]} />
        <Poster text="Py" color="#00F5D4" position={[-3.51, 2.3, -0.6]} rotY={Math.PI / 2} />

        {/* desk */}
        <NeonBox size={[4.2, 0.12, 1.6]} position={[0, 1.0, -2.15]} color="#171A26" edge="#9D4EDD" />
        {[-2, 2].flatMap((x) =>
          [-1.45, -2.85].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.5, z]}>
              <boxGeometry args={[0.08, 1.0, 0.08]} />
              <meshStandardMaterial color="#10121C" metalness={0.6} roughness={0.4} />
            </mesh>
          ))
        )}

        {/* PC tower under desk */}
        <NeonBox size={[0.5, 0.85, 0.8]} position={[1.5, 0.45, -2.35]} color="#10121C" edge="#00D9FF" />
        <RgbStrip position={[1.5, 0.45, -1.945]} size={[0.05, 0.7, 0.01]} />
        <RgbStrip position={[1.755, 0.45, -2.35]} size={[0.01, 0.7, 0.5]} />

        {/* monitors */}
        <Monitor position={[0, 2.3, -2.6]} size={[2.6, 1.1]} map={mainScreen.tex} neckH={0.69} />
        <Monitor
          position={[-1.85, 2.15, -2.5]}
          rotY={0.5}
          size={[0.9, 1.3]}
          map={sideScreen.tex}
          neckH={0.44}
          edge="#9D4EDD"
        />

        {/* keyboard + mouse */}
        <mesh position={[0.2, 1.065, -1.6]}>
          <boxGeometry args={[1.6, 0.01, 0.6]} />
          <meshStandardMaterial color="#10121C" roughness={0.9} />
        </mesh>
        <NeonBox size={[1.1, 0.05, 0.38]} position={[-0.1, 1.1, -1.6]} color="#171A26" edge="#FF2E93" />
        <NeonBox size={[0.12, 0.04, 0.2]} position={[0.8, 1.09, -1.55]} color="#171A26" edge="#00D9FF" />

        {/* desk props */}
        <Lamp position={[1.75, 1.06, -2.6]} />
        <Mug position={[1.25, 1.15, -1.8]} reduced={reduced} />
        <Cactus position={[1.95, 1.06, -1.75]} />

        <Programmer reduced={reduced} />

        {/* floating tech badges */}
        <Badge text="PY" color="#00D9FF" position={[3.0, 2.7, -1.2]} />
        <Badge text="JS" color="#FFD43B" position={[3.1, 1.5, 0.8]} />
        <Badge text="DJ" color="#00F5D4" position={[2.4, 3.4, -2.0]} />
        <Badge text="{ }" color="#FF2E93" position={[-2.6, 1.8, 1.6]} />

        <Particles count={mobile ? 50 : 160} />
      </group>
    </>
  );
}