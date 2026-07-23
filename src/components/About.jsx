import { useState, useEffect, useRef } from "react";

/* Keep in sync with Hero.jsx */
const TOKENS = {
  paper: "#FFFFFF",
  mist: "#EAF9F0",
  mint50: "#DFF6E8",
  mint: "#5FD088",
  mintDark: "#1E9E5C",
  mintDeep: "#0D3D25",
  ink: "#0E1F17",
  inkSoft: "#5B6B62",
};

const FEATURES = [
  {
    title: "Categorized spending",
    copy: "Every transaction sorted automatically, so your money tells a clear story.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80",
    alt: "Shopping receipt and bags representing categorized expenses",
  },
  {
    title: "Spending insights",
    copy: "See patterns across your habits, not just a list of numbers.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80",
    alt: "Charts and graphs showing spending trends",
  },
  {
    title: "Time-period summaries",
    copy: "Zoom into a week, a month, or a year — your budget, at any distance.",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80",
    alt: "Calendar and planner for reviewing time periods",
  },
  {
    title: "Quick entry",
    copy: "Log a transaction in seconds, without breaking your stride.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80",
    alt: "Hand tapping a phone screen to log an expense",
  },
  {
    title: "Smart recommendations",
    copy: "Gentle nudges from your own data, not generic advice.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80",
    alt: "Notebook and pen representing planning and recommendations",
  },
  {
    title: "Built around you",
    copy: "Your accounts, preferences, and habits — tuned to how you spend.",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80",
    alt: "Person adjusting settings on a laptop",
  },
];

const FallbackArt = () => (
  <div
    className="w-full h-full flex items-center justify-center hero-body text-xs text-center px-4"
    style={{ background: `linear-gradient(155deg, ${TOKENS.mint50} 0%, ${TOKENS.mist} 100%)`, color: TOKENS.mintDark }}
  >
    Add image
  </div>
);

/* fires once when el enters viewport */
function useReveal(threshold = 0.15) {
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

function FeatureCard({ title, copy, img, alt, index, visible }) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className={`reveal-card rounded-2xl overflow-hidden bg-white ${visible ? "reveal-in" : ""}`}
      style={{
        border: `1px solid ${TOKENS.mint50}`,
        boxShadow: "0 10px 24px -18px rgba(14,31,23,0.2)",
        transitionDelay: visible ? `${index * 110}ms` : "0ms",
      }}
    >
      <div className="w-full h-40 overflow-hidden">
        {ok ? (
          <img src={img} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />
        ) : (
          <FallbackArt />
        )}
      </div>
      <div className="p-5">
        <h3 className="hero-display text-base font-bold mb-1.5" style={{ color: TOKENS.mintDeep }}>
          {title}
        </h3>
        <p className="hero-body text-sm leading-relaxed" style={{ color: TOKENS.inkSoft }}>
          {copy}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const [heroImgOk, setHeroImgOk] = useState(true);
  const [textRef, textVisible] = useReveal();
  const [imgRef, imgVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal(0.1);

  return (
    <section id="about" style={{ color: TOKENS.ink }} className="relative overflow-hidden py-24 md:py-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        .reveal-text, .reveal-img, .reveal-card {
          opacity: 0;
          transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
        }
        .reveal-text { transform: translateY(22px); }
        .reveal-img  { transform: translateY(22px) scale(0.98); }
        .reveal-card { transform: translateY(24px); }
        .reveal-in   { opacity: 1; transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .reveal-text, .reveal-img, .reveal-card { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* Base wash — same palette as Hero, no motion */}
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
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.16, filter: "blur(110px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[420px] h-[420px] rounded-full"
        style={{ background: TOKENS.mintDark, opacity: 0.1, filter: "blur(100px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* ---------- Intro row ---------- */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20">
          <div ref={textRef} className={`reveal-text ${textVisible ? "reveal-in" : ""}`}>
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full mb-6 hero-body text-xs font-semibold tracking-wide uppercase"
              style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
            >
              About Sprout
            </span>
            <h2 className="hero-display text-4xl md:text-5xl font-extrabold mb-6 leading-[1.08]" style={{ color: TOKENS.mintDeep }}>
              A calmer way to watch
              <br />
              your money move.
            </h2>
            <p className="hero-body text-lg leading-relaxed" style={{ color: TOKENS.inkSoft }}>
              Sprout is a personal finance app built to make everyday tracking feel effortless.
              Log what you spend and earn, watch it sort itself into categories, and get a clear
              read on your habits — all through an interface designed to stay out of your way.
            </p>
          </div>

          <div
            ref={imgRef}
            className={`reveal-img rounded-[28px] overflow-hidden w-full h-[320px] md:h-[380px] ${imgVisible ? "reveal-in" : ""}`}
            style={{ border: `1px solid ${TOKENS.mint50}`, boxShadow: "0 24px 48px -18px rgba(14,31,23,0.22)", transitionDelay: imgVisible ? "150ms" : "0ms" }}
          >
            {heroImgOk ? (
              <img
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80"
                alt="Person checking their spending on a phone"
                className="w-full h-full object-cover"
                onError={() => setHeroImgOk(false)}
              />
            ) : (
              <FallbackArt />
            )}
          </div>
        </div>

        {/* ---------- Feature grid ---------- */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} visible={gridVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}