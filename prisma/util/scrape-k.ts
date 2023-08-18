import { JSDOM } from 'jsdom';
import type { PrismaClient } from '@prisma/client';

export async function scrapeKs(
  db: PrismaClient,
  byeWeeks: { [teamName: string]: number },
  valueMap: { [playerHash: string]: number },
) {
  const {
    window: { document },
  } = await JSDOM.fromURL(process.env.SCRAPE_BASE_URL + 'k.php?week=draft');
  const table = document.querySelector('table[id=data]');
  if (!table) {
    throw new Error('Scrape Error, no data table found');
  }
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    throw new Error('Scrape Error, no table body found');
  }
  const rows = tbody.querySelectorAll('tr');
  if (!rows || rows.length === 0) {
    throw new Error('Scrape Error, no data rows found');
  }
  for (const row of rows) {
    const data = row.querySelectorAll('td');
    const playerData = data[0].querySelectorAll('a');

    const name = playerData[0].innerHTML;
    const team = data[0].textContent
      ?.slice(-4)
      .replace(' ', '')
      .trim() as string;

    const player = await db.player.create({
      data: {
        name,
        team,
        position: 'K',
        byeWeek: byeWeeks[team],
        projectedPoints: +data[4].innerHTML,
        value: valueMap[`${name}${team}`],
      },
    });
    console.log(`Created ${player.name} - ${player.team}`);
  }
  return null;
}
