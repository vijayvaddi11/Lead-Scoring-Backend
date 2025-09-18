import { Parser } from 'json2csv';
import { getResults } from './storage.js';
import { writeFileSync } from 'fs';

// Export results from storage into results.csv
function exportCSV() {
  const results = getResults();

  if (!results || results.length === 0) {
    console.error(' No results found. Run /score first.');
    return;
  }

  try {
    const fields = ['name', 'role', 'company', 'intent', 'score', 'reasoning'];
    const parser = new Parser({ fields });
    const csv = parser.parse(results);

    writeFileSync('results.csv', csv);
    console.log('Results exported to results.csv');
  } catch (err) {
    console.error('⚠️ CSV export failed:', err);
  }
}

exportCSV();
