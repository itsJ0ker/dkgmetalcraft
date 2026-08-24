import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const ALL_PROJECTS = [
  { id: 1, title: 'Commercial Bain Marie', category: 'Kitchen Setups', img: '/assets/6.jpg', aspect: 'aspect-square' },
  { id: 2, title: 'Precision Gear', category: 'Laser Cut Parts', img: '/assets/1.jpg', aspect: 'aspect-video' },
  { id: 3, title: 'Custom Exhaust Hood', category: 'Custom Racks', img: '/assets/4.jpg', aspect: 'aspect-square' },
  { id: 4, title: 'Prep Table Line', category: 'Kitchen Setups', img: '/assets/2.jpg', aspect: 'aspect-[3/4]' },
  { id: 5, title: 'Folded Panel', category: 'Custom Racks', img: '/assets/3.jpg', aspect: 'aspect-video' },
  { id: 6, title: 'SS 304 Sink Array', category: 'Kitchen Setups', img: '/assets/5.jpg', aspect: 'aspect-square' },
];

const FILTERS = ['All', 'Kitchen Setups', 'Custom Racks', 'Laser Cut Parts'];

export default function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeFilter === 'All' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category === activeFilter);

  // GSAP animation when filter changes
  useEffect(() => {
    if (galleryRef.current) {
      const cards = galleryRef.current.querySelectorAll('.gallery-card');
      
      // Reset opacity and scale immediately to prevent flash
      gsap.set(cards, { opacity: 0, scale: 0.95, y: 15 });
      
      // Animate them in sequentially
      gsap.to(cards, { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: 'power2.out', 
        overwrite: true 
      });
    }
  }, [activeFilter]);

  return (
    <section className="py-24 bg-[var(--bg-panel)] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-[var(--text-white)] uppercase tracking-tight font-bold mb-2">
              Our <span className="text-[var(--color-orange)]">Work</span>
            </h2>
            <p className="text-[var(--text-steel)] font-sans max-w-md">
              A showcase of our premium commercial kitchen installations and custom fabrication projects.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 font-heading text-xs uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                  activeFilter === f
                    ? 'border-[var(--color-orange)] bg-[var(--color-orange)] text-[var(--text-white)] shadow-[0_0_15px_var(--color-orange-glow)]'
                    : 'border-[var(--color-border)] text-[var(--text-steel)] hover:border-[var(--color-orange)] hover:text-[var(--color-orange)] bg-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-like CSS Grid */}
        <div 
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]"
        >
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className={`gallery-card group relative overflow-hidden bg-[var(--bg-dark)] border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-colors duration-500 cursor-pointer ${
                project.aspect === 'aspect-video' ? 'md:col-span-2' : ''
              } ${
                project.aspect === 'aspect-[3/4]' ? 'md:row-span-2' : ''
              }`}
            >
              <img 
                src={project.img} 
                alt={project.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 md:grayscale md:group-hover:grayscale-0"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-heading uppercase tracking-widest text-[var(--color-orange)] block mb-1">
                  {project.category}
                </span>
                <h3 className="text-lg font-heading font-bold text-[var(--text-white)] uppercase">
                  {project.title}
                </h3>
              </div>
              
              {/* Animated Corner Accent */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[var(--color-orange)] transition-colors duration-500 m-4"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
