import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputPath = process.argv[2];
const previewDirectory = process.argv[3];
if (!outputPath) throw new Error('Provide an output .xlsx path.');

const workbook = Workbook.create();
const fontName = 'Arial';
const headerFill = '#1D4ED8';
const headerFont = { name: fontName, size: 10, bold: true, color: '#FFFFFF' };
const bodyFont = { name: fontName, size: 10, color: '#111827' };

const instructions = workbook.worksheets.add('Instructions');
instructions.showGridLines = false;
instructions.getRange('A1:B1').merge();
instructions.getRange('A1').values = [['Tools course import template']];
instructions.getRange('A1').format.font = { name: fontName, size: 18, bold: true, color: '#111827' };
instructions.getRange('A1:B1').format.rowHeight = 38;
instructions.getRange('A1:B1').format.verticalAlignment = 'center';
instructions.getRange('A3:B11').values = [
  ['Step', 'What to do'],
  [1, 'Add one row per course in Courses.'],
  [2, 'Add one or more objectives for each Course ID in Objectives.'],
  [3, 'Add audience and prerequisite rows in their matching sheets.'],
  [4, 'Add one row per module in Modules. Put each concept or practical activity on a new line inside its cell.'],
  [5, 'Add optional business scenarios in Scenarios.'],
  [6, 'Keep Course IDs unique and use TT followed by at least four digits.'],
  [7, 'Save as .xlsx, open /admin/import, upload, and validate before importing.'],
  [8, 'Existing matching Course IDs are updated. Records missing from the workbook are not deleted.'],
];
instructions.getRange('A3:B3').format = { fill: headerFill, font: headerFont };
instructions.getRange('A4:A11').format.horizontalAlignment = 'center';
instructions.getRange('A3:B11').format.font = bodyFont;
instructions.getRange('A3:B3').format.font = headerFont;
instructions.getRange('B4:B11').format.wrapText = true;
instructions.getRange('A3:B11').format.borders = { preset: 'outside', style: 'thin', color: '#BFDBFE' };
instructions.getRange('A:A').format.columnWidth = 30;
instructions.getRange('B:B').format.columnWidth = 95;
instructions.getRange('A13:B20').values = [
  ['Field guidance', 'Example'],
  ['Course ID', 'TT0189'],
  ['Level', 'Awareness, Basic, Intermediate, Advanced, or Expert'],
  ['Duration Hours', '4, 8, 16, or 32'],
  ['Tools Covered', 'One item per line or separated with |'],
  ['Technology Categories', 'AI, Automation / No-Code, Design, Content & Learning, etc.'],
  ['Concepts / Practical Activities', 'One item per line inside the cell'],
  ['Format', 'May be left blank'],
];
instructions.getRange('A13:B13').format = { fill: '#0F172A', font: headerFont };
instructions.getRange('A13:B20').format.font = bodyFont;
instructions.getRange('A13:B13').format.font = headerFont;
instructions.getRange('B14:B20').format.wrapText = true;

function addInputSheet(name, headers, widths) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  sheet.getRangeByIndexes(0, 0, 2, headers.length).values = [headers, Array(headers.length).fill(null)];
  sheet.getRangeByIndexes(0, 0, 1, headers.length).format = {
    fill: headerFill,
    font: headerFont,
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    wrapText: true,
    borders: { preset: 'all', style: 'thin', color: '#FFFFFF' },
  };
  sheet.getRangeByIndexes(1, 0, 999, headers.length).format.font = bodyFont;
  sheet.getRangeByIndexes(1, 0, 999, headers.length).format.verticalAlignment = 'top';
  headers.forEach((_header, index) => {
    sheet.getRangeByIndexes(0, index, 1000, 1).format.columnWidth = widths[index] || 22;
  });
  sheet.freezePanes.freezeRows(1);
  sheet.tables.add(sheet.getRangeByIndexes(0, 0, 2, headers.length), true, `${name.replace(/[^A-Za-z0-9]/g, '')}Table`);
  return sheet;
}

const courses = addInputSheet('Courses', [
  'Course ID', 'Category', 'Title', 'Tool Name', 'Vendor', 'Level', 'Duration Hours', 'Format',
  'Delivery', 'Summary', 'Tools Covered', 'Technology Categories', 'Skill Area', 'Tool Logo URL',
], [14, 20, 50, 24, 24, 16, 16, 18, 20, 55, 45, 32, 26, 45]);
courses.getRange('B2:B1000').dataValidation = { rule: { type: 'list', values: ['tools-technology'] } };
courses.getRange('F2:F1000').dataValidation = { rule: { type: 'list', values: ['Awareness', 'Basic', 'Intermediate', 'Advanced', 'Expert'] } };
courses.getRange('G2:G1000').dataValidation = { rule: { type: 'whole', operator: 'between', formula1: 1, formula2: 100 } };
courses.getRange('A2:J1000').format.wrapText = true;

addInputSheet('Objectives', ['Course ID', 'Objective'], [14, 100]).getRange('B2:B5000').format.wrapText = true;
addInputSheet('Audiences', ['Course ID', 'Audience'], [14, 70]).getRange('B2:B5000').format.wrapText = true;
addInputSheet('Prerequisites', ['Course ID', 'Prerequisite'], [14, 90]).getRange('B2:B5000').format.wrapText = true;
addInputSheet('Modules', ['Course ID', 'Module Code', 'Module Title', 'Concepts', 'Practical Activities'], [14, 15, 48, 90, 90]);
addInputSheet('Scenarios', ['Course ID', 'Title', 'Workflow', 'Description'], [14, 48, 90, 100]);

for (const name of ['Modules', 'Scenarios']) {
  workbook.worksheets.getItem(name).getUsedRange().format.wrapText = true;
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const inspection = await workbook.inspect({
  kind: 'workbook,sheet,table',
  maxChars: 6000,
  tableMaxRows: 4,
  tableMaxCols: 8,
});
console.log(inspection.ndjson);

const formulaErrors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',
  options: { useRegex: true, maxResults: 100 },
  summary: 'final formula error scan',
});
console.log(formulaErrors.ndjson);

if (previewDirectory) {
  await fs.mkdir(previewDirectory, { recursive: true });
  for (const sheetName of ['Instructions', 'Courses', 'Objectives', 'Audiences', 'Prerequisites', 'Modules', 'Scenarios']) {
    const preview = await workbook.render({ sheetName, autoCrop: 'all', scale: 1.25, format: 'png' });
    await fs.writeFile(path.join(previewDirectory, `${sheetName}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}
