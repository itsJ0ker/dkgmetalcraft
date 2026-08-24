import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Compass, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const weldLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Weld Line drawing animation
      gsap.fromTo(
        weldLineRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: true,
          }
        }
      );

      // Fade reveal timeline steps
      gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: step.classList.contains('left-step') ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Quality list items reveal
      gsap.fromTo(
        '.quality-item',
        { opacity: 0, scale: 0.95, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.quality-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const whyChooseUs = [
    { title: "Custom Manufacturing", desc: "Solutions according to your exact dimensions, design, and application requirements." },
    { title: "Precision Engineering", desc: "Advanced bending and laser cutting capabilities maintain high dimensional accuracy." },
    { title: "Quality Workmanship", desc: "A strong structural focus on clean welding seams, robust joints, and durable finishes." },
    { title: "Full Fabrication", desc: "From sheet metal bending to press forming and rolling under one roof." },
    { title: "Kitchen Expertise", desc: "Deep functional understanding of professional food service and catering standards." },
    { title: "Competitive Value", desc: "Balancing peak industrial performance with realistic pricing structures." },
    { title: "Reliable Service", desc: "Direct, transparent communication and dependable delivery times." }
  ];

  const qualityPoints = [
    "Proper material grade selection (SS 304, SS 202, SS 430)",
    "Dimensional accuracy matching architectural designs",
    "High-load weld integrity and joint reinforcing structural ribs",
    "Clean, burr-free and sanitary grinding/polishing of seams",
    "Ergonomic, user-safe drawer glides and silent cabinet closures",
    "Maximum product lifecycle stability and scratch resistance",
    "Comprehensive pre-dispatch quality checks"
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-[var(--bg-dark)] py-24 border-b border-[var(--color-border)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      {/* Background Glowing Highlights */}
      <div className="glow-point top-1/3 right-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <span className="font-heading text-xs tracking-[0.3em] text-[var(--color-orange)] uppercase block mb-3">
            Company Story
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase">
            Crafting the <span className="text-gradient">Vision</span>
          </h2>
          <p className="font-body text-[var(--text-steel)] text-sm md:text-base font-light leading-relaxed">
            DKG Metal Craft Private Limited transforms raw materials into highly durable commercial fixtures. We specialize in catering equipment, clean-room cabinetry, and customized steel work.
          </p>
        </div>

        {/* Section 1: Timeline Story */}
        <div className="timeline-container relative max-w-4xl mx-auto mb-32">
          
          {/* Vertical Weld Line */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 w-[2px] h-full bg-[var(--bg-panel-light)]">
            <div 
              ref={weldLineRef} 
              className="absolute top-0 left-0 w-full bg-[#ff5200] shadow-[0_0_8px_#ff5200]"
            ></div>
          </div>

          <div className="space-y-24">
            
            {/* Step 1: Who We Are */}
            <div className="timeline-step left-step relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center pl-12 md:pl-0">
              <div className="md:text-right md:pr-12">
                <h3 className="font-heading text-xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-3">
                  Who We Are
                </h3>
                <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed">
                  Based in Delhi, DKG Metal Craft combines structural engineering and skilled craftsmanship to deliver premium metal fabrication solutions across India.
                </p>
              </div>
              <div className="hidden md:block pl-12">
                <div className="w-[120px] h-[120px] border border-[var(--color-border)] bg-[var(--bg-panel)] flex items-center justify-center relative">
                  <Sparkles className="w-8 h-8 text-[var(--color-orange)]" />
                  <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#ff5200]"></div>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--bg-dark)] border-2 border-[var(--color-orange)] rounded-full z-10"></div>
            </div>

            {/* Step 2: Our Vision */}
            <div className="timeline-step right-step relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center pl-12 md:pl-0">
              <div className="hidden md:block text-right pr-12">
                <div className="w-[120px] h-[120px] border border-[var(--color-border)] bg-[var(--bg-panel)] ml-auto flex items-center justify-center relative">
                  <Compass className="w-8 h-8 text-[var(--color-orange)]" />
                  <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#ff5200]"></div>
                </div>
              </div>
              <div className="md:pl-12">
                <h3 className="font-heading text-xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-3">
                  Our Vision
                </h3>
                <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed">
                  To become a leading name in metal fabrication by manufacturing innovative, high-quality, and customized steel solutions that stand the test of time.
                </p>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--bg-dark)] border-2 border-[var(--color-orange)] rounded-full z-10"></div>
            </div>

            {/* Step 3: Our Mission */}
            <div className="timeline-step left-step relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center pl-12 md:pl-0">
              <div className="md:text-right md:pr-12">
                <h3 className="font-heading text-xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-3">
                  Our Mission
                </h3>
                <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed">
                  To manufacture precision-engineered products using state-of-the-art machinery and quality materials, providing dependable support and custom sizing for every customer.
                </p>
              </div>
              <div className="hidden md:block pl-12">
                <div className="w-[120px] h-[120px] border border-[var(--color-border)] bg-[var(--bg-panel)] flex items-center justify-center relative">
                  <Target className="w-8 h-8 text-[var(--color-orange)]" />
                  <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#ff5200]"></div>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--bg-dark)] border-2 border-[var(--color-orange)] rounded-full z-10"></div>
            </div>

          </div>
        </div>

        {/* Section 2: Why Choose Us */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="font-heading text-xs tracking-[0.25em] text-[var(--color-orange)] uppercase font-bold block mb-2">
              Our Core Pillars
            </span>
            <h3 className="font-heading text-3xl font-bold text-[var(--text-white)] uppercase tracking-widest">
              Why DKG Metal Craft?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div 
                key={idx} 
                className="card-industrial group border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading text-xs text-[var(--color-orange)] font-bold">
                    [0{idx + 1}]
                  </span>
                  <h4 className="font-heading text-base text-[var(--text-white)] uppercase tracking-wider group-hover:text-[var(--color-orange)] transition-colors duration-300">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Quality Checklist */}
        <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-[1px] bg-[#ff5200] shadow-[0_0_8px_#ff5200]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 text-[var(--color-orange)] mb-4">
                <Shield className="w-6 h-6" />
                <span className="font-heading text-xs tracking-widest uppercase font-bold">Industrial Quality Policy</span>
              </div>
              <h3 className="font-heading text-3xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-6">
                Our Approach <br className="hidden lg:block" />
                to Quality
              </h3>
              <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed">
                We understand that commercial kitchen hardware is a long-term capital investment. We enforce a zero-compromise approach from raw sheet-grade selection up to structural welding integrity.
              </p>
            </div>

            <div className="lg:col-span-7 quality-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualityPoints.map((point, i) => (
                <div 
                  key={i} 
                  className="quality-item flex gap-3 items-start bg-[var(--bg-panel-light)] p-4 border border-[var(--color-border)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--text-steel-light)] font-body leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
