import { JSDOM } from 'jsdom';
import type { PrismaClient } from '@prisma/client';

export async function scrapeTEs(
  db: PrismaClient,
  byeWeeks: { [teamName: string]: number },
  valueMap: { [playerHash: string]: number },
) {
  const {
    window: { document },
  } = await JSDOM.fromURL(process.env.SCRAPE_BASE_URL + 'te.php?week=draft');
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
        position: 'TE',
        value: valueMap[`${name}${team}`],
        recievingStats: {
          create: {
            receptions: +data[1].innerHTML,
            yards: +data[2].innerHTML.replace(',', ''),
            touchdowns: +data[3].innerHTML,
          },
        },
        rushingStats: {
          create: {
            attempts: 0,
            yards: 0,
            touchdowns: 0,
            fumblesLost: +data[4].innerHTML,
          },
        },
      },
    });
    console.log(`Created ${player.name} - ${player.team}`);
  }
  return null;
}
