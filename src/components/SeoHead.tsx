import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import type { BaseProgramme } from '../types';
import type { SeoDocument } from '../seo/routeManifest';

interface SeoHeadProps {
  selectedProgramme: BaseProgramme | null;
  isProgrammeLoading: boolean;
  programmeLoadError: string | null;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content?: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('link');
  element.rel = 'canonical';
  element.href = url;
  if (!existing) document.head.appendChild(element);
}

function setStructuredData(entries: Record<string, unknown>[]) {
  document.head.querySelectorAll('[data-technoedge-route-schema]').forEach((element) => element.remove());
  entries.forEach((data, index) => {
    const element = document.createElement('script');
    element.id = `technoedge-route-structured-data-${index + 1}`;
    element.dataset.technoedgeRouteSchema = 'true';
    element.type = 'application/ld+json';
    element.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    document.head.appendChild(element);
  });
}

export function SeoHead({ selectedProgramme, isProgrammeLoading, programmeLoadError }: SeoHeadProps) {
  const location = useLocation();
  const initialPath = useRef(location.pathname);
  const hasPrerenderedHead = useRef(typeof document !== 'undefined'
    && Boolean(document.head.querySelector('link[rel="canonical"]')));

  useEffect(() => {
    if (hasPrerenderedHead.current && location.pathname === initialPath.current && !location.search) return;

    let active = true;
    import('../seo/routeManifest').then(({ resolveSeoDocument, SITE_NAME }) => {
      if (!active) return;
      const seoDocument: SeoDocument = resolveSeoDocument(location.pathname, {
        selectedProgramme,
        isProgrammeLoading,
        programmeLoadError,
        search: location.search,
      });
      document.title = seoDocument.title;
      upsertMeta('name', 'description', seoDocument.description);
      upsertMeta('name', 'robots', seoDocument.robots);
      upsertMeta('property', 'og:site_name', SITE_NAME);
      upsertMeta('property', 'og:title', seoDocument.title);
      upsertMeta('property', 'og:description', seoDocument.description);
      upsertMeta('property', 'og:type', seoDocument.openGraph.type);
      upsertMeta('property', 'og:url', seoDocument.canonicalUrl);
      upsertMeta('property', 'og:image', seoDocument.openGraph.image);
      upsertMeta('name', 'twitter:card', 'summary_large_image');
      upsertMeta('name', 'twitter:title', seoDocument.title);
      upsertMeta('name', 'twitter:description', seoDocument.description);
      upsertMeta('name', 'twitter:image', seoDocument.openGraph.image);
      setCanonical(seoDocument.canonicalUrl);
      setStructuredData(seoDocument.jsonLd);
    });
    return () => { active = false; };
  }, [isProgrammeLoading, location.pathname, location.search, programmeLoadError, selectedProgramme]);

  return null;
}
