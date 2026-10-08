type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

const consentKey = 'technoedge-analytics-consent';

const hasConsent = () => {
  try { return window.localStorage.getItem(consentKey) === 'granted'; } catch { return false; }
};

const loadTagManager = () => {
  const containerId = import.meta.env.VITE_GTM_ID?.trim();
  if (!containerId || !/^GTM-[A-Z0-9]+$/i.test(containerId)) return;
  if (document.querySelector(`script[data-technoedge-gtm="${containerId}"]`)) return;
  window.dataLayer ??= [];
  window.dataLayer.push({
    event: 'analytics_consent_update',
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  script.dataset.technoedgeGtm = containerId;
  document.head.append(script);
};

const emit = (event: string, payload: AnalyticsPayload = {}) => {
  if (!hasConsent()) return;
  const detail = { event, ...payload };
  window.dataLayer?.push(detail);
  window.dispatchEvent(new CustomEvent('technoedge:analytics', { detail }));
};

export function setAnalyticsConsent(granted: boolean) {
  try { window.localStorage.setItem(consentKey, granted ? 'granted' : 'denied'); } catch { /* Storage may be unavailable. */ }
  window.dispatchEvent(new CustomEvent('technoedge:consent', { detail: { granted } }));
}

export function installSeoTelemetry(): () => void {
  let observers: PerformanceObserver[] = [];
  let clsValue = 0;
  let lcpValue = 0;
  let inpValue = 0;

  const reportVitals = () => {
    if (lcpValue) emit('web_vital', { metric: 'LCP', value: Math.round(lcpValue), path: location.pathname });
    emit('web_vital', { metric: 'CLS', value: Number(clsValue.toFixed(4)), path: location.pathname });
    if (inpValue) emit('web_vital', { metric: 'INP', value: Math.round(inpValue), path: location.pathname });
  };

  const observe = (type: string, callback: (entry: PerformanceEntry & Record<string, any>) => void) => {
    try {
      const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => callback(entry as PerformanceEntry & Record<string, any>)));
      observer.observe({ type, buffered: true });
      observers.push(observer);
    } catch { /* This browser does not expose the metric. */ }
  };

  const start = () => {
    observers.forEach((observer) => observer.disconnect());
    observers = [];
    clsValue = 0;
    lcpValue = 0;
    inpValue = 0;
    loadTagManager();
    observe('largest-contentful-paint', (entry) => { lcpValue = entry.startTime; });
    observe('layout-shift', (entry) => { if (!entry.hadRecentInput) clsValue += entry.value || 0; });
    observe('event', (entry) => { if ((entry.duration || 0) > inpValue) inpValue = entry.duration; });

    const parameters = new URLSearchParams(location.search);
    const referrer = document.referrer ? new URL(document.referrer).hostname : '';
    emit('page_view', {
      path: location.pathname,
      utm_source: parameters.get('utm_source') || undefined,
      referrer,
      chatgpt_referral: referrer === 'chatgpt.com' || parameters.get('utm_source') === 'chatgpt.com',
    });
  };

  const handleConsent = (event: Event) => {
    if ((event as CustomEvent<{ granted: boolean }>).detail?.granted) start();
    else {
      observers.forEach((observer) => observer.disconnect());
      window.dataLayer?.push({
        event: 'analytics_consent_update',
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  };
  const handleVisibility = () => { if (document.visibilityState === 'hidden') reportVitals(); };
  const handleClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!target) return;
    const url = new URL(target.href, location.href);
    if (url.protocol === 'tel:') emit('telephone_click', { source_path: location.pathname });
    if (url.protocol === 'mailto:') emit('email_click', { source_path: location.pathname });
    if (['wa.me', 'www.wa.me'].includes(url.hostname)) emit('whatsapp_click', { source_path: location.pathname });
    if (url.origin !== location.origin) return;
    if (/^\/programmes\//.test(url.pathname)) emit('programme_view_intent', { programme_path: url.pathname, source_path: location.pathname });
    if (/^\/services\//.test(url.pathname) && /^\/insights\//.test(location.pathname)) emit('article_to_service', { service_path: url.pathname, article_path: location.pathname });
  };
  const handleLeadSubmitted = (event: Event) => {
    const detail = (event as CustomEvent<AnalyticsPayload>).detail || {};
    emit('generate_lead', detail);
  };

  window.addEventListener('technoedge:consent', handleConsent);
  document.addEventListener('visibilitychange', handleVisibility);
  document.addEventListener('click', handleClick, { capture: true });
  window.addEventListener('technoedge:lead-submitted', handleLeadSubmitted);
  if (hasConsent()) start();

  return () => {
    observers.forEach((observer) => observer.disconnect());
    window.removeEventListener('technoedge:consent', handleConsent);
    document.removeEventListener('visibilitychange', handleVisibility);
    document.removeEventListener('click', handleClick, { capture: true });
    window.removeEventListener('technoedge:lead-submitted', handleLeadSubmitted);
  };
}
