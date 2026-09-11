# Course data import

The Tools & Technology pilot is imported from newline-delimited JSON (JSONL). Each non-empty line must contain one complete course object.

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

- Course IDs must be unique and use the `TT` prefix followed by at least four digits.
- The category must be `tools-technology`.
- Vendor is inferred for ChatGPT/OpenAI, Gemini/Google, and Claude/Anthropic when absent.
- Level is inferred from duration only when it is absent: 240 minutes = Awareness, 480 = Basic, 960 = Intermediate, and 1920 = Advanced.
- Summary is derived from the first objective when absent.
- Format is not guessed. A missing format remains a warning and the website displays the neutral label `Programme`.
- Concepts and practical activities remain separate throughout normalization and rendering.

Warnings do not block an import, but every warning is recorded in the audit report. Validation errors block the whole batch.
