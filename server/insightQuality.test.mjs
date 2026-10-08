import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeInsightContent, deriveInsightExcerpt, normalizeInsightContent } from '../scripts/lib/insight-quality.mjs';

test('derives a complete excerpt from article content when an imported excerpt is truncated', () => {
  const content = 'An AI readiness assessment helps enterprise teams identify practical capability gaps before investing in training. It also connects learning priorities with governance and measurable work outcomes.\n\n## Next section';
  const excerpt = deriveInsightExcerpt(content, 'An AI readiness assessment helps enterprise');
  assert.ok(excerpt.length >= 80 && excerpt.length <= 160);
  assert.match(excerpt, /[.!?…]$/u);
});

test('insight analysis identifies editorial blockers without changing indexability', () => {
  const article = { id: 'example', title: 'Enterprise AI Readiness', category: 'AI & Automation', excerpt: 'Too short', author: 'TechnoEdge Editorial Team' };
  const result = analyzeInsightContent(article, { content: 'Paragraph.\n\n## One\n\nText.' });
  assert.ok(result.blockers.includes('excerpt'));
  assert.ok(result.blockers.includes('heading_structure'));
  assert.ok(result.blockers.includes('primary_sources'));
  assert.ok(result.blockers.includes('named_author_and_reviewer'));
});

test('normalizes legacy CTA artifacts and removes placeholder link instructions', () => {
  const content = 'Opening.\n\n## Suggested Internal Links\n\nAdd these links inside the final website version:\n\n- Example\n\n## FAQ\n\nAnswer.\n\nFinish.Connect with us : training@technoedgels.comVisit Our Site : https://technoedgels.com/blog-insights/';
  const normalized = normalizeInsightContent(content);
  assert.doesNotMatch(normalized, /Suggested Internal Links|Add these links/);
  assert.doesNotMatch(normalized, /blog-insights|\.Connect/);
  assert.match(normalized, /https:\/\/www\.technoedgels\.com\/insights/);
});
