import fs from 'fs';
import { parse } from 'csv-parse';

//Parses a CSV file and returns the data as an array of objects(JSON data)
export function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const leads = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => {
        leads.push(row);
      })
      .on('end', () => {
        resolve(leads);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
