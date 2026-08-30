import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calculator, Send, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Work Table',
    ssGrade: 'SS 304',
    length: '',
    width: '',
    height: '850', // standard kitchen height in mm
    customDetails: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [estimatedWeight, setEstimatedWeight] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time metal weight estimator mockup
    if (name === 'length' || name === 'width') {
      const l = parseFloat(name === 'length' ? value : formData.length) || 0;
      const w = parseFloat(name === 'width' ? value : formData.width) || 0;
      if (l > 0 && w > 0) {
        // Mock metal weight calculation (density of SS * area * thickness factor)
        const densityFactor = 0.00000785; // kg/mm3 simplified
        const thickness = 1.2; // 18 gauge standard
        const topWeight = l * w * thickness * densityFactor;
        // add structure factor
        const totalEst = Math.round(topWeight * 2.2);
        setEstimatedWeight(totalEst);
        trackEvent('estimator_calculation', {
          source: 'Contact Form Estimator',
          category: formData.category,
          length: l,
          width: w,
          estimatedWeight: totalEst
        });
      } else {
        setEstimatedWeight(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    trackEvent('blueprint_submit', {
      category: formData.category,
      ssGrade: formData.ssGrade,
      estimatedWeight: estimatedWeight || 'N/A'
    });

    const web3Key = import.meta.env.VITE_WEB3FORMS_KEY;
    if (web3Key) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `New DKG MetalCraft Blueprint from ${formData.name}`,
            from_name: 'DKG Website Blueprint',
            ...formData,
            estimatedWeight: estimatedWeight ? `${estimatedWeight} KG` : 'Not calculated'
          })
        });
        const result = await response.json();
        if (result.success) {
          console.log('Blueprint emailed successfully via Web3Forms');
        }
      } catch (err) {
        console.error('Failed to email blueprint via Web3Forms:', err);
      }
    }

    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen bg-[var(--bg-dark)] py-24">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-heading text-xs tracking-[0.3em] text-[var(--color-orange)] uppercase block mb-3">
            Get in touch
          </span>
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase">
            Connect With <span className="text-gradient">The Forge</span>
          </h2>
          <p className="font-body text-[var(--text-steel)] text-sm md:text-base font-light leading-relaxed">
            Ready to deploy high-integrity steel solutions? Fill in your project blueprint details below to request a customized technical design and pricing quote from our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Contact Info */}
            <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-8 relative">
              <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#ff5200]"></div>
              
              <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-6">
                Direct Channels
              </h3>

              <div className="space-y-6 text-sm">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">FACTORY HEADQUARTERS</h4>
                    <p className="text-[var(--text-white)] font-body leading-relaxed">
                      Kh. No. 93/24, Ground Floor, Plot No. 24,<br />
                      Village Mundka, New Delhi-110041, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">TELEPHONE HOTLINE</h4>
                    <div className="flex flex-col gap-1 font-body text-[var(--text-white)]">
                      <a href="tel:+918595659171" className="hover:text-[var(--color-orange)] transition-colors font-bold">+91-8595659171 (Primary)</a>
                      <a href="tel:+919899592920" className="hover:text-[var(--color-orange)] transition-colors">+91-9899592920</a>
                      <a href="tel:+919873667806" className="hover:text-[var(--color-orange)] transition-colors">+91-9873667806</a>
                      <a href="tel:01145019426" className="hover:text-[var(--color-orange)] transition-colors">011 45019426</a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">GENERAL INQUIRIES</h4>
                    <a href="mailto:dkgmetalcraft@gmail.com" className="text-[var(--text-white)] hover:text-[var(--color-orange)] transition-colors font-body">
                      dkgmetalcraft@gmail.com
                    </a>
                  </div>
                </div>

                {/* Social media connections */}
                <div className="border-t border-[var(--color-border-light)] pt-6 mt-6">
                  <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-3">SOCIAL CONNECTIONS</h4>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://instagram.com/dkgmetalcraft" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.3)] hover:-translate-y-1 transition-all duration-300 group bg-[var(--bg-dark)]"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/share/1Hzu39EJMG/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] hover:-translate-y-1 transition-all duration-300 group bg-[var(--bg-dark)]"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.59-4H14V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://wa.me/918595659171" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--text-steel)] hover:text-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:-translate-y-1 transition-all duration-300 group bg-[var(--bg-dark)]"
                      aria-label="WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Mockup */}
            <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-4 relative overflow-hidden aspect-video flex flex-col justify-end">
              {/* Mock map imagery */}
              <div className="absolute inset-0 bg-[var(--bg-panel-light)] opacity-40 bg-grid flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-orange-glow)] border border-[var(--color-orange)] flex items-center justify-center mx-auto mb-3 animate-ping">
                    <MapPin className="w-6 h-6 text-[var(--color-orange)]" />
                  </div>
                  <span className="font-heading text-[10px] tracking-widest text-[var(--text-steel)]">MUNDKA INDUSTRIAL METROPOLIS</span>
                </div>
              </div>
              
              <div className="relative z-10 bg-[var(--bg-dark)]/90 border border-[var(--color-border)] p-4 flex justify-between items-center">
                <div>
                  <span className="font-heading text-[10px] text-[var(--text-white)] tracking-widest block font-bold">DKG METAL CRAFT</span>
                  <span className="text-[8px] text-[var(--text-steel)] tracking-widest block">Delhi, India</span>
                </div>
                <a 
                  href="https://maps.google.com/?q=Plot+No.+24,+Village+Mundka,+New+Delhi-110041" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-heading text-[8px] tracking-widest text-[var(--color-orange)] border border-[var(--color-orange)]/30 hover:border-[var(--color-orange)] px-3 py-1.5 transition-all text-decoration-none"
                >
                  OPEN MAPS
                </a>
              </div>
            </div>

          </div>

          {/* Right panel: Inquiry Builder Form */}
          <div className="lg:col-span-7 bg-[var(--bg-panel)] border border-[var(--color-border)] p-8 relative">
            <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#ff5200]"></div>
            
            <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-[var(--color-orange)]" />
              <span>Project Blueprint & Inquiry Builder</span>
            </h3>

            {submitted ? (
              <div className="py-16 text-center border border-[var(--color-orange)]/20 bg-[var(--color-orange-glow)] p-6 animate-fadeIn">
                <CheckCircle2 className="w-16 h-16 text-[var(--color-orange)] mx-auto mb-6" />
                <h4 className="font-heading text-xl font-bold text-[var(--text-white)] uppercase tracking-wider mb-3">
                  TRANSMISSION SUCCESSFUL
                </h4>
                <p className="text-xs text-[var(--text-steel)] font-body max-w-md mx-auto leading-relaxed">
                  Your metal blueprint has been logged. Our commercial kitchen estimator will analyze the SS Grade requirements and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-industrial mt-8 text-xs font-semibold"
                >
                  SUBMIT NEW BLUEPRINT
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">FULL NAME *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors"
                      placeholder="e.g. Pankaj Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">COMPANY NAME</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors"
                      placeholder="e.g. Imperial Hotels"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">EMAIL ADDRESS *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors"
                      placeholder="e.g. design@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">PHONE NUMBER *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors"
                      placeholder="e.g. +91 98995 92920"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--color-border-light)] pt-6">
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">EQUIPMENT CATEGORY</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors cursor-pointer"
                    >
                      <option value="Work Table">Stainless Steel Work Table</option>
                      <option value="Sink Unit">Sink Unit / Washing Station</option>
                      <option value="Cabinet">Storage / Wall Cabinet</option>
                      <option value="Bain Marie">Bain Marie / Food Warmer</option>
                      <option value="Display Counter">Hot / Sweet Display Counter</option>
                      <option value="Cooking Range">Commercial Cooking Range</option>
                      <option value="Racks & Shelving">Racks & Shelving Units</option>
                      <option value="Custom Fabrication">Custom Laser Cut / Fabrication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">STAINLESS STEEL GRADE</label>
                    <select
                      name="ssGrade"
                      value={formData.ssGrade}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] transition-colors cursor-pointer"
                    >
                      <option value="SS 304">SS 304 - Food Grade (Corrosion proof)</option>
                      <option value="SS 202">SS 202 - General Commercial (Indoors)</option>
                      <option value="SS 430">SS 430 - High Heat (Burner panels)</option>
                    </select>
                  </div>
                </div>

                {/* Dimensions section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-heading tracking-widest text-[var(--text-white)] uppercase">CUSTOM METRIC DIMENSIONS (Optional, in mm)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input 
                        type="number" 
                        name="length" 
                        value={formData.length}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)]"
                        placeholder="Length (L)"
                      />
                    </div>
                    <div>
                      <input 
                        type="number" 
                        name="width" 
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)]"
                        placeholder="Width (W)"
                      />
                    </div>
                    <div>
                      <input 
                        type="number" 
                        name="height" 
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)]"
                        placeholder="Height (H)"
                      />
                    </div>
                  </div>
                  
                  {estimatedWeight !== null && (
                    <div className="text-[10px] font-heading text-[var(--color-orange)] tracking-widest bg-[var(--color-orange-glow)] border border-[var(--color-orange)]/20 p-2.5 flex justify-between">
                      <span>ESTIMATED SHEET SHEAR MASS:</span>
                      <span className="font-bold">~ {estimatedWeight} KG</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">CUSTOM DESIGN BLUEPRINT DETAILS</label>
                  <textarea
                    name="customDetails"
                    rows={4}
                    value={formData.customDetails}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] p-3 text-xs outline-none focus:border-[var(--color-orange)] resize-none"
                    placeholder="Enter details like metal sheet thickness (e.g. 16 SWG / 18 SWG), under-shelves required, backsplash height, or specific drawer units..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-industrial btn-industrial-primary w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT PROJECT BLUEPRINT</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
