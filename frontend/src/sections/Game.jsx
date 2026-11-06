import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { createState, resetState, jump, moveLane } from "../game/gameLogic";
import {
  Hud, MenuOverlay, Countdown, PauseOverlay, GameOverOverlay, TouchControls,
} from "../game/GameUI";

const GameScene = lazy(() => import("../game/GameScene"));

const loadBest = () => {
  try {
    return Number(localStorage.getItem("devport.best")) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (n) => {
  try {
    localStorage.setItem("devport.best", String(n));
  } catch {
    /* ignore */
  }
};

export default function Game() {
  const wrapRef = useRef(null);
  const gameRef = useRef(null);
  if (gameRef.current === null) gameRef.current = createState();
  const statusRef = useRef("initial");
  const visibleRef = useRef(false);
  const bestRef = useRef(loadBest());
  const touchRef = useRef(null);

  // initial | ready | playing | paused | over
  const [status, setStatusState] = useState("initial");
  const [hud, setHud] = useState({ score: 0, coins: 0 });
  const [best, setBest] = useState(bestRef.current);
  const [isNewBest, setIsNewBest] = useState(false);
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobile] = useState(() => window.innerWidth < 768);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const setStatus = useCallback((s) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  /* ----- actions ----- */
  const start = useCallback(() => {
    resetState(gameRef.current);
    setHud({ score: 0, coins: 0 });
    setIsNewBest(false);
    setCount(3);
    setStatus("ready");
  }, [setStatus]);

  const pause = useCallback(() => {
    if (statusRef.current === "playing") setStatus("paused");
  }, [setStatus]);

  const resume = useCallback(() => {
    if (statusRef.current === "paused") setStatus("playing");
  }, [setStatus]);

  const onHud = useCallback((score, coins) => setHud({ score, coins }), []);

  const onCrash = useCallback(() => {
    const g = gameRef.current;
    setHud({ score: g.score, coins: g.coins });
    const isNew = g.score > bestRef.current;
    if (isNew) {
      bestRef.current = g.score;
      saveBest(g.score);
      setBest(g.score);
    }
    setIsNewBest(isNew);
    setStatus("over");
  }, [setStatus]);

  const doJump = useCallback(() => {
    if (statusRef.current === "playing") jump(gameRef.current);
  }, []);
  const doLane = useCallback((dir) => {
    if (statusRef.current === "playing") moveLane(gameRef.current, dir);
  }, []);

  /* ----- countdown: 3, 2, 1 -> playing ----- */
  useEffect(() => {
    if (status !== "ready") return;
    let n = 3;
    setCount(3);
    const id = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(id);
        setStatus("playing");
      } else {
        setCount(n);
      }
    }, 800);
    return () => clearInterval(id);
  }, [status, setStatus]);

  /* ----- visibility: load once, run only while on screen ----- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { threshold: 0.25 }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    visibleRef.current = visible;
    if (!visible && statusRef.current === "playing") setStatus("paused");
  }, [visible, setStatus]);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden && statusRef.current === "playing") setStatus("paused");
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [setStatus]);

  /* ----- keyboard ----- */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!visibleRef.current) return; // never steal keys while game is off-screen

      const st = statusRef.current;
      const k = e.code;

      if (st === "initial") {
        if (k === "Enter") {
          e.preventDefault();
          start();
        }
        return;
      }

      if (st === "playing") {
        if (k === "Space" || k === "ArrowUp" || k === "KeyW") {
          e.preventDefault();
          doJump();
          return;
        }
        if (k === "ArrowLeft" || k === "KeyA") {
          e.preventDefault();
          doLane(-1);
          return;
        }
        if (k === "ArrowRight" || k === "KeyD") {
          e.preventDefault();
          doLane(1);
          return;
        }
        if (k === "Escape") {
          pause();
          return;
        }
      }

      if (st === "paused" && k === "Escape") {
        resume();
        return;
      }
      if (k === "Enter" && st !== "ready") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, pause, resume, doJump, doLane]);

  /* ----- touch: tap = jump, swipe = lane ----- */
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s || statusRef.current !== "playing") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) doLane(dx > 0 ? 1 : -1);
    else if (dy < -30) doJump();
    else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) doJump();
  };

  return (
    <section id="game" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading num="06" label="GAME" title="CYBER RUNNER: ESCAPE THE GRID." />

        <div
          ref={wrapRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: status === "playing" ? "none" : "pan-y", borderTop: "2px solid #FF2E93" }}
          className="relative h-[440px] md:h-[560px] lg:h-[640px] bg-[#08090F] border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] select-none"
        >
          {mounted && (
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
                  LOADING GRID...
                </div>
              }
            >
              <GameScene
                gameRef={gameRef}
                statusRef={statusRef}
                onCrash={onCrash}
                onHud={onHud}
                mobile={mobile}
                reduced={reduced}
                visible={visible}
              />
            </Suspense>
          )}

          {(status === "playing" || status === "paused") && (
            <Hud score={hud.score} best={best} coins={hud.coins} onPause={pause} />
          )}
          {status === "initial" && <MenuOverlay best={best} onStart={start} />}
          {status === "ready" && <Countdown n={count} />}
          {status === "paused" && <PauseOverlay onResume={resume} onRestart={start} />}
          {status === "over" && (
            <GameOverOverlay
              score={hud.score}
              coins={hud.coins}
              best={best}
              isNewBest={isNewBest}
              onRestart={start}
            />
          )}
        </div>

        <TouchControls onLeft={() => doLane(-1)} onJump={doJump} onRight={() => doLane(1)} />
      </div>
    </section>
  );
}