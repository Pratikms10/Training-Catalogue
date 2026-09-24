import assert from 'node:assert/strict';
import test from 'node:test';
import { buildOracleCertificationRecords } from './oracleCertificationWorkbookParser.mjs';

test('Oracle workbook normalization merges repeated credentials and preserves distinct exams', () => {
  const result = buildOracleCertificationRecords({
    Catalog_Master: [
      {
        'Certification ID': 'ORACLE-CERT-0028',
        Company: 'Oracle',
        'Certification name': 'Oracle Database Administration 2019 Certified Professional',
        'Exam code': '1Z0-082',
        'Credential type': 'Certification',
        'Certification status': 'Active',
        Category: 'Oracle Database',
        Product: 'Oracle Database 19c',
        'Required exams': '1Z0-082; 1Z0-083',
      },
      {
        'Certification ID': 'ORACLE-CERT-0029',
        Company: 'Oracle',
        'Certification name': 'Oracle Database Administration 2019 Certified Professional',
        'Exam code': '1Z0-083',
        'Credential type': 'Certification',
        Level: 'Professional',
      },
    ],
    Exam_Details: [
      { 'Certification ID': 'ORACLE-CERT-0028', 'Exam code': '1Z0-082', 'Duration (min)': '120', Proctored: 'Yes' },
      { 'Certification ID': 'ORACLE-CERT-0029', 'Exam code': '1Z0-083', 'Duration (min)': '120', Proctored: 'Yes' },
    ],
    Exam_Blueprint: [
      { 'Certification ID': 'ORACLE-CERT-0028', 'Assessed domain / skill': 'Database administration', Weight: '50%' },
      { 'Certification ID': 'ORACLE-CERT-0029', 'Assessed domain / skill': 'Backup and recovery', Weight: '50%' },
    ],
    Training: [],
    Requirements: [
      { 'Certification ID': 'ORACLE-CERT-0028', 'Requirement type': 'Recommended experience', Requirement: 'Database administration experience' },
      { 'Certification ID': 'ORACLE-CERT-0028', 'Requirement type': 'Exam requirement', Requirement: 'Use a personal computer' },
    ],
    Flexible_Details: [],
    QC: [],
  });

  assert.equal(result.courses.length, 1);
  assert.equal(result.duplicatesRemoved, 1);
  assert.deepEqual(result.courses[0].rawPayload.sourceIds, ['ORACLE-CERT-0028', 'ORACLE-CERT-0029']);
  assert.deepEqual(result.courses[0].exams.map((exam) => exam.examCode), ['1Z0-082', '1Z0-083']);
  assert.deepEqual(result.courses[0].objectives.map((objective) => objective.objective), [
    'Database administration',
    'Backup and recovery',
  ]);
  assert.equal(result.courses[0].requirements.length, 1);
  assert.equal(result.courses[0].requirements[0].requirement, 'Database administration experience');
  assert.equal(result.courses[0].credentialLevel, 'Professional');
  assert.equal(result.courses[0].level, 'Advanced');
});

test('Oracle assessment rows remain searchable certification catalogue records', () => {
  const result = buildOracleCertificationRecords({
    Catalog_Master: [{
      'Certification ID': 'ORACLE-ASMT-0101',
      Company: 'Oracle',
      'Certification name': 'Oracle Cloud Delta Assessment',
      'Exam code': '1D0-0101-D',
      'Credential type': 'Assessment',
      Product: 'Oracle Cloud',
      Roles: 'Cloud Engineer; Administrator',
      Subjects: 'Cloud operations; Security',
    }],
    Exam_Details: [],
    Exam_Blueprint: [],
    Training: [],
    Requirements: [],
    Flexible_Details: [],
    QC: [],
  });

  assert.equal(result.courses[0].credentialType, 'Assessment');
  assert.equal(result.courses[0].exams[0].requirementType, 'Delta assessment');
  assert.deepEqual(result.courses[0].audiences, ['Cloud Engineer', 'Administrator']);
  assert.deepEqual(result.courses[0].skills, ['Cloud operations', 'Security']);
});

test('Oracle exam pages without a declared credential remain exams instead of inferred certifications', () => {
  const result = buildOracleCertificationRecords({
    Catalog_Master: [{
      'Certification ID': 'ORACLE-CERT-0036',
      Company: 'Oracle',
      'Certification name': 'Oracle Database Foundations',
      'Exam code': '1Z0-006-CHS',
      Product: 'Oracle Database',
    }],
    Exam_Details: [],
    Exam_Blueprint: [],
    Training: [],
    Requirements: [],
    Flexible_Details: [],
    QC: [],
  });

  assert.equal(result.courses[0].credentialType, 'Exam');
  assert.equal(result.courses[0].exams[0].requirementType, 'Exam');
  assert.match(result.courses[0].summary, /exam code 1Z0-006-CHS/);
});
