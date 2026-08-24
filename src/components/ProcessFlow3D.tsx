import { useState } from 'react';
import { Settings, Wrench, Shield, Zap, Layers, CheckCircle } from 'lucide-react';

export default function ProcessFlow3D() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Blueprint / CAD",
      desc: "Precision digital modeling and wireframing.",
      icon: <Layers className="w-8 h-8 text-[var(--color-orange)]" />,
      detail: "Our engineering team translates your concepts and sketches into detailed 2D/3D CAD models, ensuring precise measurements and structural integrity before any cutting begins."
    },
    {
      id: 1,
      title: "Laser Cutting",
      desc: "High-power lasers cut with ±0.1mm accuracy.",
      icon: <Zap className="w-8 h-8 text-[var(--color-orange)]" />,
      detail: "Using our modern CNC laser cutting machines, we cut steel sheets up to 20mm with incredible precision. This minimizes material waste and ensures perfect edge quality."
    },
    {
      id: 2,
      title: "CNC Bending",
      desc: "Hydraulic folding of complex structures.",
      icon: <Settings className="w-8 h-8 text-[var(--color-orange)]" />,
      detail: "Our hydraulic press brakes fold sheet metal at exact angles. Precise computer control guarantees consistency across high-volume production runs."
    },
    {
      id: 3,
      title: "TIG Welding",
      desc: "High integrity joints with sanitary finishes.",
      icon: <Wrench className="w-8 h-8 text-[var(--color-orange)]" />,
      detail: "Expert welders join components using TIG and MIG welding methods. We specialize in stainless steel welding for food-grade, sanitary applications."
    },
    {
      id: 4,
      title: "Final Polish",
      desc: "Food-grade finishing and buffing.",
      icon: <Shield className="w-8 h-8 text-[var(--color-orange)]" />,
      detail: "Every product is meticulously deburred, polished, and finished. We ensure a clean, professional look that meets strict commercial hygiene standards."
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg-dark)] relative overflow-hidden border-y border-[var(--color-border)]">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-[var(--text-white)] uppercase mb-4 tracking-tight font-bold">
            Manufacturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-orange)] to-yellow-500">Lifecycle</span>
          </h2>
          <p className="text-[var(--text-steel)] max-w-2xl mx-auto font-sans">
            Experience our end-to-end workflow. From digital blueprints to polished, commercial-grade equipment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-stretch bg-[var(--bg-panel)] border border-[var(--color-border)] shadow-2xl p-4 md:p-8 rounded-lg">
          
          {/* Visual Showcase Area */}
          <div className="w-full lg:w-2/3 min-h-[250px] md:min-h-[350px] bg-[var(--bg-dark)] relative border border-[var(--color-border)] overflow-hidden flex flex-col justify-center items-center p-6 pb-16 md:p-8 md:pb-8 rounded-md group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-orange)]/5 via-transparent to-transparent"></div>
            
            {/* Animated Industrial Box Indicator */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-md">
              <div className="mb-6 p-5 bg-[var(--bg-panel)] border border-[var(--color-orange)] rounded-full shadow-[0_0_20px_rgba(255,82,0,0.15)] group-hover:scale-105 transition-transform duration-500">
                {steps[step].icon}
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--text-white)] uppercase tracking-wider mb-4">
                {steps[step].title}
              </h3>
              <p className="text-[var(--text-steel-light)] text-sm font-sans leading-relaxed">
                {steps[step].detail}
              </p>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 bg-[var(--bg-panel)]/80 border border-[var(--color-border)] text-[10px] text-[var(--text-steel)] uppercase tracking-wider rounded">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--color-orange)]" />
              <span>Step {step + 1} of 5</span>
            </div>
          </div>

          {/* Steps Controls Area */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center bg-gradient-to-b from-[var(--bg-panel)] to-[var(--bg-dark)] rounded-md overflow-hidden">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`text-left p-4 md:p-5 transition-all duration-300 relative group border-b border-[var(--color-border)]/50 last:border-0 cursor-pointer ${
                  step === s.id 
                    ? 'bg-[var(--color-orange-glow)]' 
                    : 'hover:bg-[var(--bg-panel-light)]'
                }`}
              >
                {/* Active Indicator Line */}
                <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${
                  step === s.id ? 'bg-[var(--color-orange)]' : 'bg-transparent'
                }`}></div>

                <div className="flex items-start gap-4">
                  <span className={`font-heading font-bold text-xs mt-0.5 tracking-widest ${
                    step === s.id ? 'text-[var(--color-orange)]' : 'text-[var(--text-steel)]'
                  }`}>
                    0{s.id + 1}
                  </span>
                  <div>
                    <h4 className={`font-heading font-bold uppercase tracking-wider text-xs mb-1 transition-colors ${
                      step === s.id ? 'text-[var(--text-white)]' : 'text-[var(--text-steel-light)]'
                    }`}>
                      {s.title}
                    </h4>
                    <p className={`text-[11px] font-sans transition-colors ${
                      step === s.id ? 'text-[var(--text-steel-light)]' : 'text-[var(--text-steel)]'
                    }`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
