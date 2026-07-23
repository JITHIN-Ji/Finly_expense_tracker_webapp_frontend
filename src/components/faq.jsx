import { useState, useEffect, useRef } from "react";

/* Keep in sync with Hero.jsx / About.jsx / Testimonials.jsx */
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

const FAQS = [
  {
    q: "How does Sprout track my spending and income?",
    a: "Every transaction you log is timestamped and stored against the right account, so your spending and income both build into one running history you can look back on any time.",
  },
  {
    q: "How are expenses organized by category?",
    a: "Each transaction is sorted into a category automatically as it's logged. You can rename, merge, or reassign any category, and Sprout remembers your corrections for next time.",
  },
  {
    q: "Can I view summaries for different time periods?",
    a: "Yes. Switch between week, month, and year views to see totals, trends, and category breakdowns at whatever distance makes sense for you.",
  },
  {
    q: "What is quick entry and how fast is it?",
    a: "Quick entry lets you log a transaction in just a few taps — amount, category, and done. Built for logging on the spot, not after the fact.",
  },
  {
    q: "Where do the recommendations and insights come from?",
    a: "Sprout's backend looks at your own logged habits — not generic advice — and surfaces gentle nudges and patterns worth noticing in your spending.",
  },
  {
    q: "Can I manage my account and preferences in the app?",
    a: "Yes. Update your profile, notification settings, categories, and connected preferences any time from the account screen.",
  },
];

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

function Chevron({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .35s cubic-bezier(.22,1,.36,1)" }}
    >
      <path d="M5 7.5l5 5 5-5" stroke={open ? TOKENS.mint : TOKENS.inkSoft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FAQItem({ q, a, isOpen, onToggle, index }) {
  const bodyRef = useRef(null);
  const [maxH, setMaxH] = useState("0px");

  useEffect(() => {
    if (isOpen && bodyRef.current) {
      setMaxH(`${bodyRef.current.scrollHeight}px`);
    } else {
      setMaxH("0px");
    }
  }, [isOpen]);

  return (
    <div
      className="py-5"
      style={{ borderTop: index === 0 ? "none" : `1px solid ${TOKENS.mint50}` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className="hero-display text-base md:text-lg font-bold transition-colors"
          style={{ color: isOpen ? TOKENS.mintDeep : TOKENS.ink }}
        >
          {q}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isOpen ? TOKENS.mint50 : "transparent", border: `1px solid ${isOpen ? TOKENS.mint : TOKENS.mint50}` }}
        >
          <Chevron open={isOpen} />
        </span>
      </button>
      <div
        style={{
          maxHeight: maxH,
          overflow: "hidden",
          transition: "max-height .4s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <p ref={bodyRef} className="hero-body text-sm leading-relaxed pt-4 pr-8" style={{ color: TOKENS.inkSoft }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [imgOk, setImgOk] = useState(true);
  const [colRef, colVisible] = useReveal(0.1);
  const [imgRef, imgVisible] = useReveal(0.1);

  return (
    <section id="faq" style={{ background: TOKENS.paper, color: TOKENS.ink }} className="relative overflow-hidden py-24 md:py-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        .reveal-l, .reveal-r {
          opacity: 0;
          transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
        }
        .reveal-l { transform: translateX(-24px); }
        .reveal-r { transform: translateX(24px); }
        .reveal-in { opacity: 1; transform: none; }

        @media (prefers-reduced-motion: reduce) {
          .reveal-l, .reveal-r { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      {/* soft mint glows, same family as other sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 -left-32 w-[420px] h-[420px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.1, filter: "blur(110px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 w-[380px] h-[380px] rounded-full"
        style={{ background: TOKENS.mintDark, opacity: 0.08, filter: "blur(100px)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* image */}
          <div
            ref={imgRef}
            className={`reveal-l rounded-[28px] overflow-hidden w-full h-[420px] md:h-[560px] ${imgVisible ? "reveal-in" : ""}`}
            style={{ border: `1px solid ${TOKENS.mint50}`, boxShadow: "0 24px 48px -18px rgba(14,31,23,0.22)" }}
          >
            {imgOk ? (
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80"
                alt="Person reviewing their expense tracker app on a smartphone"
                className="w-full h-full object-cover"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center hero-body text-xs"
                style={{ background: `linear-gradient(155deg, ${TOKENS.mint50} 0%, ${TOKENS.mist} 100%)`, color: TOKENS.mintDark }}
              >
                Add image
              </div>
            )}
          </div>

          {/* content */}
          <div ref={colRef} className={`reveal-r ${colVisible ? "reveal-in" : ""}`}>
            <span
              className="inline-flex items-center px-3.5 py-1.5 rounded-full mb-6 hero-body text-xs font-semibold tracking-wide uppercase"
              style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
            >
              FAQ
            </span>
            <h2 className="hero-display text-4xl md:text-5xl font-extrabold mb-4 leading-[1.08]" style={{ color: TOKENS.mintDeep }}>
              Questions, answered.
            </h2>
            <p className="hero-body text-base leading-relaxed mb-2" style={{ color: TOKENS.inkSoft }}>
              Everything you need to know before you connect your first account.
            </p>

            <div className="mt-6">
              {FAQS.map((f, i) => (
                <FAQItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}