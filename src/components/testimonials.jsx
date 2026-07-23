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

const TESTIMONIALS = [
  {
    type: "text",
    quote:
      "The team at Sprout has given our household real leverage. It's exceptionally clear, and always attentive to how we actually spend — the turnaround from mess to clarity is fast.",
    name: "Marcus Webb",
    role: "Freelance photographer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    type: "video",
    quote: "Watch Elena's story",
    name: "Elena Kovac",
    role: "Studio founder",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  },
  {
    type: "text",
    quote:
      "Sprout has greatly exceeded our expectations. Categorizing is always accurate, the summaries are quick, and the insights are fresh, honest, and spot on.",
    name: "Owen Marsh",
    role: "Small business owner",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
  {
    type: "text",
    quote:
      "I stopped dreading my bank app. Everything sorts itself and I actually check in now instead of avoiding it for weeks at a time.",
    name: "Priya Nair",
    role: "Product designer",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
  },
  {
    type: "text",
    quote:
      "Switched from three different apps to just this one. The recommendations actually reflect how I spend, not generic advice pasted into every screen.",
    name: "Daniel Cho",
    role: "Product manager",
    avatar: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=200&q=80",
  },
];

const FallbackAvatar = ({ name }) => (
  <div
    className="w-full h-full flex items-center justify-center hero-display text-xs font-bold"
    style={{ background: TOKENS.mint50, color: TOKENS.mintDark }}
  >
    {name.split(" ").map((w) => w[0]).join("")}
  </div>
);

const Avatar = ({ avatar, name, ring }) => {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
      style={{ border: `3px solid ${ring || TOKENS.paper}`, boxShadow: "0 4px 14px -4px rgba(14,31,23,0.35)" }}
    >
      {ok ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <FallbackAvatar name={name} />
      )}
    </div>
  );
};

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

function TextCard({ quote, name, role, avatar, index, visible }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="reveal-card relative flex-shrink-0 snap-start w-[300px] sm:w-[340px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)",
        transitionDelay: visible ? `${index * 110}ms` : "0ms",
      }}
    >
      <div className="pl-7 pt-7">
        <div
          className="rounded-2xl bg-white pt-9 pb-7 px-6 h-full"
          style={{
            border: `1px solid ${TOKENS.mint50}`,
            boxShadow: hover ? "0 20px 38px -18px rgba(14,31,23,0.28)" : "0 10px 24px -18px rgba(14,31,23,0.16)",
            transform: hover ? "translateY(-4px)" : "translateY(0)",
            transition: "box-shadow .35s ease, transform .35s ease",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <p className="hero-body text-[15px] leading-relaxed" style={{ color: TOKENS.ink }}>
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-6 pt-5 flex items-center gap-3" style={{ borderTop: `1px solid ${TOKENS.mint50}` }}>
            <p className="hero-display text-sm font-bold" style={{ color: TOKENS.mintDeep }}>
              {name}
            </p>
            <span style={{ color: TOKENS.mint50 }}>&bull;</span>
            <p className="hero-body text-xs" style={{ color: TOKENS.inkSoft }}>
              {role}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0">
        <Avatar avatar={avatar} name={name} />
      </div>
    </div>
  );
}

