import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Target, 
  Compass, 
  Sparkles, 
  Shield, 
  CheckCircle2, 
  ChevronDown, 
  Maximize2,
  Minimize2,
  Building2,
  Layers,
  Check
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StoryItem {
  id: string;
  number: string;
  badge: string;
  title: string;
  icon: typeof Sparkles;
  quote: string;
  summary: string;
  paragraph1: string;
  paragraph2: string;
  stats: { label: string; value: string }[];
  pillars: string[];
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const weldLineRef = useRef<HTMLDivElement>(null);

  // Accordion state: track open items. By default, open 'who-we-are' or all.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'who-we-are': true,
    'our-vision': false,
    'our-mission': false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      'who-we-are': true,
      'our-vision': true,
      'our-mission': true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      'who-we-are': false,
      'our-vision': false,
      'our-mission': false,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Weld Line drawing animation
      if (weldLineRef.current) {
        gsap.fromTo(
          weldLineRef.current,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.interactive-story-container',
              start: 'top 40%',
              end: 'bottom 60%',
              scrub: true,
            }
          }
        );
      }

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

  const storyItems: StoryItem[] = [
    {
      id: 'who-we-are',
      number: '01',
      badge: 'INDUSTRIAL FOUNDATION & CRAFTSMANSHIP',
      title: 'Who We Are',
      icon: Sparkles,
      quote: 'Engineered in Delhi, Trusted Across India — Transforming Raw Stainless Steel into World-Class Heavy Duty Equipment.',
      summary: 'DKG Metal Craft Private Limited is a premier metal fabrication & engineering powerhouse specializing in commercial kitchen equipment, clean-room cabinetry, and bespoke structural stainless steel solutions.',
      paragraph1: 'Based in the heart of Delhi\'s industrial sector, DKG Metal Craft combines structural engineering expertise with decades of hands-on skilled metal craftsmanship. We specialize in turning raw stainless steel (SS 304, SS 316, SS 430) and industrial metals into high-precision, long-lasting operational fixtures.',
      paragraph2: 'From heavy-duty commercial kitchen exhaust hoods and worktables to pharmaceutical cleanroom cabinets and custom architectural cladding, our state-of-the-art facility handles everything from initial 3D CAD modeling and laser cutting to CNC press forming, seamless TIG welding, and mirror polishing.',
      stats: [
        { label: 'Primary Hub', value: 'Delhi NCR, India' },
        { label: 'Materials', value: 'SS 304 / 316 / Alloys' },
        { label: 'Engineering', value: 'CNC Laser & Press Bending' },
        { label: 'Focus', value: 'Commercial & Industrial' }
      ],
      pillars: [
        'Advanced CNC Sheet Laser Cutting & Forming',
        'Custom Sizing & Bespoke Architectural Metalwork',
        'Heavy-Duty Load Integrity & Reinforced Structural Seams',
        'Sanitary, Burr-Free Grinding for Food & Pharma Standards'
      ]
    },
    {
      id: 'our-vision',
      number: '02',
      badge: 'FUTURE HORIZONS & INNOVATION',
      title: 'Our Vision',
      icon: Compass,
      quote: 'To be recognized globally as the apex standard in metal fabrication, setting benchmarks for engineering precision, durability, and sustainable practices.',
      summary: 'We aspire to pioneer next-generation industrial fabrication by creating innovative, sustainable, and immaculate steel products that stand the test of time and operational stress.',
      paragraph1: 'Our vision is to empower commercial kitchens, industrial plants, and architectural projects with metal fabrication solutions that redefine durability, ergonomic layout, and visual sophistication. We strive to lead India\'s metal craft sector by continually adopting high-precision automated machinery.',
      paragraph2: 'We envision a future where zero-waste laser cutting, energy-efficient manufacturing processes, and modular hygienic steel design come together seamlessly. At DKG Metal Craft, every fixture is engineered to remain functionally flawless and aesthetically pristine for decades.',
      stats: [
        { label: 'Standard', value: 'Zero-Tolerance Precision' },
        { label: 'Longevity', value: 'Multi-Decade Life Cycle' },
        { label: 'Quality', value: '100% Pre-Dispatch Audit' },
        { label: 'Goal', value: 'National Tier Fabricator' }
      ],
      pillars: [
        'Next-Gen High-Precision Automated Laser Centers',
        'Modular & Hygienic Stainless Steel Systems',
        'Eco-Friendly Zero-Waste Sheet Nesting Practices',
        'Pan-India Commercial & Industrial Network Expansion'
      ]
    },
    {
      id: 'our-mission',
      number: '03',
      badge: 'OUR DAILY OPERATIONAL COMMITMENT',
      title: 'Our Mission',
      icon: Target,
      quote: 'To deliver precision-engineered stainless steel products on time, strictly aligned with customer specifications, and built for heavy industrial usage.',
      summary: 'To manufacture dependable, precision-crafted metal products using certified raw materials, state-of-the-art technology, and transparent customer service.',
      paragraph1: 'Our mission centers on absolute perfection and zero compromise. From the moment custom architectural dimensions are received to final seam polishing and factory dispatch, every product passes through strict multi-stage quality inspections.',
      paragraph2: 'We partner directly with hoteliers, commercial kitchen designers, pharmaceutical architects, and general contractors—acting as a trusted manufacturing partner who turns complex engineering blueprints into robust, sanitary, and high-performing steel reality.',
      stats: [
        { label: 'Turnaround', value: 'Fast CAD to Fabrication' },
        { label: 'Tolerance', value: 'Sub-Millimeter Accuracy' },
        { label: 'Pricing', value: 'Competitive Factory-Direct' },
        { label: 'Support', value: 'End-to-End Technical Guidance' }
      ],
      pillars: [
        'Strict Material Grade Certification (SS 304/316)',
        'Sanitary, Smooth Seam Welding & Polishing',
        'Robust Structural Ribbing & High-Load Testing',
        'Transparent Communication & Timely Delivery Guarantees'
      ]
    }
  ];

  const whyChooseUs = [
    { title: "Custom Manufacturing", desc: "Solutions engineered to your exact dimensions, design blueprints, and heavy operational requirements." },
    { title: "Precision Engineering", desc: "Advanced CNC laser cutting and press bending maintain high dimensional accuracy and clean edges." },
    { title: "Quality Workmanship", desc: "A strong structural focus on clean TIG welding seams, robust joint reinforcing, and sanitary finishes." },
    { title: "Full In-House Fabrication", desc: "From raw sheet metal cutting to press forming, rolling, welding, and polishing all under one roof." },
    { title: "Commercial Kitchen Expertise", desc: "Deep functional understanding of professional catering standards, food safety, and ergonomic kitchen workflows." },
    { title: "Competitive Factory Value", desc: "Balancing peak industrial performance with direct, realistic factory pricing structures." },
    { title: "Reliable Service & Delivery", desc: "Direct, transparent communication and dependable dispatch deadlines for all client projects." }
  ];

  const qualityPoints = [
    "Proper material grade selection (SS 304, SS 202, SS 430)",
    "Dimensional accuracy matching architectural CAD designs",
    "High-load weld integrity and joint reinforcing structural ribs",
    "Clean, burr-free and sanitary grinding/polishing of all seams",
    "Ergonomic, user-safe drawer glides and silent cabinet closures",
    "Maximum product lifecycle stability and scratch resistance",
    "Comprehensive pre-dispatch quality checks & surface protection"
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-[var(--bg-dark)] py-16 md:py-24 border-b border-[var(--color-border)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      {/* Background Glowing Highlights */}
      <div className="glow-point top-1/4 right-10"></div>
      <div className="glow-point bottom-1/3 left-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-panel-light)] border border-[var(--color-border)] mb-4">
            <Building2 className="w-4 h-4 text-[var(--color-orange)]" />
            <span className="font-heading text-xs tracking-[0.25em] text-[var(--color-orange)] uppercase font-semibold">
              Company Story & Pillars
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase leading-tight">
            Crafting the <span className="text-gradient">Steel Vision</span>
          </h2>
          <p className="font-body text-[var(--text-steel-light)] text-base md:text-lg font-light leading-relaxed max-w-3xl">
            DKG Metal Craft Private Limited transforms raw industrial alloys into high-precision, heavy-duty commercial fixtures. Explore our company foundation, future vision, and daily operational commitments below.
          </p>
        </div>

        {/* Accordion / Dropdown Interactive Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xs uppercase tracking-widest text-[var(--text-steel)]">
              Interactive Story Breakdown
            </span>
            <span className="text-xs px-2.5 py-0.5 bg-[var(--bg-panel-light)] border border-[var(--color-border)] text-[var(--color-orange)] font-mono font-bold">
              3 PILLARS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={expandAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading tracking-wider uppercase bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-light)] text-[var(--text-steel-light)] hover:text-[var(--color-orange)] border border-[var(--color-border)] transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>
            <button 
              onClick={collapseAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading tracking-wider uppercase bg-[var(--bg-panel)] hover:bg-[var(--bg-panel-light)] text-[var(--text-steel-light)] hover:text-[var(--color-orange)] border border-[var(--color-border)] transition-all cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>

        {/* Section 1: Interactive Dropdown / Accordion Story Cards */}
        <div className="interactive-story-container max-w-5xl mx-auto mb-28 space-y-6">
          {storyItems.map((item) => {
            const IconComponent = item.icon;
            const isOpen = !!openSections[item.id];

            return (
              <div 
                key={item.id}
                className={`bg-[var(--bg-panel)] border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-[var(--color-orange)] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_var(--color-orange-glow)]' 
                    : 'border-[var(--color-border)] hover:border-[var(--color-steel)]'
                }`}
              >
                {/* Accordion / Dropdown Clickable Header */}
                <button
                  onClick={() => toggleSection(item.id)}
                  className="w-full text-left p-5 sm:p-6 md:p-8 flex items-start sm:items-center justify-between gap-4 bg-transparent border-none cursor-pointer group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    {/* Number Badge */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 border flex items-center justify-center font-heading text-lg sm:text-xl font-bold transition-all ${
                      isOpen 
                        ? 'bg-[var(--color-orange)] text-white border-[var(--color-orange)] shadow-[0_0_12px_#ff5200]' 
                        : 'bg-[var(--bg-panel-light)] text-[var(--color-orange)] border-[var(--color-border)] group-hover:border-[var(--color-orange)]'
                    }`}>
                      {item.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-heading text-[10px] sm:text-xs tracking-[0.2em] text-[var(--color-orange)] uppercase font-semibold block truncate">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-white)] uppercase tracking-wide group-hover:text-[var(--color-orange)] transition-colors flex items-center gap-3">
                        <span>{item.title}</span>
                      </h3>
                      {/* Short summary snippet on closed state */}
                      {!isOpen && (
                        <p className="text-xs sm:text-sm text-[var(--text-steel)] line-clamp-1 mt-1 font-body">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Toggle Action Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-all ${
                      isOpen 
                        ? 'bg-[var(--color-orange)] text-white border-[var(--color-orange)] rotate-180' 
                        : 'bg-[var(--bg-panel-light)] text-[var(--text-white)] border-[var(--color-border)] group-hover:border-[var(--color-orange)] group-hover:text-[var(--color-orange)]'
                    }`}>
                      <ChevronDown className="w-6 h-6 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Expanded Panel Content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 md:px-8 pb-8 pt-2 border-t border-[var(--color-border)] animate-fadeIn">
                    
                    {/* Featured Quote Box - Large prominent typography */}
                    <div className="mb-8 p-5 sm:p-6 bg-[var(--bg-panel-light)] border-l-4 border-[var(--color-orange)] relative">
                      <p className="font-heading text-base sm:text-lg md:text-xl font-medium text-[var(--text-white)] italic leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Detailed Multi-Paragraph Content (Bigger font sizes) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="font-heading text-sm text-[var(--color-orange)] tracking-widest uppercase font-bold flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>Detailed Overview</span>
                        </h4>
                        <p className="font-body text-sm sm:text-base text-[var(--text-steel-light)] leading-relaxed font-light">
                          {item.paragraph1}
                        </p>
                        <p className="font-body text-sm sm:text-base text-[var(--text-steel-light)] leading-relaxed font-light">
                          {item.paragraph2}
                        </p>
                      </div>

                      {/* Key Operational Pillars / Bullet Points */}
                      <div className="lg:col-span-5 bg-[var(--bg-panel-light)] p-6 border border-[var(--color-border)] flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading text-xs tracking-[0.2em] text-[var(--color-orange)] uppercase font-bold mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span>Core Standards & Features</span>
                          </h4>
                          <ul className="space-y-3">
                            {item.pillars.map((pillar, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-3">
                                <div className="w-4 h-4 rounded-full bg-[var(--color-orange)]/10 border border-[var(--color-orange)] flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-2.5 h-2.5 text-[var(--color-orange)]" />
                                </div>
                                <span className="font-body text-xs sm:text-sm text-[var(--text-white)] leading-snug">
                                  {pillar}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* High Impact Key Metrics / Stat Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[var(--color-border)]">
                      {item.stats.map((st, sIdx) => (
                        <div 
                          key={sIdx}
                          className="bg-[var(--bg-panel-light)] p-3 sm:p-4 border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-colors"
                        >
                          <span className="font-heading text-[10px] sm:text-xs text-[var(--text-steel)] uppercase tracking-wider block mb-1">
                            {st.label}
                          </span>
                          <span className="font-heading text-xs sm:text-sm md:text-base text-[var(--text-white)] font-bold block truncate">
                            {st.value}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 2: Why Choose Us */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="font-heading text-xs tracking-[0.25em] text-[var(--color-orange)] uppercase font-bold block mb-2">
              Our Core Pillars
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--text-white)] uppercase tracking-widest">
              Why DKG Metal Craft?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div 
                key={idx} 
                className="card-industrial group border border-[var(--color-border)] p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading text-xs text-[var(--color-orange)] font-bold">
                    [0{idx + 1}]
                  </span>
                  <h4 className="font-heading text-base sm:text-lg text-[var(--text-white)] uppercase tracking-wider group-hover:text-[var(--color-orange)] transition-colors duration-300">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-steel-light)] font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Quality Checklist */}
        <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-6 sm:p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-[2px] bg-[#ff5200] shadow-[0_0_10px_#ff5200]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 text-[var(--color-orange)] mb-4">
                <Shield className="w-6 h-6" />
                <span className="font-heading text-xs tracking-widest uppercase font-bold">Industrial Quality Policy</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-6">
                Our Approach <br className="hidden lg:block" />
                to Quality
              </h3>
              <p className="text-sm text-[var(--text-steel-light)] font-body leading-relaxed">
                We understand that commercial kitchen hardware and industrial metal fixtures represent long-term capital investments. We enforce a zero-compromise policy from raw sheet-grade verification up to final structural welding and surface finishing.
              </p>
            </div>

            <div className="lg:col-span-7 quality-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualityPoints.map((point, i) => (
                <div 
                  key={i} 
                  className="quality-item flex gap-3 items-start bg-[var(--bg-panel-light)] p-4 border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[var(--text-steel-light)] font-body leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

