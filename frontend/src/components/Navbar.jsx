import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useActiveSection from "../hooks/useActiveSection";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "playground", label: "Playground" },
  { id: "game", label: "Game" },
  { id: "contact", label: "Contact" },
];
const IDS = NAV_ITEMS.map((n) => n.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg border-b border-white/10">
      <nav className="mx-auto max-w-7xl h-[72px] px-5 flex items-center justify-between">
        <a href="#home" className="font-tech text-xl font-extrabold tracking-wide">
          <span className="text-electric">&lt;/&gt;</span>{" "}
          <span className="text-neon">Dev</span>Port
        </a>

        {/* desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((n) => (
            <li key={n.id} className="relative">
              <a
                href={`#${n.id}`}
                className={`font-mono text-xs uppercase tracking-widest py-2 transition-colors ${
                  active === n.id ? "text-text" : "text-muted hover:text-electric"
                }`}
              >
                {n.label}
              </a>
              {active === n.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-electric to-neon"
                />
              )}
            </li>
          ))}
        </ul>

        {/* hamburger */}
        <button
          className="lg:hidden w-10 h-10 grid place-items-center"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="w-6 h-4 relative">
            <motion.span className="absolute left-0 h-[2px] w-full bg-electric"
              animate={open ? { top: "7px", rotate: 45 } : { top: "0px", rotate: 0 }} />
            <motion.span className="absolute left-0 top-[7px] h-[2px] w-full bg-electric"
              animate={{ opacity: open ? 0 : 1 }} />
            <motion.span className="absolute left-0 h-[2px] w-full bg-electric"
              animate={open ? { top: "7px", rotate: -45 } : { top: "14px", rotate: 0 }} />
          </div>
        </button>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-bg2 border-b border-white/10"
          >
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className={`block px-5 py-3 font-mono text-sm uppercase tracking-widest border-l-2 ${
                    active === n.id ? "border-electric text-text" : "border-transparent text-muted"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}