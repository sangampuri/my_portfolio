const mono = "JetBrains Mono, monospace";

function Students() {
  return (
    <g>
      <rect x="40" y="30" width="320" height="200" fill="#10121c" stroke="#00D9FF" />
      <rect x="40" y="30" width="320" height="30" fill="#171a26" />
      <text x="56" y="50" fill="#00D9FF" fontSize="12" fontFamily={mono}>STUDENTS</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(60 ${78 + i * 36})`}>
          <circle cx="10" cy="10" r="10" fill="#9D4EDD" />
          <rect x="34" y="3" width="120" height="8" fill="#A5A8B5" opacity=".6" />
          <rect x="34" y="16" width="70" height="6" fill="#A5A8B5" opacity=".3" />
          <rect x="230" y="2" width="30" height="16" fill="none" stroke="#00F5D4" />
          <rect x="270" y="2" width="30" height="16" fill="none" stroke="#FF2E93" />
        </g>
      ))}
    </g>
  );
}

function Books() {
  const books = [
    { x: 90, h: 110, c: "#9D4EDD" },
    { x: 130, h: 140, c: "#00D9FF" },
    { x: 170, h: 95, c: "#FF2E93" },
    { x: 210, h: 125, c: "#00F5D4" },
  ];
  return (
    <g>
      <rect x="40" y="200" width="320" height="8" fill="#171a26" stroke="#9D4EDD" />
      {books.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={200 - b.h} width="36" height={b.h} fill="#171a26" stroke={b.c} strokeWidth="2" />
          <rect x={b.x + 6} y={200 - b.h + 14} width="24" height="4" fill={b.c} />
          <rect x={b.x + 6} y={200 - b.h + 24} width="16" height="4" fill={b.c} opacity=".5" />
        </g>
      ))}
      <g transform="rotate(18 270 200)">
        <rect x="255" y="95" width="36" height="105" fill="#171a26" stroke="#FFD43B" strokeWidth="2" />
      </g>
    </g>
  );
}

function Api() {
  return (
    <g fontFamily={mono}>
      <text x="200" y="130" textAnchor="middle" fontSize="96" fill="none" stroke="#00F5D4" strokeWidth="2">
        {"{ }"}
      </text>
      <text x="40" y="190" fill="#00D9FF" fontSize="16">GET /api/students/</text>
      <text x="40" y="214" fill="#A5A8B5" fontSize="13">200 OK · application/json</text>
    </g>
  );
}

function Banquet() {
  return (
    <g>
      <path d="M120 210 V110 A80 80 0 0 1 280 110 V210" fill="none" stroke="#FF2E93" strokeWidth="3" />
      <line x1="200" y1="20" x2="200" y2="64" stroke="#FFD43B" />
      <circle cx="200" cy="76" r="12" fill="none" stroke="#FFD43B" strokeWidth="2" />
      {[-40, -20, 20, 40].map((dx) => (
        <line key={dx} x1="200" y1="76" x2={200 + dx} y2="110" stroke="#FFD43B" opacity=".5" />
      ))}
      {[110, 200, 290].map((cx, i) => (
        <ellipse key={cx} cx={cx} cy={i === 1 ? 235 : 225} rx="36" ry="10" fill="#171a26" stroke="#00D9FF" />
      ))}
    </g>
  );
}

const ARTS = { students: Students, books: Books, api: Api, banquet: Banquet };

export default function ProjectArt({ name }) {
  const Art = ARTS[name] ?? Api;
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${name} illustration`}>
      <rect width="400" height="260" fill="#0b0d16" />
      <Art />
    </svg>
  );
}