const TOKENS = {
  bg: "#DCF3E5",
  mint50: "#C9EAD6",
  mint: "#5FD088",
  mintDark: "#1E9E5C",
  mintDeep: "#0D3D25",
  ink: "#0E1F17",
  inkSoft: "#5B6B62",
};

/* Same mark as Navbar.jsx — plain wallet icon, no background tile */
function WalletLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path
        d="M4 7.5C4 6.12 5.12 5 6.5 5H17a1 1 0 0 1 1 1v2"
        stroke={TOKENS.mintDark}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5Z"
        stroke={TOKENS.mintDark}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="13" r="1.35" fill={TOKENS.mintDark} />
    </svg>
  );
}

/* Same section routes as Navbar.jsx */
const LINKS = [
  { label: "About", hash: "#about" },
  { label: "AI Coach", hash: "#ai-coach" },
  { label: "How it works", hash: "#how-it-works" },
  { label: "Testimonials", hash: "#testimonials" },
  { label: "FAQ", hash: "#faq" },
  { label: "Contact", hash: "#contact" },
];

export default function Footer() {
  const goToSection = (hash) => {
    if (window.location.pathname !== "/") {
      window.location.href = "/" + hash;
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact"
      style={{
        background: TOKENS.bg,
        borderTop: `1px solid ${TOKENS.mint50}`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <WalletLogo />
            <h2 className="hero-display text-2xl font-extrabold" style={{ color: TOKENS.mintDeep }}>
              Finly
            </h2>
          </div>
          <p className="hero-body text-sm leading-relaxed mb-7" style={{ color: TOKENS.inkSoft }}>
            Intelligence redefined for the modern global enterprise.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-transform"
              style={{ background: "#000000" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M3.6 2.3c-.4.3-.6.8-.6 1.4v16.6c0 .6.2 1.1.6 1.4l.1.1L13 12.3v-.2L3.7 2.2l-.1.1z" />
                <path d="M16.1 15.4l-3.1-3.1v-.2l3.1-3.1 3.6 2c1 .6 1 1.5 0 2.1l-3.6 2.1z" />
                <path d="M16.1 15.4L13 12.2 3.6 21.7c.4.4 1 .4 1.7 0l10.8-6.3" />
                <path d="M16.1 8.6L5.3 2.3c-.7-.4-1.3-.4-1.7 0L13 12l3.1-3.4z" />
              </svg>
              <span className="hero-body text-left leading-tight">
                <span className="block text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Get it on
                </span>
                <span className="block text-sm font-bold text-white">
                  Google Play
                </span>
              </span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-transform"
              style={{ background: "#000000" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M16.3 1c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.9 1.3-.1-1 .4-2.1 1-2.8C14.2 1.4 15.3.9 16.3 1zM19.9 17.4c-.5 1.1-.8 1.6-1.4 2.6-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9s-2.3.9-3.7.9c-1.6 0-2.8-1.6-3.7-3-2.6-3.9-2.9-8.5-1.3-11 1.1-1.8 2.9-2.8 4.6-2.8 1.7 0 2.8 1 4.2 1 1.3 0 2.2-1 4.2-1 1.5 0 3.1.8 4.2 2.2-3.7 2-3.1 7.3.4 8.9z" />
              </svg>
              <span className="hero-body text-left leading-tight">
                <span className="block text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Download on the
                </span>
                <span className="block text-sm font-bold text-white">
                  App Store
                </span>
              </span>
            </a>
          </div>
        </div>

        <div>
          <h5
            className="hero-body text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: TOKENS.mintDeep }}
          >
            Navigate
          </h5>
          <ul className="space-y-4">
            {LINKS.map((l) => (
              <li key={l.hash}>
                <button
                  onClick={() => goToSection(l.hash)}
                  className="hero-body text-sm text-left transition-colors"
                  style={{ color: TOKENS.inkSoft }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.inkSoft)}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5
            className="hero-body text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: TOKENS.mintDeep }}
          >
            Reach Us
          </h5>
          <ul className="space-y-5">
            <li>
              <a
                className="hero-body text-sm transition-colors"
                style={{ color: TOKENS.inkSoft }}
                href="mailto:wingorventures@gmail.com"
                onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.inkSoft)}
              >
                wingorventures@gmail.com
              </a>
            </li>
            <li>
              <div className="flex items-start gap-2" style={{ color: TOKENS.inkSoft }}>
                <span>🇮🇳</span>
                <div>
                  <a
                    className="hero-body block text-sm transition-colors"
                    style={{ color: TOKENS.ink }}
                    href="tel:+917012325044"
                    onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.ink)}
                  >
                    +91 70123 25044
                  </a>
                  <p className="hero-body text-sm leading-relaxed mt-1" style={{ color: TOKENS.inkSoft }}>
                    11/8B, UP School Road, Padamughal, Kakkanad, Kochi — 682030
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-start gap-2" style={{ color: TOKENS.inkSoft }}>
                <span>🇨🇦</span>
                <div>
                  <a
                    className="hero-body block text-sm transition-colors"
                    style={{ color: TOKENS.ink }}
                    href="tel:+14038708524"
                    onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.ink)}
                  >
                    +1 (403) 870-8524
                  </a>
                  <p className="hero-body text-sm leading-relaxed mt-1" style={{ color: TOKENS.inkSoft }}>
                    Calgary, Alberta
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex justify-between items-center hero-body text-xs"
        style={{ borderTop: `1px solid ${TOKENS.mint50}`, color: TOKENS.inkSoft }}
      >
        <p>© 2026 Finly. All rights reserved.</p>
        <div className="flex gap-6">
          <span
            className="material-symbols-outlined cursor-pointer transition-colors"
            style={{ color: TOKENS.inkSoft }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.inkSoft)}
          >
            language
          </span>
          <span
            className="material-symbols-outlined cursor-pointer transition-colors"
            style={{ color: TOKENS.inkSoft }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.inkSoft)}
          >
            public
          </span>
          <span
            className="material-symbols-outlined cursor-pointer transition-colors"
            style={{ color: TOKENS.inkSoft }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TOKENS.mintDark)}
            onMouseLeave={(e) => (e.currentTarget.style.color = TOKENS.inkSoft)}
          >
            brand_awareness
          </span>
        </div>
      </div>
    </footer>
  );
}