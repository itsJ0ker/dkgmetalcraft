import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, BarChart3, Mail, ShieldAlert, Calculator, Activity, LogOut, Settings, CheckCircle2 } from 'lucide-react';
import { getAnalyticsSummary, trackEvent } from '../utils/analytics';

// Live pricing rates (INR per KG approx) for SS grades
const STEEL_PRICES: Record<string, number> = {
  'SS 304': 225, // food grade
  'SS 202': 145, // general commercial
  'SS 430': 115, // high heat
};

// Sheet metal thicknesses in SWG and corresponding millimeter thickness
const THICKNESS_SWG = [
  { swg: '16 SWG', mm: 1.6 },
  { swg: '18 SWG', mm: 1.2 },
  { swg: '20 SWG', mm: 0.9 },
  { swg: '22 SWG', mm: 0.7 },
];

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dkg_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'analytics' | 'estimator' | 'system'>('overview');

  // Interactive Quick Estimator States
  const [estCategory, setEstCategory] = useState('Work Table');
  const [estGrade, setEstGrade] = useState('SS 304');
  const [estThickness, setEstThickness] = useState(1.2); // default 18 SWG (1.2mm)
  const [estLength, setEstLength] = useState('1500');
  const [estWidth, setEstWidth] = useState('750');
  const [estHeight, setEstHeight] = useState('850');
  const [estUnderShelves, setEstUnderShelves] = useState(1);

  // Handle Authentication Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'dkgforge123';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('dkg_admin_auth', 'true');
    } else {
      setAuthError('INVALID DECRYPTION KEY. ACCESS DENIED.');
      setPassword('');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dkg_admin_auth');
  };

  // Derive Quote Estimate Calculations during render
  const l = parseFloat(estLength) || 0;
  const w = parseFloat(estWidth) || 0;
  const h = parseFloat(estHeight) || 0;
  
  let calculatedWeight = 0;
  let calculatedCost = 0;
  
  if (l > 0 && w > 0) {
    // Density of Stainless Steel: 7.93 g/cm3 (0.00000793 kg/mm3)
    const density = 0.00000793;
    
    // Calculate sheet metal area
    // 1. Table Top Sheet
    const topArea = l * w;
    
    // 2. Legs (4 legs, assume tubular 40x40mm, height H, approx thickness)
    const legsArea = 4 * 160 * h; 
    
    // 3. Under-Shelves (multiplied by count)
    const shelfArea = estUnderShelves * (l * w);

    // Total area in mm2
    const totalArea = topArea + legsArea + shelfArea;
    
    // Weight = Area * Thickness * Density
    const rawWeight = totalArea * estThickness * density;
    
    // Factor for reinforcement channels, brackets, screws (~20% extra)
    calculatedWeight = Math.round(rawWeight * 1.2 * 10) / 10;
    
    // Cost = Weight * Rate/KG + Fabrication Premium (~30% overhead)
    const steelRate = STEEL_PRICES[estGrade] || 200;
    const rawMaterialCost = calculatedWeight * steelRate;
    calculatedCost = Math.round(rawMaterialCost * 1.3);
  }

  // LOGIN SCREEN RENDER
  if (!isAuthenticated) {
    return (
      <section className="relative min-h-screen bg-[var(--bg-dark)] flex items-center justify-center py-24 px-4">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[var(--color-orange-glow)] radial-gradient top-1/4 left-1/3 blur-3xl opacity-20 pointer-events-none"></div>

        <div className="w-full max-w-md bg-[var(--bg-panel)] border border-[var(--color-border)] p-8 relative shadow-2xl">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-16 h-[2px] bg-[#ff5200]"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--color-orange)] rounded-full mb-4 shadow-[0_0_20px_var(--color-orange-glow)]">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[var(--text-white)] uppercase tracking-widest">
              DKG Admin Terminal
            </h2>
            <span className="text-[9px] font-heading tracking-[0.3em] text-[var(--text-steel)] uppercase block mt-1">
              SECURE DEPLOYMENT OVERLAY
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-2">
                ENTER SECURITY PASS KEY *
              </label>
              
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--text-white)] py-3 pl-4 pr-12 text-xs outline-none focus:border-[var(--color-orange)] transition-colors font-mono tracking-widest"
                  placeholder="••••••••••••"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[var(--text-steel)] hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex gap-2.5 items-start bg-red-950/20 border border-red-500/30 p-3 text-[10px] font-heading tracking-wider text-red-400">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-industrial btn-industrial-primary w-full flex items-center justify-center gap-2 cursor-pointer font-bold tracking-widest text-xs py-3"
            >
              <Unlock className="w-4 h-4" />
              <span>DECRYPT TERMINAL ACCESS</span>
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[9px] text-[var(--text-steel)] leading-relaxed tracking-wider font-light uppercase">
              DEFAULTS DEPLOYED IN PROD ENVIRONMENT.<br />
              CONTACT TECH TEAM FOR CUSTOM Blueprints.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Live statistics state
  const [stats, setStats] = useState(() => getAnalyticsSummary());
  const [viewMode, setViewMode] = useState<'session' | 'combined'>('session');

  // Listen to new events in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setStats(getAnalyticsSummary());
    };
    window.addEventListener('dkg_analytics_update', handleUpdate);
    return () => window.removeEventListener('dkg_analytics_update', handleUpdate);
  }, []);

  const handleEstimateTrack = () => {
    trackEvent('estimator_calculation', {
      source: 'Admin Estimator Tab',
      category: estCategory,
      ssGrade: estGrade,
      length: parseFloat(estLength) || 0,
      width: parseFloat(estWidth) || 0,
      height: parseFloat(estHeight) || 0,
      underShelves: estUnderShelves,
      estimatedWeight: calculatedWeight,
      estimatedCost: calculatedCost
    });
  };

  const activeStats = viewMode === 'session' ? stats.sessionStats : stats;

  // Max value in traffic to scale it properly
  const maxViews = Math.max(...activeStats.weeklyTraffic.map(t => t.views), viewMode === 'session' ? 5 : 1800);
  const chartPoints = activeStats.weeklyTraffic.map((t, idx) => {
    const x = 10 + idx * 50;
    // Map view count to range [20, 130] in SVG coordinates (150 is bottom, 0 is top)
    const y = 130 - ((t.views / maxViews) * 100);
    return { x, y, ...t };
  });
  const pathD = chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');



  return (
    <section className="min-h-screen bg-[var(--bg-dark)] py-24 border-b border-[var(--color-border)]">
      <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Terminal Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[var(--bg-panel)] border border-[var(--color-border)] p-6 mb-8 gap-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--bg-dark)] border border-[var(--color-border)] text-[var(--color-orange)]">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-[var(--text-white)] uppercase tracking-wider">
                  DKG Forge Terminal
                </h2>
                <span className="text-[9px] font-mono bg-[var(--color-orange)]/15 border border-[var(--color-orange)]/35 text-[var(--color-orange)] px-2 py-0.5 uppercase font-bold">
                  SECURE MODE
                </span>
              </div>
              <p className="text-[10px] font-mono text-[var(--text-steel)] tracking-widest mt-1">
                SYSTEM DEPLOYMENT: VERCEL CLOUD · STATUS: ONLINE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[var(--text-steel)] hidden sm:inline">
              SYSKEY: {import.meta.env.VITE_ADMIN_PASSWORD ? 'ENV_CONFIGURED' : 'DEFAULT_ACTIVE'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500/20 hover:border-red-500 hover:text-red-400 bg-red-950/10 text-xs font-heading tracking-widest text-red-500/80 cursor-pointer transition-all duration-300 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>

        {/* Console Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Sub navigation */}
          <div className="lg:col-span-3 space-y-3 bg-[var(--bg-panel)] border border-[var(--color-border)] p-4 shadow-sm">
            <span className="block text-[9px] font-heading tracking-[0.25em] text-[var(--text-steel)] uppercase font-bold mb-4 pl-2">
              CONSOLE APPLICATIONS
            </span>
            
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left font-heading text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/10 text-[var(--text-white)] shadow-[0_0_15px_var(--color-orange-glow)]'
                  : 'border-transparent text-[var(--text-steel)] hover:text-[var(--color-orange)] hover:bg-[var(--bg-dark)]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview Diagnostic</span>
            </button>

            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left font-heading text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                activeSubTab === 'analytics'
                  ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/10 text-[var(--text-white)] shadow-[0_0_15px_var(--color-orange-glow)]'
                  : 'border-transparent text-[var(--text-steel)] hover:text-[var(--color-orange)] hover:bg-[var(--bg-dark)]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Interaction Charts</span>
            </button>

            <button
              onClick={() => setActiveSubTab('estimator')}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left font-heading text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                activeSubTab === 'estimator'
                  ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/10 text-[var(--text-white)] shadow-[0_0_15px_var(--color-orange-glow)]'
                  : 'border-transparent text-[var(--text-steel)] hover:text-[var(--color-orange)] hover:bg-[var(--bg-dark)]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Industrial Estimator</span>
            </button>



            <button
              onClick={() => setActiveSubTab('system')}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left font-heading text-xs tracking-wider uppercase border transition-all cursor-pointer ${
                activeSubTab === 'system'
                  ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/10 text-[var(--text-white)] shadow-[0_0_15px_var(--color-orange-glow)]'
                  : 'border-transparent text-[var(--text-steel)] hover:text-[var(--color-orange)] hover:bg-[var(--bg-dark)]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System & Integration</span>
            </button>
          </div>

          {/* Right panel: Active subtab console render */}
          <div className="lg:col-span-9 bg-[var(--bg-panel)] border border-[var(--color-border)] p-6 md:p-8 shadow-sm relative min-h-[500px]">
            <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-[#ff5200]"></div>
            
            {/* Console Data Stream Toggle */}
            {(activeSubTab === 'overview' || activeSubTab === 'analytics') && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--bg-dark)] border border-[var(--color-border)] p-3 mb-6 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] font-heading tracking-widest text-[var(--text-steel)] uppercase font-bold">
                    CONSOLE DATA STREAM: {viewMode === 'session' ? 'LIVE SESSION RUNTIME' : 'AGGREGATED METRICS'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('session')}
                    className={`px-3 py-1.5 text-[9px] font-heading tracking-widest border transition-all cursor-pointer ${
                      viewMode === 'session'
                        ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/15 text-[var(--color-orange)] font-bold shadow-[0_0_10px_var(--color-orange-glow)]'
                        : 'border-[var(--color-border)] text-[var(--text-steel)] hover:text-white hover:bg-[var(--bg-dark)]'
                    }`}
                  >
                    LIVE SESSION ONLY
                  </button>
                  <button
                    onClick={() => setViewMode('combined')}
                    className={`px-3 py-1.5 text-[9px] font-heading tracking-widest border transition-all cursor-pointer ${
                      viewMode === 'combined'
                        ? 'border-[var(--color-orange)] bg-[var(--color-orange)]/15 text-[var(--color-orange)] font-bold shadow-[0_0_10px_var(--color-orange-glow)]'
                        : 'border-[var(--color-border)] text-[var(--text-steel)] hover:text-white hover:bg-[var(--bg-dark)]'
                    }`}
                  >
                    COMBINED HISTORICAL BASELINE
                  </button>
                </div>
              </div>
            )}
            
            {/* SUBTAB 1: OVERVIEW DIAGNOSTIC */}
            {activeSubTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-2">
                    Overview Diagnostic Terminal
                  </h3>
                  <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed font-light">
                    Real-time visual mockup metrics capturing user interactions, conversions, and site health.
                  </p>
                </div>

                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-[var(--bg-dark)] border border-[var(--color-border)] p-4 relative group">
                    <span className="text-[8px] font-heading tracking-widest text-[var(--text-steel)] uppercase block mb-1">TOTAL TRAFFIC SESSION</span>
                    <span className="text-2xl font-bold font-heading text-white">{activeStats.sessions.toLocaleString()}</span>
                    <span className="text-[9px] font-mono text-green-500 block mt-2">+12.4% MONTH-OVER-MONTH</span>
                  </div>

                  <div className="bg-[var(--bg-dark)] border border-[var(--color-border)] p-4 relative group">
                    <span className="text-[8px] font-heading tracking-widest text-[var(--text-steel)] uppercase block mb-1">PAGE VIEW HITS</span>
                    <span className="text-2xl font-bold font-heading text-white">{activeStats.pageViews.toLocaleString()}</span>
                    <span className="text-[9px] font-mono text-[var(--color-orange)] block mt-2">2.18x ACCELERATION VALUE</span>
                  </div>

                  <div className="bg-[var(--bg-dark)] border border-[var(--color-border)] p-4 relative group">
                    <span className="text-[8px] font-heading tracking-widest text-[var(--text-steel)] uppercase block mb-1">QUOTE SUBMISSION RATE</span>
                    <span className="text-2xl font-bold font-heading text-white">{activeStats.sessions > 0 ? ((activeStats.quotes / activeStats.sessions) * 100).toFixed(1) : '0.0'}%</span>
                    <span className="text-[9px] font-mono text-green-500 block mt-2">{activeStats.quotes} BLUEPRINTS TOTAL</span>
                  </div>

                  <div className="bg-[var(--bg-dark)] border border-[var(--color-border)] p-4 relative group">
                    <span className="text-[8px] font-heading tracking-widest text-[var(--text-steel)] uppercase block mb-1">CATALOG DOWNLOADS</span>
                    <span className="text-2xl font-bold font-heading text-white">{activeStats.downloads}</span>
                    <span className="text-[9px] font-mono text-[var(--color-orange)] block mt-2">{activeStats.pageViews > 0 ? ((activeStats.downloads / activeStats.pageViews) * 100).toFixed(0) : '0'}% CLICK-THROUGH CONVERSION</span>
                  </div>

                </div>

                {/* Event tracking simulation console log */}
                <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-4">
                  <div className="flex justify-between items-center border-b border-[var(--color-border-light)] pb-2 mb-3">
                    <span className="text-[10px] font-heading tracking-widest text-[var(--color-orange)] uppercase font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" /> LIVE SESSION LOG (FROM LOCAL & VERCEL ANALYTICS)
                    </span>
                    <span className="text-[8px] font-mono text-[var(--text-steel)] uppercase">REALTIME MONITOR</span>
                  </div>
                  
                  <div className="font-mono text-[10px] text-green-400/90 space-y-1.5 leading-relaxed max-h-[220px] overflow-y-auto pr-2">
                    {stats.recentLogs.length === 0 ? (
                      <p className="text-[var(--text-steel)]">No browser interactions recorded yet. Click tabs or perform actions to see live events.</p>
                    ) : (
                      stats.recentLogs.map((log) => {
                        const timeStr = new Date(log.timestamp).toLocaleTimeString();
                        let details = '';
                        let colorClass = 'text-green-400';
                        if (log.name === 'page_view') {
                          details = `Navigated to tab "${log.properties?.tab}"`;
                          colorClass = 'text-cyan-400';
                        } else if (log.name === 'catalog_download') {
                          details = `Downloaded product catalog PDF ("${log.properties?.file}")`;
                          colorClass = 'text-yellow-400';
                        } else if (log.name === 'blueprint_submit') {
                          details = `Submitted inquiry blueprint for "${log.properties?.category}" (${log.properties?.ssGrade})`;
                          colorClass = 'text-pink-400 font-bold';
                        } else if (log.name === 'chatbot_query') {
                          details = `Query to AI Assistant: "${log.properties?.query}"`;
                          colorClass = 'text-[var(--color-orange)]';
                        } else if (log.name === 'process_preview_click') {
                          details = `Viewed process / capability: "${log.properties?.title}" (${log.properties?.category})`;
                          colorClass = 'text-purple-400';
                        } else if (log.name === 'estimator_calculation') {
                          details = `Calculated material estimation: ${log.properties?.estimatedWeight}kg for ${log.properties?.category} (${log.properties?.source})`;
                          colorClass = 'text-blue-400';
                        } else if (log.name === 'social_contact_click') {
                          details = `Clicked social contact channel: "${log.properties?.platform}"`;
                          colorClass = 'text-emerald-400';
                        } else {
                          details = `${log.name} triggered: ${JSON.stringify(log.properties)}`;
                        }
                        return (
                          <p key={log.id} className={colorClass}>
                            <span className="text-[var(--text-steel)]">[{timeStr}]</span> &gt; {details}
                          </p>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: INTERACTION CHARTS */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-2">
                    Interaction Analytics Charts
                  </h3>
                  <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed font-light">
                    Visual representation of site traffic cycles and event click percentages. Built using custom SVG layouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Traffic Chart SVG */}
                  <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-heading tracking-widest text-[var(--text-white)] uppercase mb-4 block font-bold">
                      WEEKLY TRAFFIC CYCLES (VISITS)
                    </span>
                    
                    <div className="relative h-44 w-full flex items-end">
                      {/* Simple SVG Line Chart */}
                      <svg className="w-full h-full" viewBox="0 0 350 150">
                        {/* Grids */}
                        <line x1="0" y1="20" x2="350" y2="20" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="70" x2="350" y2="70" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="120" x2="350" y2="120" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
                        
                        {/* Line plot */}
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke="var(--color-orange)" 
                          strokeWidth="3" 
                        />
                        
                        {/* Dots */}
                        {chartPoints.map((p, idx) => (
                          <circle key={idx} cx={p.x} cy={p.y} r="4" fill="white" stroke="var(--color-orange)" strokeWidth="2">
                            <title>{p.views} views</title>
                          </circle>
                        ))}
                      </svg>
                    </div>

                    <div className="flex justify-between text-[9px] font-heading text-[var(--text-steel)] mt-4 uppercase">
                      {activeStats.weeklyTraffic.map((t, idx) => <span key={idx}>{t.day}</span>)}
                    </div>
                  </div>

                  {/* Click Distribution List */}
                  <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-heading tracking-widest text-[var(--text-white)] uppercase mb-4 block font-bold">
                      EVENT CLICK CONVERSION SHARE
                    </span>

                    <div className="space-y-3">
                      {activeStats.clickData.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-[var(--text-white)]">{item.name}</span>
                            <span className="text-[var(--color-orange)] font-bold">{item.percent}% ({item.clicks})</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--bg-panel-light)] rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-[var(--color-orange)] shadow-[0_0_6px_var(--color-orange)]"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUBTAB 3: INDUSTRIAL ESTIMATOR */}
            {activeSubTab === 'estimator' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-2">
                    Quick Quote & Weight Estimator
                  </h3>
                  <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed font-light">
                    A secure diagnostic calculator tool for our engineering team to estimate the approximate sheet metal shear weight and raw material cost directly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--bg-dark)] border border-[var(--color-border)] p-6">
                  
                  {/* Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1.5">EQUIPMENT CATEGORY</label>
                      <select 
                        value={estCategory} 
                        onChange={(e) => setEstCategory(e.target.value)}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2.5 text-xs outline-none focus:border-[var(--color-orange)] cursor-pointer"
                      >
                        <option value="Work Table">Work Table / Preparation Desk</option>
                        <option value="Cabinet">Wall / Storage Cabinet</option>
                        <option value="Bain Marie">Bain Marie / Warmer Unit</option>
                        <option value="Sink Unit">Sink Unit / Washing Bay</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1.5">SS METAL GRADE</label>
                        <select 
                          value={estGrade} 
                          onChange={(e) => setEstGrade(e.target.value)}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2.5 text-xs outline-none focus:border-[var(--color-orange)] cursor-pointer"
                        >
                          <option value="SS 304">SS 304 (₹225/KG)</option>
                          <option value="SS 202">SS 202 (₹145/KG)</option>
                          <option value="SS 430">SS 430 (₹115/KG)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1.5">SHEET THICKNESS (SWG)</label>
                        <select 
                          value={estThickness} 
                          onChange={(e) => setEstThickness(parseFloat(e.target.value))}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2.5 text-xs outline-none focus:border-[var(--color-orange)] cursor-pointer"
                        >
                          {THICKNESS_SWG.map(t => (
                            <option key={t.swg} value={t.mm}>{t.swg} ({t.mm} mm)</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">LENGTH (mm)</label>
                        <input 
                          type="number" 
                          value={estLength} 
                          onChange={(e) => setEstLength(e.target.value)}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2 text-xs outline-none focus:border-[var(--color-orange)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">WIDTH (mm)</label>
                        <input 
                          type="number" 
                          value={estWidth} 
                          onChange={(e) => setEstWidth(e.target.value)}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2 text-xs outline-none focus:border-[var(--color-orange)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1">HEIGHT (mm)</label>
                        <input 
                          type="number" 
                          value={estHeight} 
                          onChange={(e) => setEstHeight(e.target.value)}
                          className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2 text-xs outline-none focus:border-[var(--color-orange)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-heading tracking-widest text-[var(--text-steel)] uppercase mb-1.5">UNDER-SHELVES COUNT</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="3"
                        value={estUnderShelves} 
                        onChange={(e) => setEstUnderShelves(parseInt(e.target.value) || 0)}
                        className="w-full bg-[var(--bg-panel)] border border-[var(--color-border)] text-white p-2 text-xs outline-none focus:border-[var(--color-orange)]"
                      />
                    </div>
                  </div>

                  {/* Calculations Display Output */}
                  <div className="bg-[var(--bg-panel)] border border-[var(--color-border)] p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[var(--color-orange)] opacity-20 pointer-events-none"></div>
                    
                    <div>
                      <span className="text-[10px] font-heading tracking-widest text-[var(--color-orange)] uppercase font-bold block mb-4">
                        ESTIMATION READOUT
                      </span>
                      
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] text-[var(--text-steel)] block uppercase">APPROXIMATE MATERIAL MASS</span>
                          <span className="text-3xl font-bold text-white font-heading">{calculatedWeight} <span className="text-lg font-light text-[var(--color-orange)]">KG</span></span>
                        </div>
                        
                        <div>
                          <span className="text-[9px] text-[var(--text-steel)] block uppercase">FABRICATION COST ESTIMATE (MINIMUM)</span>
                          <span className="text-3xl font-bold text-white font-heading">₹{calculatedCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {calculatedWeight > 0 && (
                        <button
                          onClick={handleEstimateTrack}
                          className="w-full mt-6 bg-[var(--bg-dark)] hover:bg-[var(--bg-dark)]/85 text-[var(--color-orange)] border border-[var(--color-orange)]/35 hover:border-[var(--color-orange)] font-heading text-[10px] tracking-widest font-semibold py-2.5 cursor-pointer transition-all duration-300"
                        >
                          LOG ESTIMATE TO SYSTEM TERMINAL
                        </button>
                      )}
                    </div>

                    <div className="border-t border-[var(--color-border-light)] pt-4 mt-4">
                      <p className="text-[8px] text-[var(--text-steel)] leading-relaxed font-light uppercase">
                        * Estimates are raw calculations based on metal density & default geometry formulas. Actual factory pricing includes labor, bends count, custom channels, and delivery costs.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}



            {/* SUBTAB 5: SYSTEM & INTEGRATION GUIDE */}
            {activeSubTab === 'system' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--text-white)] uppercase tracking-wider mb-2">
                    System Configuration & DB-Free Setup
                  </h3>
                  <p className="text-xs text-[var(--text-steel)] font-body leading-relaxed font-light">
                    Steps to safely hook up customer lead logs and analytical monitors without needing databases.
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Web3Forms Integration Guide */}
                  <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[var(--color-orange)]">
                      <Mail className="w-5 h-5" />
                      <h4 className="font-heading text-sm font-bold uppercase tracking-wider">Email Inquiry Setup (Web3Forms)</h4>
                    </div>
                    
                    <p className="text-xs text-[var(--text-steel-light)] leading-relaxed font-light font-body">
                      To receive all submissions from the **Inquiry Builder** directly to your email address **for free**, we can connect it to Web3Forms:
                    </p>
                    
                    <ol className="list-decimal pl-5 text-xs text-[var(--text-steel)] space-y-1.5 font-body leading-relaxed">
                      <li>Visit <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-orange)] hover:underline">web3forms.com</a> and enter your email address to receive an Access Key.</li>
                      <li>Copy the generated key (e.g. `1234abcd-1234-abcd-...`).</li>
                      <li>Add it as an environment variable in your Vercel panel: `VITE_WEB3FORMS_KEY`.</li>
                      <li>Form submissions will now securely fly into your inbox as formatted emails.</li>
                    </ol>
                  </div>

                  {/* Vercel Web Analytics Integration Guide */}
                  <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-5 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <h4 className="font-heading text-sm font-bold uppercase tracking-wider">Vercel Web Analytics: INSTALLED</h4>
                    </div>

                    <p className="text-xs text-[var(--text-steel-light)] leading-relaxed font-light font-body">
                      Vercel Web Analytics is successfully installed via `@vercel/analytics` and active on the site layout. 
                    </p>

                    <div className="bg-[var(--bg-panel)] p-3 border border-[var(--color-border)] text-xs text-[var(--text-steel)] space-y-2 font-mono">
                      <p className="text-[var(--color-orange)] font-bold">CUSTOM EVENT SCHEMAS REGISTERED:</p>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        <li><span className="text-white">page_view</span>: {"{ tab: string }"}</li>
                        <li><span className="text-white">catalog_download</span>: {"{ file: string }"}</li>
                        <li><span className="text-white">blueprint_submit</span>: {"{ category: string, ssGrade: string }"}</li>
                        <li><span className="text-white">chatbot_query</span>: {"{ query: string }"}</li>
                        <li><span className="text-white">process_preview_click</span>: {"{ category: string, title: string }"}</li>
                        <li><span className="text-white">estimator_calculation</span>: {"{ source: string, category: string, ... }"}</li>
                      </ul>
                    </div>

                    <p className="text-xs text-[var(--text-steel-light)] leading-relaxed font-light font-body pt-2">
                      To view full traffic dashboards, geographical locations, and device types, log in to your Vercel Dashboard for project **itsJ0ker/dkgmetalcraft** and visit the **Analytics** tab.
                    </p>
                  </div>

                  {/* Diagnostic details */}
                  <div className="border border-[var(--color-border)] bg-[var(--bg-dark)] p-4 font-mono text-[10px] text-[var(--text-steel)] flex justify-between items-center">
                    <span>VITE BUILD TARGET: ESBUILD / PRODUCTION</span>
                    <span>REACT ROOT: V-19.0</span>
                    <span>ACTIVE TERMINAL KEY: CONFIG_LOCKED</span>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