function VideoCard({ quote, name, role, avatar, poster, index, visible }) {
  const [imgOk, setImgOk] = useState(true);
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className="reveal-card relative flex-shrink-0 snap-start w-[280px] sm:w-[320px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)",
        transitionDelay: visible ? `${index * 110}ms` : "0ms",
      }}
    >
      <div className="pl-7 pt-7">
        <div
          className="relative rounded-2xl overflow-hidden h-[400px]"
          style={{ boxShadow: "0 20px 40px -16px rgba(14,31,23,0.35)" }}
        >
          {imgOk ? (
            <img
              src={poster}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${TOKENS.mintDeep}, ${TOKENS.mintDark})` }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(190deg, rgba(13,61,37,0) 40%, rgba(13,61,37,0.55) 100%)" }}
          />
          <button
            aria-label={`Play ${name} testimonial`}
            onClick={() => setPlaying((p) => !p)}
            className="group absolute left-1/2 bottom-8 -translate-x-1/2 flex items-center justify-center rounded-full"
            style={{
              width: 52,
              height: 52,
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(6px)",
              border: "1.5px solid rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${TOKENS.mint}`,
                animation: playing ? "pulseRing 1.6s ease-out infinite" : "none",
              }}
            />
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="#fff">
                <rect x="4" y="3" width="4" height="14" rx="1" />
                <rect x="12" y="3" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="#fff" className="ml-0.5">
                <path d="M5 3.5v13l11-6.5z" />
              </svg>
            )}
          </button>
          <p className="absolute left-5 bottom-24 hero-display text-white text-sm font-semibold drop-shadow">
            {quote}
          </p>
        </div>
      </div>
      <div className="absolute top-0 left-0">
        <Avatar avatar={avatar} name={name} ring={TOKENS.mint} />
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [headRef, headVisible] = useReveal();
  const [rowRef, rowVisible] = useReveal(0.05);
  const dragRef = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [dragging, setDragging] = useState(false);

  const onDown = (e) => {
    const el = rowRef.current;
    if (!el) return;
    dragRef.current = { down: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
    setDragging(true);
  };
  const onMove = (e) => {
    const st = dragRef.current;
    const el = rowRef.current;
    if (!st.down || !el) return;
    const dx = e.pageX - st.startX;
    if (Math.abs(dx) > 3) st.moved = true;
    el.scrollLeft = st.startScroll - dx;
  };
  const endDrag = () => {
    dragRef.current.down = false;
    setDragging(false);
  };
  const onClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="testimonials" style={{ background: TOKENS.mist, color: TOKENS.ink }} className="relative overflow-hidden py-24 md:py-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }

        .reveal-text {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
        }
        .reveal-in { opacity: 1; transform: none; }

        .tmn-scroll { scrollbar-width: none; }
        .tmn-scroll::-webkit-scrollbar { display: none; }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: .9; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-text, .reveal-card { opacity: 1 !important; transform: none !important; transition: none !important; }
        }
      `}</style>

      {/* ambient mint glows, same family as About/Banner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
        style={{ background: TOKENS.mint, opacity: 0.14, filter: "blur(100px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full"
        style={{ background: TOKENS.mintDark, opacity: 0.1, filter: "blur(100px)" }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div ref={headRef} className={`reveal-text px-6 md:px-10 max-w-xl mb-14 ${headVisible ? "reveal-in" : ""}`}>
          <span
            className="hero-body text-xs font-semibold tracking-[0.14em] uppercase"
            style={{ color: TOKENS.mintDark }}
          >
            Testimonials
          </span>
          <h2 className="hero-display text-4xl md:text-5xl font-extrabold mt-4 leading-[1.08]" style={{ color: TOKENS.mintDeep }}>
            Don&rsquo;t take our word
            <br />
            for it. Hear it from
            <br />
            our users.
          </h2>
        </div>

        <div
          ref={rowRef}
          className={`tmn-scroll flex gap-0 overflow-x-auto pl-6 md:pl-10 pr-6 pb-4 ${dragging ? "" : "snap-x snap-mandatory"}`}
          style={{ cursor: dragging ? "grabbing" : "grab", userSelect: dragging ? "none" : "auto" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onClickCapture={onClickCapture}
        >
          {TESTIMONIALS.map((t, i) =>
            t.type === "video" ? (
              <VideoCard key={t.name} {...t} index={i} visible={rowVisible} />
            ) : (
              <TextCard key={t.name} {...t} index={i} visible={rowVisible} />
            )
          )}
          <div className="flex-shrink-0 w-2" />
        </div>
      </div>
    </section>
  );
}