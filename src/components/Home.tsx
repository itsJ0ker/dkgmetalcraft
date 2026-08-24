import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ChevronRight, Settings, Wrench, Shield, Zap, Layers, Cpu, Disc, Hammer } from 'lucide-react';
import Hero from './Hero';
import ProcessFlow3D from './ProcessFlow3D';
import ProjectGallery from './ProjectGallery';
gsap.registerPlugin(ScrollTrigger);

interface HomeProps {
  onExplore: () => void;
}

export default function Home({ onExplore }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray('.animate-section');
    
    sections.forEach((section: any) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    const cards = gsap.utils.toArray('.machine-card');
    cards.forEach((card: any, index) => {
      gsap.fromTo(card, 
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });

    const whyCards = gsap.utils.toArray('.why-card');
    gsap.fromTo(whyCards,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.why-container',
          start: 'top 75%'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const machines = [
    { title: 'Laser Cutting', desc: 'Precision laser cutting helps us produce accurate shapes, patterns, and sheet-metal parts with consistent quality.', img: '/assets/lasercutting.jpg', icon: <Zap className="w-6 h-6" /> },
    { title: 'Bending Machine', desc: 'Our bending capabilities allow us to manufacture accurately shaped components, cabinets, and customised metal structures.', img: '/assets/bending.jpg', icon: <Layers className="w-6 h-6" /> },
    { title: 'Power Press', desc: 'We can manufacture and process selected metal components according to production and design requirements.', img: '/assets/powerpress.jpg', icon: <Cpu className="w-6 h-6" /> },
    { title: 'Pipe Bending', desc: 'Our capabilities also include pipe bending for the manufacturing of frames, structures, stands, and customised metal products.', img: '/assets/pipebending.jpg', icon: <Disc className="w-6 h-6" /> },
    { title: 'Sheet Rolling Machine', desc: 'Rolling of sheets and structural sections for heavy-duty industrial framing and custom contoured panels.', img: '/assets/sheetrolling.jpg', icon: <Settings className="w-6 h-6" /> },
    { title: 'Spot Welding Machine', desc: 'High-integrity spot welding specializing in stainless steel to ensure product durability, stability, and long-term performance.', img: '/assets/spotwelding.jpg', icon: <Hammer className="w-6 h-6" /> }
  ];

  const whyChooseUs = [
    'Customised manufacturing solutions',
    'Precision laser cutting & fabrication',
    'Quality stainless steel workmanship',
    'Commercial kitchen equipment expertise',
    'Modern manufacturing capabilities',
    'Durable and functional product designs',
    'Competitive pricing & value',
    'Reliable customer support'
  ];

  return (
    <div ref={containerRef} className="w-full relative">
      {/* 1. Hero Section */}
      <Hero onExplore={onExplore} />

      {/* 2. Machines & Capabilities Showcase */}
      <section className="py-24 bg-[var(--bg-panel)] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 animate-section">
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-white)] uppercase mb-4">
              Modern <span className="text-gradient">Manufacturing</span> Capabilities
            </h2>
            <p className="text-[var(--text-steel)] font-light max-w-2xl mx-auto">
              Our advanced setup enables us to handle different types of sheet-metal and fabrication requirements with extreme precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {machines.map((machine, i) => (
              <div key={i} className="machine-card group relative flex flex-col md:flex-row bg-[var(--bg-dark)] border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-colors duration-500 overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,82,0,0.15)]">
                {/* Tech ID Badge */}
                <div className="absolute top-0 right-0 bg-[var(--bg-panel)] border-b border-l border-[var(--color-border)] px-3 py-1 z-20">
                  <span className="font-heading text-[10px] tracking-widest text-[var(--color-orange)] font-bold">MOD-0{i + 1}</span>
                </div>
                
                <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-[var(--color-orange)]/20 mix-blend-overlay z-10 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={machine.img} alt={machine.title} className="w-full h-full object-cover md:grayscale md:opacity-70 group-hover:grayscale-0 group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-[var(--color-orange)] mb-4">{machine.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-[var(--text-white)] mb-3">{machine.title}</h3>
                  <p className="text-[var(--text-steel)] text-sm font-light leading-relaxed">{machine.desc}</p>
                </div>
                
                {/* Accent Corner Lines */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-orange)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 3D Process Flow */}
      <ProcessFlow3D />

      {/* 2.75 Project Gallery */}
      <ProjectGallery />

      {/* 3. Why Choose Us */}
      <section className="py-24 bg-[var(--bg-dark)] relative border-t border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2 animate-section">
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-white)] uppercase mb-6">
                Why Choose <br /><span className="text-gradient">DKG Metal Craft?</span>
              </h2>
              <p className="text-[var(--text-steel)] font-light leading-relaxed mb-8">
                Every project deserves the right balance of precision, quality, functionality, and value. From standard products to completely customised fabrication, our team works closely with customers to understand their requirements and provide reliable solutions.
              </p>
              <div className="w-[100px] h-[1px] bg-[var(--color-orange)] shadow-[0_0_8px_var(--color-orange)]"></div>
            </div>

            <div className="w-full lg:w-1/2 why-container grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyChooseUs.map((reason, i) => (
                <div key={i} className="why-card flex items-start gap-3 p-4 bg-[var(--bg-panel)] border border-[var(--color-border)] hover:border-[var(--color-orange)]/50 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <span className="text-[var(--text-white)] text-sm font-light">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Approach to Quality */}
      <section className="py-24 bg-[var(--bg-panel)] relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--color-border)] opacity-30"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center animate-section">
          <div className="inline-flex items-center justify-center p-4 bg-[var(--bg-dark)] border border-[var(--color-orange)] rounded-full mb-8 shadow-[0_0_15px_rgba(255,82,0,0.2)]">
            <Shield className="w-8 h-8 text-[var(--color-orange)]" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-white)] uppercase mb-6">
            Our Approach to Quality
          </h2>
          <p className="text-[var(--text-steel)] font-light max-w-3xl mx-auto leading-relaxed text-lg mb-8">
            Quality is an important part of every stage of our work. From material selection to final fabrication and finishing, we focus on delivering products that are reliable and suitable for demanding commercial use. We understand that commercial equipment is an investment.
          </p>
          <button onClick={onExplore} className="btn-industrial btn-industrial-primary inline-flex items-center">
            <span>DISCOVER CATALOG</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}
