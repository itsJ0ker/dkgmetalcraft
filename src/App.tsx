import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Capabilities from './components/Capabilities';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import AIChatbot from './components/AIChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home'); // actual rendered tab (swapped midway in transition)
  const [theme, setTheme] = useState<'dark' | 'light' | 'colorful'>(() => (localStorage.getItem('dkg_theme') as 'dark' | 'light' | 'colorful') || 'dark');
  const shutterRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'colorful') => {
    setTheme(newTheme);
    localStorage.setItem('dkg_theme', newTheme);
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === displayTab || isTransitioning) return;

    setIsTransitioning(true);
    const shutter = shutterRef.current;
    const laser = laserBeamRef.current;

    if (!shutter || !laser) {
      setDisplayTab(newTab);
      setActiveTab(newTab);
      setIsTransitioning(false);
      return;
    }

    // GSAP Cinematic Laser Transition Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        gsap.set(laser, { opacity: 0 }); // Hide laser beam shadow completely when transition ends
      }
    });

    // Reset positions
    gsap.set(shutter, { x: '-100%' });
    gsap.set(laser, { x: '-100%', opacity: 0 });

    // 1. Slide in the shutter and glowing laser beam
    tl.to([shutter, laser], {
      x: '0%',
      duration: 0.6,
      ease: 'power3.inOut',
      stagger: 0.05,
      onStart: () => {
        gsap.set(laser, { opacity: 1 });
      }
    })
      // 2. Midpoint: Swap the page content behind the shutter
      .call(() => {
        setDisplayTab(newTab);
        setActiveTab(newTab);
        window.scrollTo(0, 0);
      })
      // 3. Pause briefly representing "processing / cut"
      .to(laser, {
        opacity: 0.8,
        duration: 0.1
      })
      // 4. Slide out the shutter to reveal the new page
      .to(shutter, {
        x: '100%',
        duration: 0.6,
        ease: 'power3.inOut'
      })
      .to(laser, {
        x: '100%',
        duration: 0.6,
        ease: 'power3.inOut',
        opacity: 0
      }, '-=0.6'); // overlap slideout
  };

  const renderActiveSection = () => {
    switch (displayTab) {
      case 'home':
        return <Home onExplore={() => handleTabChange('capabilities')} />;
      case 'capabilities':
        return <Capabilities />;
      case 'catalog':
        return <Catalog />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onExplore={() => handleTabChange('capabilities')} />;
    }
  };

  return (
    <div className={`relative min-h-screen bg-[var(--bg-dark)] flex flex-col justify-between overflow-x-hidden ${theme === 'light' ? 'light-theme' : theme === 'colorful' ? 'colorful-theme' : ''}`}>

      {/* Laser Transition Shutter Layer */}
      <div
        ref={shutterRef}
        className="fixed top-0 left-0 w-full h-full bg-[var(--bg-panel)] z-[999] pointer-events-none transform -translate-x-full border-r border-[var(--color-border)] flex items-center justify-center"
      >
        {/* Shutter central grid design detail */}
        <div className="text-center opacity-100 select-none flex flex-col items-center">
          <img src="/assets/logo.png" alt="Loading" className="h-16 md:h-40 w-auto object-contain mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,82,0,0.4)]" />
          <span className="font-heading text-[10px] tracking-[0.4em] text-[var(--text-steel)] uppercase block">
            FORMING METALS &bull; ENGAGING GEARS
          </span>
        </div>
      </div>

      {/* Glowing orange laser transition guide */}
      <div
        ref={laserBeamRef}
        className="fixed top-0 left-0 w-[4px] h-full bg-[#ff5200] z-[1000] pointer-events-none transform -translate-x-full shadow-[0_0_15px_#ff5200,0_0_30px_#ff5200] opacity-0"
      ></div>

      {/* Global Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} setTheme={handleThemeChange} />

      {/* Main Content Render */}
      <main className="flex-1 w-full relative">
        <div className="animate-fadeIn duration-500">
          {renderActiveSection()}
        </div>
      </main>

      {/* Global AI Chat Support Bot Terminal */}
      <AIChatbot />

      {/* Global Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}
