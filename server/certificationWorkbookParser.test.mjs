import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCertificationRecords } from './certificationWorkbookParser.mjs';

test('certification workbook normalization removes physical duplicates and keeps adaptive data', () => {
  const masterRow = {
    'Global ID': 'CERT-1000',
    Vendor: 'Example Vendor',
    'Vendor certification ID': 'EX-CERT-001',
    'Certification name': 'Example Cloud Associate',
    'Exam code': 'EX-101',
    'Credential type': 'Certification',
    Level: 'Associate',
    'Product / technology': 'Example Cloud; Version/basis: 2026',
    'Target role / audience': 'Cloud Engineer; Administrator',
    'Summary / overview': 'Validates practical cloud administration skills.',
    'Exam duration': '1 hour 40 min',
    Languages: 'English; Japanese',
    'Source URL': 'https://example.com/certification',
    'Source QC status': 'Pass',
  };
  const result = buildCertificationRecords({
    Certification_Master: [masterRow, { ...masterRow }],
    Source_Master_All: [],
    Exam_Details_All: [],
    Objectives_All: [{
      'Global ID': 'CERT-1000',
      'Objective group': 'Cloud operations',
      'Objective / skill': 'Configure resilient workloads',
      Weight: '25%',
    }],
    Requirements_All: [{
      'Global ID': 'CERT-1000',
      'Requirement type': 'Recommended experience',
      Requirement: 'Six months of cloud administration experience',
    }],
    Training_Resources_All: [{
      'Global ID': 'CERT-1000',
      'Resource type': 'Study resource',
      'Resource title': 'Official study guide',
      'Resource URL': 'https://example.com/guide',
    }],
    Skills_Audience_All: [],
    Lifecycle_Renewal_All: [],
  });

  assert.equal(result.courses.length, 1);
  assert.equal(result.duplicatesRemoved, 1);
  assert.equal(result.courses[0].level, 'Intermediate');
  assert.equal(result.courses[0].durationMinutes, 100);
  assert.deepEqual(result.courses[0].productTechnologies, ['Example Cloud']);
  assert.deepEqual(result.courses[0].audiences, ['Cloud Engineer', 'Administrator']);
  assert.equal(result.courses[0].exams[0].examCode, 'EX-101');
  assert.equal(result.courses[0].objectives[0].groupTitle, 'Cloud operations');
  assert.equal(result.courses[0].requirements[0].requirementType, 'Recommended experience');
  assert.equal(result.courses[0].resources[0].title, 'Official study guide');
});

test('certification workbook normalization hides explicit missing-value boilerplate', () => {
  const result = buildCertificationRecords({
    Certification_Master: [{
      'Global ID': 'CERT-1001',
      Vendor: 'Example Vendor',
      'Vendor certification ID': 'EX-CERT-002',
      'Certification name': 'Example Specialist',
      'Target role / audience': 'Not supplied in the provided source excerpt.',
    }],
    Source_Master_All: [],
    Exam_Details_All: [],
    Objectives_All: [],
    Requirements_All: [],
    Training_Resources_All: [],
    Skills_Audience_All: [],
    Lifecycle_Renewal_All: [],
  });

  assert.deepEqual(result.courses[0].audiences, []);
  assert.equal(result.courses[0].summary, 'Example Vendor lists Example Specialist as a certification.');
  assert.equal(result.courses[0].durationMinutes, null);
});
