import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Zap, Hammer, Activity, Disc, Cpu } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

gsap.registerPlugin(ScrollTrigger);

export default function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCap, setActiveCap] = useState(0);

  const capabilities = [
    {
      icon: <Zap className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Laser Cutting",
      description: "Precision laser cutting helps us produce accurate shapes, patterns, components, and sheet-metal parts with consistent quality.",
      technical: "High-precision cutting up to 12mm thickness with minimal kerf width. Perfect edge finish requiring zero secondary deburring.",
      spec: "Tolerance: ±0.1mm"
    },
    {
      icon: <Layers className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Sheet Bending",
      description: "Our bending capabilities allow us to manufacture accurately shaped components, cabinets, counters, tables, panels, and customised metal structures.",
      technical: "Multi-axis CNC bending presses ensure accurate folding angles and repeatable dimensions across short and long production runs.",
      spec: "Angles: 15° to 175°"
    },
    {
      icon: <Hammer className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Metal Fabrication",
      description: "We carry out fabrication work for a variety of commercial and industrial applications, focusing on structural strength and clean workmanship.",
      technical: "Complete integration of metal elements, structural columns, commercial worktops, custom enclosures, and heavy-duty industrial framing.",
      spec: "Load Capacity: Heavy Duty"
    },
    {
      icon: <Activity className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Welding & Assembly",
      description: "Our fabrication process includes careful welding and assembly to ensure product durability, stability, and long-term performance.",
      technical: "High-integrity TIG, MIG, and spot welding specializing in stainless steel. Clean finishing techniques ensure sanitary culinary welds.",
      spec: "Finish: Food-grade sanitary"
    },
    {
      icon: <Cpu className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Power Press Work",
      description: "We can manufacture and process selected metal components according to production and design requirements.",
      technical: "Stamping, punching, and forming press capabilities for mass component fabrication with uniform geometric accuracy.",
      spec: "Tooling: Custom die-press"
    },
    {
      icon: <Disc className="w-6 h-6 text-[var(--color-orange)]" />,
      title: "Pipe Bending & Rolling",
      description: "Our capabilities also include pipe bending and rolling for the manufacturing of frames, structures, stands, and customised metal products.",
      technical: "Precision mandrel and roll bending of pipes/tubing to make frames, commercial kitchen legs, supports, and modular structural parts.",
      spec: "Diameters: 0.5\" to 3\""
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        '.cap-title-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Cards staggered reveal
      gsap.fromTo(
        '.capability-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen bg-[var(--bg-dark)] py-24 border-b border-[var(--color-border)] overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 cap-title-reveal">
          <span className="font-heading text-xs tracking-[0.3em] text-[var(--color-orange)] uppercase block mb-3">
            Manufacturing Setup
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase">
            Engineering <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="font-body text-[var(--text-steel)] text-sm md:text-base font-light leading-relaxed">
            Our state-of-the-art facility in Mundka incorporates multiple sheet-metal bending, precision cutting, and custom welding processes under one roof, maintaining high accuracy throughout every fabrication step.
          </p>
        </div>

        {/* Dynamic Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Interactive capabilities list */}
          <div 
            ref={cardsContainerRef}
            className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {capabilities.map((cap, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveCap(index);
                  trackEvent('process_preview_click', { category: 'Capability Card', title: cap.title });
                }}
                className={`capability-card card-industrial cursor-pointer ${
                  activeCap === index 
                    ? 'border-[var(--color-orange)] shadow-[0_0_15px_rgba(255,82,0,0.15)] bg-[var(--bg-panel)]' 
                    : 'border-[var(--color-border)] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Corner details */}
                <div className={`absolute top-0 right-0 w-[4px] h-[4px] ${activeCap === index ? 'bg-[#ff5200]' : 'bg-[#27272a]'}`}></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[var(--bg-panel-light)] border border-[var(--color-border)]">
                    {cap.icon}
                  </div>
                  <h3 className="font-heading text-base font-bold text-[var(--text-white)] uppercase tracking-wide">
                    {cap.title}
                  </h3>
                </div>
                
                <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed mb-4">
                  {cap.description}
                </p>

                <div className="pt-3 border-t border-[var(--color-border-light)] flex justify-between items-center text-[10px] font-heading tracking-widest text-[#555]">
                  <span>FABRICATION SPEC</span>
                  <span className={activeCap === index ? 'text-[var(--color-orange)]' : ''}>{cap.spec}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel: Cinematic Video Backdrop & Live Details */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--bg-panel)] border border-[var(--color-border)] relative overflow-hidden p-8 min-h-[450px]">
            {/* Ambient Background Video */}
            <div className="absolute inset-0 z-0">
              <video
                key={activeCap} // refresh video loop context on active capability change
                className="w-full h-full object-cover opacity-20 saturate-[0.1]"
                src="/assets/14bfd6dd-29bb-4907-91c6-326c3880334f.mov"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/assets/14bfd6dd-29bb-4907-91c6-326c3880334f.mov" type="video/mp4" />
              </video>
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#131316] via-transparent to-[#131316]"></div>
            </div>

            {/* Technical HUD Overlay Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4 mb-6">
                <span className="font-heading text-[10px] tracking-[0.25em] text-[var(--color-orange)] uppercase font-bold">
                  ACTIVE MACHINE PROFILE
                </span>
                <span className="font-heading text-[10px] tracking-[0.25em] text-[var(--text-steel)] uppercase">
                  MOD-0{activeCap + 1}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-4">
                {capabilities[activeCap].title}
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">
                    Process Description
                  </h4>
                  <p className="text-xs text-[var(--text-steel-light)] font-body font-light leading-relaxed">
                    {capabilities[activeCap].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">
                    Technical Specifications & Limits
                  </h4>
                  <p className="text-xs text-[var(--text-steel-light)] font-body font-light leading-relaxed">
                    {capabilities[activeCap].technical}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Tech Diagnostics */}
            <div className="relative z-10 pt-4 border-t border-[var(--color-border)] flex justify-between items-center text-[10px] font-heading tracking-widest text-[var(--text-steel)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff5200] animate-pulse"></div>
                <span>MACHINE ONLINE</span>
              </div>
              <span>DKG SYSTEM RUNNING</span>
            </div>
            
            {/* Top right cut corner detailing */}
            <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-[var(--color-border)] bg-[var(--bg-dark)] flex items-center justify-center">
              <div className="w-[4px] h-[4px] bg-[#ff5200]"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
