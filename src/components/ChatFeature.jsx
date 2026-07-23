import { useState, useEffect, useRef } from "react";

/* Keep in sync with Hero.jsx / About.jsx */
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

/* Place the mockup image at public/chat-insights-mockup.png */
const MOCKUP_SRC = "/chat-insights-mockup.png";

const POINTS = [
  {
    title: "Ask it anything",
    copy: "Chat with your own data — \u201cwhy was bills so high this month?\u201d gets a real answer.",
  },
  {
    title: "Smart recommendations",
    copy: "It flags overspending against your own averages, not generic budget rules.",
  },
  {
    title: "Doubts, sorted instantly",
    copy: "Not sure why a category jumped? Ask, and get the exact transactions behind it.",
  },
];

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

export default function ChatFeature() {
  const [imgOk, setImgOk] = useState(true);
  const [imgRef, imgVisible] = useReveal(0.2);
  const [textRef, textVisible] = useReveal();

  return (
    <section id="ai-coach" className="relative overflow-hidden py-20 md:py-28" style={{ background: TOKENS.paper, color: TOKENS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .cf-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .cf-body { font-family: 'Inter', sans-serif; }

        .cf-reveal-img, .cf-reveal-text {
          opacity: 0;
          transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
        }
        .cf-reveal-img { transform: translateY(28px) scale(0.9); }
        .cf-reveal-text { transform: translateY(22px); }
        .cf-reveal-in { opacity: 1; transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .cf-reveal-img, .cf-reveal-text { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* faint mint wash, quieter than About's — this section stays mostly white */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[420px] h-[420px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.08, filter: "blur(120px)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          {/* ---------- Left: copy ---------- */}
          <div ref={textRef} className={`cf-reveal-text order-2 md:order-1 ${textVisible ? "cf-reveal-in" : ""}`}>
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full mb-6 cf-body text-xs font-semibold tracking-wide uppercase"
              style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
            >
              AI Coach
            </span>
            <h2 className="cf-display text-3xl md:text-4xl font-extrabold mb-5 leading-[1.1]" style={{ color: TOKENS.mintDeep }}>
              Just ask. Sprout
              <br />
              already knows.
            </h2>
            <p className="cf-body text-lg leading-relaxed mb-8" style={{ color: TOKENS.inkSoft }}>
              Sprout's built-in chat understands your actual spending — not templates, not
              guesses. Ask a question about any expense, and get a straight answer with a
              recommendation attached.
            </p>

            <div className="flex flex-col gap-5">
              {POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <span
                    className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: TOKENS.mint }}
                  />
                  <div>
                    <h3 className="cf-display text-base font-bold mb-0.5" style={{ color: TOKENS.mintDeep }}>
                      {p.title}
                    </h3>
                    <p className="cf-body text-sm leading-relaxed" style={{ color: TOKENS.inkSoft }}>
                      {p.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Right: phone mockup, pops in on scroll ---------- */}
          <div
            ref={imgRef}
            className={`cf-reveal-img order-1 md:order-2 flex justify-center md:justify-end ${imgVisible ? "cf-reveal-in" : ""}`}
          >
            <div className="relative w-[300px] sm:w-[360px] md:w-[400px] lg:w-[440px]">
              {/* soft glow behind the phone */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-[40px] -z-10"
                style={{ background: TOKENS.mint, opacity: 0.18, filter: "blur(60px)", transform: "scale(0.85)" }}
              />
              {imgOk ? (
                <img
                  src={MOCKUP_SRC}
                  alt="Sprout AI insights chat on a phone, showing spending recommendations"
                  className="w-full h-auto drop-shadow-2xl"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div
                  className="w-full aspect-[9/18] rounded-[36px] flex items-center justify-center cf-body text-xs text-center px-6"
                  style={{ background: `linear-gradient(155deg, ${TOKENS.mint50} 0%, ${TOKENS.mist} 100%)`, color: TOKENS.mintDark, border: `1px solid ${TOKENS.mint50}` }}
                >
                  Add /chat-insights-mockup.png to your public folder
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}