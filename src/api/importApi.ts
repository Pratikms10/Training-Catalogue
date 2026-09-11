export interface ImportIssue {
  severity: 'error' | 'warning';
  code: string;
  sourceRow: number | null;
  courseId: string | null;
  field: string;
  message: string;
}

export interface ImportPreview {
  previewId: string;
  fileName: string;
  counts: {
    records: number;
    valid: number;
    rejected: number;
    errors: number;
    warnings: number;
  };
  canImport: boolean;
  issues: ImportIssue[];
  sample: Array<{
    courseId: string;
    title: string;
    toolName: string;
    level: string;
    durationMinutes: number;
    modules: number;
    scenarios: number;
  }>;
}

export async function previewCourseImport(source: Blob, fileName: string): Promise<ImportPreview> {
  const response = await fetch(`/api/admin/import/preview?fileName=${encodeURIComponent(fileName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: source,
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'The file could not be validated.');
  return body;
}

export async function commitCourseImport(previewId: string) {
  const response = await fetch('/api/admin/import/commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ previewId }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'The courses could not be imported.');
  return body as { status: string; imported: number; message: string };
}

export function jsonlDownloadUrl(previewId: string) {
  return `/api/admin/import/jsonl/${encodeURIComponent(previewId)}`;
}
