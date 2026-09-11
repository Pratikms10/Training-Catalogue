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

After running the JSONL validator, import the canonical Tools data in one database transaction:

```powershell
npm run db:import:tools
npm run db:verify
```

The import is an upsert keyed by Course ID. It does not remove courses that are absent from the input. For a matching Tools course it replaces that course's objectives, tools, audiences, prerequisites, modules, learning items, and scenarios inside the same transaction. A failed batch is rolled back and recorded as failed.

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
- `role_based_details`, `people_process_details`, and `tools_technology_details` contain category-specific fields.
- Modules, outcomes, audiences, prerequisites, scenarios, skills, tools, and technology categories use related tables so lists remain searchable and ordered.
- `import_batches` and `import_rows` preserve upload history, staging payloads, validation errors, and row-level outcomes.
- `course_catalogue_view` returns the common and category-specific fields needed by catalogue cards and filters.

Course IDs must use the category prefix followed by at least four digits: `RB`, `PP`, or `TT`. The database rejects a prefix that does not match the selected category.

## Import modes

- `validate_only` parses and validates a workbook without changing catalogue records.
- `upsert` creates new courses and updates matching course IDs.
- `replace_all` replaces the catalogue only after the whole workbook passes validation and a backup has been recorded.

The first production import should use `validate_only`, followed by `upsert` after review. `replace_all` should be restricted to administrators.
