import { useRef } from "react";

export default function useTilt(max = 10) {
  const ref = useRef(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(700px) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
  };
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return { ref, onPointerMove, onPointerLeave };
}