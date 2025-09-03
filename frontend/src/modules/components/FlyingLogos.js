import React, { useEffect, useMemo } from "react";

export default function FlyingLogos({
  src = `${process.env.PUBLIC_URL || ""}/stimpyper_logo.png`,
  count = 20,
  minSize = 40,
  maxSize = 120,
  minDrift = 14,
  maxDrift = 28,
  minSpin = 10,
  maxSpin = 20,
}) {
  // Inject styles once
  useEffect(() => {
    const id = "flying-logos-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .logo-field { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
      .logo-wrapper { position: absolute; will-change: transform; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
      .flying-logo { display: block; height: auto; will-change: transform; user-select: none; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.15)); animation-timing-function: linear; animation-iteration-count: infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      /* Drift variants (translate only). Rotation is handled on the <img> */
      @keyframes drift1 { 0% { transform: translate(0,0);} 50% { transform: translate(140px, -60px);} 100% { transform: translate(0,0);} }
      @keyframes drift2 { 0% { transform: translate(0,0);} 50% { transform: translate(-160px, 80px);} 100% { transform: translate(0,0);} }
      @keyframes drift3 { 0% { transform: translate(0,0);} 25% { transform: translate(100px, 30px);} 50% { transform: translate(180px, -40px);} 75% { transform: translate(100px, 50px);} 100% { transform: translate(0,0);} }
      @keyframes drift4 { 0% { transform: translate(0,0);} 50% { transform: translate(-120px, -100px);} 100% { transform: translate(0,0);} }
      @keyframes drift5 { 0% { transform: translate(0,0);} 50% { transform: translate(60px, 120px);} 100% { transform: translate(0,0);} }
      @keyframes drift6 { 0% { transform: translate(0,0);} 33% { transform: translate(-80px, 40px);} 66% { transform: translate(80px, -90px);} 100% { transform: translate(0,0);} }

      .logo-wrapper.drift1 { animation-name: drift1; }
      .logo-wrapper.drift2 { animation-name: drift2; }
      .logo-wrapper.drift3 { animation-name: drift3; }
      .logo-wrapper.drift4 { animation-name: drift4; }
      .logo-wrapper.drift5 { animation-name: drift5; }
      .logo-wrapper.drift6 { animation-name: drift6; }

      @media (prefers-reduced-motion: reduce) {
        .logo-wrapper, .flying-logo { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const items = useMemo(() => {
    const rnd = (min, max) => Math.round(min + Math.random() * (max - min));
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    return Array.from({ length: count }).map((_, i) => {
      const size = rnd(minSize, maxSize);
      const top = clamp(Math.random() * 100, 2, 98);   // keep inside viewport
      const left = clamp(Math.random() * 100, 2, 98);
      const driftDur = rnd(minDrift, maxDrift);
      const spinDur = rnd(minSpin, maxSpin);
      const delay = -Math.random() * driftDur; // start mid-path for variety
      const variant = 1 + Math.floor(Math.random() * 6);
      const opacity = 0.6 + Math.random() * 0.35;
      return { id: i, size, top, left, driftDur, spinDur, delay, variant, opacity };
    });
  }, [count, minSize, maxSize, minDrift, maxDrift, minSpin, maxSpin]);

  return (
    <div className="logo-field" aria-hidden>
      {items.map((it) => (
        <div
          key={it.id}
          className={`logo-wrapper drift${it.variant}`}
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            animationDuration: `${it.driftDur}s`,
            animationDelay: `${it.delay}s`,
          }}
        >
          <img
            src={src}
            alt=""
            className="flying-logo"
            style={{
              width: it.size,
              opacity: it.opacity,
              animationName: "spin",
              animationDuration: `${it.spinDur}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
