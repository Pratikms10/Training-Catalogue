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
    category: 'tools-technology' | 'role-based';
    title: string;
    toolName?: string;
    department?: string;
    level: string;
    durationMinutes: number;
    modules: number;
    scenarios: number;
  }>;
}

export async function previewCourseImport(source: Blob, fileName: string): Promise<ImportPreview> {
  const response = await fetch(`/api/adminzz/catalogue/import/preview?fileName=${encodeURIComponent(fileName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'X-CSRF-Token': document.cookie.match(/(?:^|; )te_admin_csrf=([^;]*)/)?.[1] || '' },
    credentials: 'same-origin',
    body: source,
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'The file could not be validated.');
  return body;
}

export async function commitCourseImport(previewId: string) {
  const response = await fetch('/api/adminzz/catalogue/import/commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': document.cookie.match(/(?:^|; )te_admin_csrf=([^;]*)/)?.[1] || '' },
    credentials: 'same-origin',
    body: JSON.stringify({ previewId }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'The courses could not be imported.');
  return body as { status: string; imported: number; message: string };
}

export function jsonlDownloadUrl(previewId: string) {
  return `/api/adminzz/catalogue/import/jsonl/${encodeURIComponent(previewId)}`;
}

export async function getImportHistory() {
  const response = await fetch('/api/adminzz/catalogue/import/history', { credentials: 'same-origin' });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Import history could not be loaded.');
  return body as { data: Array<{ preview_id: string; file_name: string; status: string; created_at: string; completed_at?: string; counts?: { valid?: number } }> };
}
