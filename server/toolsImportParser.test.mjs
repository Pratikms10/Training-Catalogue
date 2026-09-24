import assert from 'node:assert/strict';
import test from 'node:test';
import { coursesToJsonl, parseImportSource, validateCourseRecords, validateToolsRecords } from './toolsImportParser.mjs';

test('structured course text converts colored module items without invalid Unicode', async () => {
  const source = `Claude\t16 Hours\t"**Course ID:** TT9001
**Title:** Claude Workflow Test
**Delivery:** Instructor-Led
**Level:** Intermediate
**Duration:** 16 Hours
**Tools Covered:** Claude, Research

## Programme Objectives
* Build a validated workflow.

## Who Should Attend
* **Business Analysts**

## Prerequisites
* Basic computer skills

## Modules

### Module 1: Foundations
* 🔴 Understand the concept
* 🟢 Complete the practical activity

## Applied Business Scenario

### Scenario 1: Test workflow
**Input → Review → Output**

Participants complete a representative workflow.
"`;

  const parsed = await parseImportSource(Buffer.from(source), 'sample.txt');
  const validation = validateToolsRecords(parsed.records, parsed.sourceIssues);
  assert.equal(validation.valid, true);
  assert.equal(validation.courses[0].modules[0].concepts[0], 'Understand the concept');
  assert.equal(validation.courses[0].modules[0].practicalActivities[0], 'Complete the practical activity');
  assert.equal(validation.courses[0].scenarios.length, 1);

  const jsonl = coursesToJsonl(validation.courses);
  for (let index = 0; index < jsonl.length; index += 1) {
    const code = jsonl.charCodeAt(index);
    if (code >= 0xD800 && code <= 0xDBFF) {
      const next = jsonl.charCodeAt(index + 1);
      assert.ok(next >= 0xDC00 && next <= 0xDFFF, 'high surrogate must have a matching low surrogate');
      index += 1;
    } else {
      assert.ok(code < 0xDC00 || code > 0xDFFF, 'low surrogate must have a matching high surrogate');
    }
  }
});

test('standalone structured course text infers its tool and excludes trailing reference definitions', async () => {
  const source = `"**Course ID:** TT9002
**Title:** Perplexity Research Test
**Delivery:** Instructor-Led
**Level:** Basic
**Duration:** 8 Hours
**Tools Covered:** Perplexity Search, Research Mode

## Programme Objectives
* Build an evidence-based workflow.

## Who Should Attend
* **Business Analysts**

## Prerequisites
* Basic computer skills

## Modules

### Module 1: Foundations
* 🔴 Understand cited search
* 🟢 Complete a practical search

## Applied Business Scenario

### Scenario 1: Research workflow
**Question → Sources → Answer**

Participants complete a cited research workflow.

[1]: https://example.com/source "Example source"
"`;

  const parsed = await parseImportSource(Buffer.from(source), 'standalone.txt');
  const validation = validateToolsRecords(parsed.records, parsed.sourceIssues);
  assert.equal(validation.valid, true);
  assert.equal(validation.courses[0].courseId, 'TT9002');
  assert.equal(validation.courses[0].toolName, 'Perplexity');
  assert.equal(validation.courses[0].vendor, 'Perplexity AI');
  assert.equal(validation.courses[0].format, null);
  assert.equal(validation.courses[0].delivery, 'Instructor-Led');
  assert.equal(validation.courses[0].scenarios[0].description, 'Participants complete a cited research workflow.');
});

test('role-based structured text maps department, skills, modules, and scenarios', async () => {
  const source = `RB9001\tChatGPT\tHuman Resources\t4 Hours\t"**Course ID:** RB9001
**Title:** ChatGPT for Human Resources: Pilot
**Format:**
**Delivery:** Instructor-Led
**Level:** Awareness
**Duration:** 4 Hours
**Tools Covered:** ChatGPT, Prompting, File Analysis, File Analysis

## Programme Objectives
* Apply ChatGPT to representative HR work.

## Who Should Attend
* **HR Professionals**

## Prerequisites
* Basic HR knowledge

## Modules

### Module 1: HR Foundations
* 🔴 Understand responsible HR use
* 🟢 Draft an HR communication

## Applied Business Scenario

### Scenario 1: Policy communication
**Policy → Summary → Review**

Participants create a reviewed employee communication.
"`;

  const parsed = await parseImportSource(Buffer.from(source), 'role-sample.txt');
  const validation = validateCourseRecords(parsed.records, parsed.sourceIssues);
  assert.equal(validation.valid, true);
  assert.equal(validation.courses[0].courseId, 'RB9001');
  assert.equal(validation.courses[0].category, 'role-based');
  assert.equal(validation.courses[0].department, 'Human Resources');
  assert.equal(validation.courses[0].functionName, 'Human Resources');
  assert.deepEqual(validation.courses[0].relatedSkills, ['ChatGPT', 'Prompting', 'File Analysis']);
  assert.equal(validation.issues.some((item) => item.code === 'DUPLICATE_LIST_ITEMS_REMOVED'), true);
  assert.equal(validation.courses[0].modules.length, 1);
  assert.equal(validation.courses[0].scenarios.length, 1);
});

test('role-based structured text accepts a department and role header without a tool name', async () => {
  const source = `RB1024\t\tSenior Leadership / Leadership Team\tC-Suite Executives\t4 hours\t"**Course ID:** RB1024
**Department:** Senior Leadership / Leadership Team
**Role:** C-Suite Executives
**Title:** AI-Powered Leadership for C-Suite Executives
**Format:**
**Delivery:** Instructor-Led
**Level:** Awareness
**Duration:** 4 Hours
**Tools Covered:** Generative AI, Executive Prompting, Decision Support

## Programme Objectives
* Apply AI to executive decision preparation.

## Who Should Attend
* **C-Suite Executives**

## Prerequisites
* Senior leadership experience

## Modules

### Module 1: AI Foundations for Leadership
* 🔴 Understand AI from an executive perspective
* 🟢 Map executive responsibilities to AI-assisted workflows

## Applied Business Scenario

### Scenario 1: Executive decision brief
**Challenge → Evidence → Options → Decision**

Participants prepare an executive decision brief.
"`;

  const parsed = await parseImportSource(Buffer.from(source), 'role-audience-sample.txt');
  const validation = validateCourseRecords(parsed.records, parsed.sourceIssues);

  assert.equal(validation.valid, true);
  assert.equal(validation.courses[0].courseId, 'RB1024');
  assert.equal(validation.courses[0].department, 'Senior Leadership / Leadership Team');
  assert.equal(validation.courses[0].functionName, 'Senior Leadership / Leadership Team');
  assert.equal(validation.courses[0].roleTitle, 'C-Suite Executives');
  assert.deepEqual(validation.courses[0].relatedSkills, ['Generative AI', 'Executive Prompting', 'Decision Support']);
});
