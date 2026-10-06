import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { BaseProgramme } from '../types';
import { careerJobs } from '../data/careersData';
import { getInsightArticleById } from '../data/insightsData';

const SITE_ORIGIN = 'https://www.technoedgels.com';
const SITE_NAME = 'TechnoEdge Learning Services';
const SOCIAL_IMAGE = `${SITE_ORIGIN}/technoedge-brand-logo.png`;

interface SeoHeadProps {
  selectedProgramme: BaseProgramme | null;
  isProgrammeLoading: boolean;
  programmeLoadError: string | null;
}

interface SeoConfiguration {
  title: string;
  description: string;
  canonicalPath?: string;
  robots: string;
  openGraphType?: 'website' | 'article';
  structuredData?: Record<string, unknown>;
}

const indexRobots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const noindexRobots = 'noindex, follow';

const cleanDescription = (value: string) => {
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact.length <= 160 ? compact : `${compact.slice(0, 157).trimEnd()}…`;
};

const decodePathSegment = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

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

function setCanonical(pathname?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!pathname) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('link');
  element.rel = 'canonical';
  element.href = new URL(pathname, `${SITE_ORIGIN}/`).href;
  if (!existing) document.head.appendChild(element);
}

function setStructuredData(data?: Record<string, unknown>) {
  const existing = document.getElementById('technoedge-route-structured-data');
  if (!data) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('script');
  element.id = 'technoedge-route-structured-data';
  element.setAttribute('type', 'application/ld+json');
  element.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(element);
}

export function SeoHead({ selectedProgramme, isProgrammeLoading, programmeLoadError }: SeoHeadProps) {
  const location = useLocation();

  const configuration = useMemo<SeoConfiguration>(() => {
    const pathname = location.pathname.length > 1
      ? location.pathname.replace(/\/+$/, '')
      : location.pathname;

    if (pathname === '/catalogue') {
      return {
        title: 'Corporate Training Catalogue | TechnoEdge',
        description: 'Explore role-based, technical, certification, AI, tools, technology, people and process training programmes for enterprise teams.',
        canonicalPath: '/catalogue',
        robots: indexRobots,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'TechnoEdge Corporate Training Catalogue',
          url: `${SITE_ORIGIN}/catalogue`,
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_ORIGIN}/` },
        },
      };
    }

    if (pathname.startsWith('/programmes/')) {
      const requestedId = decodePathSegment(pathname.slice('/programmes/'.length)).toUpperCase();
      const isResolved = selectedProgramme && selectedProgramme.id !== 'NOT_FOUND';

      if (isResolved) {
        const description = cleanDescription(
          selectedProgramme.details?.summary
          || selectedProgramme.details?.objective
          || `${selectedProgramme.title} is a TechnoEdge corporate training programme for enterprise teams.`,
        );
        const canonicalId = selectedProgramme.id.toUpperCase();
        return {
          title: `${selectedProgramme.title} | TechnoEdge Training`,
          description,
          canonicalPath: `/programmes/${encodeURIComponent(canonicalId)}`,
          robots: indexRobots,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: selectedProgramme.title,
            description,
            url: `${SITE_ORIGIN}/programmes/${encodeURIComponent(canonicalId)}`,
            provider: {
              '@type': 'Organization',
              name: SITE_NAME,
              sameAs: `${SITE_ORIGIN}/`,
            },
          },
        };
      }

      const unavailable = Boolean(programmeLoadError) || selectedProgramme?.id === 'NOT_FOUND';
      return {
        title: unavailable ? 'Programme not found | TechnoEdge' : `Loading ${requestedId || 'programme'} | TechnoEdge`,
        description: unavailable
          ? 'The requested TechnoEdge training programme is not available.'
          : 'Loading programme information from the TechnoEdge corporate training catalogue.',
        robots: noindexRobots,
      };
    }

    if (pathname === '/insights') {
      return {
        title: 'Enterprise Learning and Technology Insights | TechnoEdge',
        description: 'Practical perspectives on enterprise AI, data, cloud, security, leadership and workforce capability development.',
        canonicalPath: '/insights',
        robots: indexRobots,
      };
    }

    if (pathname.startsWith('/insights/')) {
      const slug = decodePathSegment(pathname.slice('/insights/'.length));
      const article = getInsightArticleById(slug);
      return article
        ? {
            title: `${article.title} | TechnoEdge Insights`,
            description: cleanDescription(article.excerpt),
            robots: noindexRobots,
            openGraphType: 'article',
          }
        : {
            title: 'Insight not found | TechnoEdge',
            description: 'The requested TechnoEdge insight is not available.',
            robots: noindexRobots,
          };
    }

    if (pathname === '/careers') {
      return {
        title: 'Careers at TechnoEdge | Learning, Technology and Innovation',
        description: 'Explore opportunities to build your career in learning, technology, content, design, sales and AI solutions at TechnoEdge.',
        canonicalPath: '/careers',
        robots: indexRobots,
      };
    }

    if (pathname.startsWith('/careers/')) {
      const slug = decodePathSegment(pathname.slice('/careers/'.length));
      const job = careerJobs.find((item) => item.slug === slug);
      return job
        ? {
            title: `${job.title} | Careers at TechnoEdge`,
            description: cleanDescription(`Explore the ${job.title} opportunity in ${job.department} at TechnoEdge${job.location ? ` in ${job.location}` : ''}.`),
            robots: noindexRobots,
          }
        : {
            title: 'Role not found | Careers at TechnoEdge',
            description: 'The requested career opportunity is not available.',
            robots: noindexRobots,
          };
    }

    if (pathname === '/admin/import' || pathname.startsWith('/admin/')) {
      return {
        title: 'Catalogue Administration | TechnoEdge',
        description: 'Restricted catalogue administration area.',
        robots: 'noindex, nofollow, noarchive',
      };
    }

    return {
      title: isProgrammeLoading ? 'Loading | TechnoEdge' : 'Page not found | TechnoEdge',
      description: 'The requested TechnoEdge page is not available.',
      robots: noindexRobots,
    };
  }, [isProgrammeLoading, location.pathname, programmeLoadError, selectedProgramme]);

  useEffect(() => {
    const canonicalUrl = configuration.canonicalPath
      ? new URL(configuration.canonicalPath, `${SITE_ORIGIN}/`).href
      : '';

    document.title = configuration.title;
    upsertMeta('name', 'description', configuration.description);
    upsertMeta('name', 'robots', configuration.robots);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', configuration.title);
    upsertMeta('property', 'og:description', configuration.description);
    upsertMeta('property', 'og:type', configuration.openGraphType ?? 'website');
    upsertMeta('property', 'og:url', canonicalUrl || undefined);
    upsertMeta('property', 'og:image', SOCIAL_IMAGE);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', configuration.title);
    upsertMeta('name', 'twitter:description', configuration.description);
    upsertMeta('name', 'twitter:image', SOCIAL_IMAGE);
    setCanonical(configuration.canonicalPath);
    setStructuredData(configuration.structuredData);
  }, [configuration]);

  return null;
}
