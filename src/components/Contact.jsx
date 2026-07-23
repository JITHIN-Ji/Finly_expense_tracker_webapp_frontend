import { useState, useEffect, useRef } from "react";

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

const STEPS = [
  {
    coin: "1",
    title: "Log it",
    copy: "Add an expense or income in seconds — amount, note, done. No forms to wrestle with.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80",
    alt: "Hand logging an expense on a phone",
  },
  {
    coin: "2",
    title: "Sort it",
    copy: "Sprout tags it to a category automatically — groceries, rent, coffee — no manual filing.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80",
    alt: "Receipt sorted into a category",
  },
  {
    coin: "3",
    title: "See it",
    copy: "Your week, month, or year — laid out clearly, patterns visible at a glance.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80",
    alt: "Spending chart summary",
  },
  {
    coin: "4",
    title: "Act on it",
    copy: "Get a nudge the moment a category's running hot — before it becomes a problem.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80",
    alt: "Notebook with a spending recommendation",
  },
];

function useReveal(threshold = 0.25) {
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

const FallbackArt = () => (
  <div
    className="w-full h-full flex items-center justify-center hero-body text-xs text-center px-4"
    style={{ background: `linear-gradient(155deg, ${TOKENS.mint50} 0%, ${TOKENS.mist} 100%)`, color: TOKENS.mintDark }}
  >
    Add image
  </div>
);

function StepRow({ coin, title, copy, img, alt, index }) {
  const [rowRef, visible] = useReveal(0.3);
  const [ok, setOk] = useState(true);
  const reversed = index % 2 === 1;

  return (
    <div ref={rowRef} className="step-row-item relative">
      {/* connector segment above this row (except first) */}
      {index > 0 && (
        <div className="connector-wrap mx-auto">
          <div className={`connector-fill ${visible ? "connector-grow" : ""}`} />
        </div>
      )}

      <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${reversed ? "md:[direction:rtl]" : ""}`}>
        {/* image */}
        <div
          className={`step-img relative rounded-[28px] overflow-hidden w-full h-[220px] md:h-[280px] ${visible ? "step-img-in" : ""}`}
          style={{
            border: `1px solid ${TOKENS.mint50}`,
            boxShadow: "0 20px 40px -18px rgba(14,31,23,0.25)",
            direction: "ltr",
            transitionDelay: visible ? "80ms" : "0ms",
          }}
        >
          {ok ? (
            <img src={img} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />
          ) : (
            <FallbackArt />
          )}

          {/* coin badge overlapping the corner */}
          <div
            className={`coin-mark absolute -top-4 -left-4 md:top-5 md:left-5 hero-display font-extrabold text-white flex items-center justify-center ${visible ? "coin-pop" : ""}`}
            style={{
              background: `linear-gradient(155deg, ${TOKENS.mint} 0%, ${TOKENS.mintDark} 100%)`,
              boxShadow: `0 14px 26px -8px rgba(14,31,23,0.35), inset 0 0 0 3px ${TOKENS.mint50}`,
              transitionDelay: visible ? "260ms" : "0ms",
            }}
          >
            {coin}
          </div>
        </div>

        {/* text */}
        <div className={`step-text ${visible ? "step-text-in" : ""}`} style={{ direction: "ltr", transitionDelay: visible ? "200ms" : "0ms" }}>
          <span
            className="hero-body text-xs font-semibold tracking-widest uppercase"
            style={{ color: TOKENS.mintDark }}
          >
            Step 0{coin}
          </span>
          <h3 className="hero-display text-2xl md:text-3xl font-extrabold mt-2 mb-3" style={{ color: TOKENS.mintDeep }}>
            {title}
          </h3>
          <p className="hero-body text-base md:text-lg leading-relaxed max-w-md" style={{ color: TOKENS.inkSoft }}>
            {copy}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [headRef, headVisible] = useReveal();

  return (
    <section id="how-it-works" style={{ color: TOKENS.ink }} className="relative overflow-hidden py-24 md:py-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        .reveal-text { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
        .reveal-in { opacity: 1 !important; transform: none !important; }

        .step-img { opacity: 0; transform: translateY(30px) scale(0.96); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
        .step-img-in { opacity: 1; transform: none; }

        .step-text { opacity: 0; transform: translateY(18px); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }
        .step-text-in { opacity: 1; transform: none; }

        .coin-mark {
          width: 56px; height: 56px; border-radius: 999px; font-size: 1.2rem; z-index: 3;
          transform: scale(0.4); opacity: 0;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1), opacity .4s ease;
        }
        .coin-pop { transform: scale(1); opacity: 1; }

        .step-row-item { padding: 2.5rem 0; }
        .connector-wrap { width: 3px; height: 56px; background: ${TOKENS.mint50}; border-radius: 999px; overflow: hidden; }
        .connector-fill { width: 100%; height: 0%; background: linear-gradient(180deg, ${TOKENS.mint}, ${TOKENS.mintDark}); transition: height 1s cubic-bezier(.22,1,.36,1); }
        .connector-grow { height: 100%; }

        @media (prefers-reduced-motion: reduce) {
          .reveal-text, .step-img, .step-text, .coin-mark { opacity: 1 !important; transform: none !important; transition: none !important; }
          .connector-fill { height: 100% !important; transition: none !important; }
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
          maskImage: "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.35) 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.14, filter: "blur(110px)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        <div ref={headRef} className={`reveal-text max-w-2xl mb-16 md:mb-20 mx-auto text-center ${headVisible ? "reveal-in" : ""}`}>
          <span
            className="inline-flex items-center px-3.5 py-1.5 rounded-full mb-6 hero-body text-xs font-semibold tracking-wide uppercase"
            style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
          >
            How it works
          </span>
          <h2 className="hero-display text-4xl md:text-5xl font-extrabold mb-6 leading-[1.08]" style={{ color: TOKENS.mintDeep }}>
            Four steps. Zero spreadsheets.
          </h2>
          <p className="hero-body text-lg leading-relaxed" style={{ color: TOKENS.inkSoft }}>
            Sprout stays out of your way until the moment you need it — then it's there with the answer.
          </p>
        </div>

        <div>
          {STEPS.map((s, i) => (
            <StepRow key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}