export default function SectionHeading({ num, label, title }) {
  return (
    <div className="relative mb-12">
      <span className="absolute -top-8 -left-2 font-tech text-[7rem] md:text-[10rem] font-extrabold leading-none text-white/[0.04] select-none">
        {num}
      </span>
      <p className="relative font-mono text-xs tracking-[0.3em] text-electric mb-3">// {label}</p>
      <h2 className="relative font-display text-4xl md:text-6xl font-bold uppercase leading-tight">
        {title}
      </h2>
    </div>
  );
}