import { Injectable } from '@nestjs/common';
import * as parse from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Position } from './enum/position.enum';
import { PlayersService } from './players.service';

export interface PositionalPlayerCSV {
  name: string;
  team: string;
  byeWeek: string;
  value: string;
}

export interface PlayerCSV {
  rank: string;
  tier: string;
  name: string;
  team: string;
  position: string;
  strengthOfSchedule: string;
  pointsAboveProjection: string;
  gamesAboveProjection: string;
}

type PlayerMap = {
  [position in Position]: {
    [hash: string]: PositionalPlayerCSV;
  };
};

@Injectable()
export class PlayerCsvService {
  constructor(private playersService: PlayersService) {}

  async createAllPlayers() {
    const playerMap: PlayerMap = {
      [Position.QB]: await this.readPositionalValues(Position.QB),
      [Position.RB]: await this.readPositionalValues(Position.RB),
      [Position.WR]: await this.readPositionalValues(Position.WR),
      [Position.TE]: await this.readPositionalValues(Position.TE),
      [Position.K]: await this.readPositionalValues(Position.K),
      [Position.DST]: await this.readPositionalValues(Position.DST),
    };
    const players = await this.readPlayerValues();
    await Promise.all(
      players.map(async (playerCSV) => {
        const position = playerCSV.position.replace(/[0-9]/g, '');
        const { name, team } = playerCSV;
        console.log(`${name}${team}`);
        const { byeWeek, value } =
          playerMap[position as Position][`${name}${team}`];
        console.log(`${byeWeek} ${value}`);
        const player = await this.playersService.create({
          name,
          team,
          tier: +playerCSV.tier,
          overallRank: +playerCSV.rank,
          positionalRank: +playerCSV.position.replace(/\D/g, ''),
          byeWeek: +byeWeek,
          value: +value.replace('$', ''),
          position,
          strengthOfSchedule: playerCSV.strengthOfSchedule,
          pointsAboveProjection: playerCSV.pointsAboveProjection,
        });
        return player;
      }),
    );
  }

  private readPositionalValues(position: Position) {
    const dataPromise = new Promise<{ [hash: string]: PositionalPlayerCSV }>(
      (resolve, reject) => {
        const data: { [hash: string]: PositionalPlayerCSV } = {};
        const csvPath = path.resolve('./csv', `${position}.csv`);

        const buffer = fs.readFileSync(csvPath);

        const parser = parse.parse(buffer, { columns: true });

        parser.on('readable', () => {
          let record;
          while ((record = parser.read())) {
            data[`${record.name}${record.team}`] = record;
          }
        });

        parser.on('error', (err) => {
          console.log('Parser Error', err);
          reject('Parser Error');
        });

        parser.on('end', () => {
          resolve(data);
        });

        parser.write(buffer);

        parser.end();
      },
    );
    return dataPromise;
  }

  private readPlayerValues() {
    const dataPromise = new Promise<PlayerCSV[]>((resolve, reject) => {
      const csvPath = path.resolve('./csv', 'players.csv');

      const buffer = fs.readFileSync(csvPath);

      const data: PlayerCSV[] = [];

      const parser = parse.parse(buffer, {
        columns: true,
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
          data.push(record);
        }
      });

      parser.on('error', (err) => {
        console.log('ERROR', err);
        reject(err);
      });

      parser.on('end', () => {
        resolve(data);
      });

      parser.write(buffer);

      parser.end();
    });
    return dataPromise;
  }
}
