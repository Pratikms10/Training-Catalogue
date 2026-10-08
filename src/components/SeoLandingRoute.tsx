import { getSeoLandingPage } from '../data/seoLandingPages';
import { SeoLandingPage } from './SeoLandingPage';

export function SeoLandingRoute({ pathname, programmeLinks }: {
  pathname: string;
  programmeLinks?: Array<{ id: string; title: string }>;
}) {
  const page = getSeoLandingPage(pathname);
  return page ? <SeoLandingPage page={page} programmeLinks={programmeLinks} /> : null;
}
