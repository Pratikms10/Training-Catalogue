import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseMicrosoftCertificationMarkdown, validateCertificationBatch } from './certificationMarkdownParser.mjs';

const sample = `# AB-6002

## Course title

Introduction to finance in Dynamics 365

## Course URL

https://learn.microsoft.com/training/courses/ab-6002

## Overview

Learn the foundations of Dynamics 365 Finance.

## Level

beginner

## Product / technology

dynamics-365, dynamics-finance

## Role

business-user, functional-consultant

## Subject

finance

## Duration

24 hours

## Course language

en

## Audience profile

Finance professionals and ERP beginners.

## Prerequisites


## Learning objectives / Skills gained


## Course syllabus

### Learning Path: Introduction to finance in Dynamics 365

Explore the finance application.

#### Module 1: Describe Dynamics 365 finance and operations apps

**Description**

Explore the core application.

**Learning objectives**

- Describe enterprise resource planning.

**Topics / Units**

- Introduction
- Summary

**Exercises / Labs**


## Certification / Exam information
`;

test('Microsoft certification parser uses the filename course code, not the scraper sequence', () => {
  const course = parseMicrosoftCertificationMarkdown(sample, '0053_AB-6002.md');
  assert.equal(course.courseId, 'AB-6002');
  assert.equal(course.sourceSequence, 53);
  assert.equal(course.level, 'Beginner');
  assert.equal(course.durationMinutes, 1440);
  assert.equal(course.modules.length, 1);
  assert.deepEqual(course.modules[0].learningObjectives, ['Describe enterprise resource planning.']);
  assert.deepEqual(course.modules[0].topics, ['Introduction', 'Summary']);
});

test('Microsoft certification parser rejects a filename and heading mismatch', () => {
  assert.throws(
    () => parseMicrosoftCertificationMarkdown(sample, '0053_AB-6005.md'),
    /does not match filename code AB-6005/,
  );
});

test('certification batch validation rejects duplicate provider course codes', () => {
  const course = parseMicrosoftCertificationMarkdown(sample, '0053_AB-6002.md');
  assert.throws(() => validateCertificationBatch([course, course]), /Duplicate certification code AB-6002/);
});
