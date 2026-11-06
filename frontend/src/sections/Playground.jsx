import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { playgroundItems } from "../data/playground";

const PlaygroundScene = lazy(() => import("../three/PlaygroundScene"));

export default function Playground() {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mobile] = useState(() => window.innerWidth < 768);
  const [reduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // load + run scene only when near viewport
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "200px",
    });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const selected = playgroundItems.find((i) => i.id === selectedId);

  return (
    <section id="playground" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading num="05" label="PLAYGROUND" title="WELCOME TO MY DIGITAL PLAYGROUND." />

        <div
          ref={wrapRef}
          className="relative h-[420px] md:h-[560px] lg:h-[640px] bg-[#0b0d16] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{ borderTop: "2px solid #00D9FF" }}
        >
          {visible && (
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
                  LOADING PLAYGROUND...
                </div>
              }
            >
              <PlaygroundScene
                items={playgroundItems}
                selectedId={selectedId}
                onSelect={setSelectedId}
                mobile={mobile}
                reduced={reduced}
                visible={visible}
              />
            </Suspense>
          )}

          <p className="absolute top-3 left-4 font-mono text-[10px] tracking-[0.25em] text-muted pointer-events-none">
            {mobile ? "TAP AN OBJECT" : "DRAG TO ORBIT · CLICK AN OBJECT"}
          </p>

          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="absolute left-3 right-3 bottom-3 md:right-auto md:left-6 md:bottom-6 md:max-w-sm bg-card border p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                style={{ borderColor: selected.color }}
              >
                <button
                  onClick={() => setSelectedId(null)}
                  aria-label="Close"
                  className="absolute top-2 right-2 text-muted hover:text-text"
                >
                  <X size={16} />
                </button>
                <p className="font-mono text-[11px] tracking-[0.25em]" style={{ color: selected.color }}>
                  {selected.name.toUpperCase()}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{selected.fact}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* keyboard + touch friendly alternative */}
        <div className="mt-5 flex flex-wrap gap-2">
          {playgroundItems.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelectedId(i.id === selectedId ? null : i.id)}
              aria-pressed={i.id === selectedId}
              className="font-mono text-[11px] tracking-widest px-3 py-2 bg-card border transition-colors hover:bg-white/5"
              style={{
                borderColor: i.id === selectedId ? i.color : "rgba(255,255,255,0.1)",
                color: i.id === selectedId ? i.color : "#A5A8B5",
              }}
            >
              {i.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}