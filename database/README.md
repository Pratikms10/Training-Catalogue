# Training catalogue database

This folder contains the PostgreSQL foundation for the training catalogue and its Excel import pipeline.

## Requirements

- PostgreSQL 15 or later
- A database connection string exposed as `DATABASE_URL`
- An application backend that owns database credentials. The Vite frontend must not connect with administrative credentials.

## Configure the connection

Copy `.env.example` to `.env` and replace `DATABASE_URL` with the connection string from the PostgreSQL provider. Keep this credential on the server; never expose it through a `VITE_` environment variable.

## Apply the schema

The project migration runner applies every unapplied SQL file in order:

```powershell
npm run db:migrate
```

The equivalent direct `psql` command for the first migration is:

Run the migration once against a new database:

```powershell
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/migrations/001_initial_catalogue.sql
```

Then run the non-destructive smoke test. It inserts a temporary course inside a transaction, validates retrieval, and rolls the transaction back:

```powershell
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/verification/001_catalogue_smoke_test.sql
```

## Load and verify the pilot catalogue

After running the JSONL validator, import the canonical catalogue data:

```powershell
npm run db:import:tools
npm run db:verify
```

The import is an upsert keyed by Course ID. It does not remove courses that are absent from the input. Each chunk replaces that course's objectives, tools, audiences, prerequisites, modules, learning items, and scenarios in one transaction. New courses remain hidden as drafts until every chunk succeeds, then the batch is published together. `DATABASE_IMPORT_CHUNK_SIZE` controls the chunk size and defaults to 100.

The database importer accepts canonical JSON and JSONL. If a long job is interrupted after committed chunks, resume the same batch without repeating those courses:

```powershell
node scripts/import-tools-db.mjs "C:\path\to\courses.jsonl" --resume-batch=14
```

The resume command verifies the batch size and the exact imported Course ID sequence before continuing.

## Bulk Tools & Technology workbook import

The technical-training converter accepts the four-sheet course workbook (`Course index`, `Course details`, `Curriculum`, and `Source checks`). It maps the workbook source IDs to catalogue IDs `TC0001`, `TC0002`, and so on, while retaining each original source ID for traceability. Python 3 with `openpyxl` is required for workbook extraction.

```powershell
npm run db:convert:technical -- "C:\path\TechnoEdge_Course_Content.xlsx"
npm run db:import:tools -- "data\normalized\technical-training.json"
npm run db:verify
```

The generated JSON records the duration-normalization rule and source issues for every course. The importer uses upsert semantics, so rerunning a corrected workbook updates matching `TC` records without deleting other categories.

## Run the API locally

Start the API and Vite in separate terminals:

```powershell
npm run dev:api
npm run dev
```

Vite proxies `/api` to `http://localhost:3001` by default. Production mode can serve the compiled `dist` directory from the same Express process by setting `NODE_ENV=production` or `SERVE_STATIC=true`.

Read endpoints:

- `GET /api/health`
- `GET /api/courses?page=1&pageSize=24&category=tools-technology`
- `GET /api/courses?page=1&pageSize=24&category=role-based`
- `GET /api/courses?page=1&pageSize=24&category=certifications`
- `GET /api/courses?page=1&pageSize=24&category=technical-training`
- `GET /api/courses?q=chatgpt&level=Intermediate`
- `GET /api/courses/TT0003`
- `GET /api/courses/RB0001`

## Local Import Centre

Open `http://localhost:3000/admin/import` while the API and Vite development servers are running.
The local Import Centre accepts:

- `.xlsx` files created from the downloadable workbook template
- `.json` and `.jsonl` files
- structured Tools or Role-Based course text containing the Course ID, programme sections, modules, and scenarios

The preview step converts the source to normalized JSONL, validates all records, checks incoming Course IDs against the database, and shows rejected rows before any write. The commit step imports valid rows with upsert semantics. It never deletes courses that are absent from an incoming batch.

Role-Based structured-text rows use `Course ID`, `Tool`, `Department`, and `Duration` before the quoted Markdown record. The department is stored in `role_based_details`; Tools Covered are also available as related skills for catalogue cards and search.

