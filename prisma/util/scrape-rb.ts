import { JSDOM } from 'jsdom';
import type { PrismaClient } from '@prisma/client';

export async function scrapeRBs(
  db: PrismaClient,
  byeWeeks: { [teamName: string]: number },
  valueMap: { [playerHash: string]: number },
) {
  const {
    window: { document },
  } = await JSDOM.fromURL(process.env.SCRAPE_BASE_URL + 'rb.php?week=draft');
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
        position: 'RB',
        value: valueMap[`${name}${team}`],
        rushingStats: {
          create: {
            attempts: +data[1].innerHTML,
            yards: +data[2].innerHTML.replace(',', ''),
            touchdowns: +data[3].innerHTML,
            fumblesLost: +data[7].innerHTML,
          },
        },
        recievingStats: {
          create: {
            receptions: +data[4].innerHTML,
            yards: +data[5].innerHTML.replace(',', ''),
            touchdowns: +data[6].innerHTML,
          },
        },
      },
    });
    console.log(`Created ${player.name} - ${player.team}`);
  }

  await createMissingRBs(db, valueMap);
  return null;
}

async function createMissingRBs(
  db: PrismaClient,
  valueMap: { [playerHash: string]: number },
) {
  const dalvinCook = await db.player.findFirst({
    where: { name: 'Dalvin Cook' },
  });
  if (!dalvinCook) {
    await db.player.create({
      data: {
        name: 'Dalvin Cook',
        team: '',
        value: valueMap['Dalvin Cook'],
        position: 'RB',
      },
    });
  }

  const zeke = await db.player.findFirst({
    where: { name: 'Ezekiel Elliott' },
  });
  if (!zeke) {
    await db.player.create({
      data: {
        name: 'Ezekiel Elliott',
        team: '',
        value: valueMap['Ezekiel Elliott'],
        position: 'RB',
      },
    });
  }

  const leo = await db.player.findFirst({
    where: { name: 'Leonard Fournette' },
  });
  if (!leo) {
    await db.player.create({
      data: {
        name: 'Leonard Fournette',
        team: '',
        value: valueMap['Leonard Fournette'],
        position: 'RB',
      },
    });
  }

  const kareem = await db.player.findFirst({ where: { name: 'Kareem Hunt' } });
  if (!kareem) {
    await db.player.create({
      data: {
        name: 'Kareem Hunt',
        team: '',
        value: valueMap['Kareem Hunt'],
        position: 'RB',
      },
    });
  }
}
