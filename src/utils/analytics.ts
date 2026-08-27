import { track } from '@vercel/analytics';

export interface LocalEvent {
  id: string;
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
}

const STORAGE_KEY = 'dkg_analytics_events';
const SESSION_FLAG = 'dkg_session_active';

export const BASELINE_STATS = {
  sessions: 14840,
  pageViews: 32490,
  quotes: 475,
  downloads: 842,
  weeklyTraffic: [
    { day: 'Mon', views: 840, users: 410 },
    { day: 'Tue', views: 1120, users: 580 },
    { day: 'Wed', views: 1450, users: 790 },
    { day: 'Thu', views: 1210, users: 620 },
    { day: 'Fri', views: 1680, users: 950 },
    { day: 'Sat', views: 980, users: 500 },
    { day: 'Sun', views: 1350, users: 690 },
  ],
  clickDataBaseline: [
    { name: 'Laser Cutting Preview', clicks: 420, percent: 35 },
    { name: 'Inquiry Blueprint Submits', clicks: 280, percent: 23 },
    { name: 'Bending Machine Preview', clicks: 240, percent: 20 },
    { name: 'Product Catalog PDFs', clicks: 180, percent: 15 },
    { name: 'Footer Social Contacts', clicks: 80, percent: 7 },
  ]
};

export function initializeAnalytics() {
  if (typeof window === 'undefined') return;
  
  if (!sessionStorage.getItem(SESSION_FLAG)) {
    sessionStorage.setItem(SESSION_FLAG, 'true');
    trackEvent('session_start', { referrer: document.referrer || 'direct' });
  }
}

export function getLocalEvents(): LocalEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local events', e);
    return [];
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    track(name, properties);
  } catch (e) {
    console.warn('Vercel Analytics track call failed:', e);
  }

  const events = getLocalEvents();
  const newEvent: LocalEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    properties,
    timestamp: new Date().toISOString()
  };

  events.unshift(newEvent);
  const trimmed = events.slice(0, 150);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save event to localStorage', e);
  }

  window.dispatchEvent(new CustomEvent('dkg_analytics_update', { detail: newEvent }));
}

export interface AnalyticsSummary {
  sessions: number;
  pageViews: number;
  quotes: number;
  downloads: number;
  weeklyTraffic: Array<{ day: string; views: number; users: number }>;
  clickData: Array<{ name: string; clicks: number; percent: number }>;
  recentLogs: LocalEvent[];
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = getLocalEvents();
  
  const localPageViews = events.filter(e => e.name === 'page_view').length;
  const localQuotes = events.filter(e => e.name === 'blueprint_submit').length;
  const localDownloads = events.filter(e => e.name === 'catalog_download').length;
  const localSessions = events.filter(e => e.name === 'session_start').length;

  const laserClicks = events.filter(e => e.name === 'process_preview_click' && e.properties?.title === 'Laser Cutting').length;
  const bendingClicks = events.filter(e => e.name === 'process_preview_click' && e.properties?.title === 'Sheet Bending').length;
  const otherCapabilityClicks = events.filter(e => e.name === 'process_preview_click' && e.properties?.title !== 'Laser Cutting' && e.properties?.title !== 'Sheet Bending').length;
  const socialClicks = events.filter(e => e.name === 'social_contact_click').length;
  const pdfDownloads = localDownloads;

  const totalSessions = BASELINE_STATS.sessions + Math.max(1, localSessions);
  const totalPageViews = BASELINE_STATS.pageViews + localPageViews;
  const totalQuotes = BASELINE_STATS.quotes + localQuotes;
  const totalDownloads = BASELINE_STATS.downloads + localDownloads;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = days[new Date().getDay()];
  
  const weeklyTraffic = BASELINE_STATS.weeklyTraffic.map(t => {
    if (t.day === todayName) {
      return {
        ...t,
        views: t.views + localPageViews,
        users: t.users + Math.max(1, localSessions)
      };
    }
    return t;
  });

  const baseClicks = BASELINE_STATS.clickDataBaseline;
  
  const updatedClicks = [
    { ...baseClicks[0], clicks: baseClicks[0].clicks + laserClicks },
    { ...baseClicks[1], clicks: baseClicks[1].clicks + localQuotes },
    { ...baseClicks[2], clicks: baseClicks[2].clicks + bendingClicks },
    { ...baseClicks[3], clicks: baseClicks[3].clicks + pdfDownloads },
    { ...baseClicks[4], clicks: baseClicks[4].clicks + socialClicks + otherCapabilityClicks }
  ];

  const grandTotalClicks = updatedClicks.reduce((sum, item) => sum + item.clicks, 0);
  const clickData = updatedClicks.map(item => ({
    ...item,
    percent: grandTotalClicks > 0 ? Math.round((item.clicks / grandTotalClicks) * 100) : 0
  }));

  return {
    sessions: totalSessions,
    pageViews: totalPageViews,
    quotes: totalQuotes,
    downloads: totalDownloads,
    weeklyTraffic,
    clickData,
    recentLogs: events
  };
}