The import routes are available only from the local machine during development. Production keeps them disabled unless `ENABLE_IMPORT_CENTRE=true` is deliberately configured; authentication must be added before enabling them on a public deployment.

## Data model

- `courses` contains the common catalogue fields and publication state.
- `role_based_details`, `people_process_details`, `tools_technology_details`, `technical_training_details`, and `certification_details` contain category-specific fields.
- Modules, outcomes, audiences, prerequisites, scenarios, skills, tools, and technology categories use related tables so lists remain searchable and ordered.
- `import_batches` and `import_rows` preserve upload history, staging payloads, validation errors, and row-level outcomes.
- `course_catalogue_view` returns the common and category-specific fields needed by catalogue cards and filters.

Role-Based, People/Process, and AI Tool Course IDs use the category prefix followed by at least four digits: `RB`, `PP`, or `TT`. Tools & Technology courses use `TC` IDs and the database category `technical-training`, keeping them separate from the existing AI Tools records. Certifications use permanent TechnoEdge IDs such as `CER0001`. Provider-issued course codes such as `AB-6002` remain separate, searchable metadata; the scraper sequence in a source filename is retained only as traceability metadata.

## Microsoft certification Markdown import

The certification importer accepts one or more Markdown files or a folder containing Markdown files. A filename such as `0053_AB-6002.md` is interpreted as source sequence `0053` and official provider course code `AB-6002`. The code is cross-checked against the document H1 before any database write. Existing provider codes retain their assigned `CER` ID; new provider codes receive the next available `CER` number.

```powershell
npm run db:import:certifications -- "C:\path\0053_AB-6002.md" "C:\path\0092_AB-6005.md"

# Import every Markdown file in a folder while leaving existing course codes untouched.
npm run db:import:certifications -- "C:\path\microsoft-courses" --skip-existing
```

The import is a non-destructive upsert keyed by provider plus official course code. It preserves learning paths, module descriptions, module learning objectives, topics/units, and available labs, while leaving absent optional sections empty. Use `--skip-existing` for an add-only batch: matching provider codes are reported and excluded rather than updated. Validation normally stops the entire batch and reports every malformed file; add `--skip-invalid` only when valid courses should proceed while malformed files remain unimported for correction.

## Multi-provider certification workbook import

The certification workbook importer accepts either the structured multi-provider `.xlsx` model containing `Certification_Master` plus its supporting sheets, or the Oracle master model containing `Catalog_Master`, `Exam_Details`, `Exam_Blueprint`, `Training`, `Requirements`, `Flexible_Details`, and `QC`.

```powershell
npm run db:import:certifications:xlsx -- "C:\path\final Certification.xlsx"
npm run db:verify
```

Physical duplicate rows are collapsed by workbook `Global ID`. Stable workbook identities and provider certification IDs retain their assigned `CER` ID on later imports; new credentials receive the next available number. Provider exam codes remain separate because one exam can support multiple credentials. Customer-facing fields are normalized into certification-specific tables, while the original structured rows remain in the import payload for audit and future remapping.

For Oracle workbooks, repeated records with the same provider and credential title are merged into one customer-facing card. Distinct exams, blueprints, learning resources, and eligibility requirements are combined under that credential. Delta assessments remain separate catalogue records and are labelled as assessments. Generic test-session logistics and flexible extraction details remain in the audit payload instead of crowding the public requirements section.

The website uses an adaptive credential page. It always displays the provider, credential title, `CER` ID, overview, type, and available audience information. Exam details, objectives, requirements, official learning resources, lifecycle, price, languages, and renewal information appear only when the source supplies them. Internal source batches, QC flags, attention notes, synthetic provider IDs, duplicate logs, and extraction rules are never exposed in the public interface.

## Import modes

- `validate_only` parses and validates a workbook without changing catalogue records.
- `upsert` creates new courses and updates matching course IDs.
- `replace_all` replaces the catalogue only after the whole workbook passes validation and a backup has been recorded.

The first production import should use `validate_only`, followed by `upsert` after review. `replace_all` should be restricted to administrators.
