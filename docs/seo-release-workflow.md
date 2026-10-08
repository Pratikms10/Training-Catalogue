# Programme SEO release workflow

Programme visibility and search indexability are separate controls. A published programme can remain available in the catalogue while `seo_indexable` is false. Only approved programmes are prerendered as indexable pages and included in the programme sitemap.

## 1. Find the remediation work

Run:

```powershell
npm run audit:seo
```

Review `artifacts/seo/programme-quality-report.json`. Each held programme contains an explicit `blockers` array and a `ready_for_editorial_review` value. Fix the source content through the existing catalogue import workflow; do not edit generated sitemaps or build output by hand.

The automated content gate requires:

- Every programme: a meaningful title and at least 100 characters of unique summary content.
- Training: duration, delivery mode, at least three outcomes, an audience, modules, and a scenario, lab, or practical activity.
- Certification: provider, official source or credential status, and at least one exam, objective, requirement, training resource, or lifecycle record.
- No duplicate normalized title and no summary with 90% or greater similarity to another published programme.

## 2. Prepare an editorial review batch

Generate a review packet only from programmes that pass every automated content and duplication gate:

```powershell
npm run seo:prepare-review -- --batch-id 2026-10-wave-01 --limit 25
```

The command writes a Markdown review packet, machine-readable review records, a batch summary and a deliberately unapproved release-manifest template under `artifacts/seo/review-batches/<batch-id>/`. It refuses to fill a batch when too few programmes pass the automated gate.

When a remediation changes a checked-in role-based title, synchronize the converted JSONL source after rerunning the audit:

```powershell
npm run seo:sync-source-titles
```

Database-only records are reported separately and remain protected by the tracked migration that changed them.

## 3. Record TechnoEdge approval

Create a JSON manifest outside the repository or in an ignored working location:

```json
{
  "batchId": "2026-10-wave-01",
  "reviewedBy": "Full name or accountable TechnoEdge team",
  "reviewedAt": "2026-10-08T10:00:00+05:30",
  "programmes": [
    {
      "courseId": "TT0002",
      "approved": true,
      "sourceUrl": "https://approved-source.example/programme",
      "seoTitle": "Optional unique SEO title between 20 and 70 characters",
      "seoDescription": "Optional unique search description between 50 and 170 characters.",
      "notes": "Optional private reviewer note; it is validated but not written to public programme data."
    }
  ]
}
```

Use a direct HTTPS evidence URL. The release tool validates the URL but does not store it in the public catalogue or SEO quality report.

## 4. Dry-run and apply

Dry-run every batch first. It opens a transaction, checks current database content and duplicates, then rolls the transaction back:

```powershell
npm run seo:release -- "C:\path\to\release-manifest.json"
```

Apply only after the dry run succeeds. The confirmation value must exactly match the manifest batch ID:

```powershell
$env:SEO_RELEASE_CONFIRM="2026-10-wave-01"
npm run seo:release -- "C:\path\to\release-manifest.json" --apply
Remove-Item Env:SEO_RELEASE_CONFIRM
```

The command refuses missing programmes, unpublished programmes, already-indexable programmes, incomplete content, duplicate titles, and summaries at or above the similarity threshold. The whole batch is atomic: one failure rolls back every record.

## 5. Build and publish

After applying a batch:

```powershell
npm run audit:seo
npm run build
npm test
```

Deploy the verified build, submit the changed programme URLs through IndexNow, and monitor indexing for 14 days. Never submit held URLs or add them to a sitemap manually.
