// src/components/code/HeroIllustration.tsx
// Decorative sunset-mountain-hiker scene used behind the "100 Days of Code" hero.
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 900 500"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe9fb" />
          <stop offset="45%" stopColor="#f3dfe6" />
          <stop offset="75%" stopColor="#f7d9c8" />
          <stop offset="100%" stopColor="#efc9c9" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe3c2" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffe3c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9cdf3" />
          <stop offset="100%" stopColor="#c3b4ea" />
        </linearGradient>
        <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6a3e2" />
          <stop offset="100%" stopColor="#9d87d6" />
        </linearGradient>
        <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8e79c9" />
          <stop offset="100%" stopColor="#6f5aa8" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="900" height="500" fill="url(#sky)" />

      {/* sun */}
      <circle cx="620" cy="255" r="120" fill="url(#sunGlow)" />
      <circle cx="620" cy="255" r="46" fill="#fff3da" opacity="0.9" />

      {/* birds */}
      <g stroke="#4c3d78" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55">
        <path d="M420 95 q8 -10 16 0 q8 -10 16 0" />
        <path d="M460 120 q7 -9 14 0 q7 -9 14 0" />
        <path d="M395 135 q6 -8 12 0 q6 -8 12 0" />
      </g>

      {/* back mountain range */}
      <path
        d="M0 330 L90 230 L170 300 L250 200 L330 300 L420 240 L520 320 L610 250 L700 320 L790 260 L900 330 L900 500 L0 500 Z"
        fill="url(#mtn1)"
        opacity="0.9"
      />

      {/* mid mountain range */}
      <path
        d="M0 380 L120 280 L210 350 L300 260 L400 360 L500 290 L620 370 L720 300 L820 360 L900 320 L900 500 L0 500 Z"
        fill="url(#mtn2)"
      />

      {/* pine trees, right cluster (behind hiker rock) */}
      <g fill="#5b4a95" opacity="0.85">
        {[[700, 360, 1], [730, 375, 0.85], [760, 355, 1.1], [790, 380, 0.75], [820, 360, 0.95], [850, 385, 0.7], [660, 380, 0.8]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <polygon points="0,-46 14,-16 5,-16 18,10 7,10 22,34 -22,34 -7,10 -18,10 -5,-16 -14,-16" />
          </g>
        ))}
      </g>

      {/* front mountain / cliff range */}
      <path
        d="M0 430 L100 350 L190 410 L260 330 L340 420 L430 340 L520 430 L600 360 L680 420 L780 350 L900 410 L900 500 L0 500 Z"
        fill="url(#mtn3)"
      />

      {/* foreground pine trees, front-right */}
      <g fill="#3f346f">
        {[[705, 430, 1.3], [745, 455, 1.05], [790, 425, 1.4], [840, 458, 1.1], [870, 420, 1.2]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <polygon points="0,-52 16,-18 6,-18 20,12 8,12 26,40 -26,40 -8,12 -20,12 -6,-18 -16,-18" />
          </g>
        ))}
      </g>

      {/* hiker rock outcrop */}
      <path d="M540 500 L560 420 L640 400 L700 430 L740 500 Z" fill="#5c4a92" />

      {/* hiker figure */}
      <g transform="translate(636 340)">
        {/* walking stick */}
        <line x1="-34" y1="-10" x2="-34" y2="78" stroke="#3a3060" strokeWidth="4" strokeLinecap="round" />
        {/* legs */}
        <path d="M-6 55 L-14 100 M8 55 L14 100" stroke="#1f1b33" strokeWidth="10" strokeLinecap="round" />
        {/* boots */}
        <path d="M-20 100 L-8 100 M6 100 L18 100" stroke="#141225" strokeWidth="10" strokeLinecap="round" />
        {/* backpack */}
        <rect x="-6" y="-4" width="26" height="40" rx="8" fill="#4c3d78" />
        {/* torso / hoodie */}
        <path d="M-18 -8 Q0 -30 20 -8 L24 56 Q0 66 -22 56 Z" fill="#7c3aed" />
        {/* arm holding stick */}
        <path d="M-16 -2 Q-30 10 -34 30" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* arm resting */}
        <path d="M20 0 Q30 14 22 34" stroke="#6d28d9" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* head */}
        <circle cx="2" cy="-38" r="14" fill="#3a2c1a" />
        {/* beanie */}
        <path d="M-12 -42 Q2 -62 16 -42 Q16 -48 2 -50 Q-12 -48 -12 -42Z" fill="#1f2937" />
      </g>
    </svg>
  );
}