import { JSDOM } from 'jsdom';
import type { PrismaClient } from '@prisma/client';

export async function scrapeDSTs(
  db: PrismaClient,
  byeWeeks: { [teamName: string]: number },
  valueMap: { [playerHash: string]: number },
) {
  const {
    window: { document },
  } = await JSDOM.fromURL(process.env.SCRAPE_BASE_URL + 'dst.php?week=draft');
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
    //const playerData = data[0].querySelectorAll('a');

    const name = data[0].textContent?.trim() as string;
    const team = getTeamName(name);

    const player = await db.player.create({
      data: {
        name,
        team,
        position: 'DST',
        byeWeek: byeWeeks[team],
        projectedPoints: +data[9].innerHTML,
        value: valueMap[`${name}${team}`],
      },
    });
    console.log(`Created ${player.name} - ${player.team}`);
  }
  return null;
}

const getTeamName = (teamName: string) => {
  switch (teamName.trim()) {
    case 'Dallas Cowboys':
      return 'DAL';
    case 'Philadelphia Eagles':
      return 'PHI';
    case 'New England Patriots':
      return 'NE';
    case 'Indianapolis Colts':
      return 'IND';
    case 'Pittsburgh Steelers':
      return 'PIT';
    case 'Cleveland Browns':
      return 'CLE';
    case 'San Francisco 49ers':
      return 'SF';
    case 'Washington Commanders':
      return 'WAS';
    case 'New Orleans Saints':
      return 'NO';
    case 'Kansas City Chiefs':
      return 'KC';
    case 'Miami Dolphins':
      return 'MIA';
    case 'Green Bay Packers':
      return 'GB';
    case 'Buffalo Bills':
      return 'BUF';
    case 'Seattle Seahawks':
      return 'SEA';
    case 'New York Jets':
      return 'NYJ';
    case 'Los Angeles Chargers':
      return 'LAC';
    case 'Minnesota Vikings':
      return 'MIN';
    case 'Houston Texans':
      return 'HOU';
    case 'Detroit Lions':
      return 'DET';
    case 'Tampa Bay Buccaneers':
      return 'TB';
    case 'Baltimore Ravens':
      return 'BAL';
    case 'Los Angeles Rams':
      return 'LAR';
    case 'Jacksonville Jaguars':
      return 'JAC';
    case 'New York Giants':
      return 'NYG';
    case 'Carolina Panthers':
      return 'CAR';
    case 'Tennessee Titans':
      return 'TEN';
    case 'Cincinnati Bengals':
      return 'CIN';
    case 'Denver Broncos':
      return 'DEN';
    case 'Arizona Cardinals':
      return 'ARI';
    case 'Atlanta Falcons':
      return 'ATL';
    case 'Chicago Bears':
      return 'CHI';
    case 'Las Vegas Raiders':
      return 'LV';
    default: {
      console.log(`${teamName} not found!`);
      return '';
    }
  }
};
