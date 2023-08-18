import { PrismaClient } from '@prisma/client';
import { scrapeQBs } from './util/scrape-qb';
import { scrapeRBs } from './util/scrape-rb';
import { scrapeWRs } from './util/scrape-wr';
import { scrapeTEs } from './util/scrape-te';
import { scrapeKs } from './util/scrape-k';
import { scrapeDSTs } from './util/scrape-dst';
import { readCSVValues } from './util/csv-reader';
import {
  calculatePassingPoints,
  calculateRecievingPoints,
  calculateRushingPoints,
} from './util/calc-points';

if (!process.env.SCRAPE_BASE_URL) {
  throw new Error('Scrape base url not set');
}

const db = new PrismaClient();

const seed = async () => {
  const user = await db.user.create({
    data: {
      username: 'test',
      passwordHash:
        '1c1f59d27639f68a6d03a8c0a6fcf3aa532334bfc610ef78bacbcc28d4e76137.44e0568949852cab22577aa6374fa0c0',
    },
  });
  console.log('User created:', user);
  await seedByeWeeks();
  const byeWeeks: { [team: string]: number } = (
    await db.byeWeek.findMany()
  ).reduce((acc, entry) => {
    return {
      ...acc,
      [entry.team]: entry.byeWeek,
    };
  }, {});

  console.log('ATL', byeWeeks.ATL);

  const valueMap = await readCSVValues();

  await scrapeQBs(db, byeWeeks, valueMap);
  await scrapeRBs(db, byeWeeks, valueMap);
  await scrapeWRs(db, byeWeeks, valueMap);
  await scrapeTEs(db, byeWeeks, valueMap);
  await scrapeKs(db, byeWeeks, valueMap);
  await scrapeDSTs(db, byeWeeks, valueMap);

  const players = await db.player.findMany({
    where: { projectedPoints: 0 },
    include: { passingStats: true, rushingStats: true, recievingStats: true },
  });
  for (const player of players) {
    let projectedPoints = 0;
    if (player.passingStats) {
      projectedPoints += calculatePassingPoints(player.passingStats);
    }
    if (player.rushingStats) {
      projectedPoints += calculateRushingPoints(player.rushingStats);
    }
    if (player.recievingStats) {
      projectedPoints += calculateRecievingPoints(player.recievingStats);
    }

    await db.player.update({
      where: { id: player.id },
      data: { projectedPoints },
    });
  }

  await seedTeams();
};

seed();

async function seedByeWeeks() {
  const byeWeekData = [
    { team: 'CLE', byeWeek: 5 },
    { team: 'LAC', byeWeek: 5 },
    { team: 'SEA', byeWeek: 5 },
    { team: 'TB', byeWeek: 5 },

    { team: 'GB', byeWeek: 6 },
    { team: 'PIT', byeWeek: 6 },

    { team: 'CAR', byeWeek: 7 },
    { team: 'CIN', byeWeek: 7 },
    { team: 'DAL', byeWeek: 7 },
    { team: 'HOU', byeWeek: 7 },
    { team: 'NYJ', byeWeek: 7 },
    { team: 'TEN', byeWeek: 7 },

    { team: 'DEN', byeWeek: 9 },
    { team: 'DET', byeWeek: 9 },
    { team: 'JAC', byeWeek: 9 },
    { team: 'SF', byeWeek: 9 },

    { team: 'KC', byeWeek: 10 },
    { team: 'LAR', byeWeek: 10 },
    { team: 'MIA', byeWeek: 10 },
    { team: 'PHI', byeWeek: 10 },

    { team: 'ATL', byeWeek: 11 },
    { team: 'IND', byeWeek: 11 },
    { team: 'NE', byeWeek: 11 },
    { team: 'NO', byeWeek: 11 },

    { team: 'BAL', byeWeek: 13 },
    { team: 'BUF', byeWeek: 13 },
    { team: 'CHI', byeWeek: 13 },
    { team: 'LV', byeWeek: 13 },
    { team: 'MIN', byeWeek: 13 },
    { team: 'NYG', byeWeek: 13 },

    { team: 'ARI', byeWeek: 14 },
    { team: 'WAS', byeWeek: 14 },
  ];
  const inserts = byeWeekData.map((data) => db.byeWeek.create({ data }));
  await db.$transaction(inserts);
}

async function seedTeams() {
  const teamData = [
    { name: 'The League is named after me?', owner: 'Joe Hill' },
    { name: 'Triple Crown', owner: 'Chris Hill' },
    { name: 'Pickets Picks', owner: 'Blaine Wilson' },
    { name: 'Purdy lil Thing', owner: 'Tim Sykes' },
    { name: 'Decosta Doing Business', owner: 'Mike Sykes' },
    { name: 'Free Ballin', owner: 'Bryan Tolle' },
    { name: 'F You CMC', owner: 'Matt Moore' },
    { name: 'Odellta Variant', owner: 'Jerry Autry' },
    { name: 'Touch My Wat Son', owner: 'Jon Frazier' },
    { name: 'Mr Rodgers Neighborhood', owner: 'Chris Mohler' },
    { name: 'Bottom Of The Barrel', owner: 'Rich Wilson' },
    { name: 'The Kummanders', owner: 'Rick George' },
    { name: 'Hungry Dogs Run Fast', owner: 'Michael Polt' },
    { name: 'Main Street', owner: 'John Main' },
  ];
  const inserts = teamData.map((data) => db.team.create({ data }));
  await db.$transaction(inserts);
}
