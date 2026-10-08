const batchIdPattern = /^[a-z0-9][a-z0-9._-]{2,63}$/;
const courseIdPattern = /^(?:RB|TT|TC|CER)\d{4,}$/;

function requiredText(value, field, minimum, maximum) {
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`);
  const normalized = value.trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new Error(`${field} must contain ${minimum}–${maximum} characters.`);
  }
  return normalized;
}

function optionalText(value, field, minimum, maximum) {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredText(value, field, minimum, maximum);
}

function approvedSourceUrl(value, field) {
  const normalized = requiredText(value, field, 10, 2_048);
  let url;
  try { url = new URL(normalized); } catch { throw new Error(`${field} must be a valid URL.`); }
  if (url.protocol !== 'https:') throw new Error(`${field} must use HTTPS.`);
  return url.href;
}

export function validateSeoReleaseManifest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The release manifest must be a JSON object.');
  }

  const batchId = requiredText(value.batchId, 'batchId', 3, 64).toLowerCase();
  if (!batchIdPattern.test(batchId)) {
    throw new Error('batchId may contain lowercase letters, numbers, dots, underscores, and hyphens.');
  }
  const reviewedBy = requiredText(value.reviewedBy, 'reviewedBy', 3, 120);
  const reviewedAt = requiredText(value.reviewedAt, 'reviewedAt', 10, 40);
  const timestamp = new Date(reviewedAt);
  if (Number.isNaN(timestamp.valueOf())) throw new Error('reviewedAt must be a valid ISO date or timestamp.');

  if (!Array.isArray(value.programmes) || value.programmes.length < 1 || value.programmes.length > 100) {
    throw new Error('programmes must contain between 1 and 100 records.');
  }

  const seen = new Set();
  const programmes = value.programmes.map((programme, index) => {
    if (!programme || typeof programme !== 'object' || Array.isArray(programme)) {
      throw new Error(`programmes[${index}] must be an object.`);
    }
    const courseId = requiredText(programme.courseId, `programmes[${index}].courseId`, 6, 20).toUpperCase();
    if (!courseIdPattern.test(courseId)) throw new Error(`${courseId} is not a supported programme ID.`);
    if (seen.has(courseId)) throw new Error(`${courseId} appears more than once in the release manifest.`);
    seen.add(courseId);
    if (programme.approved !== true) throw new Error(`${courseId} must have approved set to true.`);

    return {
      courseId,
      approved: true,
      sourceUrl: approvedSourceUrl(programme.sourceUrl, `${courseId}.sourceUrl`),
      seoTitle: optionalText(programme.seoTitle, `${courseId}.seoTitle`, 20, 70),
      seoDescription: optionalText(programme.seoDescription, `${courseId}.seoDescription`, 50, 170),
      notes: optionalText(programme.notes, `${courseId}.notes`, 3, 500),
    };
  });

  return {
    batchId,
    reviewedBy,
    reviewedAt: timestamp.toISOString(),
    programmes,
  };
}
