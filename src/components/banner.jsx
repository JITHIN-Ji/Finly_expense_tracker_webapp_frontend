import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TOKENS = {
  paper: "#FFFFFF",
  mist: "#EAF9F0",
  mint50: "#DFF6E8",
  mint: "#5FD088",
  mintDark: "#1E9E5C",
  mintDeep: "#0D3D25",
  ink: "#0E1F17",
  inkSoft: "#5B6B62",
  gold: "#E0A93A",
};

const IconPlay = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M5 3.5v17a1 1 0 0 0 1.53.85l14-8.5a1 1 0 0 0 0-1.7l-14-8.5A1 1 0 0 0 5 3.5z" />
  </svg>
);
const IconApple = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.36 1.5c.1 1.1-.32 2.17-1 2.96-.7.82-1.85 1.46-2.93 1.38-.13-1.06.4-2.18 1.03-2.9.71-.83 1.96-1.45 2.9-1.44zM20.6 17.2c-.4.94-.87 1.8-1.5 2.6-.85 1.1-1.55 1.86-2.63 1.88-1.04.02-1.38-.66-2.58-.66-1.2 0-1.57.64-2.57.68-1.05.04-1.85-1.05-2.7-2.14-1.48-1.9-2.62-5.37-1.1-7.72.76-1.16 2.1-1.9 3.55-1.92 1-.02 1.94.67 2.55.67.6 0 1.75-.83 2.94-.71.5.02 1.9.2 2.8 1.5-.07.04-1.67.98-1.65 2.9.02 2.3 2.02 3.06 2.04 3.07-.02.06-.3 1.05-1 2.05z" />
  </svg>
);
const IconGlobe = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </svg>
);

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const Coin = ({ size = 56, symbol = "₹", bg, color = "#fff", className = "", style = {} }) => (
  <div
    aria-hidden
    className={`coin-wrap ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="coin-ring" />
    <div
      className="coin-face"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.4,
        boxShadow: "0 14px 26px -8px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {symbol}
    </div>
  </div>
);

export default function Banner() {
  const [ref, visible] = useReveal();

  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6 md:px-10" style={{ color: TOKENS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        .banner-panel { opacity: 0; transform: translateY(28px) scale(0.98); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
        .banner-in { opacity: 1 !important; transform: none !important; }

        @keyframes panelGradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .panel-gradient { background-size: 200% 200%; animation: panelGradient 10s ease-in-out infinite; }

        /* staggered inner content, chained after panel lands */
        .stagger-item { opacity: 0; transform: translateY(16px); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }
        .stagger-in { opacity: 1; transform: none; }

        .cta-btn { transition: transform .18s ease, box-shadow .18s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 28px -10px rgba(0,0,0,0.35); }

        /* shimmer sweep across panel, one pass, professional not gimmicky */
        .shimmer-sweep {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%);
          background-size: 250% 100%;
          background-position: 130% 0;
          transition: background-position 1.4s cubic-bezier(.22,1,.36,1);
        }
        .shimmer-in { background-position: -30% 0; }

        @keyframes coinDriftA { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-12px) rotate(6deg); } }
        @keyframes coinDriftB { 0%,100% { transform: translateY(0) rotate(5deg); } 50% { transform: translateY(-16px) rotate(-8deg); } }
        .coin-drift-a .coin-face { animation: coinDriftA 6s ease-in-out infinite; }
        .coin-drift-b .coin-face { animation: coinDriftB 7.4s ease-in-out infinite; }

        .coin-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
        .coin-face { display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; }
        @keyframes ringPulse { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.7); opacity: 0; } }
        .coin-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          animation: ringPulse 2.6s ease-out infinite;
        }

        @keyframes budgetFloat { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-18px) rotate(3deg); } }
        .budget-art { animation: budgetFloat 6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .banner-panel, .stagger-item { opacity: 1 !important; transform: none !important; transition: none !important; }
          .panel-gradient { animation: none; }
          .shimmer-sweep { display: none; }
          .coin-drift-a .coin-face, .coin-drift-b .coin-face, .coin-ring { animation: none; }
          .budget-art { animation: none; }
        }
      `}</style>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(200deg, ${TOKENS.paper} 0%, ${TOKENS.mist} 50%, ${TOKENS.paper} 100%)` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(${TOKENS.mintDark}22 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.35) 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className={`banner-panel panel-gradient relative max-w-6xl mx-auto rounded-[32px] px-8 md:px-16 py-14 md:py-20 overflow-hidden ${visible ? "banner-in" : ""}`}
        style={{
          backgroundImage: `linear-gradient(115deg, ${TOKENS.mintDeep} 0%, ${TOKENS.mintDark} 50%, ${TOKENS.mintDeep} 100%)`,
          boxShadow: "0 30px 60px -20px rgba(13,61,37,0.45)",
        }}
      >
        <div className={`shimmer-sweep ${visible ? "shimmer-in" : ""}`} />

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: "24px 24px" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full"
          style={{ background: TOKENS.mint, opacity: 0.25, filter: "blur(90px)" }}
        />

        <Coin
          size={56}
          bg={`linear-gradient(155deg, #F3C868 0%, ${TOKENS.gold} 100%)`}
          className="coin-drift-a hidden md:flex pointer-events-none absolute top-8 right-16"
        />
        <Coin
          size={36}
          bg={`linear-gradient(155deg, ${TOKENS.mint} 0%, #eafff2 130%)`}
          color={TOKENS.mintDeep}
          className="coin-drift-b hidden md:flex pointer-events-none absolute bottom-10 right-40"
        />

        {/* budget art — marked right-side spot */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden md:block"
          style={{ top: "50%", right: "6%", transform: "translateY(-50%)", width: 280, height: 280 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${TOKENS.mint}55 0%, transparent 70%)`, filter: "blur(10px)" }}
          />
          <img
            src="/budget.png"
            alt=""
            className="budget-art relative w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 20px 34px rgba(0,0,0,0.35))" }}
          />
        </div>

        <div className="relative max-w-xl">
          <span
            className={`stagger-item inline-flex items-center px-3.5 py-1.5 rounded-full mb-6 hero-body text-xs font-semibold tracking-wide uppercase ${visible ? "stagger-in" : ""}`}
            style={{ background: "rgba(255,255,255,0.12)", color: TOKENS.mist, transitionDelay: visible ? "120ms" : "0ms" }}
          >
            Get started
          </span>
          <h2
            className={`stagger-item hero-display text-3xl md:text-4xl font-extrabold mb-5 leading-[1.1] text-white ${visible ? "stagger-in" : ""}`}
            style={{ transitionDelay: visible ? "220ms" : "0ms" }}
          >
            Start tracking today — on your phone or right in the browser.
          </h2>
          <p
            className={`stagger-item hero-body text-base md:text-lg mb-9 leading-relaxed ${visible ? "stagger-in" : ""}`}
            style={{ color: TOKENS.mint50, transitionDelay: visible ? "320ms" : "0ms" }}
          >
            Same Sprout, same categories, same insights — the web app mirrors every feature from
            the mobile app, so you can log an expense from wherever you're already working.
          </p>

          <div className={`stagger-item flex flex-wrap gap-4 ${visible ? "stagger-in" : ""}`} style={{ transitionDelay: visible ? "420ms" : "0ms" }}>
            <a href="#" className="cta-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white" style={{ color: TOKENS.mintDeep }}>
              <IconPlay />
              <span className="hero-body text-left leading-tight">
                <span className="block text-[10px] opacity-60">GET IT ON</span>
                <span className="block text-base font-semibold">Google Play</span>
              </span>
            </a>
            <a href="#" className="cta-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white" style={{ color: TOKENS.mintDeep }}>
              <IconApple />
              <span className="hero-body text-left leading-tight">
                <span className="block text-[10px] opacity-60">DOWNLOAD ON THE</span>
                <span className="block text-base font-semibold">App Store</span>
              </span>
            </a>
            <Link
              to="/login"
              className="cta-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
            >
              <IconGlobe />
              <span className="hero-body text-base font-semibold">Open web app</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}