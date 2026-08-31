import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ScreenSwitchOverlayProps {
  isTransitioning: boolean;
  targetTab: string;
  onMidpoint: () => void;
  onComplete: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string; code: string }> = {
  home: {
    title: 'THE FORGE & OVERVIEW',
    subtitle: 'PRECISION METAL CRAFTSMANSHIP & INDUSTRIAL SOLUTIONS',
    code: 'SYS-01 // THE FORGE',
  },
  capabilities: {
    title: 'CAPABILITIES & MACHINERY',
    subtitle: '5-AXIS CNC, FIBER LASER CUTTING & HEAVY FABRICATION',
    code: 'SYS-02 // CAPABILITIES',
  },
  catalog: {
    title: 'PRODUCT CATALOG & GALLERY',
    subtitle: 'ENGINEERED ENCLOSURES, FRAMES & CUSTOM HARDWARE',
    code: 'SYS-03 // CATALOG',
  },
  about: {
    title: 'COMPANY STORY & VISION',
    subtitle: 'DECADES OF METALLURGICAL EXCELLENCE & INNOVATION',
    code: 'SYS-04 // ABOUT US',
  },
  contact: {
    title: 'GET IN TOUCH & QUOTE',
    subtitle: 'DIRECT CONSULTATION WITH SENIOR FABRICATION ENGINEERS',
    code: 'SYS-05 // CONTACT',
  },
  dashboard: {
    title: 'INDUSTRIAL DASHBOARD',
    subtitle: 'REAL-TIME PRODUCTION & METRICS MONITORING',
    code: 'SYS-06 // DASHBOARD',
  },
};

