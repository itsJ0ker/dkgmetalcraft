import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Layers, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  index: string;
  decimals?: number;
}

function StatCard({ value, suffix, label, description, icon, index, decimals = 0 }: StatItemProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el || !cardRef.current) return;

    const countObj = { val: 0 };
    
    const animation = gsap.to(countObj, {
      val: value,
      duration: 2.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (el) {
          el.textContent = countObj.val.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
        }
      }
    });

    // Fade-in animation for the card itself
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );

    return () => {
      animation.kill();
    };
  }, [value, decimals]);

  return (
    <div 
      ref={cardRef} 
      className="group relative bg-[var(--bg-panel)] border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-all duration-500 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,82,0,0.1)]"
    >
      {/* Top accent glowing line on hover */}
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-[var(--color-orange)] group-hover:w-full transition-all duration-500" />
      
      {/* Tech ID Badge */}
      <div className="absolute top-0 right-0 bg-[var(--bg-dark)] border-b border-l border-[var(--color-border)] px-3 py-1">
        <span className="font-heading text-[10px] tracking-widest text-[var(--color-steel)] group-hover:text-[var(--color-orange)] transition-colors duration-300 font-bold uppercase">{index}</span>
      </div>

      <div className="flex flex-col h-full justify-between">
        {/* Icon & Count Row */}
        <div>
          <div className="text-[var(--color-orange)] mb-6 inline-block p-3 bg-[var(--bg-dark)] border border-[var(--color-border)] group-hover:border-[var(--color-orange)]/30 group-hover:shadow-[0_0_15px_rgba(255,82,0,0.05)] transition-all duration-500">
            {icon}
          </div>
          
          <div className="flex items-baseline text-4xl md:text-5xl font-bold font-heading text-[var(--text-white)] mb-2">
            <span ref={numberRef}>0</span>
            <span className="text-[var(--color-orange)] font-light ml-0.5">{suffix}</span>
          </div>
        </div>

        {/* Label & Description */}
        <div className="mt-4">
          <h3 className="font-heading text-base font-bold text-[var(--text-white)] mb-2 uppercase tracking-wide">
            {label}
          </h3>
          <p className="text-[var(--text-steel)] text-xs md:text-sm font-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Subtle corner grid detail on hover */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-orange)] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      value: 500,
      suffix: '+',
      label: 'Customers Served',
      description: 'Forging strong partnerships with leading hotels, commercial kitchens, canteens, and factories across India.',
      icon: <Users className="w-6 h-6" />,
      index: 'STAT-01'
    },
    {
      value: 6,
      suffix: '',
      label: 'Advanced Capabilities',
      description: 'In-house CNC laser cutting, bending, power pressing, pipe bending, sheet rolling, and spot welding.',
      icon: <Layers className="w-6 h-6" />,
      index: 'STAT-02'
    },
    {
      value: 99.8,
      suffix: '%',
      label: 'Precision Rate',
      description: 'Achieved via state-of-the-art machinery and rigorous quality control for absolute design accuracy.',
      icon: <ShieldCheck className="w-6 h-6" />,
      index: 'STAT-03',
      decimals: 1
    }
  ];

  return (
    <section className="py-20 bg-[var(--bg-dark)] relative border-b border-[var(--color-border)] overflow-hidden">
      {/* Industrial grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      
      {/* Side structural lines */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[var(--color-border)] opacity-20 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-[var(--color-border)] opacity-20 hidden lg:block" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-heading text-xs tracking-[0.3em] text-[var(--color-orange)] uppercase block mb-3 font-semibold">
            DKG Craft by the Numbers
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-white)] uppercase max-w-3xl mx-auto">
            Engineered For <span className="text-gradient">Performance & Scale</span>
          </h2>
          <div className="w-16 h-[1px] bg-[var(--color-orange)] mx-auto mt-6 shadow-[0_0_8px_var(--color-orange)]" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              index={stat.index}
              decimals={stat.decimals}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
