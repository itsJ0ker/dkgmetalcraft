import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Capabilities from './components/Capabilities';
import Catalog from './components/Catalog';
import About from './components/About';
import Contact from './components/Contact';
import AIChatbot from './components/AIChatbot';
import Dashboard from './components/Dashboard';
import ScreenSwitchOverlay from './components/ScreenSwitchOverlay';
import SEO from './components/SEO';
import { Analytics } from '@vercel/analytics/react';
import { initializeAnalytics, trackEvent } from './utils/analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home'); // actual rendered tab (swapped midway in transition)
  const [targetTab, setTargetTab] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'colorful'>(() => (localStorage.getItem('dkg_theme') as 'dark' | 'light' | 'colorful') || 'dark');

  useEffect(() => {
    initializeAnalytics();
    trackEvent('page_view', { tab: 'home' });
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'colorful') => {
    setTheme(newTheme);
    localStorage.setItem('dkg_theme', newTheme);
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === displayTab || isTransitioning) return;

    trackEvent('page_view', { tab: newTab });
    setTargetTab(newTab);
    setIsTransitioning(true);
  };

  const handleMidpoint = () => {
    setDisplayTab(targetTab);
    setActiveTab(targetTab);
    window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    setIsTransitioning(false);
  };

  const renderActiveSection = () => {
    switch (displayTab) {
      case 'home':
        return <Home onExplore={() => handleTabChange('capabilities')} />;
      case 'capabilities':
        return <Capabilities />;
      case 'catalog':
        return <Catalog />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home onExplore={() => handleTabChange('capabilities')} />;
    }
  };

  return (
    <div className={`relative min-h-screen bg-[var(--bg-dark)] flex flex-col justify-between overflow-x-hidden ${theme === 'light' ? 'light-theme' : theme === 'colorful' ? 'colorful-theme' : ''}`}>
      {/* Dynamic SEO Manager for Active Tab */}
      <SEO activeTab={displayTab} />

      {/* 100% New High-Tech Screen Switch Transition Overlay (No Canvas Sparks) */}
      <ScreenSwitchOverlay
        isTransitioning={isTransitioning}
        targetTab={targetTab}
        onMidpoint={handleMidpoint}
        onComplete={handleComplete}
      />

      {/* Global Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} setTheme={handleThemeChange} />

      {/* Main Content Render */}
      <main className="flex-1 w-full relative">
        <div className="animate-fadeIn duration-500">
          {renderActiveSection()}
        </div>
      </main>

      {/* Global AI Chat Support Bot Terminal */}
      <AIChatbot />

      {/* Global Footer */}
      <Footer setActiveTab={handleTabChange} />
      <Analytics />
    </div>
  );
}

