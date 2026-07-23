import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Banner from '../components/banner.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import useReveal from '../hooks/useReveal.js'
import Testimonials from '../components/testimonials.jsx'
import Faq from '../components/faq.jsx'
import Chatfeature from '../components/ChatFeature.jsx'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export default function Home() {
  const containerRef = useReveal()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [location])

  return (
    <div ref={containerRef}>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <About />
        <Chatfeature />
        
        <Contact />
        <Banner />
        <Testimonials />
        <Faq />
        
      </main>
      <Footer />
    </div>
  )
}
