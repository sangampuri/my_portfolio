import { useState } from "react";

export default function Envelope({ open = false }) {
  const [hover, setHover] = useState(false);
  const isOpen = open || hover;

  return (
    <div
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="relative w-64 h-44 mx-auto mt-16 [perspective:900px] drop-shadow-[0_0_24px_rgba(0,217,255,0.35)]"
      aria-hidden="true"
    >
      {/* back */}
      <div className="absolute inset-0 bg-bg2 border border-electric/60" />

      {/* letter */}
      <div
        className="absolute left-4 right-4 bottom-3 h-28 bg-card border border-neon/70 p-3 transition-transform duration-700 z-10"
        style={{ transform: isOpen ? "translateY(-70px)" : "translateY(0)" }}
      >
        <div className="h-2 w-2/3 bg-electric/70 mb-2" />
        <div className="h-1.5 w-full bg-white/15 mb-1.5" />
        <div className="h-1.5 w-5/6 bg-white/15 mb-1.5" />
        <div className="h-1.5 w-4/6 bg-white/15" />
      </div>

      {/* front pocket */}
      <div
        className="absolute inset-0 z-20 bg-gradient-to-br from-[#1f2336] to-[#12141f]"
        style={{ clipPath: "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)" }}
      />

      {/* flap */}
      <div
        className="absolute top-0 left-0 right-0 h-[58%] origin-top bg-gradient-to-b from-[#2a2f48] to-[#1a1d2e] transition-transform duration-700"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
          zIndex: isOpen ? 5 : 30,
        }}
      />
    </div>
  );
}