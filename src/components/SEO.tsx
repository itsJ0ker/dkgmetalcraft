import { useEffect } from 'react';

interface SEOProps {
  activeTab: string;
}

const TAB_SEO_METADATA: Record<string, { title: string; description: string }> = {
  home: {
    title: 'DKG Metalcraft | Commercial Kitchen Equipment & Custom Metal Fabrication',
    description: 'DKG Metal Craft Private Limited is a premier manufacturer of commercial kitchen equipment, stainless steel products, CNC laser cutting, and custom metal fabrication solutions in Delhi, India.',
  },
  capabilities: {
    title: 'Manufacturing Capabilities & CNC Laser Cutting | DKG Metalcraft',
    description: 'Explore DKG Metalcraft advanced manufacturing setup including 5-axis CNC sheet bending, precision fiber laser cutting, food-grade TIG welding, and custom metal fabrication.',
  },
  catalog: {
    title: 'Commercial Kitchen & Metal Product Catalog | DKG Metalcraft',
    description: 'Browse our extensive catalog of stainless steel worktables, commercial cooking ranges, refrigeration equipment, storage units, and custom stainless steel fabrications.',
  },
  about: {
    title: 'About Us & Metallurgical Heritage | DKG Metalcraft Private Limited',
    description: 'Learn about DKG Metalcraft legacy of precision engineering, industrial quality standards, skilled metal craftsmanship, and commitment to client satisfaction.',
  },
  contact: {
    title: 'Contact Us & Request Fabrication Quote | DKG Metalcraft',
    description: 'Get in touch with DKG Metalcraft Private Limited in Delhi, India. Request a custom quote for commercial kitchen equipment or industrial sheet metal fabrication.',
  },
  dashboard: {
    title: 'Industrial Operations & Metrics Dashboard | DKG Metalcraft',
    description: 'Real-time production monitoring, fabrication status, and quality control metrics for DKG Metalcraft industrial manufacturing operations.',
  },
};

export default function SEO({ activeTab }: SEOProps) {
  useEffect(() => {
    const meta = TAB_SEO_METADATA[activeTab] || TAB_SEO_METADATA.home;

    // Update document title
    document.title = meta.title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', meta.description);
    } else {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      descMeta.setAttribute('content', meta.description);
      document.head.appendChild(descMeta);
    }

    // Update Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    // Update Twitter Card Title & Description
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const pageUrl = activeTab === 'home' ? 'https://dkgmetalcraft.com/' : `https://dkgmetalcraft.com/#${activeTab}`;
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', pageUrl);
      document.head.appendChild(canonical);
    }
  }, [activeTab]);

  return null;
}
