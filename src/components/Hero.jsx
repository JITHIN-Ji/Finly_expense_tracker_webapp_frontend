import { useState } from "react";

/* ---------------------------------------------------------
   Rename this to your real app name — used in the logo mark.
--------------------------------------------------------- */
const APP_NAME = "Sprout";

/* Design tokens — white/green, premium & calm */
const TOKENS = {
  paper: "#FFFFFF",
  mist: "#EAF9F0",
  mint50: "#DFF6E8",
  mint: "#5FD088",
  mintDark: "#1E9E5C",
  mintDeep: "#0D3D25",
  ink: "#0E1F17",
  inkSoft: "#5B6B62",
  coral: "#F0764B",
  gold: "#E0A93A",
};

/* ---- tiny dependency-free icons (no lucide-react needed) ---- */
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
const IconStar = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.5 1.3 6.6L12 17l-5.9 3.4 1.3-6.6-4.9-4.5 6.6-.7L12 2.5z" />
  </svg>
);
const IconWallet = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 7H4a1 1 0 0 0-1 1v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z" />
    <path d="M3 8V6a2 2 0 0 1 2-2h11" />
    <circle cx="17" cy="13" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);
const IconCheck = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconBolt = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);
const IconBag = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 7h12l1 13H5L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);
const IconCoffee = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M7 3.5c-.5.8-.5 1.2 0 2M11 3.5c-.5.8-.5 1.2 0 2" />
  </svg>
);

