import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { parse } from 'csv-parse';

interface DraftValueCSV {
  name: string;
  team: string;
  position: string;
  byeWeek: string;
  value: string;
}

function hashEntry({ name, team }: DraftValueCSV) {
  return `${name}${team}`;
}

async function readValues() {
  let totalValue = 0;
  const promise = new Promise<{ [hash: string]: number }>((resolve, reject) => {
    const data: { [hash: string]: number } = {};
    const buffer = readFileSync(resolvePath('./prisma/', 'draft-values.csv'));
    const parser = parse(buffer, { columns: true });

    parser.on('readable', () => {
      let record;
      while ((record = parser.read() as DraftValueCSV)) {
        data[hashEntry(record)] = +record.value;
        totalValue += +record.value;
      }
    });

    parser.on('error', (err) => {
      console.log('error', err);
      reject('parser error: ' + err.message);
    });

    parser.on('end', () => {
      console.log('Value accounted for:', totalValue);
      resolve(data);
    });

    parser.write(buffer);

    parser.end();
  });
  return promise;
}

export async function readCSVValues() {
  return await readValues();
}
