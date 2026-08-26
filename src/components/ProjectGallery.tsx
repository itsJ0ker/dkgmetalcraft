import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ALL_PROJECTS = [
  { 
    id: 1, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/21E72A97-AFBE-4573-8B39-DE89E57B777D.jpg', 
    aspect: 'aspect-square' 
  },
  { 
    id: 2, 
    title: 'Video', 
    category: 'Videos', 
    type: 'video', 
    src: '/assets/ourwork/bca44823-0b04-4c2a-8d91-98f0c25c69a4.mov', 
    aspect: 'aspect-video' 
  },
  { 
    id: 3, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/808A2AF4-C67D-467A-B2AE-AA35658D7808.jpg', 
    aspect: 'aspect-[3/4]' 
  },
  { 
    id: 4, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/BA09E4D8-E5E9-444E-9281-397E1DF531D6.jpg', 
    aspect: 'aspect-square' 
  },
  { 
    id: 5, 
    title: 'Video', 
    category: 'Videos', 
    type: 'video', 
    src: '/assets/ourwork/VIDEO-2026-08-26-12-32-51.mov', 
    aspect: 'aspect-video' 
  },
  { 
    id: 6, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/DC7E15BF-0F11-4FE7-A42B-2589864D075C.jpg', 
    aspect: 'aspect-square' 
  },
  { 
    id: 7, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/DF3BBCC2-2954-4D68-A843-D8E777D7594E.jpg', 
    aspect: 'aspect-video' 
  },
  { 
    id: 8, 
    title: 'Image', 
    category: 'Images', 
    type: 'image', 
    src: '/assets/ourwork/image.jpg', 
    aspect: 'aspect-square' 
  },
];

const FILTERS = ['All', 'Images', 'Videos'];

export default function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
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

  const openLightbox = (projectSrc: string) => {
    const idx = filteredProjects.findIndex(p => p.src === projectSrc);
    if (idx !== -1) {
      setSelectedIdx(idx);
    }
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
  };

  const navigateLightbox = (dir: 'next' | 'prev') => {
    if (selectedIdx === null) return;
    if (dir === 'next') {
      setSelectedIdx((selectedIdx + 1) % filteredProjects.length);
    } else {
      setSelectedIdx((selectedIdx - 1 + filteredProjects.length) % filteredProjects.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') {
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((selectedIdx + 1) % filteredProjects.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((selectedIdx - 1 + filteredProjects.length) % filteredProjects.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, filteredProjects]);

  const currentProject = selectedIdx !== null ? filteredProjects[selectedIdx] : null;

  return (
    <section className="py-24 bg-[var(--bg-panel)] relative border-b border-[var(--color-border)]">
      <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-[var(--text-white)] uppercase tracking-tight font-bold mb-2">
              Our <span className="text-[var(--color-orange)]">Work</span>
            </h2>
            <p className="text-[var(--text-steel)] font-body max-w-md font-light">
              A showcase of our custom fabrication designs, commercial equipment, and high-precision metal craft installations.
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

        {/* Masonry Grid */}
        <div 
          ref={galleryRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[260px]"
        >
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => openLightbox(project.src)}
              className={`gallery-card group relative overflow-hidden bg-[var(--bg-dark)] border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-all duration-500 cursor-pointer ${
                project.aspect === 'aspect-video' ? 'md:col-span-2' : ''
              } ${
                project.aspect === 'aspect-[3/4]' ? 'md:row-span-2' : ''
              }`}
            >
              {/* Type Badge */}
              <div className="absolute top-4 left-4 bg-[var(--bg-dark)]/85 border border-[var(--color-border)] px-2.5 py-1 flex items-center gap-1.5 z-10 transition-colors duration-300 group-hover:border-[var(--color-orange)]/40">
                {project.type === 'video' ? (
                  <>
                    <Play className="w-3 h-3 text-[var(--color-orange)] fill-[var(--color-orange)]" />
                    <span className="text-[9px] font-heading tracking-widest text-[var(--text-white)] font-bold uppercase">Video</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3 text-[var(--color-orange)]" />
                    <span className="text-[9px] font-heading tracking-widest text-[var(--text-white)] font-bold uppercase">Image</span>
                  </>
                )}
              </div>

              {/* Render Media */}
              {project.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video
                    src={project.src}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  {/* Subtle video icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-3 bg-[var(--color-orange)] rounded-full text-white shadow-lg shadow-[var(--color-orange)]/30 scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={project.src} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-transparent to-transparent opacity-80 pointer-events-none"></div>
              
              {/* Title & Info */}
              <div className="absolute bottom-0 left-0 p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                <span className="text-[9px] font-heading uppercase tracking-widest text-[var(--color-orange)] block mb-1 font-bold">
                  {project.category}
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--text-white)] uppercase tracking-wider">
                  {project.title}
                </h3>
              </div>
              
              {/* Bottom Right Border Glow Accent */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[var(--color-orange)] transition-colors duration-500 m-4 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {currentProject && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300">
            {/* Close trigger area */}
            <div className="absolute inset-0 cursor-default" onClick={closeLightbox} />

            {/* Lightbox Container */}
            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
              
              {/* Close Button */}
              <button 
                onClick={closeLightbox}
                className="absolute top-[-50px] right-4 md:right-0 text-[var(--text-steel-light)] hover:text-white bg-[var(--bg-panel)] hover:bg-[var(--color-orange)] border border-[var(--color-border)] hover:border-transparent p-2 transition-all duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Left */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 md:-left-16 top-1/2 -translate-y-1/2 text-[var(--text-steel-light)] hover:text-white bg-[var(--bg-panel)]/80 hover:bg-[var(--color-orange)] border border-[var(--color-border)] hover:border-transparent p-3 transition-all duration-300 cursor-pointer z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Navigation Right */}
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 md:-right-16 top-1/2 -translate-y-1/2 text-[var(--text-steel-light)] hover:text-white bg-[var(--bg-panel)]/80 hover:bg-[var(--color-orange)] border border-[var(--color-border)] hover:border-transparent p-3 transition-all duration-300 cursor-pointer z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Media Wrapper */}
              <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-2 md:p-3 shadow-2xl max-h-[80vh] flex items-center justify-center overflow-hidden">
                {currentProject.type === 'video' ? (
                  <video 
                    src={currentProject.src}
                    className="max-h-[75vh] max-w-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img 
                    src={currentProject.src}
                    alt={currentProject.title}
                    className="max-h-[75vh] max-w-full object-contain"
                  />
                )}
              </div>

              {/* Details footer */}
              <div className="mt-4 text-center">
                <span className="text-[10px] font-heading uppercase tracking-widest text-[var(--color-orange)] block font-bold mb-1">
                  {currentProject.category}
                </span>
                <h3 className="text-xl font-heading font-bold text-[var(--text-white)] uppercase tracking-widest">
                  {currentProject.title}
                </h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