/* ---- floating currency coin — the new signature accent ---- */
const CurrencyCoin = ({ size = 56, symbol = "₹", variant = "mint", className = "", style = {} }) => {
  const variants = {
    mint: { bg: `linear-gradient(155deg, ${TOKENS.mint} 0%, ${TOKENS.mintDark} 100%)`, ring: TOKENS.mint50 },
    gold: { bg: `linear-gradient(155deg, #F3C868 0%, ${TOKENS.gold} 100%)`, ring: "#FBF1DC" },
    deep: { bg: `linear-gradient(155deg, ${TOKENS.mintDark} 0%, ${TOKENS.mintDeep} 100%)`, ring: TOKENS.mint50 },
  };
  const v = variants[variant];
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: v.bg,
        boxShadow: `0 14px 26px -8px rgba(14,31,23,0.35), inset 0 0 0 3px ${v.ring}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.42,
        userSelect: "none",
        ...style,
      }}
    >
      {symbol}
    </div>
  );
};

export default function Hero() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section
      style={{ color: TOKENS.ink }}
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-9px) rotate(-0.6deg); } }
        @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-13px) rotate(0.8deg); } }
        @keyframes floatC { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-7px) rotate(1deg); } }
        @keyframes floatPhone { 0%,100% { transform: translateY(0px) rotate(-6deg); } 50% { transform: translateY(-16px) rotate(-4.7deg); } }
        @keyframes ringPulse { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.04); } }
        @keyframes drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(14px,-10px); } }
        @keyframes coinSpinA { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-18px) rotate(8deg); } }
        @keyframes coinSpinB { 0%,100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-22px) rotate(-10deg); } }
        @keyframes coinSpinC { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(10deg); } }

        .float-a { animation: floatA 5.5s ease-in-out infinite; }
        .float-b { animation: floatB 6.8s ease-in-out infinite; }
        .float-c { animation: floatC 4.6s ease-in-out infinite; }
        .float-phone { animation: floatPhone 7.5s ease-in-out infinite; }
        .glow-ring { animation: ringPulse 5s ease-in-out infinite; }
        .drift-orb { animation: drift 12s ease-in-out infinite; }
        .coin-a { animation: coinSpinA 6s ease-in-out infinite; }
        .coin-b { animation: coinSpinB 7.2s ease-in-out infinite; }
        .coin-c { animation: coinSpinC 5.4s ease-in-out infinite; }

        .store-btn { transition: transform .18s ease, box-shadow .18s ease; }
        .store-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(14,31,23,0.25); }

        @media (prefers-reduced-motion: reduce) {
          .float-a, .float-b, .float-c, .float-phone, .glow-ring, .drift-orb, .coin-a, .coin-b, .coin-c { animation: none; }
        }
      `}</style>

      {/* Base wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${TOKENS.mist} 0%, ${TOKENS.paper} 45%, ${TOKENS.paper} 100%)`,
        }}
      />

      {/* Premium fine dot-grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(${TOKENS.mintDark}22 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 55%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 55%, transparent 85%)",
        }}
      />

      {/* Large soft color fields */}
      <div
        aria-hidden
        className="drift-orb pointer-events-none absolute -top-52 -right-52 w-[720px] h-[720px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.24, filter: "blur(110px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-52 w-[520px] h-[520px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.16, filter: "blur(100px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full"
        style={{ background: TOKENS.mintDark, opacity: 0.12, filter: "blur(80px)" }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-16 items-center">
        {/* ---------- Left: copy ---------- */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 hero-body"
            style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
          >
            <IconWallet />
            <span className="text-xs font-semibold tracking-wide uppercase">
              {APP_NAME} · Money, made calm
            </span>
          </div>

          <h1
            className="hero-display text-5xl md:text-[4.4rem] leading-[1.04] font-extrabold mb-6"
            style={{ color: TOKENS.mintDeep }}
          >
            Know where every
            <br />
            rupee goes.
          </h1>

          <p
            className="hero-body text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
            style={{ color: TOKENS.inkSoft }}
          >
            Log expenses in seconds, see your spending patterns clearly, and
            stay ahead of your budget — one simple, uncluttered app.
          </p>

          {/* Store buttons */}
          <div className="flex flex-wrap gap-4 mb-9">
            <a
              href="#"
              className="store-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl"
              style={{ background: TOKENS.ink, color: "#fff" }}
            >
              <IconPlay />
              <span className="hero-body text-left leading-tight">
                <span className="block text-[10px] opacity-70">GET IT ON</span>
                <span className="block text-base font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="#"
              className="store-btn flex items-center gap-3 px-5 py-3.5 rounded-2xl"
              style={{ background: TOKENS.ink, color: "#fff" }}
            >
              <IconApple />
              <span className="hero-body text-left leading-tight">
                <span className="block text-[10px] opacity-70">DOWNLOAD ON THE</span>
                <span className="block text-base font-semibold">App Store</span>
              </span>
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 hero-body text-base" style={{ color: TOKENS.inkSoft }}>
            <div className="flex items-center gap-0.5" style={{ color: TOKENS.mintDark }}>
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} />
              ))}
            </div>
            <span>4.8 rating · 50K+ downloads</span>
          </div>
        </div>

        {/* ---------- Right: real app screenshot ---------- */}
        <div className="relative flex justify-center md:justify-end">
          {/* ambient glow ring behind phone — the one signature accent */}
          <div
            aria-hidden
            className="glow-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${TOKENS.mint}33 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />

          {/* floating currency coins — orbiting the phone */}
          <CurrencyCoin
            symbol="₹"
            size={54}
            variant="gold"
            className="coin-a pointer-events-none absolute -top-6 right-6 z-20"
          />
          <CurrencyCoin
            symbol="₹"
            size={44}
            variant="mint"
            className="coin-b pointer-events-none absolute top-1/3 -left-6 md:-left-12 z-20"
          />
          <CurrencyCoin
            symbol="₹"
            size={38}
            variant="deep"
            className="coin-c pointer-events-none absolute bottom-6 -right-2 md:right-2 z-20"
            style={{ animationDelay: "1.4s" }}
          />
          <CurrencyCoin
            symbol="₹"
            size={30}
            variant="gold"
            className="coin-b pointer-events-none absolute bottom-1/3 -left-2 md:left-4 z-20 hidden md:flex"
            style={{ animationDelay: "2.2s" }}
          />

          {/* floating trust card */}
          <div
            className="float-a absolute -left-2 md:-left-10 top-4 z-20 rounded-2xl px-4 py-3 bg-white"
            style={{ boxShadow: "0 16px 32px -12px rgba(14,31,23,0.18)", border: `1px solid ${TOKENS.mint50}` }}
          >
            <div className="flex items-center gap-2 hero-body">
              <IconCheck color={TOKENS.mintDark} />
              <div>
                <p className="text-xs font-semibold" style={{ color: TOKENS.ink }}>
                  Budget on track
                </p>
                <p className="text-[11px]" style={{ color: TOKENS.inkSoft }}>
                  68% used this month
                </p>
              </div>
            </div>
          </div>

          {/* synced chip */}
          <div
            className="float-b absolute -right-2 md:-right-8 bottom-20 z-20 rounded-2xl px-3.5 py-2.5 bg-white"
            style={{ boxShadow: "0 16px 32px -12px rgba(14,31,23,0.18)", border: `1px solid ${TOKENS.mint50}`, animationDelay: "1.2s" }}
          >
            <div className="flex items-center gap-2 hero-body">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full"
                style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
              >
                <IconBolt />
              </span>
              <p className="text-xs font-semibold" style={{ color: TOKENS.ink }}>
                Synced instantly
              </p>
            </div>
          </div>

          {/* category chip — groceries */}
          <div
            className="float-c hidden md:flex absolute left-2 bottom-2 z-20 items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-white"
            style={{ boxShadow: "0 16px 32px -12px rgba(14,31,23,0.18)", border: `1px solid ${TOKENS.mint50}`, animationDelay: "0.6s" }}
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{ background: "#FDEDE5", color: TOKENS.coral }}
            >
              <IconBag />
            </span>
            <div className="hero-body leading-tight">
              <p className="text-xs font-semibold" style={{ color: TOKENS.ink }}>
                Groceries
              </p>
              <p className="text-[11px]" style={{ color: TOKENS.inkSoft }}>
                −₹1,240
              </p>
            </div>
          </div>

          {/* category chip — coffee */}
          <div
            className="float-b hidden md:flex absolute right-8 top-24 z-20 items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-white"
            style={{ boxShadow: "0 16px 32px -12px rgba(14,31,23,0.18)", border: `1px solid ${TOKENS.mint50}`, animationDelay: "2s" }}
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{ background: "#FBF1DC", color: TOKENS.gold }}
            >
              <IconCoffee />
            </span>
            <div className="hero-body leading-tight">
              <p className="text-xs font-semibold" style={{ color: TOKENS.ink }}>
                Coffee
              </p>
              <p className="text-[11px]" style={{ color: TOKENS.inkSoft }}>
                −₹180
              </p>
            </div>
          </div>

          {/* image only — reduced size */}
          <div className="float-phone relative w-[280px] md:w-[360px] lg:w-[420px] z-10 md:-ml-10">
            {imgOk ? (
              <img
                src="/1.png"
                alt={`${APP_NAME} app dashboard screenshot`}
                className="w-full h-auto object-cover rounded-none"
                style={{ boxShadow: "none" }}
                onError={() => setImgOk(false)}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center hero-body text-xs text-center px-6 py-16"
                style={{ color: TOKENS.inkSoft, background: TOKENS.paper, boxShadow: "none" }}
              >
                Add your screenshot as <code>public/1.png</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}