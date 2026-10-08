const TITLE_MAXIMUM = 70;
const DESCRIPTION_MAXIMUM = 160;

export function truncateAtWord(value, maximum) {
  const compact = String(value || '').replace(/\s+/g, ' ').trim();
  if (compact.length <= maximum) return compact;
  const contentLimit = Math.max(1, maximum - 1);
  const candidate = compact.slice(0, contentLimit + 1);
  const wordBoundary = candidate.lastIndexOf(' ');
  const shortened = candidate.slice(0, wordBoundary > contentLimit * 0.6 ? wordBoundary : contentLimit).trimEnd();
  return `${shortened.replace(/[,:;\-–—]+$/u, '')}…`;
}

export function suggestedSeoTitle(programme) {
  const suffix = ' | TechnoEdge';
  const baseTitle = programme.title.split(' — ')[0].split(':')[0].trim();
  const level = programme.category === 'certifications' ? 'Certification' : programme.level;
  const candidate = [baseTitle, level].filter(Boolean).join(' — ');
  return `${truncateAtWord(candidate, TITLE_MAXIMUM - suffix.length)}${suffix}`;
}

export function suggestedSeoDescription(programme) {
  const summary = programme.details?.summary || `${programme.title} is a TechnoEdge enterprise learning programme.`;
  const candidate = summary.length >= 50
    ? summary
    : `${summary} Review the audience, outcomes, delivery format and programme structure.`;
  return truncateAtWord(candidate, DESCRIPTION_MAXIMUM);
}

export function buildReviewRecord(programme, metadata = {}) {
  return {
    courseId: programme.id,
    pageUrl: `https://www.technoedgels.com/programmes/${programme.id}`,
    category: programme.category,
    title: programme.title,
    level: programme.level || null,
    duration: programme.duration || null,
    delivery: programme.details?.delivery || programme.format || null,
    summary: programme.details?.summary || null,
    audience: programme.details?.audience || [],
    outcomes: programme.details?.objectives || [],
    prerequisites: programme.details?.prerequisitesList || [],
    modules: (programme.details?.modules || []).map((module) => module.title),
    scenarios: (programme.details?.scenarios || []).map((scenario) => scenario.title),
    provider: programme.details?.provider || programme.provider || null,
    examCode: programme.details?.examCode || programme.examCode || null,
    officialSourceUrl: programme.details?.courseUrl || programme.courseUrl || null,
    sourceReference: metadata.sourceReference || null,
    suggestedSeoTitle: suggestedSeoTitle(programme),
    suggestedSeoDescription: suggestedSeoDescription(programme),
  };
}

export function buildPendingReleaseManifest(batchId, records) {
  return {
    batchId,
    reviewedBy: 'PENDING — replace with accountable reviewer',
    reviewedAt: null,
    programmes: records.map((record) => ({
      courseId: record.courseId,
      approved: false,
      sourceUrl: record.officialSourceUrl || '',
      seoTitle: record.suggestedSeoTitle,
      seoDescription: record.suggestedSeoDescription,
      notes: 'Pending factual, source and search-snippet review.',
    })),
  };
}
