import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import Workstation from "./Workstation";

export default function HeroScene({ mobile, reduced, visible }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 2]}
      frameloop={visible ? "always" : "never"}
      gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
    >
      <OrthographicCamera
        makeDefault
        position={[8, 6, 8]}
        zoom={mobile ? 36 : 58}
        near={0.1}
        far={100}
        onUpdate={(c) => c.lookAt(0, 1.2, -0.4)}
      />
      <Workstation mobile={mobile} reduced={reduced} />
    </Canvas>
  );
}