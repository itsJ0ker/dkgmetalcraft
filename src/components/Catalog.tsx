import { useState, useEffect } from 'react';
import { Download, ZoomIn, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { gsap } from 'gsap';

export default function Catalog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const totalPages = 12;

  // Category tags mapping to catalog pages
  const categories = [
    { label: "ALL PAGES", pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { label: "WORK TABLES & CABINETS", pages: [2, 3] },
    { label: "SINKS & WASHING", pages: [4] },
    { label: "BAIN MARIES & WARMERS", pages: [5] },
    { label: "DISPLAY COUNTERS", pages: [6, 7] },
    { label: "COOKING & SERVICE", pages: [8, 10, 11] },
    { label: "RACKS & TROLLEYS", pages: [9] }
  ];

  const [activeCategory, setActiveCategory] = useState(0);

  const getPageUrl = (num: number) => `/assets/catalog_pages/page_${num}.png`;

  const handlePageChange = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setCurrentPage(num);
  };

  const handleCategoryClick = (catIndex: number) => {
    setActiveCategory(catIndex);
    const pages = categories[catIndex].pages;
    if (!pages.includes(currentPage)) {
      setCurrentPage(pages[0]);
    }
  };

  // GSAP animation for page transitions
  useEffect(() => {
    gsap.fromTo(
      '.catalog-main-image',
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, [currentPage]);

  return (
    <section className="relative min-h-screen bg-[var(--bg-dark)] py-24 border-b border-[var(--color-border)]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="font-heading text-xs tracking-[0.3em] text-[var(--color-orange)] uppercase block mb-3">
              Explore Our Range
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase">
              Product <span className="text-gradient">Catalog</span>
            </h2>
            <p className="font-body text-[var(--text-steel)] text-sm font-light leading-relaxed">
              Browse through our official digital catalog containing technical designs, images, and dimensions of our complete kitchen, catering, and metal fabrication range.
            </p>
          </div>

          <div>
            <a 
              href="/assets/METALCRAFT CATALOG FINAL.pdf" 
              download="DKG_Metal_Craft_Catalog.pdf"
              className="btn-industrial btn-industrial-primary flex items-center justify-center gap-3 w-full md:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PDF CATALOG</span>
            </a>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[var(--color-border-light)]">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(index)}
              className={`font-heading text-[10px] tracking-widest font-semibold px-4 py-2 bg-transparent border cursor-pointer transition-all duration-300 ${
                activeCategory === index 
                  ? 'text-[var(--color-orange)] border-[var(--color-orange)] bg-[var(--color-orange-glow)]' 
                  : 'text-[var(--text-steel)] border-[var(--color-border)] hover:text-[var(--text-white)] hover:border-[#71717a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Viewer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center: Main Page Display */}
          <div className="lg:col-span-8 bg-[var(--bg-panel)] border border-[var(--color-border)] p-4 md:p-8 flex flex-col items-center justify-between min-h-[500px] md:min-h-[700px] relative">
            
            {/* Quick Actions overlay */}
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <button 
                onClick={() => setIsLightboxOpen(true)}
                className="p-3 bg-[var(--bg-dark)]/90 border border-[var(--color-border)] text-[var(--text-white)] hover:text-[var(--color-orange)] hover:border-[var(--color-orange)] transition-colors duration-300 cursor-pointer"
                title="Zoom Page"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Page display box */}
            <div className="flex-1 flex items-center justify-center py-8 w-full max-w-[550px] mx-auto">
              <div 
                className="relative cursor-pointer group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={getPageUrl(currentPage)}
                  alt={`DKG Catalog Page ${currentPage}`}
                  className="catalog-main-image max-w-full max-h-[500px] md:max-h-[600px] object-contain shadow-2xl border border-[var(--color-border)] transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-[#000]/0 group-hover:bg-[#000]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 text-xs font-heading text-[var(--text-white)] tracking-widest bg-[#ff5200] px-4 py-2 shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>ZOOM SPECIFICATIONS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="w-full border-t border-[var(--color-border-light)] pt-6 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-transparent border border-[var(--color-border)] text-[var(--text-steel)] hover:text-[var(--text-white)] hover:border-white disabled:opacity-30 disabled:hover:text-[var(--text-steel)] disabled:hover:border-[var(--color-border)] transition-colors duration-300 cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-heading text-xs tracking-[0.25em] text-[var(--text-steel)]">
                PAGE <span className="text-[var(--color-orange)] font-bold">{String(currentPage).padStart(2, '0')}</span> / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-transparent border border-[var(--color-border)] text-[var(--text-steel)] hover:text-[var(--text-white)] hover:border-white disabled:opacity-30 disabled:hover:text-[var(--text-steel)] disabled:hover:border-[var(--color-border)] transition-colors duration-300 cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right: Thumbnails Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-4 max-h-[500px] md:max-h-[700px] overflow-y-auto pr-2">
            <h3 className="font-heading text-xs text-[var(--text-white)] font-semibold tracking-widest uppercase pb-2 border-b border-[var(--color-border)]">
              Catalog Pages
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories[activeCategory].pages.map((pageNum) => (
                <div
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`relative cursor-pointer border overflow-hidden aspect-[3/4] flex items-center justify-center p-1 bg-[var(--bg-panel)] transition-all duration-300 hover:scale-[1.03] ${
                    currentPage === pageNum 
                      ? 'border-[var(--color-orange)] shadow-[0_0_8px_rgba(255,82,0,0.2)]' 
                      : 'border-[var(--color-border)] hover:border-[#71717a]'
                  }`}
                >
                  <img
                    src={getPageUrl(pageNum)}
                    alt={`Thumb ${pageNum}`}
                    className="w-full h-full object-contain filter brightness-[0.7] hover:brightness-[1]"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 font-heading text-[8px] bg-black/80 px-1 text-[var(--color-orange)] font-semibold border border-[var(--color-border)]">
                    {String(pageNum).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / Zoom Overlay */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-dark)]/95 flex flex-col justify-between p-4 backdrop-blur-sm">
          {/* Header toolbar */}
          <div className="flex justify-between items-center w-full max-w-6xl mx-auto py-2">
            <span className="font-heading text-xs tracking-widest text-[var(--text-steel)]">
              DKG CATALOG SPEC &bull; PAGE {currentPage} OF {totalPages}
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 bg-[var(--bg-panel)] border border-[var(--color-border)] text-[var(--text-white)] hover:text-[var(--color-orange)] transition-colors duration-300 cursor-pointer"
              aria-label="Close zoomed view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zoombable Image Wrapper */}
          <div className="flex-1 flex items-center justify-center overflow-auto max-h-[85vh] w-full py-4">
            <img
              src={getPageUrl(currentPage)}
              alt={`DKG Catalog Page ${currentPage} High Res`}
              className="max-w-[95vw] max-h-[80vh] md:max-h-[85vh] object-contain shadow-2xl border border-[var(--color-border)]"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex justify-between items-center w-full max-w-6xl mx-auto py-4 border-t border-[var(--color-border-light)]">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--color-border)] text-[var(--text-steel)] hover:text-[var(--text-white)] disabled:opacity-20 cursor-pointer"
            >
              PREVIOUS
            </button>

            <a 
              href={getPageUrl(currentPage)} 
              download={`DKG_Catalog_Page_${currentPage}.png`}
              className="font-heading text-xs text-[var(--text-white)] tracking-widest hover:text-[var(--color-orange)] flex items-center gap-2 text-decoration-none"
            >
              <Download className="w-4 h-4" />
              <span>SAVE THIS PAGE</span>
            </a>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--color-border)] text-[var(--text-steel)] hover:text-[var(--text-white)] disabled:opacity-20 cursor-pointer"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
