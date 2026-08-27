import { Mail, Phone, MapPin, ShieldAlert, Award, Lock } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-dark)] border-t border-[var(--color-border)] pt-16 pb-8 text-[var(--text-steel)] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="mb-6">
              <img src="/assets/logo.png" alt="DKG Metal Craft Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              Trusted manufacturer of commercial kitchen equipment, stainless steel products, and customized metal fabrication. Combining precision engineering and skilled craftsmanship.
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--color-orange)] mb-8">
              <Award className="w-4 h-4" />
              <span className="font-heading tracking-wider uppercase">ISO 9001:2015 Certified Manufacturing</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/dkgmetalcraft" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_contact_click', { platform: 'Instagram' })}
                className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.3)] hover:-translate-y-1 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://facebook.com/dkgmetalcraft" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_contact_click', { platform: 'Facebook' })}
                className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] hover:-translate-y-1 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.59-4H14V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href="https://wa.me/919899592920" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('social_contact_click', { platform: 'WhatsApp' })}
                className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:-translate-y-1 transition-all duration-300 group"
                aria-label="WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-[var(--text-white)] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Sections
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--text-white)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                >
                  The Forge (Home)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('capabilities'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--text-white)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                >
                  Capabilities
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--text-white)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--text-white)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                >
                  Story & Quality
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--text-white)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
                >
                  Get a Quote (Contact)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[var(--color-orange)] text-[var(--text-steel)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Admin Terminal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-heading text-[var(--text-white)] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Headquarters
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                <span>
                  Kh. No. 93/24, Ground Floor, Plot No. 24, Village Mundka, New Delhi-110041, India
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-[var(--color-orange)] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+919899592920" className="hover:text-[var(--text-white)] transition-colors duration-300 text-[var(--text-steel)] text-decoration-none">
                    +91-9899592920
                  </a>
                  <a href="tel:+919873667806" className="hover:text-[var(--text-white)] transition-colors duration-300 text-[var(--text-steel)] text-decoration-none">
                    +91-9873667806
                  </a>
                  <a href="tel:01145019426" className="hover:text-[var(--text-white)] transition-colors duration-300 text-[var(--text-steel)] text-decoration-none">
                    011 45019426
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-[var(--color-orange)] shrink-0" />
                <a href="mailto:dkgmetalcraft@gmail.com" className="hover:text-[var(--text-white)] transition-colors duration-300 text-[var(--text-steel)] text-decoration-none">
                  dkgmetalcraft@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border-light)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            &copy; {currentYear} DKG Metal Craft Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-[#444] text-[10px]">
            <ShieldAlert className="w-3 h-3" />
            <span>Precision Manufactured in New Delhi, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