export default function ScreenSwitchOverlay({
  isTransitioning,
  targetTab,
  onMidpoint,
  onComplete,
}: ScreenSwitchOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topDoorRef = useRef<HTMLDivElement>(null);
  const bottomDoorRef = useRef<HTMLDivElement>(null);
  const laserSeamRef = useRef<HTMLDivElement>(null);
  const scannerHeadRef = useRef<HTMLDivElement>(null);
  const hudContentRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const currentTabInfo = TAB_TITLES[targetTab] || {
    title: targetTab.toUpperCase(),
    subtitle: 'INITIALIZING COMPONENT MODULE',
    code: `SYS-SYS // ${targetTab.toUpperCase()}`,
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const topDoor = topDoorRef.current;
    const bottomDoor = bottomDoorRef.current;
    const laserSeam = laserSeamRef.current;
    const scannerHead = scannerHeadRef.current;
    const hudContent = hudContentRef.current;
    const container = containerRef.current;

    if (!topDoor || !bottomDoor || !laserSeam || !hudContent || !container) {
      onMidpoint();
      onComplete();
      return;
    }

    // Set initial state for transition
    gsap.set(container, { display: 'flex', pointerEvents: 'auto' });
    gsap.set(topDoor, { y: '-100%' });
    gsap.set(bottomDoor, { y: '100%' });
    gsap.set(laserSeam, { scaleX: 0, opacity: 0 });
    gsap.set(hudContent, { opacity: 0, scale: 0.92 });
    setProgress(0);

    let midpointCalled = false;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(container, { display: 'none', pointerEvents: 'none' });
        onComplete();
      },
    });

    // 1. Doors slam shut to meet in center
    tl.to(
      [topDoor, bottomDoor],
      {
        y: '0%',
        duration: 0.3,
        ease: 'power4.inOut',
      }
    )
      // 2. Reveal Laser Seam and HUD Content
      .to(
        laserSeam,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.15,
          ease: 'power3.out',
        },
        '-=0.08'
      )
      .to(
        hudContent,
        {
          opacity: 1,
          scale: 1,
          duration: 0.18,
          ease: 'back.out(1.4)',
        },
        '-=0.1'
      );

    // Progress counter animation sync
    const obj = { val: 0 };
    tl.to(
      obj,
      {
        val: 100,
        duration: 0.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          const currentVal = Math.round(obj.val);
          setProgress(currentVal);
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${currentVal}%`;
          }
          // Midpoint swap at ~50%
          if (currentVal >= 50 && !midpointCalled) {
            midpointCalled = true;
            onMidpoint();
          }
        },
      },
      '-=0.18'
    );

    // Scanner beam gliding back & forth along laser seam
    if (scannerHead) {
      gsap.fromTo(
        scannerHead,
        { x: '-40vw' },
        {
          x: '40vw',
          duration: 0.35,
          repeat: 1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      );
    }

    // 3. Pause briefly at peak focus
    tl.to({}, { duration: 0.08 });

    // 4. Doors slide apart outward to reveal new page
    tl.to(hudContent, {
      opacity: 0,
      scale: 0.95,
      duration: 0.12,
      ease: 'power2.in',
    })
      .to(laserSeam, {
        scaleX: 0,
        opacity: 0,
        duration: 0.12,
        ease: 'power2.in',
      })
      .to([topDoor, bottomDoor], {
        y: (index) => (index === 0 ? '-100%' : '100%'),
        duration: 0.3,
        ease: 'power4.inOut',
      });

    return () => {
      tl.kill();
    };
  }, [isTransitioning, targetTab]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] hidden pointer-events-none flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Top Titanium Shutter Door */}
      <div
        ref={topDoorRef}
        className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[var(--bg-dark)] via-[#111116] to-[#18181f] border-b border-[var(--color-border)] shadow-2xl overflow-hidden flex items-end justify-center"
      >
        {/* Steel Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        {/* Subtle Diagonal Metal Grain */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 0, transparent 10px)',
          }}
        />
        {/* Top HUD Telemetry Header */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-[var(--text-steel)] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-orange)] animate-ping" />
            <span>DKG FABRICATION MATRIX</span>
          </div>
          <div>{currentTabInfo.code}</div>
          <div className="hidden sm:block">TOLERANCE: 0.001MM</div>
        </div>

        {/* L-bracket industrial corner top-left */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[var(--color-orange)] opacity-80" />
        {/* L-bracket industrial corner top-right */}
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[var(--color-orange)] opacity-80" />
      </div>

      {/* Bottom Titanium Shutter Door */}
      <div
        ref={bottomDoorRef}
        className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[var(--bg-dark)] via-[#111116] to-[#18181f] border-t border-[var(--color-border)] shadow-2xl overflow-hidden flex items-start justify-center"
      >
        {/* Steel Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        {/* Subtle Diagonal Metal Grain */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 0, transparent 10px)',
          }}
        />

        {/* Bottom HUD Footer */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-[var(--text-steel)] tracking-widest uppercase">
          <div>AUTOMATED CNC ROUTER ACTIVE</div>
          <div>DKG METALCRAFT &bull; HIGH PRECISION</div>
        </div>

        {/* L-bracket industrial corner bottom-left */}
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[var(--color-orange)] opacity-80" />
        {/* L-bracket industrial corner bottom-right */}
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[var(--color-orange)] opacity-80" />
      </div>

      {/* Laser Cut Center Seam Line */}
      <div
        ref={laserSeamRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[3px] bg-[var(--color-orange)] z-[10002] shadow-[0_0_20px_var(--color-orange),0_0_40px_var(--color-orange)] opacity-0 flex items-center justify-center"
      >
        {/* Moving Laser Scanner Node */}
        <div
          ref={scannerHeadRef}
          className="w-24 h-12 bg-white/80 rounded-full blur-[3px] shadow-[0_0_30px_#fff,0_0_50px_var(--color-orange)]"
        />
      </div>

      {/* Center High-Tech Telemetry HUD Display */}
      <div
        ref={hudContentRef}
        className="relative z-[10003] flex flex-col items-center justify-center p-8 text-center max-w-xl mx-4 bg-[#0a0a0d]/90 backdrop-blur-xl border border-[var(--color-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,82,0,0.15)] rounded-none"
      >
        {/* Glowing Logo */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--color-orange)]/20 blur-xl animate-pulse" />
          <img
            src="/assets/logo.png"
            alt="DKG Metalcraft"
            className="h-16 md:h-20 w-auto object-contain relative z-10 drop-shadow-[0_0_20px_var(--color-orange-glow)]"
          />
        </div>

        {/* Dynamic Title */}
        <h2 className="font-heading text-xl md:text-2xl font-bold tracking-[0.2em] text-[var(--text-white)] uppercase mb-2">
          {currentTabInfo.title}
        </h2>

        {/* Dynamic Subtitle */}
        <p className="font-mono text-[10px] md:text-xs text-[var(--color-orange)] tracking-widest uppercase mb-6 max-w-md">
          {currentTabInfo.subtitle}
        </p>

        {/* Progress Bar & Percentage */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-steel)] tracking-widest">
            <span>ENGAGING GEARS</span>
            <span className="text-[var(--text-white)] font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a22] border border-[var(--color-border)] p-[1px] relative overflow-hidden">
            <div
              ref={progressFillRef}
              className="h-full bg-gradient-to-r from-[var(--color-orange)] to-[#ff8800] shadow-[0_0_10px_var(--color-orange)] transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
