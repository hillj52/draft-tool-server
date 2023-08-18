import { JSDOM } from 'jsdom';
import type { PrismaClient } from '@prisma/client';

export async function scrapeQBs(
  db: PrismaClient,
  byeWeeks: { [teamName: string]: number },
  valueMap: { [playerHash: string]: number },
) {
  const {
    window: { document },
  } = await JSDOM.fromURL(process.env.SCRAPE_BASE_URL + 'qb.php?week=draft');
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
        byeWeek: byeWeeks[team],
        position: 'QB',
        value: valueMap[`${name}${team}`],
        passingStats: {
          create: {
            attempts: +data[1].innerHTML,
            completions: +data[2].innerHTML,
            yards: +data[3].innerHTML.replace(',', ''),
            touchdowns: +data[4].innerHTML,
            interceptions: +data[5].innerHTML,
          },
        },
        rushingStats: {
          create: {
            attempts: +data[6].innerHTML,
            yards: +data[7].innerHTML.replace(',', ''),
            touchdowns: +data[8].innerHTML,
            fumblesLost: +data[9].innerHTML,
          },
        },
      },
    });
    console.log(`Created ${player.name} - ${player.team}`);
  }
  return null;
}
