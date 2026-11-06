
import { Pause, Play, RotateCcw, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

const stop = (e) => e.stopPropagation();

function Stat({ label, value, color }) {
  return (
    <div className="bg-card border border-white/10 px-3 py-1.5">
      <p className="font-mono text-[9px] tracking-[0.25em] text-muted">{label}</p>
      <p className="font-tech text-lg font-bold leading-tight" style={{ color }}>{value}</p>
    </div>
  );
}

function Overlay({ children, dim = true }) {
  return (
    <div className={`absolute inset-0 grid place-items-center p-4 ${dim ? "bg-black/60" : ""}`}>
      {children}
    </div>
  );
}

const panel =
  "bg-card border border-electric/60 p-6 max-w-md w-full text-center shadow-[0_24px_48px_rgba(0,0,0,0.7)]";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 bg-electric text-bg font-display font-bold text-sm tracking-widest px-8 py-3 hover:bg-cyan transition-colors";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 border border-neon text-text font-display font-bold text-sm tracking-widest px-6 py-3 hover:bg-neon/20 transition-colors";

export function Hud({ score, best, coins, onPause }) {
  return (
    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
      <div className="flex flex-wrap gap-2">
        <Stat label="SCORE" value={score} color="#00D9FF" />
        <Stat label="BEST" value={best} color="#9D4EDD" />
        <Stat label="COINS" value={coins} color="#FFD43B" />
      </div>
      <button
        onClick={onPause}
        onTouchStart={stop}
        onTouchEnd={stop}
        aria-label="Pause"
        className="pointer-events-auto bg-card border border-white/20 p-2.5 hover:border-electric transition-colors"
      >
        <Pause size={18} />
      </button>
    </div>
  );
}

export function MenuOverlay({ best, onStart }) {
  return (
    <Overlay>
      <div className={panel}>
        <h3 className="font-tech text-xl md:text-2xl font-extrabold leading-tight">
          CYBER RUNNER<span className="block text-electric text-sm md:text-base mt-1">ESCAPE THE GRID.</span>
        </h3>
        <p className="mt-3 text-sm text-muted">Dodge obstacles. Collect energy coins. Survive.</p>
        <p className="mt-2 font-mono text-[11px] tracking-widest text-neon">BEST: {best}</p>
        <button onClick={onStart} className={`${primaryBtn} mt-5`}>
          <Play size={16} /> START
        </button>
        <div className="mt-5 grid grid-cols-2 gap-3 text-left font-mono text-[10px] text-muted leading-relaxed">
          <div>
            <p className="text-electric mb-1">DESKTOP</p>
            SPACE / ↑ jump<br />← → lanes<br />ESC pause<br />ENTER restart
          </div>
          <div>
            <p className="text-electric mb-1">MOBILE</p>
            Tap jump<br />Swipe ← → lanes<br />Or use buttons
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export function Countdown({ n }) {
  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none">
      <span className="font-tech text-8xl font-extrabold text-electric drop-shadow-[0_0_24px_rgba(0,217,255,0.8)]">
        {n}
      </span>
    </div>
  );
}

export function PauseOverlay({ onResume, onRestart }) {
  return (
    <Overlay>
      <div className={panel}>
        <h3 className="font-tech text-2xl font-extrabold">PAUSED</h3>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={onResume} className={primaryBtn}>
            <Play size={16} /> RESUME
          </button>
          <button onClick={onRestart} className={ghostBtn}>
            <RotateCcw size={16} /> RESTART
          </button>
        </div>
      </div>
    </Overlay>
  );
}



export function GameOverOverlay({ score, coins, best, isNewBest, onRestart }) {
  return (
    <Overlay>
      <div className={`${panel} border-hot/70`}>
        <h3 className="font-tech text-2xl font-extrabold text-hot">GAME OVER</h3>
        {isNewBest && <p className="mt-1 font-mono text-[11px] tracking-widest text-cyan">NEW BEST!</p>}
        <p className="mt-4 font-tech text-5xl font-extrabold text-electric">{score}</p>
        <p className="font-mono text-[11px] tracking-widest text-muted mt-1">
          COINS {coins} · BEST {best}
        </p>
        <button onClick={onRestart} className={`${primaryBtn} mt-6`}>
          <RotateCcw size={16} /> PLAY AGAIN
        </button>
        <p className="mt-3 hidden md:block font-mono text-[10px] tracking-widest text-muted">
          OR PRESS ENTER
        </p>
      </div>
    </Overlay>
  );
}




export function TouchControls({ onLeft, onJump, onRight }) {
  const btn =
    "flex-1 grid place-items-center py-5 bg-card border border-white/15 active:bg-electric/20 active:border-electric select-none touch-none";
  const down = (fn) => (e) => {
    e.preventDefault();
    fn();
  };
  return (
    <div className="mt-4 flex gap-3 md:hidden">
      <button className={btn} onPointerDown={down(onLeft)} aria-label="Move left">
        <ChevronLeft size={28} />
      </button>
      <button className={btn} onPointerDown={down(onJump)} aria-label="Jump">
        <ChevronUp size={28} />
      </button>
      <button className={btn} onPointerDown={down(onRight)} aria-label="Move right">
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

