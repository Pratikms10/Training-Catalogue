# Course data import

The catalogue import pipeline supports Tools & Technology and Role-Based courses. Each non-empty JSONL line contains one complete course object.

Validated database-ready backups currently include:

- `data/converted/tools-TT0011-TT0188-valid.jsonl`
- `data/converted/role-based-RB0001-RB0011-valid.jsonl`

Use the local Import Centre at `http://localhost:3000/admin/import` for structured text, Excel, JSON, or JSONL preview and Supabase import. The command below remains available for generating the legacy local Tools dataset.

## Run an import

```powershell
npm run import:tools -- "C:\path\to\tools-courses.jsonl"
```

To update existing courses or add new courses without replacing the rest of the catalogue, use merge mode:

```powershell
npm run import:tools -- "C:\path\to\changed-courses.jsonl" --merge
```

Merge mode replaces records with matching Course IDs, keeps all other existing records in their current order, and appends genuinely new Course IDs.

The importer validates the entire file before changing catalogue data. If any validation error is found, the import is rejected and the current generated catalogue remains unchanged.

On success it writes:

- `data/normalized/tools-technology.json` — canonical normalized data for database loading.
- `src/data/toolsTechProgrammes.ts` — generated frontend data used by the current website.
- `data/import-reports/tools-technology-last.json` — validation counts, transformations, and warnings.

## Current normalization rules

- Course IDs must be unique and use the category prefix (`TT` or `RB`) followed by at least four digits.
- A database import batch must contain only one category.
- Vendor is inferred for ChatGPT/OpenAI, Gemini/Google, and Claude/Anthropic when absent.
- Role-Based records require a department. Their related skills default to Tools Covered when no separate skill list is supplied.
- Level is inferred from duration only when it is absent: 240 minutes = Awareness, 480 = Basic, 960 = Intermediate, and 1920 = Advanced.
- Summary is derived from the first objective when absent.
- Format is not guessed. A missing format remains a warning and the website displays the neutral label `Programme`.
- Concepts and practical activities remain separate throughout normalization and rendering.

Warnings do not block an import, but every warning is recorded in the audit report. Validation errors block the whole batch.
