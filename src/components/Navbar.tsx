import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light' | 'colorful';
  setTheme: (theme: 'dark' | 'light' | 'colorful') => void;
}

export default function Navbar({ activeTab, setActiveTab, theme, setTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'THE FORGE' },
    { id: 'capabilities', label: 'CAPABILITIES' },
    { id: 'catalog', label: 'CATALOG' },
    { id: 'about', label: 'STORY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    
    // Smooth scroll to top of component or section if needed, but since it's a SPA tab system we just update state
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ThemeSelector = () => (
    <div className="flex bg-[var(--bg-panel)] border border-[var(--color-border)] p-0.5 gap-0.5 relative select-none">
      <button
        onClick={() => setTheme('dark')}
        className={`px-2 py-1 text-[8px] font-heading tracking-widest border-none cursor-pointer transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-[var(--color-orange)] text-white shadow-sm'
            : 'text-[var(--text-steel)] hover:text-[var(--text-white)] bg-transparent'
        }`}
      >
        DARK
      </button>
      <button
        onClick={() => setTheme('light')}
        className={`px-2 py-1 text-[8px] font-heading tracking-widest border-none cursor-pointer transition-all duration-200 ${
          theme === 'light'
            ? 'bg-[var(--color-orange)] text-white shadow-sm'
            : 'text-[var(--text-steel)] hover:text-[var(--text-white)] bg-transparent'
        }`}
      >
        LIGHT
      </button>
      <button
        onClick={() => setTheme('colorful')}
        className={`px-2 py-1 text-[8px] font-heading tracking-widest border-none cursor-pointer transition-all duration-200 ${
          theme === 'colorful'
            ? 'bg-[var(--color-orange)] text-white shadow-sm'
            : 'text-[var(--text-steel)] hover:text-[var(--text-white)] bg-transparent'
        }`}
      >
        FORGE
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-dark)]/80 backdrop-blur-md border-b border-[var(--color-border)] h-[80px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        {/* Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <img src="/assets/logo.png" alt="DKG Metal Craft Logo" className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-heading text-lg md:text-2xl font-bold tracking-tight text-[var(--text-white)] leading-none uppercase">DKG <span className="text-[var(--color-orange)]">Metalcraft</span></span>
            <span className="font-sans text-[8px] md:text-xs text-[var(--text-steel)] tracking-widest uppercase mt-1">Private Limited</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-heading text-xs tracking-[0.2em] font-medium transition-all duration-300 relative py-2 bg-transparent border-none cursor-pointer ${
                activeTab === item.id 
                  ? 'text-[#ff5200]' 
                  : 'text-[var(--text-steel)] hover:text-[var(--text-white)]'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff5200] shadow-[0_0_8px_#ff5200]"></span>
              )}
            </button>
          ))}
          
          {/* Segmented Theme Selector */}
          <ThemeSelector />
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Hamburger Menu (Mobile) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--text-white)] bg-transparent border-none cursor-pointer p-2 flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-[var(--bg-dark)]/98 backdrop-blur-md z-40 border-t border-[var(--color-border)] md:hidden flex flex-col justify-center items-center gap-8 animate-fadeIn">
          {/* Theme Selector inside mobile drawer */}
          <div className="mb-2 text-center">
            <span className="font-heading text-[8px] tracking-[0.25em] text-[var(--text-steel)] uppercase block mb-2">
              SELECT THEME
            </span>
            <ThemeSelector />
          </div>
          
          <div className="h-[1px] w-12 bg-[var(--color-border)]"></div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-heading text-lg tracking-[0.25em] transition-all duration-300 bg-transparent border-none cursor-pointer ${
                activeTab === item.id ? 'text-[#ff5200]' : 'text-[var(--text-steel)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
