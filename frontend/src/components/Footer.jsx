export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg px-5 py-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] tracking-widest text-muted">
        <span>
          <span className="text-electric">&lt;/&gt;</span> DEVPORT
        </span>
        <span>© {new Date().getFullYear()} SANGAM PURI. BUILD. LEARN. EXPLORE.</span>
        <a href="#home" className="hover:text-electric transition-colors">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}