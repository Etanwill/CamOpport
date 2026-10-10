// src/components/code/TodaysChallengeIllustration.tsx
// Desktop monitor with code lines + a small potted plant, on a soft blob backdrop.
export default function TodaysChallengeIllustration() {
  return (
    <svg
      viewBox="0 0 280 220"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2433" />
          <stop offset="100%" stopColor="#151824" />
        </linearGradient>
        <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9bdf0" />
          <stop offset="100%" stopColor="#a996e6" />
        </linearGradient>
      </defs>

      {/* soft blurred blob backdrop */}
      <ellipse cx="165" cy="105" rx="112" ry="92" fill="#efeafb" />
      <ellipse cx="205" cy="60" rx="46" ry="38" fill="#f4f1fc" />

      {/* monitor shadow */}
      <ellipse cx="168" cy="196" rx="78" ry="8" fill="#e5e0f5" />

      {/* monitor stand */}
      <rect x="150" y="164" width="36" height="20" rx="4" fill="#c9c3e0" />
      <rect x="120" y="182" width="96" height="10" rx="5" fill="#b3abd6" />

      {/* monitor body */}
      <rect x="70" y="34" width="196" height="132" rx="14" fill="#e7e2f7" />
      <rect x="82" y="46" width="172" height="108" rx="8" fill="url(#screenGrad)" />

      {/* code lines on screen */}
      <g strokeLinecap="round" strokeWidth="4">
        <line x1="96" y1="64" x2="150" y2="64" stroke="#8b5cf6" />
        <line x1="96" y1="76" x2="176" y2="76" stroke="#22d3ee" />
        <line x1="108" y1="88" x2="150" y2="88" stroke="#fb923c" />
        <line x1="96" y1="100" x2="200" y2="100" stroke="#a78bfa" />
        <line x1="108" y1="112" x2="164" y2="112" stroke="#34d399" />
        <line x1="96" y1="124" x2="140" y2="124" stroke="#f472b6" />
        <line x1="96" y1="136" x2="188" y2="136" stroke="#818cf8" />
      </g>

      {/* webcam dot */}
      <circle cx="168" cy="40" r="2.5" fill="#9d94c4" />

      {/* potted plant, front-left of the monitor */}
      <g transform="translate(42 118)">
        <path d="M0 46 L8 76 L44 76 L52 46 Z" fill="url(#potGrad)" />
        <rect x="-3" y="40" width="58" height="10" rx="5" fill="#b3a4e8" />
        <path
          d="M26 40 C26 40 4 30 8 6 C22 12 26 26 26 40Z"
          fill="#5fae94"
        />
        <path
          d="M26 40 C26 40 48 28 46 4 C30 10 26 26 26 40Z"
          fill="#79c2a4"
        />
        <path
          d="M26 40 C26 40 14 18 26 -6 C36 16 30 32 26 40Z"
          fill="#8fd0b3"
        />
      </g>
    </svg>
  );
}