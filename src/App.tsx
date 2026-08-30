import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Capabilities from './components/Capabilities';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import AIChatbot from './components/AIChatbot';
import Dashboard from './components/Dashboard';
import { Analytics } from '@vercel/analytics/react';
import { initializeAnalytics, trackEvent } from './utils/analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home'); // actual rendered tab (swapped midway in transition)
  const [theme, setTheme] = useState<'dark' | 'light' | 'colorful'>(() => (localStorage.getItem('dkg_theme') as 'dark' | 'light' | 'colorful') || 'dark');
  const shutterRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // High-fidelity spark system
  const sparksRef = useRef<Array<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    size: number;
    gravity: number;
  }>>([]);

  useEffect(() => {
    initializeAnalytics();
    trackEvent('page_view', { tab: 'home' });
  }, []);

  useEffect(() => {
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const renderSparks = () => {
    const canvas = sparkCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current laser position to generate new sparks
    const laser = laserBeamRef.current;
    if (laser && isTransitioningRef.current) {
      const rect = laser.getBoundingClientRect();
      // Generate sparks around the middle of the laser guide on screen
      if (rect.x > -10 && rect.x < canvas.width + 10) {
        // High density realistic sparks spray
        for (let i = 0; i < 12; i++) {
          const angle = (Math.random() * Math.PI) - (Math.PI / 2); // outward angles
          const speed = Math.random() * 11 + 5; // realistic high velocity
          const sparkY = canvas.height / 2 + (Math.random() * 70 - 35); // spread near center cutting head
          sparksRef.current.push({
            x: rect.x + 2,
            y: sparkY,
            prevX: rect.x + 2,
            prevY: sparkY,
            vx: Math.cos(angle) * speed * (Math.random() > 0.45 ? 1 : -1),
            vy: (Math.random() - 0.8) * 8, // upward and outward dispersion
            life: 1.0,
            decay: Math.random() * 0.02 + 0.015, // random duration per spark
            size: Math.random() * 2.5 + 1.2,
            gravity: Math.random() * 0.15 + 0.15 // simulate physical gravity
          });
        }
      }
    }

    // Draw & update existing sparks
    sparksRef.current.forEach((spark, index) => {
      // Store previous position for motion blur vector trail
      spark.prevX = spark.x;
      spark.prevY = spark.y;

      // Update positions with friction/gravity
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += spark.gravity;

      // Decay life
      spark.life -= spark.decay;

      if (spark.life <= 0) {
        sparksRef.current.splice(index, 1);
        return;
      }

      // Calculate dynamic color representing cooling stages of hot iron
      let strokeColor = '';
      if (spark.life > 0.75) {
        // White-hot steel spark
        strokeColor = `rgba(255, 255, 255, ${spark.life})`;
      } else if (spark.life > 0.45) {
        // Bright dazzling golden-yellow spark
        strokeColor = `rgba(255, 215, 0, ${spark.life})`;
      } else if (spark.life > 0.2) {
        // Hot orange-red spark
        strokeColor = `rgba(255, 100, 20, ${spark.life})`;
      } else {
        // Cooling deep red spark
        strokeColor = `rgba(200, 30, 20, ${spark.life})`;
      }

      ctx.save();
      // Add subtle bloom matching spark temperature
      ctx.shadowBlur = spark.life > 0.5 ? 8 : 2;
      ctx.shadowColor = strokeColor;
      
      // Draw as a vector trail line to simulate motion blur
      ctx.beginPath();
      ctx.moveTo(spark.prevX, spark.prevY);
      ctx.lineTo(spark.x, spark.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = spark.size;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    });

    if (isTransitioningRef.current || sparksRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(renderSparks);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationFrameRef.current = null;
    }
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'colorful') => {
    setTheme(newTheme);
    localStorage.setItem('dkg_theme', newTheme);
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === displayTab || isTransitioningRef.current) return;

    trackEvent('page_view', { tab: newTab });

    isTransitioningRef.current = true;
    const shutter = shutterRef.current;
    const laser = laserBeamRef.current;

    if (!shutter || !laser) {
      setDisplayTab(newTab);
      setActiveTab(newTab);
      isTransitioningRef.current = false;
      return;
    }

    // GSAP Cinematic Laser Transition Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.set(laser, { opacity: 0 }); // Hide laser beam shadow completely when transition ends
        gsap.killTweensOf(laser); // Stop the flickering
      }
    });

    // Reset positions
    gsap.set(shutter, { x: '-100%' });
    gsap.set(laser, { x: '-100%', opacity: 0 });
    
    // Animate the laser head up and down slightly to simulate cutting resistance
    const laserHead = laser.querySelector('.laser-head');
    if (laserHead) {
      gsap.to(laserHead, {
        y: '20px',
        duration: 0.1,
        yoyo: true,
        repeat: -1,
        ease: 'rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false })'
      });
    }

    // 1. Slide in the shutter and glowing laser beam
    tl.to([shutter, laser], {
      x: '0%',
      duration: 0.7,
      ease: 'power4.inOut',
      stagger: 0.08,
      onStart: () => {
        gsap.set(laser, { opacity: 1 });
        // Start spark loop if not running
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(renderSparks);
        }
        // Intense random flickering
        gsap.to(laser, { opacity: 0.6, duration: 0.05, yoyo: true, repeat: -1, ease: 'rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false })' });
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
        scaleX: 2,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      })
      // 4. Slide out the shutter to reveal the new page
      .to(shutter, {
        x: '100%',
        duration: 0.7,
        ease: 'power4.inOut'
      })
      .to(laser, {
        x: '105%',
        duration: 0.7,
        ease: 'power4.inOut',
        opacity: 0
      }, '-=0.7'); // overlap slideout
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
      case 'dashboard':
        return <Dashboard />;
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
        className="fixed top-0 left-0 w-[4px] h-full bg-[#ff5200] z-[1000] pointer-events-none transform -translate-x-full shadow-[0_0_20px_#ff5200,0_0_40px_#ff5200] opacity-0 flex items-center justify-center mix-blend-screen"
      >
        {/* Laser Cutting Head Core */}
        <div className="laser-head absolute top-1/2 -translate-y-1/2 w-4 h-16 flex items-center justify-center">
          <div className="w-2 h-12 bg-white rounded-full shadow-[0_0_25px_#fff,0_0_40px_#ff5200]"></div>
        </div>
      </div>

      {/* Global Canvas for High-Fidelity Sparks */}
      <canvas 
        ref={sparkCanvasRef} 
        className="fixed inset-0 pointer-events-none z-[1001]"
      />

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
      <Analytics />
    </div>
  );
}
