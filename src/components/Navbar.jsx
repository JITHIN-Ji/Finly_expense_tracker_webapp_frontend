import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

/* Matches RegisterScreen.tsx palette: mint / mintDark / textDark on white-glass */
const TOKENS = {
  paper: '#FFFFFF',
  mist: '#EAF9F0',
  mint50: '#DFF6E8',
  mint: '#7FD99C',
  mintDark: '#1E9E5C',
  mintDeep: '#0D3D25',
  ink: '#0E1F17',
  inkSoft: '#5B6B62',
}

/* Wallet mark — plain icon, no background tile, mint outline */
function WalletLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
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
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (hash) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + hash)
    } else {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const links = [
    { label: 'About', hash: '#about' },
    { label: 'AI Coach', hash: '#ai-coach' },
    { label: 'How it works', hash: '#how-it-works' },
    { label: 'Testimonials', hash: '#testimonials' },
    { label: 'FAQ', hash: '#faq' },
    { label: 'Contact', hash: '#contact' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${TOKENS.mint50}`,
        boxShadow: '0 8px 24px -16px rgba(14,31,23,0.18)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        .hero-display { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.03em; }
        .hero-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-2.5">
          <WalletLogo />
          <span className="hero-display text-lg font-extrabold" style={{ color: TOKENS.mintDeep }}>
            Finly
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.hash}
              onClick={() => goToSection(l.hash)}
              className="hero-body font-medium text-sm transition-colors duration-200 whitespace-nowrap"
              style={{ color: TOKENS.ink, opacity: 0.75 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.mintDark
                e.currentTarget.style.opacity = 1
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.ink
                e.currentTarget.style.opacity = 0.75
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:inline-flex items-center hero-body px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all"
            style={{
              background: TOKENS.mint,
              color: TOKENS.mintDeep,
              boxShadow: '0 8px 20px -8px rgba(30,158,92,0.45)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.mintDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = TOKENS.mint)}
          >
            Continue in Web
          </button>
          <button
            onClick={() => goToSection('#get-app')}
            className="hidden sm:inline-flex items-center hero-body px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all"
            style={{
              background: TOKENS.ink,
              color: TOKENS.paper,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#000000')}
            onMouseLeave={(e) => (e.currentTarget.style.background = TOKENS.ink)}
          >
            Download App
          </button>
          <button
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: TOKENS.paper }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-xl" style={{ color: TOKENS.mintDeep }}>
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden px-6 py-5 flex flex-col gap-3"
          style={{ background: 'rgba(255,255,255,0.94)', borderTop: `1px solid ${TOKENS.mint50}` }}
        >
          {links.map((l) => (
            <button
              key={l.hash}
              onClick={() => goToSection(l.hash)}
              className="text-left hero-body font-medium text-sm py-1"
              style={{ color: TOKENS.ink, opacity: 0.8 }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              navigate('/login')
            }}
            className="hero-body px-6 py-2.5 rounded-full text-sm font-bold text-center mt-1"
            style={{ background: TOKENS.mint, color: TOKENS.mintDeep }}
          >
            Continue in Web
          </button>
          <button
            onClick={() => goToSection('#get-app')}
            className="hero-body px-6 py-2.5 rounded-full text-sm font-bold text-center"
            style={{ background: TOKENS.ink, color: TOKENS.paper }}
          >
            Download App
          </button>
        </div>
      )}
    </nav>
  )
}