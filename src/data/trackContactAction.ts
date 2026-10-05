type Channel = 'call' | 'email' | 'whatsapp';

interface ContactAction {
  eventId: string;
  channel: Channel;
  destination: string;
  sourcePage: string;
  ctaLabel: string;
}

function actionFromLink(link: HTMLAnchorElement): ContactAction | null {
  const href = link.getAttribute('href') || '';
  let channel: Channel;
  let destination: string;
  if (/^tel:/i.test(href)) {
    channel = 'call';
    destination = href.slice(4).split(/[;?]/, 1)[0];
  } else if (/^mailto:/i.test(href)) {
    channel = 'email';
    try { destination = decodeURIComponent(href.slice(7).split('?', 1)[0]); } catch { return null; }
  } else {
    let url: URL;
    try { url = new URL(href, window.location.href); } catch { return null; }
    if (!['wa.me', 'www.wa.me'].includes(url.hostname)) return null;
    channel = 'whatsapp';
    destination = url.pathname.replace(/^\//, '');
  }
  const area = link.id || link.closest<HTMLElement>('section[id], footer[id], aside[id]')?.id || '';
  const label = (link.dataset.contactCta || link.getAttribute('aria-label') || link.textContent || '').trim().replace(/\s+/g, ' ');
  return {
    eventId: crypto.randomUUID(),
    channel,
    destination,
    sourcePage: window.location.pathname,
    ctaLabel: `${area ? `${area}: ` : ''}${label}`.slice(0, 160),
  };
}

export function installContactActionTracking(): () => void {
  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    const action = actionFromLink(link);
    if (!action) return;
    const payload = new Blob([JSON.stringify(action)], { type: 'application/json' });
    try {
      if (navigator.sendBeacon?.('/api/contact-actions', payload)) return;
    } catch {
      // Fall back to a keepalive request without interrupting the contact link.
    }
    void fetch('/api/contact-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
      keepalive: true,
    }).catch(() => {});
  };
  document.addEventListener('click', handleClick, { capture: true });
  return () => document.removeEventListener('click', handleClick, { capture: true });
}
