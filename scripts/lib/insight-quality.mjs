const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const truncate = (value, maximum = 160) => {
  const compact = normalize(value);
  if (compact.length <= maximum) return compact;
  const contentLimit = maximum - 1;
  const candidate = compact.slice(0, contentLimit + 1);
  const boundary = candidate.lastIndexOf(' ');
  return `${candidate.slice(0, boundary > 90 ? boundary : contentLimit).replace(/[,:;\-–—]+$/u, '').trimEnd()}…`;
};

export function deriveInsightExcerpt(content, suppliedExcerpt = '') {
  const supplied = normalize(suppliedExcerpt).replace(/\.{3}$/u, '').trim();
  if (supplied.length >= 80 && supplied.length <= 160 && /[.!?…]$/u.test(supplied)) return supplied;

  const paragraph = content
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((value) => normalize(value.replace(/^#{1,6}\s+/u, '')))
    .find((value) => value.length >= 80 && !/^(?:[-*]|\d+\.)\s/u.test(value));
  const candidate = paragraph || supplied || 'Practical enterprise learning and technology guidance from TechnoEdge.';
  const sentence = candidate.match(/^.{80,159}?[.!?](?=\s|$)/u)?.[0];
  const excerpt = truncate(sentence || candidate, 160);
  return /[.!?…]$/u.test(excerpt) ? excerpt : `${excerpt.slice(0, 159).trimEnd()}.`;
}

export function normalizeInsightContent(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n## Suggested Internal Links[\s\S]*?(?=\n## (?:FAQ|Enterprise CTA|CTA)|$)/giu, '\n')
    .replace(/([.!?])(?:Connect with us)\s*:/giu, '$1\n\nConnect with us:')
    .replace(/training@technoedgels\.com\s*(?:Visit Our Site|visit our Site)\s*:/giu, 'training@technoedgels.com\n\nExplore TechnoEdge insights:')
    .replace(/https:\/\/technoedgels\.com\/blog-insights\/?/giu, 'https://www.technoedgels.com/insights')
    .replace(/https:\/\/technoedgels\.com\/about-us\/For\b/giu, 'https://www.technoedgels.com/about\n\nFor')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function analyzeInsightContent(article, payload) {
  const content = String(payload?.content || '').replace(/\r\n/g, '\n');
  const words = content.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) || [];
  const h2Count = (content.match(/^##\s+.+$/gmu) || []).length;
  const h3Count = (content.match(/^###\s+.+$/gmu) || []).length;
  const sourceUrls = [...new Set(content.match(/https:\/\/[^\s)\]}]+/giu) || [])];
  const blockers = [];
  if (normalize(article.excerpt).length < 80 || !/[.!?…]$/u.test(normalize(article.excerpt))) blockers.push('excerpt');
  if (words.length < 800) blockers.push('thin_content');
  if (h2Count < 3) blockers.push('heading_structure');
  if (sourceUrls.length < 2) blockers.push('primary_sources');
  if (article.author === 'admintechnoedge' || /Editorial Team/i.test(article.author)) blockers.push('named_author_and_reviewer');
  if (/## Suggested Internal Links|Add these links inside the final website version/i.test(content)) blockers.push('placeholder_internal_links');
  if (/technoedgels\.com\/blog-insights\/?/i.test(content)) blockers.push('legacy_cta_link');
  if (/[.!?](?:Connect with us|Visit Our Site)\s*:/i.test(content) && !/\n\s*(?:Connect with us|Visit Our Site)\s*:/i.test(content)) blockers.push('concatenated_cta');

  return {
    id: article.id,
    title: article.title,
    category: article.category,
    author: article.author,
    excerptLength: normalize(article.excerpt).length,
    wordCount: words.length,
    h2Count,
    h3Count,
    sourceUrls,
    blockers,
  };
}
